import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://signatures-api.criipto.com/v1/graphql',
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
      },
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
        mapping: {
          SignatureEvidenceProvider: 'SignatureEvidenceProvider',
        },
      },
    },
    'packages/dotnet/Criipto.Signatures/Operations.cs': {
      plugins: ['c-sharp-operations'],
      config: {
        namespaceName: 'Criipto.Signatures',
        querySuffix: 'Query',
        mutationSuffix: 'Mutation',
      },
    },
  },
};
export default config;
