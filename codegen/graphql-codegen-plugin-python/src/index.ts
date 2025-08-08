import { type GraphQLSchema, type DocumentNode, concatAST } from 'graphql';
import {
  getCachedDocumentNodeFromSchema,
  oldVisit,
  type PluginFunction,
  type Types,
} from '@graphql-codegen/plugin-helpers';
import { PythonTypesVisitor } from './typesVisitor.ts';
import type { RawConfig } from '@graphql-codegen/visitor-plugin-common';
import { PythonOperationsVisitor } from './operationsVisitor.ts';

export interface PythonPluginConfig extends RawConfig {
  mode: 'types' | 'operations';
}

export const plugin: PluginFunction<PythonPluginConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: PythonPluginConfig,
) => {
  const visitor =
    config.mode === 'types'
      ? new PythonTypesVisitor(config, schema)
      : new PythonOperationsVisitor(config, schema);

  const astNode =
    config.mode === 'types'
      ? getCachedDocumentNodeFromSchema(schema)
      : concatAST(documents.map(v => v.document).filter(n => n != undefined));

  const visitorResult = oldVisit(
    astNode,
    // @ts-expect-error the visit function does not properly narrow the types for each node. For example, our visitor expects `NamedType` to be called with a `NamedTypeNode`, but the types expect it to be called with any type of `DocumentNode`. Ideally we should use visit directly from graphql-js, but it does not support { leave: KindVisitor } (see https://github.com/graphql/graphql-js/issues/4466)
    { leave: visitor },
  ) as DocumentNode;

  const blockContent = visitorResult.definitions.filter(d => typeof d === 'string').join('\n');

  return {
    prepend: visitor.getPrepend(),
    append: visitor.getAppend(),
    content: blockContent,
  };
};
