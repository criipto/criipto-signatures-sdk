import {
  Kind,
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  type InlineFragmentNode,
  type OperationDefinitionNode,
} from 'graphql';
import assert, { strictEqual } from 'assert';
import { assertIsNotUndefined } from './assertIsNotUndefined.ts';

export interface ScalarSelection {
  type: 'scalar';
  name: string;
}
export interface ObjectSelection {
  type: 'object';
  name: string;
  fields: FieldSelection[];
}
export interface FragmentSelection {
  type: 'fragment';
  onType: string;
  fields: (ScalarSelection | ObjectSelection)[];
}

export type FieldSelection = ScalarSelection | ObjectSelection | FragmentSelection;

export const isObjectSelection = (selection: FieldSelection): selection is ObjectSelection =>
  selection.type === 'object';

export const isFragmentSelection = (selection: FieldSelection): selection is FragmentSelection =>
  selection.type === 'fragment';

export const isScalarSelection = (selection: FieldSelection): selection is ScalarSelection =>
  selection.type === 'scalar';

/**
 * Given an operation definition (query or mutation), recursively traverse through the selection
 * set, and collect the selected fields into a tree structure.
 *
 * If a field is selected multiple times at the same level in the tree, it will only be present in
 * the output once.
 *
 * This method handles fragment spreads and inline fragments in the selection set, and converts them
 * to their actual selected fields.
 *
 * Does not handle conditional selections
 *
 * @param operationNode
 * @param fragments An array of all fragments used in the operation
 * @returns
 */
export function collectSelectedFieldsFromOperation(
  operationNode: OperationDefinitionNode,
  fragments: FragmentDefinitionNode[],
): ObjectSelection {
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
  const root: ObjectSelection = {
    name: operationNode.selectionSet.selections[0].name.value,
    fields: [],
    type: 'object',
  };

  collectFieldsRecursive(root, operationNode.selectionSet.selections[0], fragments);
  return root;
}

function collectFieldsRecursive(
  node: ObjectSelection | FragmentSelection,
  selectionNode: FieldNode | FragmentDefinitionNode | InlineFragmentNode,
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
          if (!node.fields.some(field => isScalarSelection(field) && field.name === name)) {
            node.fields.push({ type: 'scalar', name });
          }
        } else {
          let fieldNode: ObjectSelection | undefined =
            // `node.fields` can be either `FieldSelection[]` or `(ScalarSelection |
            // ObjectSelection)[]` (notice how the second type is a strict subset of the first).
            // Here, we are doing a safe upcast to a `FieldSelection[]`, by using both `satisfies`
            // and `as`
            (node.fields satisfies FieldSelection[] as FieldSelection[])
              .filter(isObjectSelection)
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
      case Kind.FRAGMENT_SPREAD:
      case Kind.INLINE_FRAGMENT:
        assert(isObjectSelection(node));
        collectFieldsFromFragment(node, selection, fragments);
        break;
      default:
        selection satisfies never;
    }
  }
}

function getFragmentDefinitionFromFragment(
  fragmentNode: FragmentSpreadNode | InlineFragmentNode,
  fragments: FragmentDefinitionNode[],
): FragmentDefinitionNode | InlineFragmentNode {
  if (fragmentNode.kind === Kind.INLINE_FRAGMENT) {
    return fragmentNode;
  }

  const fragmentDefinition = fragments.find(
    fragment => fragment.name.value === fragmentNode.name.value,
  );

  assert(fragmentDefinition, `No definition found for fragment ${fragmentNode.name.value}`);

  return fragmentDefinition;
}

function collectFieldsFromFragment(
  parentNode: ObjectSelection,
  fragment: FragmentSpreadNode | InlineFragmentNode,
  fragments: FragmentDefinitionNode[],
) {
  const fragmentDefinition = getFragmentDefinitionFromFragment(fragment, fragments);
  assertIsNotUndefined(
    fragmentDefinition.typeCondition,
    'Expected fragment to have a type condition',
  );
  const onType = fragmentDefinition.typeCondition.name.value;

  let fragmentNode: FragmentSelection | undefined = parentNode.fields
    .filter(isFragmentSelection)
    .find(node => node.onType === onType);
  if (fragmentNode == undefined) {
    fragmentNode = {
      onType,
      type: 'fragment',
      fields: [],
    };
    parentNode.fields.push(fragmentNode);
  }

  /**
   * Fragments can contained nested fragments. This mostly happens with fragments on sub-types:
   * ```graphql
   * fragment Foo on Interface {
   *   interfaceField
   *   ... on ConcreteType {
   *     concreteTypeField
   *   }
   * }
   * ```
   *
   * We want the two fragments above to end up at the same level of the selection tree.
   *
   * Therefore, we split the selection into fields (which should be handled at the child node
   * (`fragmentNode`) level), and nested fragments (which should be handled at this (`parentNode`)
   * level)
   */
  const { fields, nestedFragments } = fragmentDefinition.selectionSet.selections.reduce<{
    fields: FieldNode[];
    nestedFragments: (FragmentSpreadNode | InlineFragmentNode)[];
  }>(
    (carry, fragmentSelection) => {
      if (fragmentSelection.kind === Kind.FIELD) {
        carry.fields.push(fragmentSelection);
      } else {
        carry.nestedFragments.push(fragmentSelection);
      }

      return carry;
    },
    { fields: [], nestedFragments: [] },
  );

  for (const nestedFragment of nestedFragments) {
    collectFieldsFromFragment(parentNode, nestedFragment, fragments);
  }

  collectFieldsRecursive(
    fragmentNode,
    {
      // Creates a new selection set, which only contains the field selections (so no fragments)
      ...fragmentDefinition,
      selectionSet: {
        kind: Kind.SELECTION_SET,
        selections: fields,
      },
    },
    fragments,
  );
}
