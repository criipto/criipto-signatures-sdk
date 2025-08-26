import {
  type RawConfig,
  BaseVisitor,
  buildScalarsFromConfig,
} from '@graphql-codegen/visitor-plugin-common';

import {
  type FieldDefinitionNode,
  type InputObjectTypeDefinitionNode,
  type InputValueDefinitionNode,
  type InterfaceTypeDefinitionNode,
  type ObjectTypeDefinitionNode,
  type UnionTypeDefinitionNode,
  type GraphQLSchema,
  type EnumTypeDefinitionNode,
  type ASTNode,
  Kind,
  isScalarType,
  isObjectType,
  isInterfaceType,
} from 'graphql';

import { PythonDeclarationBlock } from './pythonDeclarationBlock.ts';

import { getCachedDocumentNodeFromSchema } from '@graphql-codegen/plugin-helpers';
import { inspect } from 'node:util';
import assert from 'node:assert';
import { assertIsNotUndefined, unwrapTypeNode } from 'graphql-codegen-shared';

const DEFAULT_SCALARS = {
  ID: { input: 'str', output: 'str' },
  String: { input: 'str', output: 'str' },
  Int: { input: 'int', output: 'int' },
  Float: { input: 'float', output: 'float' },
  Boolean: { input: 'bool', output: 'bool' },
  Blob: { input: 'CustomBlobInput', output: 'str' },
} as const;

export class PythonTypesVisitor extends BaseVisitor {
  modelsToRebuild: string[] = [];
  schema: GraphQLSchema;

  constructor(config: RawConfig, schema: GraphQLSchema) {
    super(config, {
      typesPrefix: config.typesPrefix ?? '',
      scalars: buildScalarsFromConfig(
        schema,
        config,
        DEFAULT_SCALARS,
        config.defaultScalarType ?? 'str',
      ),
    });

    this.schema = schema;
  }

  static getImports() {
    return [
      'from __future__ import annotations',
      'from .utils import CustomBlobInput',
      'from enum import StrEnum',
      'from typing import Optional, Literal',
      'from pydantic import BaseModel, Field',
    ];
  }

  getScalarsTypes() {
    return Object.entries(this.scalars)
      .flatMap(([name, type]) => [
        `type ${name}ScalarInput = ${type.input}`,
        `type ${name}ScalarOutput = ${type.output}`,
      ])
      .join('\n');
  }

  EnumTypeDefinition = {
    leave: (node: EnumTypeDefinitionNode): string => {
      if (!node.values) {
        return '';
      }

      return new PythonDeclarationBlock(node)
        .asKind('class')
        .withExtends('StrEnum')
        .withContent(
          node.values.map(enumOption => {
            const name = enumOption.name.value;
            return `${name} = '${name}'`;
          }),
        )
        .toString();
    },
  };

  InputObjectTypeDefinition = {
    leave: (node: InputObjectTypeDefinitionNode) => {
      this.modelsToRebuild.push(node.name.value);
      return new PythonDeclarationBlock(node)
        .asKind('class')
        .withExtends('BaseModel')
        .withContent(node.fields?.map(node => this.asString(node)))
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
    const isTypenameField = node.name.value === '__typename';
    let typeString = typeNode.name.value;
    let fieldName = node.name.value;

    const fieldModifiers = [];

    if (isTypenameField) {
      const types = isInterfaceType(schemaType)
        ? this.schema.getImplementations(schemaType).objects.map(type => type.name)
        : [typeNode.name.value];

      // Double underscores in python leads to name mangling, which we don't want
      // https://realpython.com/python-double-underscore/#double-leading-underscore-in-classes-pythons-name-mangling
      fieldName = 'typename';
      fieldModifiers.push(`alias="__typename"`);
      typeString = types.map(type => `Literal["${type}"]`).join(' | ');
    } else {
      assertIsNotUndefined(schemaType);

      if (isScalarType(schemaType)) {
        typeString = `${typeString}Scalar${node.kind === Kind.INPUT_VALUE_DEFINITION ? 'Input' : 'Output'}`;
      } else if (isObjectType(schemaType) || isInterfaceType(schemaType)) {
        typeString = this.config.typesPrefix + typeString;
      }

      if (nullable) {
        typeString = `Optional[${typeString}]`;
      }
      if (listType) {
        typeString = `list[${typeString}]`;
        if (nullableList) {
          typeString = `Optional[${typeString}]`;
        }
      }
    }

    let output = '';
    if (node.description?.value) {
      output += `# ${node.description.value}\n`;
    }

    output += `${fieldName}: ${typeString}`;

    if (!isTypenameField && (nullable || (listType && nullableList))) {
      fieldModifiers.push('default=None');
    }

    if (fieldModifiers.length) {
      output += ` = Field(${fieldModifiers.join(',')})`;
    }

    return output;
  }

  ObjectTypeDefinition = {
    leave: (node: ObjectTypeDefinitionNode) => {
      if (!node.fields) {
        return '';
      }

      this.modelsToRebuild.push(node.name.value);

      return new PythonDeclarationBlock(node)
        .asKind('class')
        .withExtends(['BaseModel'])
        .withContent(node.fields.map(node => this.asString(node)))
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

      return new PythonDeclarationBlock(node)
        .asKind('union')
        .withContent(implementingNodes.map(node => node.name.value).join(' | '))
        .toString();
    },
  };

  UnionTypeDefinition = {
    leave: (node: UnionTypeDefinitionNode) => {
      if (!node.types) {
        return '';
      }

      return new PythonDeclarationBlock(node)
        .asKind('union')
        .withContent(node.types.map(node => this.config.typesPrefix + node.name.value).join(' | '))
        .toString();
    },
  };

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

  getAdditionalContent() {
    return '';
  }

  getPrepend() {
    return [...PythonTypesVisitor.getImports(), this.getScalarsTypes()];
  }

  getAppend() {
    return this.modelsToRebuild.map(modelName => `${modelName}.model_rebuild()`);
  }
}
