import { type GraphQLSchema, concatAST, Kind, visit } from 'graphql';
import { type PluginFunction, type Types } from '@graphql-codegen/plugin-helpers';
import { type LoadedFragment, type RawConfig } from '@graphql-codegen/visitor-plugin-common';
import { KotlinOperationsVisitor } from './KotlinOperationsVisitor.ts';

function isNotNullish<T>(arg: T): arg is Exclude<T, null | undefined> {
  return arg !== null && arg !== undefined;
}

export type KotlinPluginConfig = {
  mode: 'operations';
  package?: string;
} & RawConfig;

export const plugin: PluginFunction<KotlinPluginConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: KotlinPluginConfig,
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

  const visitor = new KotlinOperationsVisitor(config, schema, allFragments);

  const visitorResult = visit(allDocuments, visitor);

  const blockContent =
    visitorResult.definitions.filter((d: unknown) => typeof d === 'string').join('\n') +
    '\n' +
    visitor.getAdditionalContent();

  return {
    prepend: visitor.getPrepend(),
    append: visitor.getAppend(),
    content: blockContent,
  };
};
