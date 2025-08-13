import {
  type ParsedConfig,
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
  Kind,
  isScalarType,
  isObjectType,
  isInterfaceType,
} from 'graphql';

import { PythonDeclarationBlock } from './pythonDeclarationBlock.ts';

import { getCachedDocumentNodeFromSchema } from '@graphql-codegen/plugin-helpers';
import { inspect } from 'node:util';
import assert from 'node:assert';

const DEFAULT_SCALARS = {
  ID: { input: 'str', output: 'str' },
  String: { input: 'str', output: 'str' },
  Int: { input: 'int', output: 'int' },
  Float: { input: 'float', output: 'float' },
  Boolean: { input: 'bool', output: 'bool' },
} as const;

export interface PythonTypesRawConfig extends RawConfig {
  everythingIsOptional: boolean;
}
interface PythonTypesParsedConfig extends ParsedConfig {
  everythingIsOptional: boolean;
}

export class PythonTypesVisitor extends BaseVisitor<PythonTypesRawConfig, PythonTypesParsedConfig> {
  modelsToRebuild: string[] = [];
  schema: GraphQLSchema;

  constructor(config: PythonTypesRawConfig, schema: GraphQLSchema) {
    super(config, {
      everythingIsOptional: config.everythingIsOptional,
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

  getImports() {
    return [
      'from enum import StrEnum',
      'from typing import Optional',
      'from pydantic import BaseModel, Field',
    ];
  }

  getScalarsTypes() {
    return Object.entries(this.scalars)
      .map(([name, type]) => `type ${name}Scalar = ${type.input}`)
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
        .withContent(node.fields?.map(node => this.asString(node)) ?? 'pass')
        .toString();
    },
  };

  NamedType = {
    leave: (node: NamedTypeNode) => {
      let name = node.name.value;

      const schemaType = this.schema.getType(name);
      assert(schemaType != undefined);

      if (isScalarType(schemaType)) {
        name = `${name}Scalar`;
      } else if (isObjectType(schemaType) || isInterfaceType(schemaType)) {
        name = this.config.typesPrefix + name;
      }

      return `Optional[${name}]`;
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

  NonNullType = {
    leave: (
      node: NonNullTypeNode,
      _key: string | number | undefined,
      parent: ASTNode | ReadonlyArray<ASTNode> | undefined,
    ) => {
      const type = this.asString(node.type);

      const isInputField =
        parent != undefined && 'kind' in parent && parent.kind === Kind.INPUT_VALUE_DEFINITION;

      if (this.config.everythingIsOptional && !isInputField) {
        return type;
      }

      // We make types Optional by default in `ListType` and `NamedType`, and remove the Optional if we see them wrapped in a `NonNull`
      // Yes, this seems to be the only way to do it, see https://github.com/dotansimha/graphql-code-generator/blob/d2f8d9b7573d89a7ca4bee566d13e7424bc70bbb/packages/plugins/typescript/typescript/src/visitor.ts#L276
      return this.clearOptional(type);
    },
  };

  ListType = {
    leave: (node: ListTypeNode) => {
      return `Optional[list[${this.asString(node.type)}]]`;
    },
  };

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
        .withContent(
          node.types
            .map(node => this.asString(node))
            .map(node => this.clearOptional(node))
            .join(' | '),
        )
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
