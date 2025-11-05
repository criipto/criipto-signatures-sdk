import { getCachedDocumentNodeFromSchema } from '@graphql-codegen/plugin-helpers';
import { BaseVisitor, type RawConfig } from '@graphql-codegen/visitor-plugin-common';
import assert from 'assert';
import {
  isInterfaceType,
  isObjectType,
  isScalarType,
  Kind,
  type ASTNode,
  type EnumTypeDefinitionNode,
  type FieldDefinitionNode,
  type GraphQLSchema,
  type InputObjectTypeDefinitionNode,
  type InputValueDefinitionNode,
  type InterfaceTypeDefinitionNode,
  type UnionTypeDefinitionNode,
} from 'graphql';
import { unwrapTypeNode } from 'graphql-codegen-shared';
import { inspect } from 'util';

export class RustTypeDefinition {
  _name: string;
  _kind: string;
  _derives: string[] = [];
  _comment: string;
  _content: string[] = [];
  _attributes: string[] = [];

  constructor(name: string, kind: string) {
    this._name = name;
    this._kind = kind;
    this._comment = '';
  }

  withDerives(derives: string[]) {
    this._derives = derives;
    return this;
  }

  withAttributes(attributes: string[]) {
    this._attributes = attributes;
    return this;
  }

  withContent(content: string[]) {
    this._content = content;
    return this;
  }

  withComment(comment: string) {
    this._comment = comment;
    return this;
  }

  toString(): string {
    let result = '';
    result += `/// ${this._comment}\n`;
    if (this._derives.length > 0) {
      result += `#[derive(${this._derives.join(', ')})]\n`;
    }
    this._attributes.forEach(attr => {
      result += `${attr}\n`;
    });
    result += `pub ${this._kind} ${this._name} {\n`;
    this._content.forEach(line => {
      result += `    ${line},\n`;
    });
    result += `}\n`;
    return result;
  }
}

export class RustTypesVisitor extends BaseVisitor {
  schema: GraphQLSchema;

  constructor(config: RawConfig, schema: GraphQLSchema) {
    super(config, {});

    this.schema = schema;
  }

  EnumTypeDefinition = {
    leave: (node: EnumTypeDefinitionNode): string => {
      const typeDef = new RustTypeDefinition(node.name.value, 'enum')
        .withDerives(['Debug', 'Clone', 'PartialEq', 'Eq'])
        .withContent(
          node.values?.map(enumOption => {
            const name = enumOption.name.value;
            return `${name}`;
          }) || [],
        )
        .toString();

      const serialiseImpls = `
            impl ::serde::Serialize for ${node.name.value} {
                fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
                where
                    S: ::serde::Serializer,
                {
                    match *self {
                        ${node.values
                          ?.map(enumOption => {
                            const name = enumOption.name.value;
                            return `${node.name.value}::${name} => serializer.serialize_str("${name}"),`;
                          })
                          .join('\n')}
                    }
                }
            }
            
            impl<'de> ::serde::Deserialize<'de> for ${node.name.value} {
                fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
                where
                    D: ::serde::Deserializer<'de>,
                {
                        let s:String = ::serde::Deserialize::deserialize(deserializer)?;
                        match s.as_ref() {
                            ${node.values
                              ?.map(enumOption => {
                                const name = enumOption.name.value;
                                return `"${name}" => Ok(${node.name.value}::${name}),`;
                              })
                              .join('\n')}
                            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
                        }
                }
            }
            `;

      return typeDef + '\n' + serialiseImpls;
    },
  };

  InputObjectTypeDefinition = {
    enter: (node: InputObjectTypeDefinitionNode) => {
      const isDefaultable =
        node.fields?.every(field => {
          const { nullable, listType } = unwrapTypeNode(field.type);
          return nullable || listType;
        }) ?? false;

      (node as any).__isDefaultable = isDefaultable;
    },
    leave: (node: InputObjectTypeDefinitionNode): string => {
      return new RustTypeDefinition(node.name.value, 'struct')
        .withDerives([
          'Debug',
          'Clone',
          'Serialize',
          'Deserialize',
          ...((node as any).__isDefaultable ? ['Default'] : []),
        ])
        .withContent(node.fields?.map(node => this.asString(node)) || [])
        .toString();
    },
  };

  ObjectTypeDefinition = {
    leave: (node: InputObjectTypeDefinitionNode): string => {
      if (!node.fields) {
        return '';
      }

      return new RustTypeDefinition(node.name.value, 'struct')
        .withDerives(['Debug', 'Clone', 'Serialize', 'Deserialize'])
        .withContent(node.fields?.map(node => this.asString(node)))
        .toString();
    },
  };

  InterfaceTypeDefinition = {
    leave: (node: InterfaceTypeDefinitionNode) => {
      const astNode = getCachedDocumentNodeFromSchema(this.schema);

      const implementingNodes = astNode.definitions
        .filter(otherNode => otherNode.kind === Kind.OBJECT_TYPE_DEFINITION)
        .filter(otherNode =>
          otherNode.interfaces?.find(interfaceNode => interfaceNode.name.value === node.name.value),
        );

      if (implementingNodes.length === 0) {
        return '';
      }

      return new RustTypeDefinition(node.name.value, 'enum')
        .withDerives(['Debug', 'Clone', 'Serialize', 'Deserialize'])
        .withContent(
          implementingNodes.map(
            node => `${node.name.value}(${this.config.typesPrefix}${node.name.value})`,
          ),
        )
        .withComment('interface')
        .toString();
    },
  };
  UnionTypeDefinition = {
    leave: (node: UnionTypeDefinitionNode) => {
      if (!node.types) {
        return '';
      }

      return new RustTypeDefinition(node.name.value, 'enum')
        .withDerives(['Debug', 'Clone', 'Serialize', 'Deserialize'])
        .withAttributes(['#[serde(tag = "__typename")]'])
        .withContent(
          node.types.map(
            node => `${node.name.value}(${this.config.typesPrefix}${node.name.value})`,
          ),
        )
        .withComment('union')
        .toString();
    },
  };

  FieldDefinition = {
    leave: (node: FieldDefinitionNode) => {
      return this.FieldOrInputValueDefinition(node);
    },
  };

  InputValueDefinition = {
    leave: (node: InputValueDefinitionNode) => {
      return this.FieldOrInputValueDefinition(node);
    },
  };

  private FieldOrInputValueDefinition(node: FieldDefinitionNode | InputValueDefinitionNode) {
    const { nullable, listType, nullableList, node: typeNode } = unwrapTypeNode(node.type);

    const schemaType = this.schema.getType(typeNode.name.value);
    assert(schemaType != undefined);

    let typeString = typeNode.name.value;

    if (isScalarType(schemaType)) {
      typeString = `crate::scalars::${typeString}`;
    } else if (isObjectType(schemaType) || isInterfaceType(schemaType)) {
      typeString = this.config.typesPrefix + typeString;
    } else {
      typeString = `crate::criipto_signatures::types::${typeString}`;
    }

    if (nullable) {
      typeString = `Option<${typeString}>`;
    }

    if (listType) {
      typeString = `Vec<${typeString}>`;
      if (nullableList) {
        typeString = `Option<${typeString}>`;
      }
    }

    return `pub ${node.name.value}: ${typeString}`;
  }

  getAdditionalContent(): string {
    return '';
  }

  getPrepend(): string[] {
    return ['use serde_derive::{Deserialize, Serialize};'];
  }

  getAppend(): string[] {
    return [];
  }

  /**
   * Helper method to convert node objects to strings in the eyes of typescript.
   * When we start out walking the AST, everything is an object. Our visitor then
   * starts from the bottom of the tree, converting objects to strings as it goes.
   *
   * However, from the perspective of typescript, everything remains an object,
   * it cannot know which transformations have already been done.
   *
   * Instead of relying on `as unknown as string` everywhere, use this
   * helper method to assert that what typescript thinks is a node is actually a string.
   *
   * If the node has not already been converted to a string as we expect, this throws
   * an error instead of silently stringifying the node.
   */
  private asString(node: ASTNode): string {
    if (typeof node === 'object') {
      throw new Error(`Expected a string, but got a node ${inspect(node)}`);
    }

    return node;
  }
}
