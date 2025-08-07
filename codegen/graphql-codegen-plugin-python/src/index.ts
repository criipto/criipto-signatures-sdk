import { type GraphQLSchema, type DocumentNode } from 'graphql';
import {
  getCachedDocumentNodeFromSchema,
  oldVisit,
  type PluginFunction,
  type Types,
} from '@graphql-codegen/plugin-helpers';
import { PythonVisitor } from './visitor.ts';
import type { RawConfig } from '@graphql-codegen/visitor-plugin-common';

export const plugin: PluginFunction<RawConfig> = (
  schema: GraphQLSchema,
  _documents: Types.DocumentFile[],
  config: RawConfig,
) => {
  const visitor = new PythonVisitor(config, schema);

  const astNode = getCachedDocumentNodeFromSchema(schema);

  const visitorResult = oldVisit(
    astNode,
    // @ts-expect-error the visit function does not properly narrow the types for each node. For example, our visitor expects `NamedType` to be called with a `NamedTypeNode`, but the types expect it to be called with any type of `DocumentNode`. Ideally we should use visit directly from graphql-js, but it does not support { leave: KindVisitor } (see https://github.com/graphql/graphql-js/issues/4466)
    { leave: visitor },
  ) as DocumentNode;

  const blockContent = visitorResult.definitions.filter(d => typeof d === 'string').join('\n');

  return {
    prepend: [...visitor.getImports(), visitor.getScalarsTypes()],
    append: [visitor.getModelRebuild()],
    content: blockContent,
  };
};
