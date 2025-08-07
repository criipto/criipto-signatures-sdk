import { type GraphQLSchema } from 'graphql';
import {
  getCachedDocumentNodeFromSchema,
  type PluginFunction,
  type Types,
} from '@graphql-codegen/plugin-helpers';
import type { RawConfig } from '@graphql-codegen/visitor-plugin-common';

export const plugin: PluginFunction<RawConfig> = (
  schema: GraphQLSchema,
  _documents: Types.DocumentFile[],
  _config: RawConfig,
) => {
  // @ts-expect-error Will be used in a jiffy!
  const astNode = getCachedDocumentNodeFromSchema(schema);
  return 'print("Hello world")';
};
