import { GraphQLClient } from 'graphql-request';
import { getSdk, Sdk } from './signatory-viewer-types';

import * as Types from './signatory-viewer-types';
import jsonSerializer from './json-serializer';
import { SignInput } from './signatory-viewer-types';
import {
  CompleteCriiptoVerifyEvidenceProviderInput,
  StartCriiptoVerifyEvidenceProviderInput,
} from './application-viewer-types';
export { Types as SignatoryViewerTypes };

type Authentication = { token: string; validation?: string };

export class SignatoryViewerClient {
  client: GraphQLClient;
  sdk: Sdk;

  constructor(options: Authentication) {
    this.client = new GraphQLClient('https://signatures-api.criipto.com/v1/graphql', {
      jsonSerializer,
    });

    this.setAuthentication(options);
    this.sdk = getSdk(this.client);
  }

  public setAuthentication(authentication: Authentication) {
    this.client.setHeader('Signatory-Token', authentication.token);
    if (authentication.validation) {
      this.client.setHeader('Signatory-Validation', authentication.validation);
    }
  }

  async sign(input: SignInput) {
    const response = await this.sdk.sign({
      input,
    });
    return response.sign!.viewer;
  }

  async startCriiptoVerifyEvidenceProvider(input: StartCriiptoVerifyEvidenceProviderInput) {
    const response = await this.sdk.startCriiptoVerifyEvidenceProvider({
      input,
    });
    return response.startCriiptoVerifyEvidenceProvider!;
  }

  async completeCriiptoVerifyEvidenceProvider(input: CompleteCriiptoVerifyEvidenceProviderInput) {
    const response = await this.sdk.completeCriiptoVerifyEvidenceProvider({
      input,
    });
    return response.completeCriiptoVerifyEvidenceProvider!;
  }

  async openDocument(input: { documentId: string }) {
    await this.sdk.updateSignatoryDocumentStatus({
      input: {
        documentId: input.documentId,
        status: 'OPENED',
      },
    });
  }

  async approveDocument(input: { documentId: string }) {
    await this.sdk.updateSignatoryDocumentStatus({
      input: {
        documentId: input.documentId,
        status: 'APPROVED',
      },
    });
  }

  async viewer() {
    const response = await this.sdk.viewer();
    return response.viewer;
  }
}
