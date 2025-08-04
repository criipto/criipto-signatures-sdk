import {
  type DefinitionNode,
  Kind,
  type GraphQLSchema,
  type DocumentNode,
} from "graphql";
import {
  getCachedDocumentNodeFromSchema,
  oldVisit,
  type PluginFunction,
  type Types,
} from "@graphql-codegen/plugin-helpers";
import { PythonVisitor } from "./visitor.ts";
import type { RawConfig } from "@graphql-codegen/visitor-plugin-common";

export const plugin: PluginFunction<RawConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: RawConfig
) => {
  const visitor = new PythonVisitor(config, schema);

  const astNode = getCachedDocumentNodeFromSchema(schema);

  // Process interfaces last. Python requires base classes to be declared
  // before any classes that depend on them.
  const { interfaces, everyThingElse } = astNode.definitions.reduce(
    (carry, node) => {
      if (node.kind === Kind.INTERFACE_TYPE_DEFINITION) {
        carry.interfaces.push(node);
      } else {
        carry.everyThingElse.push(node);
      }
      return carry;
    },
    {
      interfaces: [] as DefinitionNode[],
      everyThingElse: [] as DefinitionNode[],
    }
  );

  const visitorResult = oldVisit(
    { ...astNode, definitions: [...everyThingElse, ...interfaces] },
    // @ts-expect-error TODO: Something broken in the types for visit? Switch to using visit directly from graphql-js when their types are fixed.
    { leave: visitor }
  ) as DocumentNode;

  const blockContent = visitorResult.definitions
    .filter((d) => typeof d === "string")
    .join("\n");

  return {
    prepend: [...visitor.getImports(), visitor.getScalarsTypes()],
    append: [visitor.getModelRebuild()],
    content: blockContent,
  };
};
