import test from 'ava';
import { buildSchema, Kind, parse, validate } from 'graphql';
import { assertIsNotUndefined } from './assertIsNotUndefined.ts';
import { collectSelectedFieldsFromOperation } from './collect-selected-fields-from-operation.ts';

const schema = buildSchema(/* GraphQL */ `
  type NestedType {
    fieldA: String
    fieldB: String
    fieldC: String
    deeplyNested: DeeplyNestedType
  }

  type DeeplyNestedType {
    fieldD: String
    fieldE: String
    recursive: DeeplyNestedType
  }

  type MutationOutput {
    nested: NestedType
  }
  type Mutation {
    mutate: MutationOutput
  }
  type Query {
    void: String
  }
`);

test('Multiple selections on the same field', t => {
  // Arrange
  const documents = parse(/* GraphQL */ `
    mutation mutate {
      mutate {
        nested {
          fieldA
        }
        nested {
          fieldB
        }
      }
    }
  `);

  const validationErrors = validate(schema, documents);
  if (validationErrors.length !== 0) {
    throw new AggregateError(validationErrors, 'GraphQL Schema validation errors');
  }

  const operation = documents.definitions.find(
    definition => definition.kind === Kind.OPERATION_DEFINITION,
  );
  assertIsNotUndefined(operation);

  // Act
  const res = collectSelectedFieldsFromOperation(operation, []);

  // Assert
  t.deepEqual(res, {
    type: 'object',
    name: 'mutate',
    fields: [
      {
        type: 'object',
        name: 'nested',
        fields: [
          { type: 'scalar', name: 'fieldA' },
          { type: 'scalar', name: 'fieldB' },
        ],
      },
    ],
  });
});

test('Deeply nested selection', t => {
  // Arrange
  const documents = parse(/* GraphQL */ `
    mutation mutate {
      mutate {
        nested {
          fieldA
          deeplyNested {
            fieldD
            recursive {
              fieldE
            }
          }
        }
      }
    }
  `);

  const validationErrors = validate(schema, documents);
  if (validationErrors.length !== 0) {
    throw new AggregateError(
      validationErrors,
      `GraphQL Schema validation errors ${validationErrors.map(e => e.message).join('\n')}`,
    );
  }

  const operation = documents.definitions.find(
    definition => definition.kind === Kind.OPERATION_DEFINITION,
  );
  assertIsNotUndefined(operation);
  const fragments = documents.definitions.filter(
    definition => definition.kind === Kind.FRAGMENT_DEFINITION,
  );

  // Act
  const res = collectSelectedFieldsFromOperation(operation, fragments);

  // Assert
  t.deepEqual(res, {
    type: 'object',
    name: 'mutate',
    fields: [
      {
        type: 'object',
        name: 'nested',
        fields: [
          { type: 'scalar', name: 'fieldA' },
          {
            type: 'object',
            name: 'deeplyNested',
            fields: [
              {
                type: 'scalar',
                name: 'fieldD',
              },
              {
                type: 'object',
                name: 'recursive',
                fields: [
                  {
                    type: 'scalar',
                    name: 'fieldE',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
});

test('Multiple selections on the same field, with fragments', t => {
  // Arrange
  const documents = parse(/* GraphQL */ `
    fragment Foo on NestedType {
      fieldB
    }
    mutation mutate {
      mutate {
        nested {
          fieldA
          ...Foo
        }
      }
    }
  `);

  const validationErrors = validate(schema, documents);
  if (validationErrors.length !== 0) {
    throw new AggregateError(
      validationErrors,
      `GraphQL Schema validation errors ${validationErrors.map(e => e.message).join('\n')}`,
    );
  }

  const operation = documents.definitions.find(
    definition => definition.kind === Kind.OPERATION_DEFINITION,
  );
  assertIsNotUndefined(operation);
  const fragments = documents.definitions.filter(
    definition => definition.kind === Kind.FRAGMENT_DEFINITION,
  );

  // Act
  const res = collectSelectedFieldsFromOperation(operation, fragments);

  // Assert
  t.deepEqual(res, {
    type: 'object',
    name: 'mutate',
    fields: [
      {
        type: 'object',
        name: 'nested',
        fields: [
          { type: 'scalar', name: 'fieldA' },
          { type: 'scalar', name: 'fieldB' },
        ],
      },
    ],
  });
});

test('Multiple fragments', t => {
  // Arrange
  const documents = parse(/* GraphQL */ `
    fragment Foo on NestedType {
      fieldB
    }
    fragment Bar on NestedType {
      fieldA
      fieldB
    }
    mutation mutate {
      mutate {
        nested {
          ...Bar
          ...Foo
        }
      }
    }
  `);

  const validationErrors = validate(schema, documents);
  if (validationErrors.length !== 0) {
    throw new AggregateError(
      validationErrors,
      `GraphQL Schema validation errors ${validationErrors.map(e => e.message).join('.\n')}`,
    );
  }

  const operation = documents.definitions.find(
    definition => definition.kind === Kind.OPERATION_DEFINITION,
  );
  assertIsNotUndefined(operation);
  const fragments = documents.definitions.filter(
    definition => definition.kind === Kind.FRAGMENT_DEFINITION,
  );

  // Act
  const res = collectSelectedFieldsFromOperation(operation, fragments);

  // Assert
  t.deepEqual(res, {
    type: 'object',
    name: 'mutate',
    fields: [
      {
        type: 'object',
        name: 'nested',
        fields: [
          { type: 'scalar', name: 'fieldA' },
          { type: 'scalar', name: 'fieldB' },
        ],
      },
    ],
  });
});
