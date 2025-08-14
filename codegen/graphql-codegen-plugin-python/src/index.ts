import { type GraphQLSchema, type DocumentNode, concatAST, Kind } from 'graphql';
import {
  getCachedDocumentNodeFromSchema,
  oldVisit,
  type PluginFunction,
  type Types,
} from '@graphql-codegen/plugin-helpers';
import { PythonTypesVisitor, type PythonTypesRawConfig } from './PythonTypesVisitor.ts';
import { type LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import {
  PythonOperationsVisitor,
  type PythonOperationsRawConfig,
} from './PythonOperationsVisitor.ts';

function isNotNullish<T>(arg: T): arg is Exclude<T, null | undefined> {
  return arg !== null;
}

export type PythonPluginConfig =
  | ({
      mode: 'types';
    } & PythonTypesRawConfig)
  | ({ mode: 'operations' } & PythonOperationsRawConfig);

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

  const visitorResult = oldVisit(
    astNode,
    // @ts-expect-error the visit function does not properly narrow the types for each node. For example, our visitor expects `NamedType` to be called with a `NamedTypeNode`, but the types expect it to be called with any type of `DocumentNode`. Ideally we should use visit directly from graphql-js, but it does not support { leave: KindVisitor } (see https://github.com/graphql/graphql-js/issues/4466)
    { leave: visitor },
  ) as DocumentNode;

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
