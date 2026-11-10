import test from 'ava';

import { CriiptoSignatures } from '../../application-viewer';

const { version } = require('../../../package.json') as { version: string };

test('CriiptoSignatures sends the SDK name and version', t => {
  const client = new CriiptoSignatures('invalid', 'invalid');

  t.like(client.client.requestConfig.headers, {
    'Criipto-Sdk': `criipto-signatures-nodejs@${version}`,
  });
});
