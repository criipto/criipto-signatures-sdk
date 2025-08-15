import { indentMultiline, indent } from '@graphql-codegen/visitor-plugin-common';
import { type ASTNode } from 'graphql';

function ensureArray<T>(item: undefined | T | T[]): T[] {
  if (item === undefined) {
    return [];
  }
  if (Array.isArray(item)) {
    return item;
  } else {
    return [item];
  }
}

export class PythonDeclarationBlock {
  _kind: string | undefined = undefined;
  _name: string | undefined = undefined;
  _extends: string[] | undefined = undefined;
  _comment: string | undefined = undefined;
  _content: string[] | undefined = undefined;

  constructor(node: ASTNode) {
    if ('description' in node && node.description != undefined) {
      this._comment = node.description.value;
    }
    if ('name' in node && node.name != undefined) {
      this._name = node.name.value;
    }
  }

  asKind(kind: string) {
    this._kind = kind;
    return this;
  }

  withExtends(_extends: string | string[] | undefined) {
    this._extends = ensureArray(_extends);

    return this;
  }

  withContent(content: string | string[] | undefined) {
    this._content = ensureArray(content);
    return this;
  }

  toString() {
    let result = '';

    if (this._comment) {
      result += `# ${this._comment}\n`;
    }

    let indentation = 0;
    switch (this._kind) {
      case 'class':
        indentation = 1;
        if (!this._name) {
          throw new Error('Naming is missing for class definition');
        }
        result += `class ${this._name}`;

        if (this._extends) {
          result += `(${this._extends.join(', ')})`;
        }
        result += ':';
        result += '\n';
        break;
      case 'union':
        if (!this._name) {
          throw new Error('Naming is missing for i definition');
        }
        result += `type ${this._name} = `;
        break;
    }

    if (this._content) {
      if (this._kind === 'class' && this._content.length === 0) {
        result += indent('pass');
      }
      for (const item of this._content) {
        result += indentMultiline(item, indentation) + '\n';
      }
    }

    return result;
  }
}
