import { GraphQLClient } from 'graphql-request';
import {
  AddSignatoriesInput,
  AddSignatoryInput,
  ChangeSignatoryInput,
  ExtendSignatureOrderInput,
  CloseSignatureOrderInput,
  CreateSignatureOrderInput,
  CreateBatchSignatoryInput,
  getSdk,
  Sdk,
  SignActingAsInput,
  ChangeSignatureOrderInput,
} from './application-viewer-types';

import * as Types from './application-viewer-types';
import jsonSerializer from './json-serializer';
export { Types as CriiptoSignaturesTypes };

export class CriiptoSignatures {
  client: GraphQLClient;
  sdk: Sdk;

  constructor(clientId: string, clientSecret: string) {
    this.client = new GraphQLClient('https://signatures-api.criipto.com/v1/graphql', {
      headers: {
        Authorization: `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
        'Criipto-Sdk': 'criipto-signatures-nodejs',
      },
      jsonSerializer,
    });
    this.sdk = getSdk(this.client);
  }

  async createSignatureOrder(
    input: CreateSignatureOrderInput,
  ): Promise<
    NonNullable<Types.CreateSignatureOrderMutation['createSignatureOrder']>['signatureOrder']
  > {
    const response = await this.sdk.createSignatureOrder({
      input,
    });
    return response.createSignatureOrder!.signatureOrder;
  }

  async addSignatory(
    signatureOrderId: string,
    input?: Omit<AddSignatoryInput, 'signatureOrderId'>,
  ): Promise<NonNullable<Types.AddSignatoryMutation['addSignatory']>['signatory']> {
    const response = await this.sdk.addSignatory({
      input: {
        ...input,
        signatureOrderId,
      },
    });
    return response.addSignatory!.signatory;
  }

  async addSignatories(
    signatureOrderId: string,
    input: Omit<AddSignatoriesInput, 'signatureOrderId'>,
  ): Promise<NonNullable<Types.AddSignatoriesMutation['addSignatories']>['signatories']> {
    const response = await this.sdk.addSignatories({
      input: {
        ...input,
        signatureOrderId,
      },
    });
    return response.addSignatories!.signatories;
  }

  async changeSignatory(
    signatoryId: string,
    input: Omit<ChangeSignatoryInput, 'signatoryId'>,
  ): Promise<NonNullable<Types.ChangeSignatoryMutation['changeSignatory']>['signatory']> {
    const response = await this.sdk.changeSignatory({
      input: {
        ...input,
        signatoryId,
      },
    });
    return response.changeSignatory!.signatory;
  }

  async extendSignatureOrder(
    signatureOrderId: string,
    input: Omit<ExtendSignatureOrderInput, 'signatureOrderId'>,
  ): Promise<
    NonNullable<Types.ExtendSignatureOrderMutation['extendSignatureOrder']>['signatureOrder']
  > {
    const response = await this.sdk.extendSignatureOrder({
      input: {
        ...input,
        signatureOrderId,
      },
    });

    return response.extendSignatureOrder!.signatureOrder;
  }

  async closeSignatureOrder(
    signatureOrderId: string,
    input?: Omit<CloseSignatureOrderInput, 'signatureOrderId'>,
  ): Promise<
    NonNullable<Types.CloseSignatureOrderMutation['closeSignatureOrder']>['signatureOrder']
  > {
    const response = await this.sdk.closeSignatureOrder({
      input: {
        ...input,
        signatureOrderId,
      },
    });
    return response.closeSignatureOrder!.signatureOrder;
  }

  async cancelSignatureOrder(
    signatureOrderId: string,
  ): Promise<
    NonNullable<Types.CancelSignatureOrderMutation['cancelSignatureOrder']>['signatureOrder']
  > {
    const response = await this.sdk.cancelSignatureOrder({
      input: {
        signatureOrderId,
      },
    });
    return response.cancelSignatureOrder!.signatureOrder;
  }

  async cleanupSignatureOrder(
    signatureOrderId: string,
  ): Promise<
    NonNullable<Types.CleanupSignatureOrderMutation['cleanupSignatureOrder']>['signatureOrder']
  > {
    const response = await this.sdk.cleanupSignatureOrder({
      input: {
        signatureOrderId,
      },
    });
    return response.cleanupSignatureOrder!.signatureOrder;
  }

  async signActingAs(
    signatoryId: string,
    input: Omit<SignActingAsInput, 'signatoryId'>,
  ): Promise<NonNullable<Types.SignActingAsMutation['signActingAs']>['signatory']> {
    const response = await this.sdk.signActingAs({
      input: {
        ...input,
        signatoryId,
      },
    });
    return response.signActingAs!.signatory;
  }

  async deleteSignatory(
    signatureOrderId: string,
    signatoryId: string,
  ): Promise<NonNullable<Types.DeleteSignatoryMutation['deleteSignatory']>['signatureOrder']> {
    const response = await this.sdk.deleteSignatory({
      input: {
        signatureOrderId,
        signatoryId,
      },
    });
    return response.deleteSignatory!.signatureOrder;
  }

  async createBatchSignatory(
    input: CreateBatchSignatoryInput,
  ): Promise<
    NonNullable<Types.CreateBatchSignatoryMutation['createBatchSignatory']>['batchSignatory']
  > {
    const response = await this.sdk.createBatchSignatory({
      input: input,
    });
    return response.createBatchSignatory!.batchSignatory;
  }

  async changeSignatureOrder(
    input: ChangeSignatureOrderInput,
  ): Promise<
    NonNullable<Types.ChangeSignatureOrderMutation['changeSignatureOrder']>['signatureOrder']
  > {
    const response = await this.sdk.changeSignatureOrder({
      input: input,
    });
    return response.changeSignatureOrder!.signatureOrder;
  }

  async validateDocument(
    input: Types.ValidateDocumentInput,
  ): Promise<NonNullable<Types.ValidateDocumentMutation['validateDocument']>> {
    const response = await this.sdk.validateDocument({ input });
    return response.validateDocument!;
  }

  async querySignatureOrder(
    signatureOrderId: string,
    includeDocuments: boolean = false,
  ): Promise<
    | null
    | NonNullable<Types.SignatureOrderWithDocumentsQuery['signatureOrder']>
    | NonNullable<Types.SignatureOrderQuery['signatureOrder']>
  > {
    const response = includeDocuments
      ? await this.sdk.signatureOrderWithDocuments({ id: signatureOrderId })
      : await this.sdk.signatureOrder({ id: signatureOrderId });
    return response.signatureOrder ?? null;
  }

  async querySignatory(signatoryId: string): Promise<Types.SignatoryQuery['signatory']> {
    const response = await this.sdk.signatory({ id: signatoryId });
    return response.signatory ?? null;
  }

  async querySignatureOrders<T extends Types.SignatureOrdersQuery['viewer']>(
    query: {
      first: number;
      after?: string;
      status?: Types.SignatureOrderStatus;
    } = { first: 10 },
  ): Promise<
    T extends { __typename: 'Application' }
      ? Array<T['signatureOrders']['edges'][number]['node']>
      : never
  > {
    const response = await this.sdk.signatureOrders({
      first: query.first,
      after: query.after,
      status: query.status,
    });

    if (response.viewer.__typename !== 'Application') throw new Error('Unexpected viewer type');
    // @ts-expect-error
    return response.viewer.signatureOrders.edges.map(e => e.node);
  }

  async queryBatchSignatory(
    batchSignatoryId: string,
  ): Promise<Types.BatchSignatoryQuery['batchSignatory']> {
    const response = await this.sdk.batchSignatory({ id: batchSignatoryId });
    return response.batchSignatory ?? null;
  }
}

export default CriiptoSignatures;
