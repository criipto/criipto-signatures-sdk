import { Kind, type NamedTypeNode, type TypeNode } from 'graphql';

/**
 * Named types can be wrapped in both non-nullable and list nodes (such as foo: [Bar!]!),
 * which translates to NonNullType(ListType(NonNullType(Bar))))
 */
export function unwrapTypeNode(node: TypeNode): NamedTypeNode {
  while (node.kind === Kind.LIST_TYPE || node.kind == Kind.NON_NULL_TYPE) {
    node = node.type;
  }
  return node;
}
