import {
  ClientSideBaseVisitor,
  indentMultiline,
  type LoadedFragment,
  type RawConfig,
} from '@graphql-codegen/visitor-plugin-common';
import {
  Kind,
  print,
  getNullableType,
  isEnumType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isListType,
  buildSchema,
  printSchema,
  visit,
  OperationTypeNode,
  type FieldDefinitionNode,
  type OperationDefinitionNode,
  type FragmentDefinitionNode,
  type GraphQLSchema,
} from 'graphql';
import assert from 'node:assert';
import { upperCaseFirst } from 'change-case-all';
import {
  assertIsNotUndefined,
  operationSelectionsToAstTree,
  unwrapTypeNode,
  type AstTreeNode,
} from 'graphql-codegen-shared';
import { KotlinTypesVisitor, KOTLIN_SCALARS } from './KotlinTypesVisitor.ts';

interface StoredOperation {
  name: string;
  astTree: AstTreeNode;
}

interface SharedTypeRecord {
  parentUnionName: string | null;
  fieldSets: FieldDefinitionNode[][];
}

interface Param {
  name: string;
  kotlinType: string;
  nullable: boolean;
  isEnum: boolean;
  defaultValue: string;
}

interface MethodMetadata {
  operationName: string;
  params: Param[];
  kotlinReturnType: string;
  hasNullable: boolean;
  mapEntries: string;
  topFieldName: string;
  operationOutputName: string;
  returnTypeName: string;
  unwrapField: string | null;
}

export class KotlinOperationsVisitor extends ClientSideBaseVisitor {
  fragments: FragmentDefinitionNode[];
  private readonly storedOperations: StoredOperation[] = [];
  private readonly sharedTypeRegistry: Map<string, SharedTypeRecord> = new Map();

  constructor(config: RawConfig, schema: GraphQLSchema, fragments: LoadedFragment[]) {
    // Rebuild schema from string to populate AST nodes on types
    // https://github.com/graphql/graphql-js/issues/1575
    schema = buildSchema(printSchema(schema));
    super(schema, fragments, config, {});
    this.fragments = fragments.map(f => f.node);
  }

  /** Escape `$` so it is not treated as Kotlin string interpolation inside triple-quoted strings. */
  private static escapeKotlin(str: string): string {
    // Use a function replacement to avoid `$'` being treated as the "after-match" special pattern
    return str.replace(/\$/g, () => "${'$'}");
  }

  FragmentDefinition = {
    leave: (node: FragmentDefinitionNode): string => {
      // Emit each fragment as a Kotlin const val triple-quoted string
      return `const val ${node.name.value}Fragment = """\n${KotlinOperationsVisitor.escapeKotlin(print(node))}\n"""`;
    },
  };

  private getOperationName(node: OperationDefinitionNode): string {
    assertIsNotUndefined(node.name);
    return node.operation === OperationTypeNode.QUERY
      ? `query${upperCaseFirst(node.name.value)}`
      : node.name.value;
  }

  // @ts-expect-error We are intentionally changing the signature of `OperationDefinition` here.
  // ClientSideBaseVisitor expects the old `{ leave: visitor }` format that was removed in
  // https://github.com/graphql/graphql-js/pull/2957.
  override OperationDefinition = {
    leave: (node: OperationDefinitionNode): string => {
      this._collectedOperations.push(node);

      const name = this.getOperationName(node);

      const astTree = operationSelectionsToAstTree({
        node,
        schema: this._schema,
        fragments: this.fragments,
      });

      // Collect type info into the shared registry; data class generation is deferred to
      // getAdditionalContent() so the full registry is available before code is emitted.
      this.storedOperations.push({ name, astTree });
      this.collectSharedTypes(astTree);

      const fragmentNames = this._extractFragments(node, true).map(n => this.getFragmentName(n));
      // Fragment const vals include leading/trailing newlines, so simple concatenation works
      const fragmentConcat = fragmentNames.length > 0 ? ' + ' + fragmentNames.join(' + ') : '';
      return `const val ${name}Document = """\n${KotlinOperationsVisitor.escapeKotlin(print(node))}\n"""${fragmentConcat}`;
    },
  };

  /**
   * Walk an ast tree and register every concrete type (object node) into the shared-type registry.
   * Union members are tagged with their parent union name so they can later be assigned a parent
   * sealed interface.
   */
  private collectSharedTypes(astTree: AstTreeNode): void {
    const nodesToProcess: { treeNode: AstTreeNode; graphqlUnionName: string | null }[] = [
      { treeNode: astTree, graphqlUnionName: null },
    ];

    while (nodesToProcess.length > 0) {
      const { treeNode, graphqlUnionName } = nodesToProcess.shift()!;

      if (treeNode.astNode.kind === Kind.UNION_TYPE_DEFINITION) {
        const unionName = treeNode.astNode.name.value;
        for (const child of treeNode.children) {
          nodesToProcess.push({ treeNode: child, graphqlUnionName: unionName });
        }
      } else {
        const typeName = treeNode.astNode.name.value;
        const fields = (treeNode.astNode.fields ?? []) as FieldDefinitionNode[];
        const existing = this.sharedTypeRegistry.get(typeName);
        if (existing) {
          existing.fieldSets.push(fields);
        } else {
          this.sharedTypeRegistry.set(typeName, {
            parentUnionName: graphqlUnionName,
            fieldSets: [fields],
          });
        }
        for (const child of treeNode.children) {
          nodesToProcess.push({ treeNode: child, graphqlUnionName: null });
        }
      }
    }
  }

  /**
   * Returns the intersection of all field sets for a type — i.e. only fields that appear in every
   * operation that selects this type.
   */
  private intersectFields(fieldSets: FieldDefinitionNode[][]): FieldDefinitionNode[] {
    if (fieldSets.length === 0) return [];
    const first = fieldSets[0];
    if (!first) return [];
    return first.filter(field =>
      fieldSets.every(set => set.some(f => f.name.value === field.name.value)),
    );
  }

  /**
   * Returns the set of field names that will actually be declared in the shared interface for
   * `typeName` — i.e. only intersection fields whose Kotlin type can be resolved (scalar, enum, or
   * another shared-interface type). Union-typed fields are excluded because unions are represented
   * as sealed interfaces that aren't reachable via `isObjectType`.
   */
  private getInterfaceFieldNames(typeName: string, needsSharedInterface: Set<string>): Set<string> {
    const record = this.sharedTypeRegistry.get(typeName);
    if (!record) return new Set();

    const names = new Set<string>();
    for (const field of this.intersectFields(record.fieldSets)) {
      const { node: typeNode } = unwrapTypeNode(field.type);
      const fieldTypeName = typeNode.name.value;
      const schemaType = this._schema.getType(fieldTypeName);
      if (!schemaType) continue;

      if (
        isScalarType(schemaType) ||
        isEnumType(schemaType) ||
        ((isObjectType(schemaType) || isInterfaceType(schemaType)) &&
          needsSharedInterface.has(fieldTypeName))
      ) {
        names.add(field.name.value);
      }
    }
    return names;
  }

  /**
   * Fixpoint iteration: start from union members, expand to any object types they reference in
   * their intersection fields that also have registry entries.
   */
  private computeNeedsSharedInterface(): Set<string> {
    const needs = new Set<string>();

    for (const [typeName, record] of this.sharedTypeRegistry) {
      if (record.parentUnionName !== null) needs.add(typeName);
    }

    let changed = true;
    while (changed) {
      changed = false;
      for (const typeName of needs) {
        const record = this.sharedTypeRegistry.get(typeName);
        if (!record) continue;
        for (const field of this.intersectFields(record.fieldSets)) {
          const { node: typeNode } = unwrapTypeNode(field.type);
          const fieldTypeName = typeNode.name.value;
          const schemaType = this._schema.getType(fieldTypeName);
          if (
            schemaType &&
            (isObjectType(schemaType) || isInterfaceType(schemaType)) &&
            this.sharedTypeRegistry.has(fieldTypeName) &&
            !needs.has(fieldTypeName)
          ) {
            needs.add(fieldTypeName);
            changed = true;
          }
        }
      }
    }

    return needs;
  }

  /**
   * Generate the per-operation data classes for one stored operation, injecting
   * `sharedInterfaceName` and `overrideFields` for types that have shared interfaces.
   */
  private generateOperationTypes(
    name: string,
    astTree: AstTreeNode,
    needsSharedInterface: Set<string>,
  ): string[] {
    const result: string[] = [];

    const nodesToProcess: {
      treeNode: AstTreeNode;
      parentPrefix: string;
      superTypeName?: string;
    }[] = [{ treeNode: astTree, parentPrefix: upperCaseFirst(name) }];

    while (nodesToProcess.length > 0) {
      const { parentPrefix, treeNode, superTypeName } = nodesToProcess.shift()!;
      const nodePrefix = `${parentPrefix}_${treeNode.astNode.name.value}`;
      const graphqlTypeName = treeNode.astNode.name.value;

      let sharedInterfaceName: string | undefined;
      let overrideFields: ReadonlySet<string> | undefined;

      if (
        treeNode.astNode.kind !== Kind.UNION_TYPE_DEFINITION &&
        needsSharedInterface.has(graphqlTypeName)
      ) {
        sharedInterfaceName = graphqlTypeName;
        overrideFields = this.getInterfaceFieldNames(graphqlTypeName, needsSharedInterface);
      }

      const typesVisitor = new KotlinTypesVisitor(
        { typesPrefix: nodePrefix + '_', superTypeName, sharedInterfaceName, overrideFields },
        this._schema,
      );

      const visitorResult = visit(
        { ...treeNode.astNode, name: { ...treeNode.astNode.name, value: nodePrefix } },
        typesVisitor,
      );

      assert(typeof visitorResult === 'string');
      result.push(visitorResult);

      if (treeNode.astNode.kind === Kind.UNION_TYPE_DEFINITION) {
        nodesToProcess.push(
          ...treeNode.children.map(child => ({
            parentPrefix: nodePrefix,
            treeNode: child,
            superTypeName: nodePrefix,
          })),
        );
      } else {
        nodesToProcess.push(
          ...treeNode.children.map(child => ({
            parentPrefix: nodePrefix,
            treeNode: child,
          })),
        );
      }
    }

    return result;
  }

  /**
   * Emit `sealed interface Document`, `interface PdfDocument : Document { ... }`, etc.
   * for every type in `needsSharedInterface`.
   */
  private generateSharedInterfaces(
    needsSharedInterface: Set<string>,
    unionNames: Set<string>,
  ): string {
    const parts: string[] = [];

    for (const unionName of unionNames) {
      parts.push(`sealed interface ${unionName}`);
    }

    for (const typeName of needsSharedInterface) {
      const record = this.sharedTypeRegistry.get(typeName);
      if (!record) continue;

      const parentPart = record.parentUnionName ? ` : ${record.parentUnionName}` : '';
      const interfaceFieldNames = this.getInterfaceFieldNames(typeName, needsSharedInterface);

      const fieldLines = (record.fieldSets[0] ?? [])
        .filter(field => interfaceFieldNames.has(field.name.value))
        .map(field => {
          const { nullable, listType, nullableList, node: typeNode } = unwrapTypeNode(field.type);
          const fieldTypeName = typeNode.name.value;
          const schemaType = this._schema.getType(fieldTypeName);
          assertIsNotUndefined(schemaType);

          let kotlinType = isScalarType(schemaType)
            ? (KOTLIN_SCALARS[fieldTypeName] ?? 'String')
            : fieldTypeName;

          if (nullable) kotlinType = `${kotlinType}?`;
          if (listType) {
            kotlinType = `List<${kotlinType}>`;
            if (nullableList) kotlinType = `${kotlinType}?`;
          }

          return `    val ${field.name.value}: ${kotlinType}`;
        });

      if (fieldLines.length > 0) {
        parts.push(`interface ${typeName}${parentPart} {\n${fieldLines.join('\n')}\n}`);
      } else {
        parts.push(`interface ${typeName}${parentPart}`);
      }
    }

    return parts.join('\n\n');
  }

  getAdditionalContent(): string {
    const needsSharedInterface = this.computeNeedsSharedInterface();

    const unionNames = new Set<string>();
    for (const record of this.sharedTypeRegistry.values()) {
      if (record.parentUnionName) unionNames.add(record.parentUnionName);
    }

    const parts: string[] = [];

    for (const { name, astTree } of this.storedOperations) {
      parts.push(...this.generateOperationTypes(name, astTree, needsSharedInterface));
    }

    parts.push(this.generateSharedInterfaces(needsSharedInterface, unionNames));
    parts.push(this.generateInterface());
    parts.push(this.generateClient());

    return parts.join('\n\n');
  }

  private getMethodMetadata(node: OperationDefinitionNode): MethodMetadata {
    const operationName = this.getOperationName(node);

    assert(
      node.selectionSet.selections.length === 1,
      'Expected operation to have exactly one top-level selection',
    );
    assert(
      node.selectionSet.selections[0]?.kind === Kind.FIELD,
      'Top-level selection must be a field',
    );
    const topLevelSelection = node.selectionSet.selections[0];

    const operations =
      node.operation === OperationTypeNode.QUERY
        ? this._schema.getQueryType()
        : node.operation === OperationTypeNode.MUTATION
          ? this._schema.getMutationType()
          : this._schema.getSubscriptionType();

    const selectionField = operations?.getFields()[topLevelSelection.name.value];
    assertIsNotUndefined(selectionField, 'Top-level selection field not found in schema');

    const operationOutputNode = getNullableType(selectionField.type);
    assert(
      isInterfaceType(operationOutputNode) || isObjectType(operationOutputNode),
      'Expected operation output type to be interface or object',
    );

    const returnTypeNameParts = [upperCaseFirst(operationName), operationOutputNode.name];
    const operationOutputName = returnTypeNameParts.join('_');

    let unwrapField: string | null = null;
    let isList = false;
    if (
      node.operation === OperationTypeNode.MUTATION &&
      topLevelSelection.selectionSet?.selections.length === 1
    ) {
      assert(
        topLevelSelection.selectionSet.selections[0]?.kind === Kind.FIELD,
        'Mutation sub-selection must be a field',
      );
      const subFieldName = topLevelSelection.selectionSet.selections[0].name.value;
      let subFieldType = getNullableType(operationOutputNode.getFields()[subFieldName]?.type);

      if (isListType(subFieldType)) {
        subFieldType = getNullableType(subFieldType.ofType);
        isList = true;
      }

      assert(
        isInterfaceType(subFieldType) || isObjectType(subFieldType),
        'Expected mutation sub-field type to be interface or object',
      );

      returnTypeNameParts.push(subFieldType.name);
      unwrapField = subFieldName;
    }

    const returnTypeName = returnTypeNameParts.join('_');
    const kotlinReturnType = isList ? `List<${returnTypeName}>` : returnTypeName;

    const params = (node.variableDefinitions ?? [])
      .map(varDef => {
        const { nullable, node: typeNode } = unwrapTypeNode(varDef.type);
        const schemaType = this._schema.getType(typeNode.name.value);
        assertIsNotUndefined(schemaType);

        let kotlinType: string;
        if (isScalarType(schemaType)) {
          kotlinType = KOTLIN_SCALARS[typeNode.name.value] ?? 'String';
        } else {
          kotlinType = typeNode.name.value;
        }

        if (nullable) {
          kotlinType = `${kotlinType}?`;
        }

        return {
          name: varDef.variable.name.value,
          kotlinType,
          nullable,
          isEnum: isEnumType(schemaType),
          defaultValue: nullable ? ' = null' : '',
        };
      })
      .sort((a, b) => (a.nullable === b.nullable ? 0 : a.nullable ? 1 : -1));

    const hasNullable = params.some(p => p.nullable);
    // Enum params use .label to get the GraphQL string value (e.g. "OPEN" not "Open")
    const mapEntries = params
      .map(p => {
        const value = p.isEnum ? `${p.name}${p.nullable ? '?' : ''}.label` : p.name;
        return `"${p.name}" to ${value}`;
      })
      .join(', ');
    const topFieldName = topLevelSelection.name.value;

    return {
      operationName,
      params,
      kotlinReturnType,
      hasNullable,
      mapEntries,
      topFieldName,
      operationOutputName,
      returnTypeName,
      unwrapField,
    };
  }

  private generateInterface(): string {
    const methods = indentMultiline(
      this._collectedOperations.map(node => this.generateMethodSignature(node)).join('\n'),
      1,
    );
    return `internal interface IduraSignaturesOperations {\n${methods}\n}`;
  }

  private generateMethodSignature(node: OperationDefinitionNode): string {
    const { operationName, params, kotlinReturnType } = this.getMethodMetadata(node);
    // Interface methods carry default values so callers can omit nullable params
    const paramList = params.map(p => `${p.name}: ${p.kotlinType}${p.defaultValue}`).join(', ');
    return `suspend fun ${operationName}(${paramList}): ${kotlinReturnType}`;
  }

  private generateClient(): string {
    const methods = indentMultiline(
      this._collectedOperations.map(node => this.generateMethod(node)).join('\n\n'),
      1,
    );

    return `internal open class IduraSignaturesClient(private val clientId: String, private val clientSecret: String) : IduraSignaturesOperations {
    private val mapper: ObjectMapper = ObjectMapper()
        .registerKotlinModule()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        .enable(com.fasterxml.jackson.databind.MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS)
    private val httpClient: java.net.http.HttpClient = java.net.http.HttpClient.newHttpClient()
    private val endpoint = "https://signatures-api.criipto.com/v1/graphql"
    private val authHeader = "Basic " + java.util.Base64.getEncoder().encodeToString("\$clientId:\$clientSecret".toByteArray())

    private suspend fun executeRaw(document: String, variables: Map<String, Any?>): JsonNode {
        val body = mapper.writeValueAsString(mapOf("query" to document, "variables" to variables))
        val request = java.net.http.HttpRequest.newBuilder()
            .uri(java.net.URI.create(endpoint))
            .header("Content-Type", "application/json")
            .header("Authorization", authHeader)
            .header("Criipto-Sdk", "idura-signatures-kotlin")
            .POST(java.net.http.HttpRequest.BodyPublishers.ofString(body))
            .build()
        val response = httpClient.sendAsync(request, java.net.http.HttpResponse.BodyHandlers.ofString()).await()
        val json = mapper.readTree(response.body())
        val errors = json.get("errors")
        if (errors != null && errors.isArray && errors.size() > 0) {
            throw IOException("GraphQL errors: \$errors")
        }
        return json.get("data")
            ?: throw IOException("No data field in GraphQL response")
    }

${methods}
}`;
  }

  private generateMethod(node: OperationDefinitionNode): string {
    const {
      operationName,
      params,
      kotlinReturnType,
      hasNullable,
      mapEntries,
      topFieldName,
      operationOutputName,
      returnTypeName,
      unwrapField,
    } = this.getMethodMetadata(node);
    // Override methods must not repeat default values (Kotlin restriction)
    const paramList = params.map(p => `${p.name}: ${p.kotlinType}`).join(', ');

    // Filter nulls: the API rejects null enum values, and nullable scalars simply omit the field
    const variablesExpr = hasNullable
      ? `mapOf<String, Any?>(${mapEntries}).filterValues { it != null }`
      : `mapOf<String, Any?>(${mapEntries})`;

    let bodyLines: string;
    if (unwrapField !== null) {
      bodyLines = `val variables = ${variablesExpr}
val data = executeRaw(${operationName}Document, variables)
val element = data.get("${topFieldName}") ?: throw IOException("Field '${topFieldName}' missing in response")
val output = mapper.treeToValue(element, ${operationOutputName}::class.java)
return output.${unwrapField}`;
    } else {
      bodyLines = `val variables = ${variablesExpr}
val data = executeRaw(${operationName}Document, variables)
val element = data.get("${topFieldName}") ?: throw IOException("Field '${topFieldName}' missing in response")
return mapper.treeToValue(element, ${returnTypeName}::class.java)`;
    }

    return `override suspend fun ${operationName}(${paramList}): ${kotlinReturnType} {
${indentMultiline(bodyLines, 1)}
}`;
  }

  getPrepend(): string[] {
    const packageName = (this.config as { package?: string }).package ?? 'eu.idura.signatures';
    return [
      `package ${packageName}`,
      '',
      'import com.fasterxml.jackson.annotation.JsonSubTypes',
      'import com.fasterxml.jackson.annotation.JsonTypeInfo',
      'import com.fasterxml.jackson.databind.DeserializationFeature',
      'import com.fasterxml.jackson.databind.JsonNode',
      'import com.fasterxml.jackson.databind.ObjectMapper',
      'import com.fasterxml.jackson.module.kotlin.registerKotlinModule',
      'import kotlinx.coroutines.future.await',
      'import java.io.IOException',
    ];
  }

  getAppend(): string[] {
    return [];
  }
}
