import {
  BaseVisitor,
  ClientSideBaseVisitor,
  type LoadedFragment,
  type RawConfig,
} from '@graphql-codegen/visitor-plugin-common';
import { upperCaseFirst } from 'change-case-all';
import {
  buildSchema,
  OperationTypeNode,
  print,
  printSchema,
  visit,
  type FragmentDefinitionNode,
  type GraphQLSchema,
  type OperationDefinitionNode,
} from 'graphql';
import {
  assertIsNotUndefined,
  operationSelectionsToAstTree,
  type AstTreeNode,
} from 'graphql-codegen-shared';
import { RustTypesVisitor } from './RustTypesVisitor.ts';
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
      let result: string[] = [];

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
        result.push(visitorResult);

        nodesToProcess.push(
          ...treeNode.children.map(child => ({
            parentPrefix: nodePrefix + '_',
            treeNode: child,
          })),
        );
      }

      let query = print(node);

      return `pub mod op_${operationName} {
        pub const OPERATION_NAME: &str = "${operationName}";
        pub const QUERY: &str = r#"${query}"#;
        use super::*;
        ${result.join('\n')}
      }`;
    },
  };

  getAdditionalContent(): string {
    return '';
  }

  getPrepend(): string[] {
    return ['use serde_derive::{Deserialize, Serialize};'];
  }

  getAppend(): string[] {
    return [];
  }
}
