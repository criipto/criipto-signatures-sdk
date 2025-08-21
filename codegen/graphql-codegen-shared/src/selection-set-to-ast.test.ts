import { strictEqual } from 'node:assert';
import test from 'ava';
import { buildSchema, parse, validate, Kind } from 'graphql';
import { operationSelectionsToAstTree } from './selection-set-to-ast.ts';
import { assertIsNotUndefined } from './assertIsNotUndefined.ts';

test('selecting fields from mutation output type', t => {
  // Arrange
  const schema = buildSchema(/* GraphQL */ `
    type MutationOutput {
      id: ID!
      otherField: String
    }
    type Mutation {
      mutate: MutationOutput
    }
    type Query {
      void: String
    }
  `);

  const documents = parse(/* GraphQL */ `
    mutation mutate {
      mutate {
        id
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
  const astTree = operationSelectionsToAstTree({
    node: operation,
    fragments: [],
    schema,
  });

  // Assert
  strictEqual(astTree.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(astTree.children.length, 0);

  strictEqual(astTree.astNode.fields?.length, 1);
  t.is(astTree.astNode.fields[0]?.name.value, 'id');
});

test('selecting fields from query output type', t => {
  // Arrange
  const schema = buildSchema(/* GraphQL */ `
    type QueryResponse {
      fieldA: String!
      fieldB: String
      fieldC: String
    }
    type Mutation {
      void: String
    }
    type Query {
      query: QueryResponse
    }
  `);

  const documents = parse(/* GraphQL */ `
    query mutate {
      query {
        fieldA
        fieldB
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
  const astTree = operationSelectionsToAstTree({
    node: operation,
    fragments: [],
    schema,
  });

  // Assert
  strictEqual(astTree.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(astTree.children.length, 0);

  strictEqual(astTree.astNode.fields?.length, 2);

  t.deepEqual(
    astTree.astNode.fields.map(field => field.name.value).sort(),
    ['fieldA', 'fieldB'].sort(),
  );
});

test('selecting fields on nested types', t => {
  // Arrange
  const schema = buildSchema(/* GraphQL */ `
    type Foo {
      fieldA: String!
      fieldB: String
      fieldC: String
    }
    type QueryResponse {
      foo: Foo!
    }
    type Mutation {
      void: String
    }
    type Query {
      query: QueryResponse
    }
  `);

  const documents = parse(/* GraphQL */ `
    query queryIt {
      query {
        foo {
          fieldA
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
  const astTree = operationSelectionsToAstTree({
    node: operation,
    fragments: [],
    schema,
  });

  // Assert
  strictEqual(astTree.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(astTree.astNode.name.value, 'QueryResponse');
  strictEqual(astTree.astNode.fields?.length, 1);
  assertIsNotUndefined(astTree.astNode.fields[0]);
  strictEqual(astTree.astNode.fields[0].name.value, 'foo');
  strictEqual(astTree.astNode.fields[0].type.kind, Kind.NON_NULL_TYPE);
  strictEqual(astTree.astNode.fields[0].type.type.kind, Kind.NAMED_TYPE);
  strictEqual(astTree.astNode.fields[0].type.type.name.value, 'Foo');

  strictEqual(astTree.children.length, 1);
  assertIsNotUndefined(astTree.children[0]);
  strictEqual(astTree.children[0].astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(astTree.children[0].astNode.name.value, 'Foo');
  strictEqual(astTree.children[0].astNode.fields?.length, 2);
  t.deepEqual(
    astTree.children[0].astNode.fields.map(field => field.name.value).sort(),
    ['fieldA', 'fieldB'].sort(),
  );
});

test('works for fragments', t => {
  // Arrange
  const schema = buildSchema(/* GraphQL */ `
    type MutationOutput {
      fieldA: String!
      fieldB: String
      fieldC: String
      fieldD: String
    }
    type Mutation {
      myMutation: MutationOutput
    }
    type Query {
      void: String
    }
  `);

  const documents = parse(/* GraphQL */ `
    fragment mutateFragment on MutationOutput {
      fieldA
      fieldB
    }
    mutation mutateIt {
      myMutation {
        fieldC
        ...mutateFragment
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
  const fragments = documents.definitions.filter(
    definition => definition.kind === Kind.FRAGMENT_DEFINITION,
  );

  // Act
  const astTree = operationSelectionsToAstTree({
    node: operation,
    fragments,
    schema,
  });

  // Assert
  strictEqual(astTree.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(astTree.astNode.name.value, 'MutationOutput');
  strictEqual(astTree.astNode.fields?.length, 3);

  t.deepEqual(
    astTree.astNode.fields.map(field => field.name.value).sort(),
    ['fieldA', 'fieldB', 'fieldC'].sort(),
  );
});

test('works on interfaces', t => {
  // Arrange
  const schema = buildSchema(/* GraphQL */ `
    interface Foo {
      fieldA: String!
      fieldB: String
      fieldC: String
    }
    type Mutation {
      void: String
    }
    type Query {
      foo: Foo
    }
  `);

  const documents = parse(/* GraphQL */ `
    query queryIt {
      foo {
        fieldA
        fieldB
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
  const astTree = operationSelectionsToAstTree({
    node: operation,
    fragments: [],
    schema,
  });

  // Assert
  strictEqual(astTree.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(astTree.astNode.name.value, 'Foo');

  t.deepEqual(
    astTree.astNode.fields?.map(field => field.name.value).sort(),
    ['fieldA', 'fieldB'].sort(),
  );
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
    details: UserViewerDetails!
    email: String!
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

test('works for fragments on interfaces', t => {
  // Arrange
  const documents = parse(/* GraphQL */ `
    fragment UserViewerFragment on UserViewer {
      email
    }

    query viewerQuery {
      viewer {
        id

        ... on UserViewer {
          details {
            name
          }
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
    throw new AggregateError(validationErrors, 'GraphQL Schema validation errors');
  }

  const operation = documents.definitions.find(
    definition => definition.kind === Kind.OPERATION_DEFINITION,
  );
  assertIsNotUndefined(operation);
  const fragments = documents.definitions.filter(
    definition => definition.kind === Kind.FRAGMENT_DEFINITION,
  );

  // Act
  const astTree = operationSelectionsToAstTree({
    node: operation,
    fragments,
    schema: viewerSchema,
  });

  // Assert
  strictEqual(astTree.astNode.kind, Kind.UNION_TYPE_DEFINITION);
  strictEqual(astTree.astNode.name.value, 'Viewer');

  strictEqual(astTree.children.length, 2);
  const userViewer = astTree.children[0];
  assertIsNotUndefined(userViewer);
  strictEqual(userViewer.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(userViewer.astNode.name.value, 'UserViewer');
  t.deepEqual(
    userViewer.astNode.fields?.map(field => field.name.value).sort(),
    ['id', 'details', 'email'].sort(),
  );

  strictEqual(userViewer.children.length, 1);
  const userViewerDetails = userViewer.children[0];

  assertIsNotUndefined(userViewerDetails);
  strictEqual(userViewerDetails.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(userViewerDetails.astNode.name.value, 'UserViewerDetails');
  t.deepEqual(
    userViewerDetails.astNode.fields?.map(field => field.name.value),
    ['name'],
  );

  const applicationViewer = astTree.children[1];
  assertIsNotUndefined(applicationViewer);
  strictEqual(applicationViewer.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(applicationViewer.astNode.name.value, 'ApplicationViewer');
  t.deepEqual(
    applicationViewer.astNode.fields?.map(field => field.name.value).sort(),
    ['id', 'applicationName'].sort(),
  );
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
  const astTree = operationSelectionsToAstTree({
    node: operation,
    fragments,
    schema: viewerSchema,
  });

  // Assert
  strictEqual(astTree.astNode.kind, Kind.UNION_TYPE_DEFINITION);
  strictEqual(astTree.astNode.name.value, 'Viewer');

  strictEqual(astTree.children.length, 2);
  const userViewer = astTree.children[0];
  assertIsNotUndefined(userViewer);
  strictEqual(userViewer.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(userViewer.astNode.name.value, 'UserViewer');
  t.deepEqual(
    userViewer.astNode.fields?.map(field => field.name.value).sort(),
    ['id', 'isAuthenticated', 'details', 'email'].sort(),
  );

  const userViewerDetails = userViewer.children[0];
  assertIsNotUndefined(userViewerDetails);

  strictEqual(userViewerDetails.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(userViewerDetails.astNode.name.value, 'UserViewerDetails');
  t.deepEqual(
    userViewerDetails.astNode.fields?.map(field => field.name.value),
    ['name'],
  );

  const applicationViewer = astTree.children[1];
  assertIsNotUndefined(applicationViewer);
  strictEqual(applicationViewer.astNode.kind, Kind.OBJECT_TYPE_DEFINITION);
  strictEqual(applicationViewer.astNode.name.value, 'ApplicationViewer');
  t.deepEqual(
    applicationViewer.astNode.fields?.map(field => field.name.value),
    ['id'],
  );
});
