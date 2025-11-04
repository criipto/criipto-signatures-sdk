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

  constructor(name: string, kind: string) {
    this._name = name;
    this._kind = kind;
    this._comment = '';
  }

  withDerives(derives: string[]) {
    this._derives = derives;
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
      return new RustTypeDefinition(node.name.value, 'enum')
        .withDerives(['Debug', 'Clone', 'PartialEq', 'Eq', 'Serialize', 'Deserialize'])
        .withContent(
          node.values?.map(enumOption => {
            const name = enumOption.name.value;
            return `${name}`;
          }) || [],
        )
        .toString();
    },
  };

  InputObjectTypeDefinition = {
    leave: (node: InputObjectTypeDefinitionNode): string => {
      return new RustTypeDefinition(node.name.value, 'struct')
        .withDerives(['Debug', 'Clone', 'Serialize', 'Deserialize'])
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
