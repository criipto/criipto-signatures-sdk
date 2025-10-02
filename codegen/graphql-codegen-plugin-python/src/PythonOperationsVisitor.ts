import {
  ClientSideBaseVisitor,
  indentMultiline,
  type LoadedFragment,
  type RawConfig,
} from '@graphql-codegen/visitor-plugin-common';
import {
  Kind,
  print,
  getNullableType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isEnumType,
  isListType,
  buildSchema,
  printSchema,
  isInputObjectType,
  visit,
  OperationTypeNode,
  type OperationDefinitionNode,
  type FragmentDefinitionNode,
  type GraphQLSchema,
  type GraphQLNamedType,
  type GraphQLObjectType,
  type GraphQLInterfaceType,
} from 'graphql';
import assert from 'node:assert';
import { upperCaseFirst } from 'change-case-all';
import {
  assertIsNotUndefined,
  operationSelectionsToAstTree,
  unwrapTypeNode,
  type AstTreeNode,
} from 'graphql-codegen-shared';
import { PythonTypesVisitor } from './PythonTypesVisitor.ts';

export class PythonOperationsVisitor extends ClientSideBaseVisitor {
  modelImports: Set<string> = new Set<string>();
  fragments: FragmentDefinitionNode[];

  constructor(config: RawConfig, schema: GraphQLSchema, fragments: LoadedFragment[]) {
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
    return this.generateSDK({ async: true }) + '\n' + this.generateSDK({ async: false });
  }

  generateSDK({ async }: { async: boolean }) {
    let result = `
class CriiptoSignaturesSDK${async ? 'Async' : 'Sync'}:
  def __init__(self, clientId: str, clientSecret: str):
    auth = BasicAuth(username=clientId, password=clientSecret)
    headers= {"Criipto-Sdk": "criipto-signatures-python"}
    transport = ${async ? 'HTTPXAsyncTransport' : 'HTTPXTransport'}(url="https://signatures-api.criipto.com/v1/graphql", auth=auth, headers=headers)
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
          const topLevelSelection = node.selectionSet.selections[0];
          let outputChain = 'root';

          const operations =
            node.operation === OperationTypeNode.QUERY
              ? this._schema.getQueryType()
              : node.operation === OperationTypeNode.MUTATION
                ? this._schema.getMutationType()
                : this._schema.getSubscriptionType();
          const selectionNode = operations?.getFields()[topLevelSelection.name.value];
          assertIsNotUndefined(selectionNode, 'Top level selection type not found in schema');

          // The root type returned from the GraphQL operation.
          const operationOutputNode = getNullableType(selectionNode.type);

          assert(
            isInterfaceType(operationOutputNode) || isObjectType(operationOutputNode),
            'Expected output type for operation to be either interface or object',
          );

          const returnTypeNameParts = [upperCaseFirst(operationName), operationOutputNode.name];
          const operationOutputName = returnTypeNameParts.join('_');

          // The type returned by our function. This can be different from the operation return type
          // in case of mutations.
          let returnTypeNode: GraphQLObjectType | GraphQLInterfaceType = operationOutputNode;
          let isList = false;

          if (
            node.operation === OperationTypeNode.MUTATION &&
            topLevelSelection.selectionSet?.selections.length === 1
          ) {
            // Most mutations have a single top-level selection, such as
            // ```createSignatureOrder { signatureOrder { ... }}```
            // When this is the case, we want to return the signatureOrder directly, so that we
            // don't have to drill into it when using the SDK.
            // By default:
            //  response = await sdk.createSignatureOrder()
            //  print(response.signatureOrder.id)
            // With this change:
            //  signatureOrder = await sdk.createSignatureOrder()
            //  print(signatureOrder.id)
            assert(
              topLevelSelection.selectionSet.selections[0]?.kind === Kind.FIELD,
              'Mutation selection must be a field',
            );
            const mutationFieldSelection = topLevelSelection.selectionSet.selections[0].name.value;
            let mutationFieldSelectionNode = getNullableType(
              returnTypeNode.getFields()[mutationFieldSelection]?.type,
            );

            if (isListType(mutationFieldSelectionNode)) {
              mutationFieldSelectionNode = getNullableType(mutationFieldSelectionNode.ofType);
              isList = true;
            }

            assert(
              isInterfaceType(mutationFieldSelectionNode) ||
                isObjectType(mutationFieldSelectionNode),
              'Expected nested selection type for mutation to be either interface or object',
            );
            returnTypeNameParts.push(mutationFieldSelectionNode.name);
            returnTypeNode = mutationFieldSelectionNode;
            outputChain += `.${mutationFieldSelection}`;
          }

          let outputTypeName = returnTypeNameParts.join('_');
          if (isList) {
            outputTypeName = `list[${outputTypeName}]`;
          }

          const functionArguments = (node.variableDefinitions ?? [])
            .map<{
              name: string;
              nullable: boolean;
              type: GraphQLNamedType;
            }>(variableDefinitionNode => {
              const { nullable, node: variableTypeNode } = unwrapTypeNode(
                variableDefinitionNode.type,
              );

              const variableSchemaType = this._schema.getType(variableTypeNode.name.value);
              assertIsNotUndefined(variableSchemaType);
              if (isInputObjectType(variableSchemaType)) {
                this.modelImports.add(variableTypeNode.name.value);
              }

              return {
                name: variableDefinitionNode.variable.name.value,
                nullable,
                type: variableSchemaType,
              };
            })
            .sort(
              // Sort the arguments so that optional arguments are placed last
              (argumentA, argumentB) => {
                if (!argumentA.nullable && argumentB.nullable) {
                  return -1;
                }
                return 0;
              },
            );

          const functionDefinition = `${async ? 'async ' : ''}def ${operationName}(self, ${functionArguments
            .map(({ name, type, nullable }) => {
              let typeName = type.name;
              if (isScalarType(type)) {
                typeName = `${typeName}ScalarInput`;
              }
              if (nullable) {
                typeName = `Optional[${typeName}] = None`;
              }

              return `${name}: ${typeName}`;
            })
            .join(', ')}) -> ${outputTypeName}:`;

          // Builds a JSON object of variables to pass to the query
          const queryVariables = [
            '{',
            functionArguments
              .map(({ name, type, nullable }) => {
                let argumentValue = name;

                if (isInputObjectType(type)) {
                  argumentValue = `${argumentValue}.model_dump()`;
                } else if (isEnumType(type) && nullable) {
                  // The Criipto GraphQL API does not handle null enum values, so we convert them to
                  // empty strings
                  argumentValue = `${argumentValue} if ${argumentValue} is not None else ""`;
                }

                return `"${name}": ${argumentValue}`;
              })
              .join(','),
            '}',
          ].join('\n');

          const functionBody = indentMultiline(
            `query = gql(${operationName}Document)
query.variable_values = ${queryVariables}
result = ${async ? 'await ' : ''}self.client.${async ? 'execute_async' : 'execute'}(query)
parsed = RootModel[${operationOutputName}].model_validate(result.get('${selectionNode.name}')).${outputChain}
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
      `from pydantic import RootModel`,
      `from .models import ${Array.from(this.modelImports).join(',')}`,
      `from .models import ${scalars.flatMap(scalar => [`${scalar.name}ScalarInput`, `${scalar.name}ScalarOutput`]).join(',')}`,
      `from .models import ${enums.map(e => e.name).join(',')}`,
      'from gql import Client, gql',
      'from httpx import BasicAuth',
      'from gql.transport.httpx import HTTPXAsyncTransport, HTTPXTransport',
    ];
  }
  getAppend(): string[] {
    return [];
  }
}
