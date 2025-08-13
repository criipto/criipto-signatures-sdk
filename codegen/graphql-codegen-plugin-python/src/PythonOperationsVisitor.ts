import {
  ClientSideBaseVisitor,
  indentMultiline,
  type LoadedFragment,
  type RawConfig,
} from '@graphql-codegen/visitor-plugin-common';
import {
  type OperationDefinitionNode,
  Kind,
  print,
  type FragmentDefinitionNode,
  GraphQLSchema,
  getNullableType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isEnumType,
  buildSchema,
  printSchema,
  isInputObjectType,
  OperationTypeNode,
  visit,
} from 'graphql';
import assert from 'node:assert';
import { upperCaseFirst } from 'change-case-all';
import {
  assertIsNotUndefined,
  operationSelectionsToAstTree,
  type AstTreeNode,
} from 'graphql-codegen-shared';
import { PythonTypesVisitor } from './PythonTypesVisitor.ts';

export interface PythonOperationsRawConfig extends RawConfig {}

export class PythonOperationsVisitor extends ClientSideBaseVisitor<PythonOperationsRawConfig> {
  modelImports: Set<string> = new Set<string>();
  fragments: FragmentDefinitionNode[];

  constructor(
    config: PythonOperationsRawConfig,
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
  ) {
    // Rebuild schema from string, in order to populate AST nodes
    // https://github.com/graphql/graphql-js/issues/1575
    schema = buildSchema(printSchema(schema));

    super(schema, fragments, config, {});
    this.fragments = fragments.map(fragment => fragment.node);
  }

  static stringVariable(variableName: string, body: string, expressions?: string[]) {
    if (expressions && expressions.length > 0) {
      // When printed as f-strings, curly-brackets are a control character. So we need to escape them
      body = `f"""${body.replaceAll(/({|})/g, '$1$1')}
${expressions.map(expression => `{${expression}}`).join('\n')}"""`;
    } else {
      body = `"""${body}"""`;
    }

    return `${variableName} = ${body}`;
  }

  FragmentDefinition = {
    leave: (node: FragmentDefinitionNode) => {
      return PythonOperationsVisitor.stringVariable(`${node.name.value}Fragment`, print(node));
    },
  };

  private getOperationName(node: OperationDefinitionNode) {
    assertIsNotUndefined(node.name);
    return node.operation === OperationTypeNode.QUERY
      ? `query${upperCaseFirst(node.name.value)}`
      : node.name.value;
  }

  // @ts-expect-error We are intentionally changing the signature of `OperationDefinition` here.
  // ClientSideBaseVisitor expects to be passed the old format of visit, where you
  // could pass `{ leave: visitor }`. That was removed in
  // https://github.com/graphql/graphql-js/pull/2957, so we change the type of the property, to
  // specify the `leave` property inline.
  override OperationDefinition = {
    leave: (node: OperationDefinitionNode) => {
      // Save the operation for later, when we build the actual SDK operations
      this._collectedOperations.push(node);

      const name = this.getOperationName(node);
      const result: string[] = [];

      // We want to build the most accurate output type for each operation
      // In order to do that, we need to take the selection set (the specification
      // of which fields were selected), and translate that to a concrete type.

      // First, we convert the selection set to a tree of GraphQL AST nodes
      const astTree = operationSelectionsToAstTree({
        node,
        schema: this._schema,
        fragments: this.fragments,
      });

      // Then, we run a breadth-first traversal of the tree. For each node
      // we keep track of the prefix of the parent node.
      const nodesToProcess: { treeNode: AstTreeNode; parentPrefix: string }[] = [
        { treeNode: astTree, parentPrefix: upperCaseFirst(name) },
      ];

      while (nodesToProcess.length > 0) {
        // We checked the length in the line above, so the non-null assertion is safe here
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { parentPrefix, treeNode } = nodesToProcess.shift()!;

        const nodePrefix = `${parentPrefix}_${treeNode.astNode.name.value}`;
        // For each AST node, we use the PythonTypesVisitor to generate a specialized
        // python class definition for the specific selection. The class definition
        // differs from the general output type classes defined in the schema in
        // three ways:
        // 1. The class only includes the fields actually selected by the operation
        //    (as opposed to all fields defined by the output type)
        // 2. The names of the classes are prefixed with the name of their parent type
        //    (by overriding node.name.value before passing the node to `oldVisit`)
        // 3. All field types are prefixed with the name of their parent type, using
        //    the `typesPrefix` option. So for a type called `Foo`, with a field `bar` of type
        //    `Bar`, the type of `Foo.bar` will be `Foo_Bar`
        const typesVisitor = new PythonTypesVisitor(
          {
            typesPrefix: nodePrefix + '_',
          },
          this._schema,
        );

        const visitorResult = visit(
          {
            ...treeNode.astNode,
            name: {
              ...treeNode.astNode.name,
              value: nodePrefix,
            },
          },
          typesVisitor,
        );
        assert(typeof visitorResult === 'string');
        result.push(visitorResult);

        nodesToProcess.push(
          ...treeNode.children.map(child => ({
            parentPrefix: nodePrefix,
            treeNode: child,
          })),
        );
      }

      // Recursively extracts the names of all fragments used in the operation
      const fragments = this._extractFragments(node, true).map(node => this.getFragmentName(node));

      return [
        ...result,
        // Return just the GraphQL document variable definition for now, the actual operation is built
        // in `getAdditionalContent`
        PythonOperationsVisitor.stringVariable(`${name}Document`, print(node), fragments),
      ].join('\n');
    },
  };

  getAdditionalContent() {
    let result = `
class CriiptoSignaturesSDK:
  def __init__(self, clientId: str, clientSecret: str):
    auth = BasicAuth(clientId, clientSecret)
    transport = AIOHTTPTransport(url=" https://signatures-api.criipto.com/v1/graphql", auth=auth)
    self.client = Client(transport=transport, fetch_schema_from_transport=False)
`;

    result += indentMultiline(
      this._collectedOperations
        .map(node => {
          const operationName = this.getOperationName(node);

          assert(
            node.selectionSet.selections.length === 1,
            'Expected query / mutation to have exactly one top level selection',
          );
          assert(
            node.selectionSet.selections[0]?.kind === Kind.FIELD,
            'Top level selection must be a field',
          );
          const operations =
            node.operation === OperationTypeNode.QUERY
              ? this._schema.getQueryType()
              : node.operation === OperationTypeNode.MUTATION
                ? this._schema.getMutationType()
                : this._schema.getSubscriptionType();
          const selectionNode = operations?.getFields()[node.selectionSet.selections[0].name.value];
          assertIsNotUndefined(selectionNode, 'Top level selection type not found in schema');

          const outputTypeNode = getNullableType(selectionNode.type);

          assert(
            isInterfaceType(outputTypeNode) || isObjectType(outputTypeNode),
            'Expected output type for operation to be either interface or object',
          );

          const outputTypeName = upperCaseFirst(operationName) + '_' + outputTypeNode.name;

          const functionArguments = (node.variableDefinitions ?? []).reduce<Record<string, string>>(
            (functionArguments, variableDefinitionNode) => {
              const variableName = variableDefinitionNode.variable.name.value;

              const nullable = variableDefinitionNode.type.kind !== Kind.NON_NULL_TYPE;
              const variableTypeNode = nullable
                ? variableDefinitionNode.type
                : variableDefinitionNode.type.type;

              assert(
                variableTypeNode.kind === Kind.NAMED_TYPE,
                'Only named types are supported in function arguments',
              );

              let variableTypeName = variableTypeNode.name.value;
              const variableSchemaType = this._schema.getType(variableTypeName);
              if (isScalarType(variableSchemaType)) {
                variableTypeName = `${variableTypeName}Scalar`;
              } else if (isInputObjectType(variableSchemaType)) {
                this.modelImports.add(variableTypeName);
              }

              functionArguments[variableName] = nullable
                ? `Optional[${variableTypeName}]`
                : variableTypeName;
              return functionArguments;
            },
            {},
          );

          const functionDefinition = `def ${operationName}(self, ${Object.entries(functionArguments)
            .map(([argumentName, argumentType]) => `${argumentName}: ${argumentType}`)
            .join(', ')}) -> ${outputTypeName}:`;

          // Builds a JSON object of variables to pass to the query
          const queryVariables = [
            '{',
            Object.keys(functionArguments)
              .map(
                argumentName =>
                  // If the argument is called `input`, we assume it to be a pydantic model,
                  // and dump it to an object
                  `"${argumentName}": ${argumentName === 'input' ? `${argumentName}.model_dump()` : argumentName}`,
              )
              .join(','),
            '}',
          ].join('\n');

          const functionBody = indentMultiline(
            `query = gql(${operationName}Document)
variables = ${queryVariables}
result = self.client.execute(query, variable_values=variables)
parsed = ${outputTypeName}.model_validate(result.get('${selectionNode.name}'))
return parsed`,
            1,
          );

          return [functionDefinition, functionBody].join('\n');
        })
        .join('\n'),
      1,
    );

    return result;
  }

  getPrepend(): string[] {
    const typeMap = this._schema.getTypeMap();
    const scalars = Object.values(typeMap).filter(type => isScalarType(type));
    const enums = Object.values(typeMap)
      .filter(type => isEnumType(type))
      .filter(e => !['__DirectiveLocation', '__TypeKind'].includes(e.name));

    return [
      ...PythonTypesVisitor.getImports(),
      `from .models import ${Array.from(this.modelImports).join(',')}`,
      `from .models import ${scalars.map(scalar => `${scalar.name}Scalar`).join(',')}`,
      `from .models import ${enums.map(e => e.name).join(',')}`,
      'from gql import Client, gql',
      'from gql.transport.aiohttp import AIOHTTPTransport, BasicAuth',
    ];
  }
  getAppend(): string[] {
    return [];
  }
}
