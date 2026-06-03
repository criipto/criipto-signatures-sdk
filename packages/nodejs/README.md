# @criipto/signatures

A Node.js SDK for Criipto Signatures

Sign PAdeS-LTA documents using MitID, BankID or any other eID supported by Criipto.

[Examples](https://docs.criipto.com/signatures/graphql/examples/)

## Getting started

### Requirements

This library supports Node 16 and later.

### Installation

The SDK is available on [NPM](https://npmjs.com/package/@criipto/signatures):

```
npm install --save @criipto/signatures
yarn add @criipto/signatures
```

### Configure the SDK

```javascript
import CriiptoSignatures from '@criipto/signatures';
const client = new CriiptoSignatures('{YOUR_CRIIPTO_CLIENT_ID}', '{YOUR_CRIIPTO_CLIENT_SECRET}');
```

### Overriding the GraphQL endpoint

By default the SDK targets `https://signatures.idura.app`. You can override the endpoint by passing an `endpoint` option:

```javascript
import CriiptoSignatures from '@criipto/signatures';
const client = new CriiptoSignatures('{YOUR_CRIIPTO_CLIENT_ID}', '{YOUR_CRIIPTO_CLIENT_SECRET}', {
  endpoint: 'https://signatures.idura.app/v1/graphql',
});
```

The same option is supported by `SignatoryViewerClient`:

```javascript
import { SignatoryViewerClient } from '@criipto/signatures';
const client = new SignatoryViewerClient(
  { token: '{SIGNATORY_TOKEN}' },
  { endpoint: 'https://signatures.idura.app/v1/graphql' },
);
```

## Basic example

```javascript
import CriiptoSignatures from '@criipto/signatures';
const client = new CriiptoSignatures("{YOUR_CRIIPTO_CLIENT_ID}", "{YOUR_CRIIPTO_CLIENT_SECRET}");

// Create signature order
const signatureOrder = await client.createSignatureOrder({
  title: "Node.js sample",
  documents: [
    {
      pdf: {
        title: "Node.js Sample",
        blob: pdf // Buffer
        storageMode: 'Temporary'
      }
    }
  ]
});

// Add signatory to signature order
const signatory = await client.addSignatory(signatureOrder.id);
console.log(signatory.href);

const closed = await client.closeSignatureOrder(signatureOrder.id);
```
