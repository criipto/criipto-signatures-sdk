import {
  ClientSideBaseVisitor,
  indent,
  indentMultiline,
  type LoadedFragment,
  type RawConfig,
} from '@graphql-codegen/visitor-plugin-common';
import { upperCaseFirst } from 'change-case-all';
import {
  buildSchema,
  getNullableType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  OperationTypeNode,
  print,
  printSchema,
  visit,
  type FragmentDefinitionNode,
  type GraphQLNamedType,
  type GraphQLSchema,
  type OperationDefinitionNode,
} from 'graphql';
import {
  assertIsNotUndefined,
  operationSelectionsToAstTree,
  unwrapTypeNode,
  type AstTreeNode,
} from 'graphql-codegen-shared';
import { RustTypeDefinition, RustTypesVisitor } from './RustTypesVisitor.ts';
import assert from 'assert';
import { inspect } from 'util';

export class RustOperationsVisitor extends ClientSideBaseVisitor {
  fragments: FragmentDefinitionNode[];

  constructor(config: RawConfig, schema: GraphQLSchema, fragments: LoadedFragment[]) {
    // Rebuild schema from string, in order to populate AST nodes
    // https://github.com/graphql/graphql-js/issues/1575
    schema = buildSchema(printSchema(schema));

    super(schema, fragments, config, {});
    this.fragments = fragments.map(f => f.node);
  }

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
    leave: (node: OperationDefinitionNode): string => {
      let resultStrings: string[] = [];

      const operationName = this.getOperationName(node);

      const astTree = operationSelectionsToAstTree({
        node,
        schema: this._schema,
        fragments: this.fragments,
      });

      // Then, we run a breadth-first traversal of the tree. For each node
      // we keep track of the prefix of the parent node.
      const nodesToProcess: { treeNode: AstTreeNode; parentPrefix: string }[] = [
        { treeNode: astTree, parentPrefix: '' },
      ];

      while (nodesToProcess.length > 0) {
        // We checked the length in the line above, so the non-null assertion is safe here
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { parentPrefix, treeNode } = nodesToProcess.shift()!;

        const nodePrefix = `${parentPrefix}${treeNode.astNode.name.value}`;
        const typesVisitor = new RustTypesVisitor(
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
        if (typeof visitorResult !== 'string') {
          throw new Error(
            `Expected visitorResult to be a string, got: ${inspect(visitorResult, {
              depth: 2,
            })}`,
          );
        }
        resultStrings.push(visitorResult);

        nodesToProcess.push(
          ...treeNode.children.map(child => ({
            parentPrefix: nodePrefix + '_',
            treeNode: child,
          })),
        );
      }

      const makeQuery = (node: OperationDefinitionNode): string => {
        const fragments = this._extractFragments(node, true);

        const fragmentDefinitions = fragments.map(frag =>
          this.fragments.find(f => f.name.value === frag),
        );

        return (
          print(node) +
          '\n' +
          fragmentDefinitions
            .filter(f => f != null)
            .map(fragDef => print(fragDef!))
            .join('\n')
        );
      };

      let query = makeQuery(node).replaceAll('\n', ' ');

      const generateOutputType = () => {
        assert(
          node.selectionSet.selections.length === 1,
          'Expected query / mutation to have exactly one top-level selection',
        );
        const topLevelSelection = node.selectionSet.selections[0]!;

        assert(topLevelSelection.kind === 'Field', 'Expected top-level selection to be a field');

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

        return new RustTypeDefinition(`ResponseData`, 'struct')
          .withDerives(['Debug', 'Clone', 'Serialize', 'Deserialize'])
          .withContent([`pub ${topLevelSelection.name.value}: ${operationOutputNode.name}`])
          .toString();
      };

      const generateInputType = () => {
        const functionArguments = (node.variableDefinitions ?? []).map<{
          name: string;
          nullable: boolean;
          type: GraphQLNamedType;
        }>(variableDefinitionNode => {
          const { nullable, node: variableTypeNode } = unwrapTypeNode(variableDefinitionNode.type);

          const variableSchemaType = this._schema.getType(variableTypeNode.name.value);
          assertIsNotUndefined(variableSchemaType);

          return {
            name: variableDefinitionNode.variable.name.value,
            nullable,
            type: variableSchemaType,
          };
        });

        const variableType = new RustTypeDefinition('Variables', 'struct')
          .withDerives(['Debug', 'Clone', 'Serialize', 'Deserialize'])
          .withContent(
            functionArguments.map(arg => {
              let typeString: string;

              if (isScalarType(arg.type)) {
                typeString = `crate::scalars::${arg.type.name}`;
              } else if (isInputObjectType(arg.type) || isEnumType(arg.type)) {
                typeString = `crate::generated::types::${arg.type.name}`;
              } else {
                throw new Error(`Unsupported variable type: ${JSON.stringify(arg.type)}`);
              }

              if (arg.nullable) {
                typeString = `Option<${typeString}>`;
              }

              return `pub ${arg.name}: ${typeString}`;
            }),
          );

        return variableType.toString();
      };

      return `
pub struct ${operationName};

pub mod op_${operationName} {
    pub const OPERATION_NAME: &str = "${operationName}";
    pub const QUERY: &str = r#"${query}"#;
    use serde_derive::{Deserialize, Serialize};

${indentMultiline(resultStrings.join('\n'), 2)}
${indentMultiline(generateInputType(), 2)}
${indentMultiline(generateOutputType(), 2)}
} // mod op_${operationName}
        
impl crate::graphql::GraphQlQuery for ${operationName} {
    type Variables = op_${operationName}::Variables;
    type ResponseBody = op_${operationName}::ResponseData;

    fn build_query(variables: Self::Variables) -> crate::graphql::QueryBody<Self::Variables> {
        crate::graphql::QueryBody {
        query: op_${operationName}::QUERY,
        variables,
        }
    }
}`;
    },
  };

  getAdditionalContent(): string {
    return '';
  }

  getPrepend(): string[] {
    return [];
  }

  getAppend(): string[] {
    return [];
  }
}
