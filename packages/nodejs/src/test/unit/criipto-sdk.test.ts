import test from 'ava';

import { CriiptoSignatures } from '../../application-viewer';
import { SignatoryViewerClient } from '../../signatory-viewer';

const { version } = require('../../../package.json') as { version: string };

test('CriiptoSignatures sends the SDK name and version', t => {
  const client = new CriiptoSignatures('invalid', 'invalid');

  t.like(client.client.requestConfig.headers, {
    'Criipto-Sdk': `criipto-signatures-nodejs@${version}`,
  });
});

test('SignatoryViewerClient sends the SDK name and version', t => {
  const client = new SignatoryViewerClient({ token: 'invalid' });

  t.like(client.client.requestConfig.headers, {
    'Criipto-Sdk': `criipto-signatures-signatory-nodejs@${version}`,
  });
});
