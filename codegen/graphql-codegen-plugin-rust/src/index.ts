import { type GraphQLSchema, concatAST, Kind, visit } from 'graphql';

import type { PluginFunction } from '@graphql-codegen/plugin-helpers';
import type { LoadedFragment, RawConfig } from '@graphql-codegen/visitor-plugin-common';
import { getCachedDocumentNodeFromSchema, type Types } from '@graphql-codegen/plugin-helpers';
import { RustTypesVisitor } from './RustTypesVisitor.ts';
import { RustOperationsVisitor } from './RustOperationsVisitor.ts';

export type RustPluginConfig = { mode: 'types' | 'operations' } & {} & RawConfig;

function isNotNullish<T>(arg: T): arg is Exclude<T, null | undefined> {
  return arg !== null;
}

export const plugin: PluginFunction<RustPluginConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: RustPluginConfig,
) => {
  const allDocuments = concatAST(documents.map(v => v.document).filter(isNotNullish));

  const allFragments: LoadedFragment[] = [
    ...allDocuments.definitions
      .filter(d => d.kind === Kind.FRAGMENT_DEFINITION)
      .map(fragmentDef => ({
        node: fragmentDef,
        name: fragmentDef.name.value,
        onType: fragmentDef.typeCondition.name.value,
        isExternal: false,
      })),
  ];

  const visitor =
    config.mode === 'types'
      ? new RustTypesVisitor(config, schema)
      : new RustOperationsVisitor(config, schema, allFragments);

  const astNode = config.mode === 'types' ? getCachedDocumentNodeFromSchema(schema) : allDocuments;

  const visitorResult = visit(astNode, visitor);

  const blockContent =
    visitorResult.definitions.filter(d => typeof d === 'string').join('\n') +
    '\n' +
    visitor.getAdditionalContent();

  return {
    prepend: visitor.getPrepend(),
    append: visitor.getAppend(),
    content: blockContent,
  };
};
