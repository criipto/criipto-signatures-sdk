import test from 'ava';

import { buildSchema, type GraphQLSchema } from 'graphql';
import { plugin } from './index.ts';

const runPlugin = async (schema: GraphQLSchema) => {
  const result = await plugin(schema, [], { mode: 'types' }, { outputFile: '' });
  if (typeof result === 'object') {
    return result.content;
  }
  return result;
};

test('Should work with types', async t => {
  const schema = buildSchema(/* GraphQL */ `
    "this is b"
    type B {
      "This is a field"
      id: ID
    }
  `);
  const result = await runPlugin(schema);

  t.is(
    result,
    `# this is b
class B(BaseModel):
  # This is a field
  id: "Optional[IDScalar]" = Field(default=None)
`,
  );
});

test('works with interfaces', async t => {
  const schema = buildSchema(/* GraphQL */ `
    interface A {
      id: ID!
    }
    type B implements A {
      id: ID!
    }
    type C implements A {
      id: ID!
    }
  `);
  const result = await runPlugin(schema);

  t.is(
    result,
    `type A = B | C

class B(BaseModel):
  id: "IDScalar"

class C(BaseModel):
  id: "IDScalar"
`,
  );
});
