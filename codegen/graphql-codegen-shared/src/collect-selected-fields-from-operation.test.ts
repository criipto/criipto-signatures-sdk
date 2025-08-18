import test from 'ava';
import { buildSchema, Kind, parse, validate } from 'graphql';
import { assertIsNotUndefined } from './assertIsNotUndefined.ts';
import { collectSelectedFieldsFromOperation } from './collect-selected-fields-from-operation.ts';

const nestedSchema = buildSchema(/* GraphQL */ `
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

  const validationErrors = validate(nestedSchema, documents);
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

  const validationErrors = validate(nestedSchema, documents);
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
          fieldB
          ...Foo
        }
      }
    }
  `);

  const validationErrors = validate(nestedSchema, documents);
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
          { type: 'fragment', onType: 'NestedType', fields: [{ type: 'scalar', name: 'fieldB' }] },
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

  const validationErrors = validate(nestedSchema, documents);
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
          {
            type: 'fragment',
            onType: 'NestedType',
            fields: [
              { type: 'scalar', name: 'fieldA' },
              { type: 'scalar', name: 'fieldB' },
            ],
          },
        ],
      },
    ],
  });
});

const viewerSchema = buildSchema(/* GraphQL */ `
  interface Viewer {
    id: ID!
  }

  type UserViewerDetails {
    name: String!
  }

  type UserViewer implements Viewer {
    id: ID!
    isAuthenticated: Boolean!
    name: String!
    email: String!
    details: UserViewerDetails!
  }

  type ApplicationViewer implements Viewer {
    id: ID!
    applicationName: String!
  }

  type Mutation {
    void: String
  }
  type Query {
    viewer: Viewer
  }
`);
test('Handles both inline fragments and fragment spreads on interface', t => {
  const documents = parse(/* GraphQL */ `
    fragment UserViewerFragment on UserViewer {
      email
    }

    query viewerQuery {
      viewer {
        id

        ... on UserViewer {
          name
        }
        ...UserViewerFragment

        ... on ApplicationViewer {
          applicationName
        }
      }
    }
  `);

  const validationErrors = validate(viewerSchema, documents);
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
    name: 'viewer',
    fields: [
      { type: 'scalar', name: 'id' },
      {
        type: 'fragment',
        onType: 'UserViewer',
        fields: [
          { type: 'scalar', name: 'name' },
          { type: 'scalar', name: 'email' },
        ],
      },
      {
        type: 'fragment',
        onType: 'ApplicationViewer',
        fields: [{ type: 'scalar', name: 'applicationName' }],
      },
    ],
  });
});

test('nested fragments', t => {
  const documents = parse(/* GraphQL */ `
    fragment UserViewerDetailsFragment on UserViewerDetails {
      name
    }

    fragment DeeplyNestedFragment on UserViewer {
      isAuthenticated
    }

    fragment UserViewerFragment on UserViewer {
      ...DeeplyNestedFragment
      email
      details {
        ...UserViewerDetailsFragment
      }
    }

    fragment ViewerFragment on Viewer {
      id
      ...UserViewerFragment
    }

    query viewerQuery {
      viewer {
        ...ViewerFragment
      }
    }
  `);

  const validationErrors = validate(viewerSchema, documents);
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
    name: 'viewer',
    fields: [
      {
        type: 'fragment',
        onType: 'Viewer',
        fields: [{ type: 'scalar', name: 'id' }],
      },
      {
        type: 'fragment',
        onType: 'UserViewer',
        fields: [
          // `isAuthenticated` was nested in `DeeplyNestedFragment`, which is nested in
          // `UserViewerFragment`, which again is nested in `ViewerFragment`. We expect it to have
          // been lifted up to here, such that all fragments on viewer are on the same level.
          { type: 'scalar', name: 'isAuthenticated' },
          { type: 'scalar', name: 'email' },
          {
            type: 'object',
            name: 'details',
            fields: [
              {
                type: 'fragment',
                onType: 'UserViewerDetails',
                fields: [{ type: 'scalar', name: 'name' }],
              },
            ],
          },
        ],
      },
    ],
  });
});
