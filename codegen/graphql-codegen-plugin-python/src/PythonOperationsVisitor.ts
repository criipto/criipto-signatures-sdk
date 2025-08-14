import {
  ClientSideBaseVisitor,
  indentMultiline,
  type LoadedFragment,
  type RawConfig,
} from '@graphql-codegen/visitor-plugin-common';
import {
  type OperationDefinitionNode,
  Kind,
  type NonNullTypeNode,
  print,
  type FragmentDefinitionNode,
  GraphQLSchema,
  getNullableType,
  isInterfaceType,
  isObjectType,
} from 'graphql';
import assert from 'node:assert';
import { upperCaseFirst } from 'change-case-all';

export interface PythonOperationsRawConfig extends RawConfig {}

export class PythonOperationsVisitor extends ClientSideBaseVisitor<PythonOperationsRawConfig> {
  modelImports: Set<string> = new Set();

  constructor(
    config: PythonOperationsRawConfig,
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
  ) {
    super(schema, fragments, config, {});
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

  // @ts-expect-error We are intentionally changing the signature of `OperationDefinition` here.
  // ClientSideBaseVisitor expects to be passed the old format of visit, where you
  // could pass `{ leave: visitor }`. That was removed in
  // https://github.com/graphql/graphql-js/pull/2957, so we change the type of the property, to
  // specify the `leave` property inline.
  override OperationDefinition = {
    leave: (node: OperationDefinitionNode) => {
      // Save the operation for later, when we build the actual SDK operations
      this._collectedOperations.push(node);

      const name =
        node.operation === 'query'
          ? `query${upperCaseFirst(node.name?.value ?? '')}`
          : node.name?.value;

      // Recursively extracts the names of all fragments used in the operation
      const fragments = this._extractFragments(node, true).map(node => this.getFragmentName(node));

      // Return just the GraphQL document variable definition for now, the actual operation is built in `getAdditionalContent`
      return PythonOperationsVisitor.stringVariable(`${name}Document`, print(node), fragments);
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
          const name =
            node.operation === 'query'
              ? `query${upperCaseFirst(node.name?.value ?? '')}`
              : node.name?.value;

          assert(
            node.selectionSet.selections.length === 1,
            'Expected query / mutation to have exactly one top level selection',
          );
          assert(
            node.selectionSet.selections[0]?.kind === Kind.FIELD,
            'Top level selection must be a field',
          );
          const operations =
            node.operation === 'query'
              ? this._schema.getQueryType()
              : node.operation === 'mutation'
                ? this._schema.getMutationType()
                : this._schema.getSubscriptionType();
          let selectionNode = operations?.getFields()[node.selectionSet.selections[0].name.value];
          assert(selectionNode != undefined, 'Top level selection type not found in schema');

          const outputTypeNode = getNullableType(selectionNode.type);

          assert(
            isInterfaceType(outputTypeNode) || isObjectType(outputTypeNode),
            'Expected output type for operation to be either interface or object',
          );

          const outputType = upperCaseFirst(outputTypeNode.name);

          this.modelImports.add(outputType);

          const functionArguments = (node.variableDefinitions ?? []).reduce(
            (functionArguments, variableDefinitionNode) => {
              const variableName = variableDefinitionNode.variable.name.value;

              const nullable = variableDefinitionNode.type.kind !== Kind.NON_NULL_TYPE;
              const variableTypeNode = nullable
                ? variableDefinitionNode.type
                : (variableDefinitionNode.type as NonNullTypeNode).type;

              assert(
                variableTypeNode.kind === Kind.NAMED_TYPE,
                'Only named types are supported in function arguments',
              );

              let variableType = variableTypeNode.name.value;
              if (Object.keys(this.scalars).includes(variableType)) {
                variableType = `${variableType}Scalar`;
              }
              this.modelImports.add(variableType);

              functionArguments[variableName] = variableType;
              return functionArguments;
            },
            {} as Record<string, string>,
          );

          const functionDefinition = `def ${name}(self, ${Object.entries(functionArguments)
            .map(([argumentName, argumentType]) => `${argumentName}: ${argumentType}`)
            .join(', ')}) -> ${outputType}:`;

          // Builds a JSON object of variables to pass to the query
          const queryVariables = [
            '{',
            Object.keys(functionArguments)
              .map(
                argumentName =>
                  // If the argument is called `input`, we assume it to be a pydantic model, and dump it to an object
                  `"${argumentName}": ${argumentName === 'input' ? `${argumentName}.model_dump()` : argumentName}`,
              )
              .join(','),
            '}',
          ].join('\n');

          const functionBody = indentMultiline(
            `query = gql(${name}Document)
variables = ${queryVariables}
result = self.client.execute(query, variable_values=variables)
parsed = ${outputType}.model_validate(result.get('${selectionNode.name}'))
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
    return [
      `from .models import ${Array.from(this.modelImports).join(',')}`,
      'from gql import Client, gql',
      'from gql.transport.aiohttp import AIOHTTPTransport, BasicAuth',
    ];
  }
  getAppend(): string[] {
    return [];
  }
}
