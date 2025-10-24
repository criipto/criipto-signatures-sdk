import test from 'ava';
import fs from 'fs';

import CriiptoSignatures from '../../';
import { DocumentStorageMode } from '../../signatory-viewer-types';
import { SignatoryViewerClient } from '../../signatory-viewer';
import assert from 'node:assert';

const sample = fs.readFileSync(__dirname + '/sample.pdf');
const sampleForm = fs.readFileSync(__dirname + '/sample-form.pdf');

const documentFixture = {
  pdf: {
    title: 'Node.js Sample',
    blob: sample, // Buffer
    storageMode: <DocumentStorageMode>'Temporary',
  },
};

function arrange() {
  const applicationClient = new CriiptoSignatures(
    process.env.CRIIPTO_SIGNATURES_CLIENT_ID!,
    process.env.CRIIPTO_SIGNATURES_CLIENT_SECRET!,
  );
  applicationClient.client.setHeader('Criipto-Sdk', 'test');

  return { applicationClient };
}

test('client credentials', t => {
  t.truthy(process.env.CRIIPTO_SIGNATURES_CLIENT_ID);
  t.truthy(process.env.CRIIPTO_SIGNATURES_CLIENT_SECRET);
});

test('can authenticate with criiptoVerify mock', async t => {
  // ARRANGE
  const { applicationClient } = arrange();
  const signatureOrder = await applicationClient.createSignatureOrder({
    title: 'Node.js sample',
    expiresInDays: 1,
    documents: [documentFixture],
  });
  const signatory = await applicationClient.addSignatory(signatureOrder.id);

  const signatoryClient = new SignatoryViewerClient({
    token: signatory.token,
  });

  const viewer = await signatoryClient.viewer();
  assert.strictEqual(viewer.__typename, 'SignatoryViewer');
  const ep = viewer.evidenceProviders.find(
    s => s.__typename === 'CriiptoVerifySignatureEvidenceProvider',
  );
  assert(ep);

  // ACT
  const started = await signatoryClient.startCriiptoVerifyEvidenceProvider({
    id: ep.id,
    acrValue: 'urn:grn:authn:mock',
    redirectUri: `https://${ep.domain}/signatures`,
    stage: 'VIEW',
  });

  const login = await followMock(started.redirectUri);
  assert.strictEqual(login.status, 'ok');

  const completed = await signatoryClient.completeCriiptoVerifyEvidenceProvider({
    code: login.code,
    state: login.state,
  });

  t.truthy(completed.jwt);
});

test('can sign with criiptoVerify mock', async t => {
  // ARRANGE
  const { applicationClient } = arrange();
  const signatureOrder = await applicationClient.createSignatureOrder({
    title: 'Node.js sample',
    expiresInDays: 1,
    documents: [documentFixture],
  });
  const signatory = await applicationClient.addSignatory(signatureOrder.id);

  const signatoryClient = new SignatoryViewerClient({
    token: signatory.token,
  });

  const viewer = await signatoryClient.viewer();
  assert.strictEqual(viewer.__typename, 'SignatoryViewer');
  const ep = viewer.evidenceProviders.find(
    s => s.__typename === 'CriiptoVerifySignatureEvidenceProvider',
  );
  assert(ep);

  await signatoryClient.openDocument({
    documentId: viewer.documents.edges[0].node.id,
  });
  await signatoryClient.approveDocument({
    documentId: viewer.documents.edges[0].node.id,
  });

  // ACT
  const started = await signatoryClient.startCriiptoVerifyEvidenceProvider({
    id: ep.id,
    acrValue: 'urn:grn:authn:mock',
    redirectUri: `https://${ep.domain}/signatures`,
    stage: 'SIGN',
  });

  const login = await followMock(started.redirectUri);
  assert.strictEqual(login.status, 'ok');

  const signed = await signatoryClient.sign({
    id: ep.id,
    criiptoVerifyV2: {
      code: login.code,
      state: login.state,
    },
  });
  assert.strictEqual(signed.__typename, 'SignatoryViewer');
  t.is(signed.status, 'SIGNED');
});

test('can authenticate to view', async t => {
  // ARRANGE
  const { applicationClient } = arrange();
  const signatureOrder = await applicationClient.createSignatureOrder({
    title: 'Node.js sample',
    expiresInDays: 1,
    documents: [documentFixture],
    evidenceValidationStages: ['VIEW', 'SIGN'],
  });
  const signatory = await applicationClient.addSignatory(signatureOrder.id);

  const signatoryClient = new SignatoryViewerClient({
    token: signatory.token,
  });

  const unvalidatedViewer = await signatoryClient.viewer();
  assert.strictEqual(unvalidatedViewer.__typename, 'UnvalidatedSignatoryViewer');
  const ep = unvalidatedViewer.evidenceProviders.find(
    s => s.__typename === 'CriiptoVerifySignatureEvidenceProvider',
  );
  assert(ep);

  // ACT
  const started = await signatoryClient.startCriiptoVerifyEvidenceProvider({
    id: ep.id,
    acrValue: 'urn:grn:authn:mock',
    redirectUri: `https://${ep.domain}/signatures`,
    stage: 'VIEW',
  });

  const login = await followMock(started.redirectUri);
  assert.strictEqual(login.status, 'ok');

  const completed = await signatoryClient.completeCriiptoVerifyEvidenceProvider({
    code: login.code,
    state: login.state,
  });
  signatoryClient.setAuthentication({
    token: signatory.token,
    validation: `${ep.id}:${completed.jwt}`,
  });

  // ASSERT
  const authenticatedViewer = await signatoryClient.viewer();
  t.is(authenticatedViewer.__typename, 'SignatoryViewer');
});

test('can authenticate to view and then sign', async t => {
  // ARRANGE
  const { applicationClient } = arrange();
  const signatureOrder = await applicationClient.createSignatureOrder({
    title: 'Node.js sample',
    expiresInDays: 1,
    documents: [documentFixture],
    evidenceValidationStages: ['VIEW', 'SIGN'],
  });
  const signatory = await applicationClient.addSignatory(signatureOrder.id);

  const signatoryClient = new SignatoryViewerClient({
    token: signatory.token,
  });

  const unvalidatedViewer = await signatoryClient.viewer();
  assert.strictEqual(unvalidatedViewer.__typename, 'UnvalidatedSignatoryViewer');
  const ep = unvalidatedViewer.evidenceProviders.find(
    s => s.__typename === 'CriiptoVerifySignatureEvidenceProvider',
  );
  assert(ep);

  // ACT - AUTHENTICATE TO VIEW
  const startedToLogin = await signatoryClient.startCriiptoVerifyEvidenceProvider({
    id: ep.id,
    acrValue: 'urn:grn:authn:mock',
    redirectUri: `https://${ep.domain}/signatures`,
    stage: 'VIEW',
  });

  const loginResponse = await followMock(startedToLogin.redirectUri);
  assert.strictEqual(loginResponse.status, 'ok');

  const completed = await signatoryClient.completeCriiptoVerifyEvidenceProvider({
    code: loginResponse.code,
    state: loginResponse.state,
  });
  signatoryClient.setAuthentication({
    token: signatory.token,
    validation: `${ep.id}:${completed.jwt}`,
  });

  const authenticatedViewer = await signatoryClient.viewer();
  assert.strictEqual(authenticatedViewer.__typename, 'SignatoryViewer');

  // ACT - SIGN
  await signatoryClient.openDocument({
    documentId: authenticatedViewer.documents.edges[0].node.id,
  });
  await signatoryClient.approveDocument({
    documentId: authenticatedViewer.documents.edges[0].node.id,
  });

  const startedToSign = await signatoryClient.startCriiptoVerifyEvidenceProvider({
    id: ep.id,
    acrValue: 'urn:grn:authn:mock',
    redirectUri: `https://${ep.domain}/signatures`,
    stage: 'SIGN',
  });

  const signResponse = await followMock(startedToSign.redirectUri);
  assert.strictEqual(signResponse.status, 'ok');

  const signed = await signatoryClient.sign({
    id: ep.id,
    criiptoVerifyV2: {
      code: signResponse.code,
      state: signResponse.state,
    },
  });

  // ASSERT
  assert.strictEqual(signed.__typename, 'SignatoryViewer');
  t.is(signed.status, 'SIGNED');
});

async function followMock(initial: string) {
  const first = await fetch(initial, {
    redirect: 'manual',
  });
  assert.equal(first.status, 303);

  const second = await fetch(first.headers.get('location')!, {
    redirect: 'manual',
  });

  const final = new URL(second.headers.get('location')!);
  if (final.searchParams.get('code')) {
    return {
      status: 'ok' as const,
      code: final.searchParams.get('code')!,
      state: final.searchParams.get('state')!,
    } as const;
  }
  if (final.searchParams.get('error')) {
    return {
      status: 'error' as const,
      error: final.searchParams.get('error')!,
      error_description: final.searchParams.get('error_description'),
    } as const;
  }
  assert.fail(final.href);
}
