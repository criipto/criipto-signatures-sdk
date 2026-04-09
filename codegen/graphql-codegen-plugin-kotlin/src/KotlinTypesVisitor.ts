import { type RawConfig, BaseVisitor } from '@graphql-codegen/visitor-plugin-common';

import {
  type FieldDefinitionNode,
  type ObjectTypeDefinitionNode,
  type UnionTypeDefinitionNode,
  type GraphQLSchema,
  type ASTNode,
  isScalarType,
  isEnumType,
} from 'graphql';

import assert from 'node:assert';
import { unwrapTypeNode } from 'graphql-codegen-shared';

export const KOTLIN_SCALARS: Record<string, string> = {
  ID: 'String',
  String: 'String',
  Int: 'Int',
  Float: 'Double',
  Boolean: 'Boolean',
  Blob: 'ByteArray',
  Date: 'String',
  DateTime: 'String',
  URI: 'String',
};

type KotlinTypesConfig = RawConfig & {
  typesPrefix?: string;
  superTypeName?: string;
  /** The shared interface this concrete type implements, e.g. "PdfDocument". */
  sharedInterfaceName?: string;
  /** Field names that must be emitted with the `override` modifier. */
  overrideFields?: ReadonlySet<string>;
};

export class KotlinTypesVisitor extends BaseVisitor {
  schema: GraphQLSchema;
  /** The sealed class name this type extends, if it is a concrete variant of a union. */
  readonly superTypeName: string | undefined;
  /** The shared interface this concrete type implements, e.g. "PdfDocument". */
  readonly sharedInterfaceName: string | undefined;
  /** Field names that must be emitted with the `override` modifier. */
  readonly overrideFields: ReadonlySet<string> | undefined;

  constructor(config: KotlinTypesConfig, schema: GraphQLSchema) {
    super(config, {
      typesPrefix: config.typesPrefix ?? '',
    });
    // Store separately because BaseVisitor doesn't preserve unknown rawConfig properties
    this.superTypeName = config.superTypeName;
    this.sharedInterfaceName = config.sharedInterfaceName;
    this.overrideFields = config.overrideFields;
    this.schema = schema;
  }

  FieldDefinition = {
    leave: (node: FieldDefinitionNode): string => {
      const { nullable, listType, nullableList, node: typeNode } = unwrapTypeNode(node.type);

      const schemaType = this.schema.getType(typeNode.name.value);
      assert(schemaType != undefined, `Type ${typeNode.name.value} not found in schema`);

      let kotlinType: string;

      if (isScalarType(schemaType)) {
        kotlinType = KOTLIN_SCALARS[typeNode.name.value] ?? 'String';
      } else if (isEnumType(schemaType)) {
        // Enums come from types.kt, use the raw type name
        kotlinType = typeNode.name.value;
      } else {
        kotlinType = this.config.typesPrefix + typeNode.name.value;
      }

      // Apply nullability and list wrapping (innermost to outermost)
      if (nullable) {
        kotlinType = `${kotlinType}?`;
      }
      if (listType) {
        kotlinType = `List<${kotlinType}>`;
        if (nullableList) {
          kotlinType = `${kotlinType}?`;
        }
      }

      const defaultValue = nullable || (listType && nullableList) ? ' = null' : '';
      const overridePrefix = this.overrideFields?.has(node.name.value) ? 'override ' : '';
      return `${overridePrefix}val ${node.name.value}: ${kotlinType}${defaultValue}`;
    },
  };

  ObjectTypeDefinition = {
    leave: (node: ObjectTypeDefinitionNode): string => {
      if (!node.fields) {
        return '';
      }

      const interfacePart = this.sharedInterfaceName ? `, ${this.sharedInterfaceName}` : '';
      const superTypePart = this.superTypeName
        ? ` : ${this.superTypeName}()${interfacePart}`
        : this.sharedInterfaceName
          ? ` : ${this.sharedInterfaceName}`
          : '';

      if (node.fields.length === 0) {
        // Kotlin data class requires at least one primary constructor parameter
        return `class ${node.name.value}()${superTypePart}`;
      }

      const fields = node.fields.map(f => this.asString(f));
      const fieldLines = fields.map(f => `    ${f}`).join(',\n');
      return `data class ${node.name.value}(\n${fieldLines}\n)${superTypePart}`;
    },
  };

  UnionTypeDefinition = {
    leave: (node: UnionTypeDefinitionNode): string => {
      if (!node.types || node.types.length === 0) {
        return '';
      }

      const sealedClassName = node.name.value;
      const variants = node.types.map(t => ({
        gqlTypeName: t.name.value,
        // typesPrefix is already `${nodePrefix}_`, so this gives `${nodePrefix}_${typeName}`
        kotlinClassName: this.config.typesPrefix + t.name.value,
      }));

      const subTypeEntries = variants
        .map(
          v =>
            `    JsonSubTypes.Type(value = ${v.kotlinClassName}::class, name = "${v.gqlTypeName}")`,
        )
        .join(',\n');

      const unknownVariant = `    data class Unknown(val __typename: String = "") : ${sealedClassName}()`;
      return [
        `@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = ${sealedClassName}.Unknown::class)`,
        `@JsonSubTypes(\n${subTypeEntries}\n)`,
        `sealed class ${sealedClassName} {\n${unknownVariant}\n}`,
      ].join('\n');
    },
  };

  /**
   * After graphql-js visits child nodes (e.g. FieldDefinitionNode), it replaces the node
   * with the return value of the visitor function (a string). TypeScript still sees the original
   * type, so this helper asserts at runtime that the value is indeed a string.
   */
  private asString(node: ASTNode): string {
    if (typeof node === 'object') {
      throw new Error(`Expected a string, but got a node`);
    }
    return node as unknown as string;
  }
}
