import {
  ClientSideBaseVisitor,
  type LoadedFragment,
  type RawConfig,
} from '@graphql-codegen/visitor-plugin-common';
import { type GraphQLSchema } from 'graphql';

export interface PythonOperationsRawConfig extends RawConfig {}

export class PythonOperationsVisitor extends ClientSideBaseVisitor<PythonOperationsRawConfig> {
  constructor(
    config: PythonOperationsRawConfig,
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
  ) {
    super(schema, fragments, config, {});
  }

  getAdditionalContent() {
    return '';
  }

  getPrepend() {
    return [];
  }

  getAppend() {
    return [];
  }
}
