import {
  BaseVisitor,
  type RawConfig,
  buildScalarsFromConfig,
} from '@graphql-codegen/visitor-plugin-common';
import { type GraphQLSchema, isScalarType, type NamedTypeNode } from 'graphql';
import { DEFAULT_SCALARS } from './typesVisitor.ts';

export class PythonVisitor extends BaseVisitor {
  scalarNames: string[];
  schema: GraphQLSchema;

  constructor(config: RawConfig, schema: GraphQLSchema) {
    super(config, {
      scalars: buildScalarsFromConfig(
        schema,
        config,
        DEFAULT_SCALARS,
        config.defaultScalarType ?? 'str',
      ),
    });

    const typeMap = schema.getTypeMap();
    this.scalarNames = Object.keys(typeMap)
      .map(typeName => typeMap[typeName])
      .filter(type => isScalarType(type))
      .map(type => type.name);

    this.schema = schema;
  }

  isScalar(node: NamedTypeNode) {
    return this.scalarNames.includes(node.name.value);
  }
}
