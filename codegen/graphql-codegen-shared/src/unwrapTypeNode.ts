import { Kind, type NamedTypeNode, type TypeNode } from 'graphql';

/**
 * Named types can be wrapped in both non-nullable and list nodes (such as foo: [Bar!]!),
 * which translates to NonNullType(ListType(NonNullType(Bar)))).
 *
 * This function unwraps the node, and returns booleans indicating whether:
 * * The innermost type was nullable (`nullable`)
 * * The type was wrapped in a list (`listType`)
 * * The list type was nullable (`nullableList`)
 */
export function unwrapTypeNode(node: TypeNode): {
  nullable: boolean;
  listType: boolean;
  nullableList: boolean;
  node: NamedTypeNode;
} {
  let nullable = true;
  let listType = false;
  let nullableList = true;

  while (node.kind === Kind.LIST_TYPE || node.kind == Kind.NON_NULL_TYPE) {
    if (node.kind === Kind.NON_NULL_TYPE) {
      nullable = false;
    }
    if (node.kind === Kind.LIST_TYPE) {
      listType = true;
      if (!nullable) {
        nullableList = false;
        nullable = true;
      }
    }
    node = node.type;
  }
  return { nullable, listType, nullableList, node };
}
