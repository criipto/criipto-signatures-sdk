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
  type ListTypeNode,
  type NamedTypeNode,
  type NonNullTypeNode,
  type ObjectTypeDefinitionNode,
  type UnionTypeDefinitionNode,
  type GraphQLSchema,
  type EnumTypeDefinitionNode,
  type ASTNode,
  isScalarType,
  Kind,
} from 'graphql';

import { PythonDeclarationBlock } from './pythonDeclarationBlock.ts';

import { getCachedDocumentNodeFromSchema } from '@graphql-codegen/plugin-helpers';
import { inspect } from 'node:util';

const DEFAULT_SCALARS = {
  ID: { input: 'str', output: 'str' },
  String: { input: 'str', output: 'str' },
  Int: { input: 'int', output: 'int' },
  Float: { input: 'float', output: 'float' },
  Boolean: { input: 'bool', output: 'bool' },
} as const;

export interface PythonTypesRawConfig extends RawConfig {}

export class PythonTypesVisitor extends BaseVisitor<PythonTypesRawConfig> {
  scalarNames: string[];

  modelsToRebuild: string[] = [];
  schema: GraphQLSchema;

  constructor(config: PythonTypesRawConfig, schema: GraphQLSchema) {
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

  getImports() {
    return [
      'from enum import Enum',
      'from typing import Optional',
      'from pydantic import BaseModel, Field',
    ];
  }

  getScalarsTypes() {
    return Object.entries(this.scalars)
      .map(([name, type]) => `type ${name}Scalar = ${type.input}`)
      .join('\n');
  }

  EnumTypeDefinition(node: EnumTypeDefinitionNode): string {
    if (!node.values) {
      return '';
    }

    return new PythonDeclarationBlock(node)
      .asKind('class')
      .withExtends('Enum')
      .withContent(
        node.values.map(enumOption => {
          const name = enumOption.name.value;
          return `${name} = '${name}'`;
        }),
      )
      .toString();
  }

  InputObjectTypeDefinition(node: InputObjectTypeDefinitionNode) {
    this.modelsToRebuild.push(node.name.value);
    return new PythonDeclarationBlock(node)
      .asKind('class')
      .withExtends('BaseModel')
      .withContent(node.fields?.map(node => this.asString(node)) ?? 'pass')
      .toString();
  }

  NamedType(node: NamedTypeNode) {
    let name = node.name.value;

    if (this.scalarNames.includes(name)) {
      name = `${name}Scalar`;
    }

    return `Optional[${name}]`;
  }

  FieldDefinition(node: FieldDefinitionNode) {
    return this.FieldOrInputValueDefinition(node);
  }

  InputValueDefinition(node: InputValueDefinitionNode) {
    return this.FieldOrInputValueDefinition(node);
  }

  private FieldOrInputValueDefinition(node: FieldDefinitionNode | InputValueDefinitionNode) {
    const typeString = this.asString(node.type);
    let output = '';

    if (node.description?.value) {
      output += `# ${node.description.value}\n`;
    }

    output += `${node.name.value}: "${typeString}"`;

    if (typeString.startsWith('Optional')) {
      output += ` = Field(default=None)`;
    }

    return output;
  }

  NonNullType(node: NonNullTypeNode) {
    const type = this.asString(node.type);

    // We make types Optional by default in `ListType` and `NamedType`, and remove the Optional if we see them wrapped in a `NonNull`
    // Yes, this seems to be the only way to do it, see https://github.com/dotansimha/graphql-code-generator/blob/d2f8d9b7573d89a7ca4bee566d13e7424bc70bbb/packages/plugins/typescript/typescript/src/visitor.ts#L276
    return this.clearOptional(type);
  }

  ListType(node: ListTypeNode) {
    return `Optional[list[${this.asString(node.type)}]]`;
  }

  ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
    if (!node.fields) {
      return '';
    }

    this.modelsToRebuild.push(node.name.value);

    return new PythonDeclarationBlock(node)
      .asKind('class')
      .withExtends(['BaseModel'])
      .withContent(node.fields.map(node => this.asString(node)))
      .toString();
  }

  InterfaceTypeDefinition(node: InterfaceTypeDefinitionNode) {
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
  }

  UnionTypeDefinition(node: UnionTypeDefinitionNode) {
    if (!node.types) {
      return '';
    }

    return new PythonDeclarationBlock(node)
      .asKind('union')
      .withContent(
        node.types
          .map(node => this.asString(node))
          .map(node => this.clearOptional(node))
          .join(' | '),
      )
      .toString();
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

  private clearOptional(str: string) {
    return str.replace(/Optional\[(.*?)\]/, '$1');
  }

  getAdditionalContent() {
    return '';
  }

  getPrepend() {
    return [...this.getImports(), this.getScalarsTypes()];
  }

  getAppend() {
    return this.modelsToRebuild.map(modelName => `${modelName}.model_rebuild()`);
  }
}
