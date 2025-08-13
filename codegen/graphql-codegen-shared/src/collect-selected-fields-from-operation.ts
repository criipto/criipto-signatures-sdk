import {
  Kind,
  type FieldNode,
  type FragmentDefinitionNode,
  type OperationDefinitionNode,
} from 'graphql';
import assert, { strictEqual } from 'assert';

interface Scalar {
  type: 'scalar';
  name: string;
}
export interface SelectedFieldsObject {
  type: 'object';
  name: string;
  fields: (Scalar | SelectedFieldsObject)[];
}

/**
 * Given an operation definition (query or mutation), recursively traverse through the selection set,
 * and collect the selected fields into a tree structure.
 *
 * If a field is selected multiple times at the same level in the tree, it will only be present in
 * the output once.
 *
 * This method handles fragment spreads in the selection set, and converts them to their actual
 * selected fields.
 *
 * Does not handle conditional selections
 * Does not handle inline fragments
 *
 * @param operationNode
 * @param fragments An array of all fragments used in the operation
 * @returns
 */
export function collectSelectedFieldsFromOperation(
  operationNode: OperationDefinitionNode,
  fragments: FragmentDefinitionNode[],
): SelectedFieldsObject {
  strictEqual(
    operationNode.selectionSet.selections.length,
    1,
    'Operation should have exactly one top-level selection',
  );
  strictEqual(
    operationNode.selectionSet.selections[0]?.kind,
    Kind.FIELD,
    'Top-level selection should be a field',
  );
  const root: SelectedFieldsObject = {
    name: operationNode.selectionSet.selections[0].name.value,
    fields: [],
    type: 'object',
  };

  collectFieldsRecursive(root, operationNode.selectionSet.selections[0], fragments);
  return root;
}

function collectFieldsRecursive(
  node: SelectedFieldsObject,
  selectionNode: FieldNode | FragmentDefinitionNode,
  fragments: FragmentDefinitionNode[],
): void {
  if (!selectionNode.selectionSet) {
    return;
  }

  for (const selection of selectionNode.selectionSet.selections) {
    switch (selection.kind) {
      case Kind.FIELD: {
        const name = selection.name.value;
        if (selection.selectionSet == undefined) {
          if (!node.fields.find(field => field.type === 'scalar' && field.name === name)) {
            node.fields.push({ type: 'scalar', name });
          }
        } else {
          let fieldNode = node.fields
            .filter(field => field.type === 'object')
            .find(field => field.name === name);

          if (fieldNode == undefined) {
            fieldNode = {
              name,
              type: 'object',
              fields: [],
            };
            node.fields.push(fieldNode);
          }

          collectFieldsRecursive(fieldNode, selection, fragments);
        }
        break;
      }
      case Kind.FRAGMENT_SPREAD: {
        const fragmentDefinition = fragments.find(
          fragment => fragment.name.value === selection.name.value,
        );
        assert(fragmentDefinition, `No definition found for fragment ${selection.name.value}`);
        collectFieldsRecursive(node, fragmentDefinition, fragments);
        break;
      }
      case Kind.INLINE_FRAGMENT: {
        // TODO
        break;
      }
      default:
        selection satisfies never;
    }
  }
}
