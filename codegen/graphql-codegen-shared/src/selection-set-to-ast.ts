import assert, { strictEqual } from 'node:assert';
import {
  type GraphQLOutputType,
  type ObjectTypeDefinitionNode,
  type FieldDefinitionNode,
  type FragmentDefinitionNode,
  type OperationDefinitionNode,
  OperationTypeNode,
  isInterfaceType,
  GraphQLSchema,
  Kind,
  isObjectType,
  getNullableType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  type UnionTypeDefinitionNode,
} from 'graphql';
import {
  collectSelectedFieldsFromOperation,
  isFragmentSelection,
  isObjectSelection,
  isScalarSelection,
  type ObjectSelection,
  type ScalarSelection,
} from './collect-selected-fields-from-operation.ts';
import { assertIsNotUndefined } from './assertIsNotUndefined.ts';
import { unwrapTypeNode } from './unwrapTypeNode.ts';

export interface AstTreeNode {
  astNode: ObjectTypeDefinitionNode | UnionTypeDefinitionNode;
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
    schemaNode: rootType,
    fragments,
    fieldSelection: selections,
  });
}

function createAstTreeNodeFromSelection({
  schema,
  schemaNode,
  fieldSelection,
  fragments,
}: {
  schema: GraphQLSchema;
  fragments: FragmentDefinitionNode[];
  schemaNode: GraphQLObjectType | GraphQLInterfaceType;
  fieldSelection: ObjectSelection;
}): AstTreeNode {
  let possibleTypes: readonly (GraphQLObjectType | GraphQLInterfaceType)[];
  if (
    isInterfaceType(schemaNode) &&
    // We only need to consider multiple possible types if there are any fragments in the selection
    // set. If not, we know that all fields exist on the base type.
    fieldSelection.fields.some(isFragmentSelection)
  ) {
    const implementations = schema.getImplementations(schemaNode);
    assert(implementations.interfaces.length === 0, 'Nested interfaces are not supported');
    possibleTypes = implementations.objects;
  } else {
    possibleTypes = [schemaNode];
  }

  const result: AstTreeNode[] = possibleTypes.map(({ name, astNode }) => {
    const children: AstTreeNode[] = [];
    const filteredFields: FieldDefinitionNode[] = [];

    const selections = fieldSelection.fields.reduce<(ScalarSelection | ObjectSelection)[]>(
      (carry, selection) => {
        if (isObjectSelection(selection) || isScalarSelection(selection)) {
          carry.push(selection);
        }

        if (
          isFragmentSelection(selection) &&
          // The selection can be either on the concrete type, or its interface.
          (selection.onType === name || selection.onType === schemaNode.name)
        ) {
          carry.push(...selection.fields);
        }

        return carry;
      },
      [],
    );

    assert(astNode != null);
    for (const fieldSelection of selections) {
      const field: FieldDefinitionNode | undefined = astNode.fields?.find(
        _field => _field.name.value === fieldSelection.name,
      );
      assertIsNotUndefined(field);

      filteredFields.push(field);

      const { node: fieldType } = unwrapTypeNode(field.type);
      const fieldSchemaType = schema.getType(fieldType.name.value);

      assertIsNotUndefined(fieldSchemaType);
      if (isObjectType(fieldSchemaType) || isInterfaceType(fieldSchemaType)) {
        assert(isObjectSelection(fieldSelection));

        children.push(
          createAstTreeNodeFromSelection({
            schema,
            fragments,
            schemaNode: fieldSchemaType,
            fieldSelection: fieldSelection,
          }),
        );
      }
    }

    return {
      astNode: {
        ...astNode,
        // Convert interfaces to objects, in order to output concrete types for interfaces
        kind: Kind.OBJECT_TYPE_DEFINITION,
        fields: filteredFields,
      },
      children,
    };
  });

  if (result.length > 1) {
    // Create a union of the possible types
    return {
      astNode: {
        kind: Kind.UNION_TYPE_DEFINITION,
        types: result.map(child => ({
          ...child.astNode,
          kind: Kind.NAMED_TYPE,
        })),
        name: {
          kind: Kind.NAME,
          value: schemaNode.name,
        },
      } satisfies UnionTypeDefinitionNode,
      children: result,
    };
  }

  assertIsNotUndefined(result[0]);
  return result[0];
}
