import { type GraphQLSchema, isInputObjectType, isIntrospectionType } from 'graphql';
import type { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { generateBuilder } from './KotlinBuildersVisitor.ts';

export type KotlinBuildersPluginConfig = {
  package?: string;
};

export const plugin: PluginFunction<KotlinBuildersPluginConfig> = (
  schema: GraphQLSchema,
  _documents,
  config: KotlinBuildersPluginConfig,
) => {
  const packageName = config.package ?? 'eu.idura.signatures';
  const typeMap = schema.getTypeMap();

  const builders: string[] = [];

  // Iterate schema types in a stable order
  for (const typeName of Object.keys(typeMap).sort()) {
    const type = typeMap[typeName];
    if (!type || !isInputObjectType(type)) continue;
    if (isIntrospectionType(type)) continue;

    builders.push(generateBuilder(typeName, type));
  }

  return {
    prepend: [`package ${packageName}`, ''],
    content: builders.join('\n\n'),
  };
};
