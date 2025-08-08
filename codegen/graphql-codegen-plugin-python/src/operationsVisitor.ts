import { indent } from '@graphql-codegen/visitor-plugin-common';
import {
  type OperationDefinitionNode,
  Kind,
  type NonNullTypeNode,
  print,
  type SelectionSetNode,
  type FragmentDefinitionNode,
  type ASTNode,
  OperationTypeNode,
} from 'graphql';
import assert from 'node:assert';
import { upperCaseFirst } from 'change-case-all';
import { PythonVisitor } from './pythonVisitor.ts';

function isNotNull<T>(arg: T): arg is Exclude<T, null | undefined> {
  return arg !== null;
}

export class PythonOperationsVisitor extends PythonVisitor {
  modelImports: Set<string> = new Set();

  static findFragments(node: SelectionSetNode) {
    return node.selections
      .flatMap((selection): string | string[] | null => {
        const kind = selection.kind;
        switch (kind) {
          case Kind.FRAGMENT_SPREAD:
            return selection.name.value;
          case Kind.FIELD:
            return selection.selectionSet
              ? this.findFragments(selection.selectionSet).filter(isNotNull)
              : [];
          case Kind.INLINE_FRAGMENT:
            // TODO: Do we need to handle this?
            return null;
          default:
            kind satisfies never;
        }
        return null;
      })
      .filter(isNotNull);
  }

  static stringVariable(variableName: string, body: string, templateStrings: string[]) {
    if (templateStrings.length > 0) {
      // When printed as f-strings, curly-brackets are a control character. So we need to escape them
      body = `f"""${body.replaceAll(/({|})/g, '$1$1')}
${templateStrings.map(templateString => `{${templateString}Fragment}`).join('\n')}"""`;
    } else {
      body = `"""${body}"""`;
    }

    return `${variableName} = ${body}`;
  }

  FragmentDefinition(node: FragmentDefinitionNode) {
    // TODO: generate class def based on fragment

    const fragmentsInUse = PythonOperationsVisitor.findFragments(node.selectionSet);
    const fragmentString = PythonOperationsVisitor.stringVariable(
      `${node.name.value}Fragment`,
      print(node),
      fragmentsInUse,
    );

    return fragmentString;
  }

  OperationDefinition(node: OperationDefinitionNode) {
    const name =
      node.operation === 'query'
        ? `query${upperCaseFirst(node.name?.value ?? '')}`
        : node.name?.value;

    const functionArguments: Record<string, string> = {};

    const fragmentsInUse = PythonOperationsVisitor.findFragments(node.selectionSet);
    const documentString = PythonOperationsVisitor.stringVariable(
      `${name}Document`,
      print(node),
      fragmentsInUse,
    );

    if (node.operation === OperationTypeNode.MUTATION) {
      assert(
        node.variableDefinitions?.length === 1,
        `Expected mutation ${name} to have exactly one argument`,
      );
      assert(
        node.variableDefinitions[0]?.type.kind === Kind.NON_NULL_TYPE,
        `Expected input to ${name} to be non-null`,
      );
      assert(
        node.variableDefinitions[0].type.type.kind === Kind.NAMED_TYPE,
        `Expected input to ${name} to be named type`,
      );

      const inputTypeName = node.variableDefinitions[0].type.type.name.value;
      this.modelImports.add(inputTypeName);
      functionArguments['input'] = inputTypeName;
    } else if (node.operation == OperationTypeNode.QUERY) {
      node.variableDefinitions?.forEach(variableDefinitionNode => {
        const variableName = variableDefinitionNode.variable.name.value;

        const nullable = variableDefinitionNode.type.kind !== Kind.NON_NULL_TYPE;
        const variableTypeNode = nullable
          ? variableDefinitionNode.type
          : (variableDefinitionNode.type as NonNullTypeNode).type;

        assert(
          variableTypeNode.kind === Kind.NAMED_TYPE,
          'Only named types are supported in query arguments',
        );

        let variableType = variableTypeNode.name.value;
        if (this.isScalar(variableTypeNode)) {
          variableType = `${variableType}Scalar`;
        }
        this.modelImports.add(variableType);

        functionArguments[variableName] = variableType;
      });
    }
    const functionDefinition = `def ${name}(${Object.entries(functionArguments)
      .map(([argumentName, argumentType]) => `${argumentName}: ${argumentType}`)
      .join(', ')}):`;

    const functionBody = indent('pass', 1);

    return [documentString, functionDefinition, functionBody].join('\n');
  }

  getPrepend(): string[] {
    return [`from .models import ${Array.from(this.modelImports).join(',')}`];
  }
  getAppend(): string[] {
    return [];
  }
}
