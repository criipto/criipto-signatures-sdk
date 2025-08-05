# @criipto/signatures

A Node.js SDK for Criipto Signatures

Sign PAdeS-LTA documents using MitID, BankID or any other eID supported by Criipto.

[Examples](https://docs.criipto.com/signatures/graphql/examples/)

## Getting started

### Requirements

The library is published as ESM only. On node 20.19.0, 22.12.0 and ^24 `require(esm)` works out of the box, even if your code is using CommonJS. On
older versions, you will need to run with `--experimental-require-module`. See https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require for more details.

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
