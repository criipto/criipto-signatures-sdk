import assert, { strictEqual } from 'node:assert';
import {
  type GraphQLOutputType,
  type ObjectTypeDefinitionNode,
  type FieldDefinitionNode,
  type TypeNode,
  type NamedTypeNode,
  type FragmentDefinitionNode,
  type InterfaceTypeDefinitionNode,
  type OperationDefinitionNode,
  OperationTypeNode,
  isInterfaceType,
  GraphQLSchema,
  Kind,
  isObjectType,
  getNullableType,
} from 'graphql';
import {
  collectSelectedFieldsFromOperation,
  type SelectedFieldsObject,
} from './collect-selected-fields-from-operation.ts';
import { assertIsNotUndefined } from './assertIsNotUndefined.ts';

export interface AstTreeNode {
  astNode: ObjectTypeDefinitionNode;
  children: AstTreeNode[];
}

/**
 * Given an operation definition (mutation or query), returns a tree of AST nodes queried by
 * the operations.
 *
 * The fields on the AST nodes are filtered by the selection set defined by the operation
 */
export function operationSelectionsToAstTree({
  node,
  fragments,
  schema,
}: {
  node: OperationDefinitionNode;
  fragments: FragmentDefinitionNode[];
  schema: GraphQLSchema;
}): AstTreeNode {
  strictEqual(
    node.selectionSet.selections.length,
    1,
    'Operation should have exactly one top-level selection',
  );
  strictEqual(
    node.selectionSet.selections[0]?.kind,
    Kind.FIELD,
    'Top-level selection should be a field',
  );
  const typeName = node.selectionSet.selections[0].name.value;

  let rootType: GraphQLOutputType | undefined;
  switch (node.operation) {
    case OperationTypeNode.MUTATION:
      rootType = schema.getMutationType()?.getFields()[typeName]?.type;
      break;
    case OperationTypeNode.QUERY:
      rootType = schema.getQueryType()?.getFields()[typeName]?.type;
      break;
    case OperationTypeNode.SUBSCRIPTION:
      throw new Error('Subscriptions are not supported');
    default:
      node.operation satisfies never;
  }

  assert(rootType, 'Root type not found in schema');
  rootType = getNullableType(rootType);
  assert(
    isObjectType(rootType) || isInterfaceType(rootType),
    'Root type should be object or interface type',
  );
  assert(rootType.astNode, 'astNode missing on root type');

  const selections = collectSelectedFieldsFromOperation(node, fragments);

  return createAstTreeNodeFromSelection({
    schema,
    astNode: rootType.astNode,
    fragments,
    selections,
  });
}

function createAstTreeNodeFromSelection({
  schema,
  astNode,
  selections,
  fragments,
}: {
  schema: GraphQLSchema;
  fragments: FragmentDefinitionNode[];
  astNode: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode;
  selections: SelectedFieldsObject;
}): AstTreeNode {
  const children: AstTreeNode[] = [];
  const filteredFields: FieldDefinitionNode[] = [];

  for (const field of astNode.fields ?? []) {
    const fieldSelection = selections.fields.find(selection => selection.name === field.name.value);
    if (!fieldSelection) {
      continue;
    }

    filteredFields.push(field);

    const fieldType = unwrapTypeNode(field.type);
    const schemaType = schema.getType(fieldType.name.value);

    assertIsNotUndefined(schemaType);
    if (isObjectType(schemaType) || isInterfaceType(schemaType)) {
      assert(
        schemaType.astNode?.kind === Kind.OBJECT_TYPE_DEFINITION ||
          schemaType.astNode?.kind === Kind.INTERFACE_TYPE_DEFINITION,
      );
      strictEqual(fieldSelection.type, 'object');

      children.push(
        createAstTreeNodeFromSelection({
          schema,
          fragments,
          astNode: schemaType.astNode,
          selections: fieldSelection,
        }),
      );
    }
  }

  return {
    astNode: {
      ...astNode,
      // For now, we convert interfaces to objects, in order to output concrete types for interfaces
      // this will probably change once we add support for inline fragments
      kind: Kind.OBJECT_TYPE_DEFINITION,
      fields: filteredFields,
    },
    children,
  };
}

/**
 * Named types can be wrapped in both non-nullable and list nodes (such as foo: [Bar!]!),
 * which translates to NonNullType(ListType(NonNullType(Bar))))
 */
function unwrapTypeNode(node: TypeNode): NamedTypeNode {
  while (node.kind === Kind.LIST_TYPE || node.kind == Kind.NON_NULL_TYPE) {
    node = node.type;
  }
  return node;
}
