import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type { plugin as GraphqlRequestPlugin } from '@graphql-codegen/typescript-graphql-request';
import type { plugin as CSharpPlugin } from '@graphql-codegen/c-sharp';
import type { plugin as CSharpOperationsPlugin } from '@graphql-codegen/c-sharp-operations';
import type { PythonPluginConfig } from 'graphql-codegen-plugin-python';

type TypescriptGraphqlRequestPluginConfig = Parameters<typeof GraphqlRequestPlugin>[2];
type CSharpPluginConfig = Parameters<typeof CSharpPlugin>[2];
type CSharpOperationsPluginConfig = Parameters<typeof CSharpOperationsPlugin>[2];

const pythonCommonConfig: Partial<CodegenConfig> = {
  hooks: {
    afterOneFileWrite: ['uvx ruff format'],
  },
};

const config: CodegenConfig = {
  schema: [
    {
      'https://signatures-api.criipto.com/v1/graphql': {
        method: 'GET',
      },
    },
  ],
  documents: './*.graphql',
  generates: {
    'packages/nodejs/src/graphql-sdk.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      config: {
        strictScalars: true,
        namingConvention: {
          enumValues: 'keep',
        },
        enumsAsTypes: true,
        futureProofEnums: true,
        scalars: {
          Blob: 'Buffer',
          Date: 'string',
          DateTime: 'string',
          URI: 'string',
        },
      } satisfies TypeScriptPluginConfig &
        TypeScriptDocumentsPluginConfig &
        TypescriptGraphqlRequestPluginConfig,
    },
    'packages/dotnet/Criipto.Signatures/Models.cs': {
      plugins: ['c-sharp'],
      config: {
        namespaceName: 'Criipto.Signatures',
        emitRecords: false,
        scalars: {
          Blob: 'byte[]',
          DateTime: 'string',
        },
      } satisfies CSharpPluginConfig,
    },
    'packages/dotnet/Criipto.Signatures/Operations.cs': {
      plugins: ['c-sharp-operations'],
      config: {
        namespaceName: 'Criipto.Signatures',
        querySuffix: 'Query',
        mutationSuffix: 'Mutation',
      } satisfies CSharpOperationsPluginConfig,
    },
    'packages/python/src/criipto_signatures/models.py': {
      plugins: ['graphql-codegen-plugin-python'],
      config: {
        mode: 'types',
      } satisfies PythonPluginConfig,
      ...pythonCommonConfig,
    },
    'packages/python/src/criipto_signatures/operations.py': {
      plugins: ['graphql-codegen-plugin-python'],
      config: {
        mode: 'operations',
      } satisfies PythonPluginConfig,
      ...pythonCommonConfig,
    },
  },
};
export default config;
