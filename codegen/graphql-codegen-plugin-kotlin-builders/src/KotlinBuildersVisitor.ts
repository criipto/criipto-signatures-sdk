import {
  type GraphQLInputObjectType,
  type GraphQLInputField,
  type GraphQLType,
  isNonNullType,
  isListType,
  isScalarType,
  isEnumType,
  isInputObjectType,
  getNamedType,
} from 'graphql';
import { pascalCase } from 'change-case-all';

// Mirror the scalar mapping used by @graphql-codegen/kotlin for input types.
const KOTLIN_SCALARS: Record<string, string> = {
  ID: 'String',
  String: 'String',
  Int: 'Int',
  Float: 'Float',
  Boolean: 'Boolean',
  Blob: 'ByteArray',
  Date: 'String',
  DateTime: 'String',
  URI: 'String',
};

/**
 * Convert a GraphQL enum constant to its Kotlin name.
 * e.g. EN_US → EnUs, READ_ONLY → ReadOnly
 */
function toKotlinEnumConstant(value: string): string {
  return value
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

/** Full Kotlin type string including nullability suffix. */
function kotlinType(gqlType: GraphQLType): string {
  if (isNonNullType(gqlType)) {
    return kotlinTypeCore(gqlType.ofType);
  }
  return kotlinTypeCore(gqlType) + '?';
}

/** Core Kotlin type without outer nullability suffix. */
function kotlinTypeCore(gqlType: GraphQLType): string {
  if (isListType(gqlType)) {
    return `List<${kotlinType(gqlType.ofType)}>`;
  }
  if (isScalarType(gqlType)) {
    return KOTLIN_SCALARS[gqlType.name] ?? 'String';
  }
  // Enum or InputObjectType — normalize to PascalCase to match @graphql-codegen/kotlin output.
  // The official plugin appends "Input" when the name doesn't already end with it (for input types).
  const named = getNamedType(gqlType);
  const name = pascalCase(named.name);
  if (isInputObjectType(gqlType) && !name.endsWith('Input')) {
    return `${name}Input`;
  }
  return name;
}

/**
 * The non-nullable version of a type — used for setter parameters so Java
 * callers never have to pass a nullable value.
 */
function kotlinTypeNonNull(gqlType: GraphQLType): string {
  if (isNonNullType(gqlType)) {
    return kotlinTypeCore(gqlType.ofType);
  }
  return kotlinTypeCore(gqlType);
}

/** True when the field MUST appear in the builder constructor (non-null, no schema default). */
function isRequiredField(field: GraphQLInputField): boolean {
  return isNonNullType(field.type) && field.defaultValue === undefined;
}

/**
 * Kotlin literal expression for the field's default value.
 * Returns null when the field has no schema default (it will be initialised to null in the backing field).
 */
function kotlinDefaultLiteral(field: GraphQLInputField): string {
  if (field.defaultValue === undefined || field.defaultValue === null) {
    return 'null';
  }
  const namedType = getNamedType(field.type);
  if (isEnumType(namedType)) {
    return `${namedType.name}.${toKotlinEnumConstant(String(field.defaultValue))}`;
  }
  if (typeof field.defaultValue === 'string') {
    return `"${field.defaultValue}"`;
  }
  // number, boolean
  return String(field.defaultValue);
}

export function generateBuilder(typeName: string, type: GraphQLInputObjectType): string {
  const fields = Object.values(type.getFields());
  const requiredFields = fields.filter(isRequiredField);
  const optionalFields = fields.filter(f => !isRequiredField(f));

  const baseName = pascalCase(typeName);
  // Mirror the official @graphql-codegen/kotlin rule: append "Input" when not already present
  const kotlinName = baseName.endsWith('Input') ? baseName : `${baseName}Input`;
  const builderName = `${kotlinName}Builder`;

  // Constructor — required fields only
  const ctorParams = requiredFields
    .map(f => `    private val ${f.name}: ${kotlinTypeNonNull(f.type)}`)
    .join(',\n');

  const ctorLine =
    requiredFields.length > 0 ? `class ${builderName}(\n${ctorParams}\n)` : `class ${builderName}`;

  // Backing fields for optional fields
  const backingFields = optionalFields
    .map(f => `    private var ${f.name}: ${kotlinType(f.type)} = ${kotlinDefaultLiteral(f)}`)
    .join('\n');

  // Fluent setters for optional fields.
  // Use this.fieldName to avoid shadowing when the field and parameter share the same name.
  const setters = optionalFields
    .map(
      f =>
        `    fun ${f.name}(value: ${kotlinTypeNonNull(f.type)}) = apply { this.${f.name} = value }`,
    )
    .join('\n');

  // build() — named arguments for all fields
  const buildArgs = fields.map(f => `        ${f.name} = ${f.name}`).join(',\n');

  const body = [backingFields, setters, `    fun build() = ${kotlinName}(\n${buildArgs}\n    )`]
    .filter(Boolean)
    .join('\n\n');

  return `${ctorLine} {\n${body}\n}`;
}
