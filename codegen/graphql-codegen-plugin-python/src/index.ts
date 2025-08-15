import { type GraphQLSchema, concatAST, Kind, visit } from 'graphql';
import {
  getCachedDocumentNodeFromSchema,
  type PluginFunction,
  type Types,
} from '@graphql-codegen/plugin-helpers';
import { PythonTypesVisitor } from './PythonTypesVisitor.ts';
import { type LoadedFragment, type RawConfig } from '@graphql-codegen/visitor-plugin-common';
import { PythonOperationsVisitor } from './PythonOperationsVisitor.ts';

function isNotNullish<T>(arg: T): arg is Exclude<T, null | undefined> {
  return arg !== null;
}

export type PythonPluginConfig = (
  | {
      mode: 'types';
    }
  | { mode: 'operations' }
) &
  RawConfig;

export const plugin: PluginFunction<PythonPluginConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: PythonPluginConfig,
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
      ? new PythonTypesVisitor(config, schema)
      : new PythonOperationsVisitor(config, schema, allFragments);

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
