import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Blob: { input: Buffer; output: Buffer };
  Date: { input: string; output: string };
  DateTime: { input: string; output: string };
  URI: { input: string; output: string };
};

export type AddSignatoriesInput = {
  signatories: Array<CreateSignatureOrderSignatoryInput>;
  signatureOrderId: Scalars['ID']['input'];
};

export type AddSignatoriesOutput = {
  __typename?: 'AddSignatoriesOutput';
  signatories: Array<Signatory>;
  signatureOrder: SignatureOrder;
};

export type AddSignatoryInput = {
  /** Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents. */
  documents?: InputMaybe<Array<SignatoryDocumentInput>>;
  /** Selectively enable evidence providers for this signatory. */
  evidenceProviders?: InputMaybe<Array<SignatoryEvidenceProviderInput>>;
  evidenceValidation?: InputMaybe<Array<SignatoryEvidenceValidationInput>>;
  /** Will not be displayed to signatories, can be used as a reference to your own system. */
  reference?: InputMaybe<Scalars['String']['input']>;
  /** Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output. */
  role?: InputMaybe<Scalars['String']['input']>;
  signatureAppearance?: InputMaybe<SignatureAppearanceInput>;
  signatureOrderId: Scalars['ID']['input'];
  /** Defines signing sequence order for sequential signing. If two signatories have the same number they can sign in parallel. Default: 2147483647 */
  signingSequence?: InputMaybe<Scalars['Int']['input']>;
  /** Override UI settings for signatory, defaults to UI settings for signature order */
  ui?: InputMaybe<SignatoryUiInput>;
};

export type AddSignatoryOutput = {
  __typename?: 'AddSignatoryOutput';
  signatory: Signatory;
  signatureOrder: SignatureOrder;
};

export type AllOfEvidenceProviderInput = {
  providers: Array<SingleEvidenceProviderInput>;
};

export type AllOfSignatureEvidenceProvider = SignatureEvidenceProvider & {
  __typename?: 'AllOfSignatureEvidenceProvider';
  id: Scalars['ID']['output'];
  providers: Array<SingleSignatureEvidenceProvider>;
};

export type AnonymousViewer = Viewer & {
  __typename?: 'AnonymousViewer';
  authenticated: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
};

export type Application = Viewer & {
  __typename?: 'Application';
  apiKeys: Array<ApplicationApiKey>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  signatureOrders: SignatureOrderConnection;
  /** Tenants are only accessable from user viewers */
  tenant?: Maybe<Tenant>;
  verifyApplication: VerifyApplication;
  webhookLogs: Array<WebhookInvocation>;
};

export type ApplicationSignatureOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<SignatureOrderStatus>;
};

export type ApplicationWebhookLogsArgs = {
  from: Scalars['String']['input'];
  succeeded?: InputMaybe<Scalars['Boolean']['input']>;
  to: Scalars['String']['input'];
};

export type ApplicationApiKey = {
  __typename?: 'ApplicationApiKey';
  clientId: Scalars['String']['output'];
  clientSecret?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mode: ApplicationApiKeyMode;
  note?: Maybe<Scalars['String']['output']>;
};

export type ApplicationApiKeyMode = 'READ_ONLY' | 'READ_WRITE' | '%future added value';

export type BatchSignatory = {
  __typename?: 'BatchSignatory';
  href: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  items: Array<BatchSignatoryItem>;
  /** The authentication token required for performing batch operations. */
  token: Scalars['String']['output'];
  traceId: Scalars['String']['output'];
  ui: SignatureOrderUi;
};

export type BatchSignatoryItem = {
  __typename?: 'BatchSignatoryItem';
  signatory: Signatory;
  signatureOrder: SignatureOrder;
};

export type BatchSignatoryItemInput = {
  signatoryId: Scalars['String']['input'];
  signatureOrderId: Scalars['String']['input'];
};

export type BatchSignatoryViewer = Viewer & {
  __typename?: 'BatchSignatoryViewer';
  authenticated: Scalars['Boolean']['output'];
  batchSignatoryId: Scalars['ID']['output'];
  documents: SignatoryDocumentConnection;
  evidenceProviders: Array<SignatureEvidenceProvider>;
  id: Scalars['ID']['output'];
  signer: Scalars['Boolean']['output'];
  status: SignatoryStatus;
  ui: SignatureOrderUi;
};

export type CancelSignatureOrderInput = {
  signatureOrderId: Scalars['ID']['input'];
};

export type CancelSignatureOrderOutput = {
  __typename?: 'CancelSignatureOrderOutput';
  signatureOrder: SignatureOrder;
};

export type ChangeSignatoryInput = {
  /** Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents. */
  documents?: InputMaybe<Array<SignatoryDocumentInput>>;
  /** Selectively enable evidence providers for this signatory. */
  evidenceProviders?: InputMaybe<Array<SignatoryEvidenceProviderInput>>;
  evidenceValidation?: InputMaybe<Array<SignatoryEvidenceValidationInput>>;
  /** Will not be displayed to signatories, can be used as a reference to your own system. */
  reference?: InputMaybe<Scalars['String']['input']>;
  /** Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output. */
  role?: InputMaybe<Scalars['String']['input']>;
  signatoryId: Scalars['ID']['input'];
  signatureAppearance?: InputMaybe<SignatureAppearanceInput>;
  /** Defines signing sequence order for sequential signing. If two signatories have the same number they can sign in parallel. Default: 2147483647 */
  signingSequence?: InputMaybe<Scalars['Int']['input']>;
  /** Override UI settings for signatory, defaults to UI settings for signature order */
  ui?: InputMaybe<SignatoryUiInput>;
};

export type ChangeSignatoryOutput = {
  __typename?: 'ChangeSignatoryOutput';
  signatory: Signatory;
  signatureOrder: SignatureOrder;
};

export type ChangeSignatureOrderInput = {
  /** Max allowed signatories (as it influences pages needed for seals). Cannot be changed after first signer. */
  maxSignatories?: InputMaybe<Scalars['Int']['input']>;
  signatureOrderId: Scalars['ID']['input'];
  /** Signature order webhook settings */
  webhook?: InputMaybe<CreateSignatureOrderWebhookInput>;
};

export type ChangeSignatureOrderOutput = {
  __typename?: 'ChangeSignatureOrderOutput';
  signatureOrder: SignatureOrder;
};

export type CleanupSignatureOrderInput = {
  signatureOrderId: Scalars['ID']['input'];
};

export type CleanupSignatureOrderOutput = {
  __typename?: 'CleanupSignatureOrderOutput';
  signatureOrder: SignatureOrder;
};

export type CloseSignatureOrderInput = {
  /** Retains documents on Criipto servers after closing a signature order. You MUST manually call the cleanupSignatureOrder mutation when you are sure you have downloaded the blobs. Maximum value is 7 days. */
  retainDocumentsForDays?: InputMaybe<Scalars['Int']['input']>;
  signatureOrderId: Scalars['ID']['input'];
};

export type CloseSignatureOrderOutput = {
  __typename?: 'CloseSignatureOrderOutput';
  signatureOrder: SignatureOrder;
};

export type CompleteCriiptoVerifyEvidenceProviderInput = {
  code: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type CompleteCriiptoVerifyEvidenceProviderOutput = {
  __typename?: 'CompleteCriiptoVerifyEvidenceProviderOutput';
  jwt: Scalars['String']['output'];
};

export type CompositeSignature = Signature & {
  __typename?: 'CompositeSignature';
  signatory?: Maybe<Signatory>;
  signatures: Array<SingleSignature>;
};

export type CreateApplicationApiKeyInput = {
  applicationId: Scalars['ID']['input'];
  mode?: InputMaybe<ApplicationApiKeyMode>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type CreateApplicationApiKeyOutput = {
  __typename?: 'CreateApplicationApiKeyOutput';
  apiKey: ApplicationApiKey;
  application: Application;
};

export type CreateApplicationInput = {
  name: Scalars['String']['input'];
  tenantId: Scalars['ID']['input'];
  verifyApplicationDomain: Scalars['String']['input'];
  verifyApplicationEnvironment: VerifyApplicationEnvironment;
  verifyApplicationRealm: Scalars['String']['input'];
};

export type CreateApplicationOutput = {
  __typename?: 'CreateApplicationOutput';
  apiKey: ApplicationApiKey;
  application: Application;
  tenant: Tenant;
};

export type CreateBatchSignatoryInput = {
  items: Array<BatchSignatoryItemInput>;
  /** UI settings for batch signatory, will use defaults otherwise (will not use UI settings from sub signatories) */
  ui?: InputMaybe<SignatoryUiInput>;
};

export type CreateBatchSignatoryOutput = {
  __typename?: 'CreateBatchSignatoryOutput';
  batchSignatory: BatchSignatory;
};

export type CreateSignatureOrderInput = {
  /** By default signatories will be prompted to sign with a Criipto Verify based e-ID, this setting disables it. */
  disableVerifyEvidenceProvider?: InputMaybe<Scalars['Boolean']['input']>;
  documents: Array<DocumentInput>;
  /** Define evidence providers for signature order if not using built-in Criipto Verify for e-IDs */
  evidenceProviders?: InputMaybe<Array<EvidenceProviderInput>>;
  /** Defines when a signatory must be validated, default is when signing, but can be expanded to also be required when viewing documents. */
  evidenceValidationStages?: InputMaybe<Array<EvidenceValidationStage>>;
  /** When this signature order will auto-close/expire at exactly in one of the following ISO-8601 formats: yyyy-MM-ddTHH:mm:ssZ, yyyy-MM-ddTHH:mm:ss.ffZ, yyyy-MM-ddTHH:mm:ss.fffZ, yyyy-MM-ddTHH:mm:ssK, yyyy-MM-ddTHH:mm:ss.ffK, yyyy-MM-ddTHH:mm:ss.fffK. Cannot be provided with `expiresInDays`. */
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  /** When this signature order will auto-close/expire. Default 90 days. Cannot be provided with `expiresAt` */
  expiresInDays?: InputMaybe<Scalars['Int']['input']>;
  /** Attempt to automatically fix document formatting errors if possible. Default 'true'. */
  fixDocumentFormattingErrors?: InputMaybe<Scalars['Boolean']['input']>;
  /** Max allowed signatories (as it influences pages needed for seals). Default 14. */
  maxSignatories?: InputMaybe<Scalars['Int']['input']>;
  signatories?: InputMaybe<Array<CreateSignatureOrderSignatoryInput>>;
  /** Configure appearance of signatures inside documents */
  signatureAppearance?: InputMaybe<SignatureAppearanceInput>;
  /** Timezone to render signature seals in, default UTC. */
  timezone?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  /** Various settings for how the UI is presented to the signatory. */
  ui?: InputMaybe<CreateSignatureOrderUiInput>;
  /** Signature order webhook settings */
  webhook?: InputMaybe<CreateSignatureOrderWebhookInput>;
};

export type CreateSignatureOrderOutput = {
  __typename?: 'CreateSignatureOrderOutput';
  application: Application;
  signatureOrder: SignatureOrder;
};

export type CreateSignatureOrderSignatoryInput = {
  /** Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents. */
  documents?: InputMaybe<Array<SignatoryDocumentInput>>;
  /** Selectively enable evidence providers for this signatory. */
  evidenceProviders?: InputMaybe<Array<SignatoryEvidenceProviderInput>>;
  evidenceValidation?: InputMaybe<Array<SignatoryEvidenceValidationInput>>;
  /** Will not be displayed to signatories, can be used as a reference to your own system. */
  reference?: InputMaybe<Scalars['String']['input']>;
  /** Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output. */
  role?: InputMaybe<Scalars['String']['input']>;
  signatureAppearance?: InputMaybe<SignatureAppearanceInput>;
  /** Defines signing sequence order for sequential signing. If two signatories have the same number they can sign in parallel. Default: 2147483647 */
  signingSequence?: InputMaybe<Scalars['Int']['input']>;
  /** Override UI settings for signatory, defaults to UI settings for signature order */
  ui?: InputMaybe<SignatoryUiInput>;
};

export type CreateSignatureOrderUiInput = {
  /** Removes the UI options to reject a document or signature order. */
  disableRejection?: InputMaybe<Scalars['Boolean']['input']>;
  /** The language of texts rendered to the signatory. */
  language?: InputMaybe<Language>;
  /** Define a logo to be shown in the signatory UI. */
  logo?: InputMaybe<SignatureOrderUiLogoInput>;
  /** Renders a UI layer for PDF annotations, such as links, making them interactive in the UI/browser */
  renderPdfAnnotationLayer?: InputMaybe<Scalars['Boolean']['input']>;
  /** The signatory will be redirected to this URL after signing or rejected the signature order. */
  signatoryRedirectUri?: InputMaybe<Scalars['String']['input']>;
  /** Add stylesheet/css via an absolute HTTPS URL. */
  stylesheet?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSignatureOrderWebhookInput = {
  /** If defined, webhook invocations will have a X-Criipto-Signature header containing a HMAC-SHA256 signature (as a base64 string) of the webhook request body (utf-8). The secret should be between 256 and 512 bits. */
  secret?: InputMaybe<Scalars['Blob']['input']>;
  /** Webhook url. POST requests will be executed towards this URL on certain signatory events. */
  url: Scalars['String']['input'];
  /** Validates webhook connectivity by triggering a WEBHOOK_VALIDATION event, your webhook must respond within 5 seconds with 200/OK or the signature order creation will fail. */
  validateConnectivity?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CriiptoVerifyEvidenceProviderRedirect = {
  __typename?: 'CriiptoVerifyEvidenceProviderRedirect';
  redirectUri: Scalars['String']['output'];
  state: Scalars['String']['output'];
};

/** Criipto Verify based evidence for signatures. */
export type CriiptoVerifyProviderInput = {
  acrValues?: InputMaybe<Array<Scalars['String']['input']>>;
  alwaysRedirect?: InputMaybe<Scalars['Boolean']['input']>;
  /** Define additional valid audiences (besides the main client_id) for the Criipto Verify domain/issuer underlying the application. */
  audiences?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Set a custom login_hint for the underlying authentication request. */
  loginHint?: InputMaybe<Scalars['String']['input']>;
  /** Messages displayed when performing authentication (only supported by DKMitID currently). */
  message?: InputMaybe<Scalars['String']['input']>;
  /** Set a custom scope for the underlying authentication request. */
  scope?: InputMaybe<Scalars['String']['input']>;
  /** Enforces that signatories sign by unique evidence by comparing the values of previous evidence on the key you define. For Criipto Verify you likely want to use `sub` which is a unique pseudonym value present in all e-ID tokens issued. */
  uniqueEvidenceKey?: InputMaybe<Scalars['String']['input']>;
};

export type CriiptoVerifySignatureEvidenceProvider = SignatureEvidenceProvider &
  SingleSignatureEvidenceProvider & {
    __typename?: 'CriiptoVerifySignatureEvidenceProvider';
    acrValues: Array<Scalars['String']['output']>;
    alwaysRedirect: Scalars['Boolean']['output'];
    audience: Scalars['String']['output'];
    audiences: Array<Scalars['String']['output']>;
    clientID: Scalars['String']['output'];
    domain: Scalars['String']['output'];
    environment?: Maybe<VerifyApplicationEnvironment>;
    id: Scalars['ID']['output'];
    loginHint?: Maybe<Scalars['String']['output']>;
    message?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
    scope?: Maybe<Scalars['String']['output']>;
  };

export type DeleteApplicationApiKeyInput = {
  apiKeyId: Scalars['ID']['input'];
  applicationId: Scalars['ID']['input'];
};

export type DeleteApplicationApiKeyOutput = {
  __typename?: 'DeleteApplicationApiKeyOutput';
  application: Application;
};

export type DeleteSignatoryInput = {
  signatoryId: Scalars['ID']['input'];
  signatureOrderId: Scalars['ID']['input'];
};

export type DeleteSignatoryOutput = {
  __typename?: 'DeleteSignatoryOutput';
  signatureOrder: SignatureOrder;
};

export type DeviceInput = {
  os?: InputMaybe<DeviceOperatingSystem>;
};

export type DeviceOperatingSystem = 'ANDROID' | 'IOS' | '%future added value';

export type Document = {
  blob?: Maybe<Scalars['Blob']['output']>;
  id: Scalars['ID']['output'];
  originalBlob?: Maybe<Scalars['Blob']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  signatoryViewerStatus?: Maybe<SignatoryDocumentStatus>;
  signatures?: Maybe<Array<Signature>>;
  title: Scalars['String']['output'];
};

export type DocumentIdLocation = 'BOTTOM' | 'LEFT' | 'RIGHT' | 'TOP' | '%future added value';

export type DocumentInput = {
  pdf?: InputMaybe<PadesDocumentInput>;
  /** When enabled, will remove any existing signatures from the document before storing. (PDF only) */
  removePreviousSignatures?: InputMaybe<Scalars['Boolean']['input']>;
  /** XML signing is coming soon, reach out to learn more. */
  xml?: InputMaybe<XadesDocumentInput>;
};

/** Document storage mode. Temporary documents will be deleted once completed. */
export type DocumentStorageMode =
  /** Temporary documents will be deleted once completed. */
  'Temporary' | '%future added value';

export type DownloadVerificationCriiptoVerifyInput = {
  jwt: Scalars['String']['input'];
};

export type DownloadVerificationInput = {
  criiptoVerify?: InputMaybe<DownloadVerificationCriiptoVerifyInput>;
  oidc?: InputMaybe<DownloadVerificationOidcInput>;
};

export type DownloadVerificationOidcInput = {
  jwt: Scalars['String']['input'];
};

/** Hand drawn signature evidence for signatures. */
export type DrawableEvidenceProviderInput = {
  /** Required minimum height of drawed area in pixels. */
  minimumHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Required minimum width of drawed area in pixels. */
  minimumWidth?: InputMaybe<Scalars['Int']['input']>;
  requireName?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DrawableSignature = Signature &
  SingleSignature & {
    __typename?: 'DrawableSignature';
    image: Scalars['Blob']['output'];
    name?: Maybe<Scalars['String']['output']>;
    signatory?: Maybe<Signatory>;
  };

export type DrawableSignatureEvidenceProvider = SignatureEvidenceProvider &
  SingleSignatureEvidenceProvider & {
    __typename?: 'DrawableSignatureEvidenceProvider';
    id: Scalars['ID']['output'];
    minimumHeight?: Maybe<Scalars['Int']['output']>;
    minimumWidth?: Maybe<Scalars['Int']['output']>;
    requireName: Scalars['Boolean']['output'];
  };

export type EmptySignature = Signature &
  SingleSignature & {
    __typename?: 'EmptySignature';
    signatory?: Maybe<Signatory>;
  };

/** Must define a evidence provider subsection. */
export type EvidenceProviderInput = {
  allOf?: InputMaybe<AllOfEvidenceProviderInput>;
  /** Criipto Verify based evidence for signatures. */
  criiptoVerify?: InputMaybe<CriiptoVerifyProviderInput>;
  /** Hand drawn signature evidence for signatures. */
  drawable?: InputMaybe<DrawableEvidenceProviderInput>;
  /** Determined if this evidence provider should be enabled by signatories by default. Default true */
  enabledByDefault?: InputMaybe<Scalars['Boolean']['input']>;
  /** TEST environment only. Does not manipulate the PDF, use for integration or webhook testing. */
  noop?: InputMaybe<NoopEvidenceProviderInput>;
  /** Deprecated */
  oidc?: InputMaybe<OidcEvidenceProviderInput>;
};

export type EvidenceValidationStage =
  | 'SIGN'
  /** Require the signatory to be validated before viewing documents */
  | 'VIEW'
  | '%future added value';

export type ExtendSignatureOrderInput = {
  /** Expiration to add to order, in days, max 30. */
  additionalExpirationInDays: Scalars['Int']['input'];
  signatureOrderId: Scalars['ID']['input'];
};

export type ExtendSignatureOrderOutput = {
  __typename?: 'ExtendSignatureOrderOutput';
  signatureOrder: SignatureOrder;
};

export type JwtClaim = {
  __typename?: 'JWTClaim';
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type JwtSignature = Signature &
  SingleSignature & {
    __typename?: 'JWTSignature';
    claims: Array<JwtClaim>;
    jwks: Scalars['String']['output'];
    jwt: Scalars['String']['output'];
    signatory?: Maybe<Signatory>;
  };

export type Language = 'DA_DK' | 'EN_US' | 'NB_NO' | 'SV_SE' | '%future added value';

export type Mutation = {
  __typename?: 'Mutation';
  /** Add multiple signatures to your signature order. */
  addSignatories?: Maybe<AddSignatoriesOutput>;
  /** Add a signatory to your signature order. */
  addSignatory?: Maybe<AddSignatoryOutput>;
  /** Cancels the signature order without closing it, use if you no longer need a signature order. Documents are deleted from storage after cancelling. */
  cancelSignatureOrder?: Maybe<CancelSignatureOrderOutput>;
  /** Change an existing signatory */
  changeSignatory?: Maybe<ChangeSignatoryOutput>;
  /** Change an existing signature order */
  changeSignatureOrder?: Maybe<ChangeSignatureOrderOutput>;
  /** Cleans up the signature order and removes any saved documents from the servers. */
  cleanupSignatureOrder?: Maybe<CleanupSignatureOrderOutput>;
  /** Finalizes the documents in the signature order and returns them to you as blobs. Documents are deleted from storage after closing. */
  closeSignatureOrder?: Maybe<CloseSignatureOrderOutput>;
  completeCriiptoVerifyEvidenceProvider?: Maybe<CompleteCriiptoVerifyEvidenceProviderOutput>;
  /** Creates a signature application for a given tenant. */
  createApplication?: Maybe<CreateApplicationOutput>;
  /** Creates a new set of api credentials for an existing application. */
  createApplicationApiKey?: Maybe<CreateApplicationApiKeyOutput>;
  createBatchSignatory?: Maybe<CreateBatchSignatoryOutput>;
  /** Creates a signature order to be signed. */
  createSignatureOrder?: Maybe<CreateSignatureOrderOutput>;
  /** Deletes a set of API credentials for an application. */
  deleteApplicationApiKey?: Maybe<DeleteApplicationApiKeyOutput>;
  /** Delete a signatory from a signature order */
  deleteSignatory?: Maybe<DeleteSignatoryOutput>;
  /** Extends the expiration of the signature order. */
  extendSignatureOrder?: Maybe<ExtendSignatureOrderOutput>;
  /** Refreshes the client secret for an existing set of API credentials. Warning: The old client secret will stop working immediately. */
  refreshApplicationApiKey?: Maybe<RefreshApplicationApiKeyOutput>;
  /** Used by Signatory frontends to reject a signature order in full. */
  rejectSignatureOrder?: Maybe<RejectSignatureOrderOutput>;
  retrySignatureOrderWebhook?: Maybe<RetrySignatureOrderWebhookOutput>;
  /** Used by Signatory frontends to sign the documents in a signature order. */
  sign?: Maybe<SignOutput>;
  /** Sign with API credentials acting as a specific signatory. The signatory MUST be preapproved in this case. */
  signActingAs?: Maybe<SignActingAsOutput>;
  /** Signatory frontend use only. */
  signatoryBeacon?: Maybe<SignatoryBeaconOutput>;
  /** Signatory frontend use only. */
  startCriiptoVerifyEvidenceProvider?: Maybe<StartCriiptoVerifyEvidenceProviderOutput>;
  /** Signatory frontend use only. */
  trackSignatory?: Maybe<TrackSignatoryOutput>;
  /** Used by Signatory frontends to mark documents as opened, approved or rejected. */
  updateSignatoryDocumentStatus?: Maybe<UpdateSignatoryDocumentStatusOutput>;
  validateDocument?: Maybe<ValidateDocumentOutput>;
};

export type MutationAddSignatoriesArgs = {
  input: AddSignatoriesInput;
};

export type MutationAddSignatoryArgs = {
  input: AddSignatoryInput;
};

export type MutationCancelSignatureOrderArgs = {
  input: CancelSignatureOrderInput;
};

export type MutationChangeSignatoryArgs = {
  input: ChangeSignatoryInput;
};

export type MutationChangeSignatureOrderArgs = {
  input: ChangeSignatureOrderInput;
};

export type MutationCleanupSignatureOrderArgs = {
  input: CleanupSignatureOrderInput;
};

export type MutationCloseSignatureOrderArgs = {
  input: CloseSignatureOrderInput;
};

export type MutationCompleteCriiptoVerifyEvidenceProviderArgs = {
  input: CompleteCriiptoVerifyEvidenceProviderInput;
};

export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};

export type MutationCreateApplicationApiKeyArgs = {
  input: CreateApplicationApiKeyInput;
};

export type MutationCreateBatchSignatoryArgs = {
  input: CreateBatchSignatoryInput;
};

export type MutationCreateSignatureOrderArgs = {
  input: CreateSignatureOrderInput;
};

export type MutationDeleteApplicationApiKeyArgs = {
  input: DeleteApplicationApiKeyInput;
};

export type MutationDeleteSignatoryArgs = {
  input: DeleteSignatoryInput;
};

export type MutationExtendSignatureOrderArgs = {
  input: ExtendSignatureOrderInput;
};

export type MutationRefreshApplicationApiKeyArgs = {
  input: RefreshApplicationApiKeyInput;
};

export type MutationRejectSignatureOrderArgs = {
  input: RejectSignatureOrderInput;
};

export type MutationRetrySignatureOrderWebhookArgs = {
  input: RetrySignatureOrderWebhookInput;
};

export type MutationSignArgs = {
  input: SignInput;
};

export type MutationSignActingAsArgs = {
  input: SignActingAsInput;
};

export type MutationSignatoryBeaconArgs = {
  input: SignatoryBeaconInput;
};

export type MutationStartCriiptoVerifyEvidenceProviderArgs = {
  input: StartCriiptoVerifyEvidenceProviderInput;
};

export type MutationTrackSignatoryArgs = {
  input: TrackSignatoryInput;
};

export type MutationUpdateSignatoryDocumentStatusArgs = {
  input: UpdateSignatoryDocumentStatusInput;
};

export type MutationValidateDocumentArgs = {
  input: ValidateDocumentInput;
};

/** TEST only. Allows empty signatures for testing. */
export type NoopEvidenceProviderInput = {
  name: Scalars['String']['input'];
};

export type NoopSignatureEvidenceProvider = SignatureEvidenceProvider &
  SingleSignatureEvidenceProvider & {
    __typename?: 'NoopSignatureEvidenceProvider';
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
  };

/** OIDC/JWT based evidence for signatures. */
export type OidcEvidenceProviderInput = {
  acrValues?: InputMaybe<Array<Scalars['String']['input']>>;
  alwaysRedirect?: InputMaybe<Scalars['Boolean']['input']>;
  audience: Scalars['String']['input'];
  clientID: Scalars['String']['input'];
  domain: Scalars['String']['input'];
  name: Scalars['String']['input'];
  /** Enforces that signatories sign by unique evidence by comparing the values of previous evidence on the key you define. */
  uniqueEvidenceKey?: InputMaybe<Scalars['String']['input']>;
};

export type OidcJwtSignatureEvidenceProvider = SignatureEvidenceProvider &
  SingleSignatureEvidenceProvider & {
    __typename?: 'OidcJWTSignatureEvidenceProvider';
    acrValues: Array<Scalars['String']['output']>;
    alwaysRedirect: Scalars['Boolean']['output'];
    clientID: Scalars['String']['output'];
    domain: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
  };

export type PadesDocumentFormInput = {
  enabled: Scalars['Boolean']['input'];
};

export type PadesDocumentInput = {
  blob: Scalars['Blob']['input'];
  /** Will add a unique identifier for the document to the specified margin of each page. Useful when printing signed documents. */
  displayDocumentID?: InputMaybe<DocumentIdLocation>;
  form?: InputMaybe<PadesDocumentFormInput>;
  /** Will not be displayed to signatories, can be used as a reference to your own system. */
  reference?: InputMaybe<Scalars['String']['input']>;
  sealsPageTemplate?: InputMaybe<PadesDocumentSealsPageTemplateInput>;
  storageMode: DocumentStorageMode;
  title: Scalars['String']['input'];
};

export type PadesDocumentSealsPageTemplateInput = {
  /** Using the PDF coordinate system, with (x1, y1) being bottom-left */
  area: PdfBoundingBoxInput;
  /** Must be a PDF containing a SINGLE page */
  blob: Scalars['Blob']['input'];
  /** Validate that the defined seal area produces the expected number of columns, will error if expectation is not met */
  expectedColumns?: InputMaybe<Scalars['Int']['input']>;
  /** Validate that the defined seal area produces the expected number of rows, will error if expectation is not met */
  expectedRows?: InputMaybe<Scalars['Int']['input']>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PdfBoundingBoxInput = {
  x1: Scalars['Float']['input'];
  x2: Scalars['Float']['input'];
  y1: Scalars['Float']['input'];
  y2: Scalars['Float']['input'];
};

export type PdfDocument = Document & {
  __typename?: 'PdfDocument';
  blob?: Maybe<Scalars['Blob']['output']>;
  /** Same value as stamped on document when using displayDocumentID */
  documentID: Scalars['String']['output'];
  form?: Maybe<PdfDocumentForm>;
  id: Scalars['ID']['output'];
  originalBlob?: Maybe<Scalars['Blob']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  signatoryViewerStatus?: Maybe<SignatoryDocumentStatus>;
  signatures?: Maybe<Array<Signature>>;
  title: Scalars['String']['output'];
};

export type PdfDocumentForm = {
  __typename?: 'PdfDocumentForm';
  enabled: Scalars['Boolean']['output'];
};

export type PdfSealPosition = {
  page: Scalars['Int']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  application?: Maybe<Application>;
  batchSignatory?: Maybe<BatchSignatory>;
  document?: Maybe<Document>;
  /** Query a signatory by id. Useful when using webhooks. */
  signatory?: Maybe<Signatory>;
  signatureOrder?: Maybe<SignatureOrder>;
  /** Tenants are only accessable from user viewers */
  tenant?: Maybe<Tenant>;
  timezones: Array<Scalars['String']['output']>;
  viewer: Viewer;
};

export type QueryApplicationArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  verifyApplication?: InputMaybe<VerifyApplicationQueryInput>;
};

export type QueryBatchSignatoryArgs = {
  id: Scalars['ID']['input'];
};

export type QueryDocumentArgs = {
  id: Scalars['ID']['input'];
};

export type QuerySignatoryArgs = {
  id: Scalars['ID']['input'];
};

export type QuerySignatureOrderArgs = {
  id: Scalars['ID']['input'];
};

export type QueryTenantArgs = {
  id: Scalars['ID']['input'];
};

export type RefreshApplicationApiKeyInput = {
  apiKeyId: Scalars['ID']['input'];
  applicationId: Scalars['ID']['input'];
};

export type RefreshApplicationApiKeyOutput = {
  __typename?: 'RefreshApplicationApiKeyOutput';
  apiKey: ApplicationApiKey;
  application: Application;
};

export type RejectSignatureOrderInput = {
  dummy: Scalars['Boolean']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type RejectSignatureOrderOutput = {
  __typename?: 'RejectSignatureOrderOutput';
  viewer: Viewer;
};

export type RetrySignatureOrderWebhookInput = {
  retryPayload: Scalars['String']['input'];
  signatureOrderId: Scalars['ID']['input'];
};

export type RetrySignatureOrderWebhookOutput = {
  __typename?: 'RetrySignatureOrderWebhookOutput';
  invocation: WebhookInvocation;
};

export type SignActingAsInput = {
  evidence: SignInput;
  signatoryId: Scalars['ID']['input'];
};

export type SignActingAsOutput = {
  __typename?: 'SignActingAsOutput';
  signatory: Signatory;
  signatureOrder: SignatureOrder;
};

export type SignAllOfInput = {
  criiptoVerify?: InputMaybe<SignCriiptoVerifyInput>;
  criiptoVerifyV2?: InputMaybe<SignCriiptoVerifyV2Input>;
  drawable?: InputMaybe<SignDrawableInput>;
  noop?: InputMaybe<Scalars['Boolean']['input']>;
  oidc?: InputMaybe<SignOidcInput>;
};

export type SignCriiptoVerifyInput = {
  jwt: Scalars['String']['input'];
};

export type SignCriiptoVerifyV2Input = {
  code: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type SignDocumentFormFieldInput = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type SignDocumentFormInput = {
  fields: Array<SignDocumentFormFieldInput>;
};

export type SignDocumentInput = {
  form?: InputMaybe<SignDocumentFormInput>;
  id: Scalars['ID']['input'];
};

export type SignDrawableInput = {
  image: Scalars['Blob']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type SignInput = {
  allOf?: InputMaybe<SignAllOfInput>;
  criiptoVerify?: InputMaybe<SignCriiptoVerifyInput>;
  criiptoVerifyV2?: InputMaybe<SignCriiptoVerifyV2Input>;
  documents?: InputMaybe<Array<SignDocumentInput>>;
  drawable?: InputMaybe<SignDrawableInput>;
  /** EvidenceProvider id */
  id: Scalars['ID']['input'];
  noop?: InputMaybe<Scalars['Boolean']['input']>;
  oidc?: InputMaybe<SignOidcInput>;
};

export type SignOidcInput = {
  jwt: Scalars['String']['input'];
};

export type SignOutput = {
  __typename?: 'SignOutput';
  viewer: Viewer;
};

export type Signatory = {
  __typename?: 'Signatory';
  documents: SignatoryDocumentConnection;
  /** A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention. */
  downloadHref?: Maybe<Scalars['String']['output']>;
  evidenceProviders: Array<SignatureEvidenceProvider>;
  /** A link to the signatures frontend, you can send this link to your users to enable them to sign your documents. */
  href: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  reference?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  /** Signature order for the signatory. */
  signatureOrder: SignatureOrder;
  signingSequence: SignatorySigningSequence;
  spanId: Scalars['String']['output'];
  /** The current status of the signatory. */
  status: SignatoryStatus;
  /** The reason for the signatory status (rejection reason when rejected). */
  statusReason?: Maybe<Scalars['String']['output']>;
  /** The signature frontend authentication token, only required if you need to build a custom url. */
  token: Scalars['String']['output'];
  traceId: Scalars['String']['output'];
  ui: SignatureOrderUi;
};

export type SignatoryBeaconInput = {
  lastActionAt: Scalars['DateTime']['input'];
};

export type SignatoryBeaconOutput = {
  __typename?: 'SignatoryBeaconOutput';
  viewer: Viewer;
};

export type SignatoryDocumentConnection = {
  __typename?: 'SignatoryDocumentConnection';
  edges: Array<SignatoryDocumentEdge>;
};

export type SignatoryDocumentEdge = {
  __typename?: 'SignatoryDocumentEdge';
  node: Document;
  status?: Maybe<SignatoryDocumentStatus>;
};

export type SignatoryDocumentInput = {
  id: Scalars['ID']['input'];
  /** Define custom position for PDF seal. Uses PDF coordinate system (bottom-left as 0,0). If defined for one signatory/document, must be defined for all. */
  pdfSealPosition?: InputMaybe<PdfSealPosition>;
  preapproved?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SignatoryDocumentStatus =
  | 'APPROVED'
  | 'OPENED'
  | 'PREAPPROVED'
  | 'REJECTED'
  | 'SIGNED'
  | '%future added value';

export type SignatoryEvidenceProviderInput = {
  allOf?: InputMaybe<AllOfEvidenceProviderInput>;
  /** Criipto Verify based evidence for signatures. */
  criiptoVerify?: InputMaybe<CriiptoVerifyProviderInput>;
  /** Hand drawn signature evidence for signatures. */
  drawable?: InputMaybe<DrawableEvidenceProviderInput>;
  id: Scalars['ID']['input'];
  /** TEST environment only. Does not manipulate the PDF, use for integration or webhook testing. */
  noop?: InputMaybe<NoopEvidenceProviderInput>;
  /** Deprecated */
  oidc?: InputMaybe<OidcEvidenceProviderInput>;
};

export type SignatoryEvidenceValidationInput = {
  boolean?: InputMaybe<Scalars['Boolean']['input']>;
  key: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

export type SignatoryFrontendEvent =
  | 'DOWNLOAD_LINK_OPENED'
  | 'SIGN_LINK_OPENED'
  | '%future added value';

export type SignatorySigningSequence = {
  __typename?: 'SignatorySigningSequence';
  initialNumber: Scalars['Int']['output'];
};

export type SignatoryStatus =
  | 'DELETED'
  | 'ERROR'
  | 'OPEN'
  | 'REJECTED'
  | 'SIGNED'
  | '%future added value';

export type SignatoryUiInput = {
  /** Removes the UI options to reject a document or signature order. */
  disableRejection?: InputMaybe<Scalars['Boolean']['input']>;
  /** The language of texts rendered to the signatory. */
  language?: InputMaybe<Language>;
  /** Define a logo to be shown in the signatory UI. */
  logo?: InputMaybe<SignatureOrderUiLogoInput>;
  /** Renders a UI layer for PDF annotations, such as links, making them interactive in the UI/browser */
  renderPdfAnnotationLayer?: InputMaybe<Scalars['Boolean']['input']>;
  /** The signatory will be redirected to this URL after signing or rejected the signature order. */
  signatoryRedirectUri?: InputMaybe<Scalars['String']['input']>;
  /** Add stylesheet/css via an absolute HTTPS URL. */
  stylesheet?: InputMaybe<Scalars['String']['input']>;
};

export type SignatoryViewer = Viewer & {
  __typename?: 'SignatoryViewer';
  authenticated: Scalars['Boolean']['output'];
  documents: SignatoryDocumentConnection;
  download?: Maybe<SignatoryViewerDownload>;
  evidenceProviders: Array<SignatureEvidenceProvider>;
  id: Scalars['ID']['output'];
  signatoryId: Scalars['ID']['output'];
  signatureOrderStatus: SignatureOrderStatus;
  signer: Scalars['Boolean']['output'];
  status: SignatoryStatus;
  ui: SignatureOrderUi;
};

export type SignatoryViewerDownloadArgs = {
  verification?: InputMaybe<DownloadVerificationInput>;
};

export type SignatoryViewerDownload = {
  __typename?: 'SignatoryViewerDownload';
  documents?: Maybe<SignatoryDocumentConnection>;
  expired: Scalars['Boolean']['output'];
  verificationEvidenceProvider?: Maybe<SignatureEvidenceProvider>;
  verificationRequired: Scalars['Boolean']['output'];
};

/** Represents a signature on a document. */
export type Signature = {
  signatory?: Maybe<Signatory>;
};

export type SignatureAppearanceInput = {
  displayName?: InputMaybe<Array<SignatureAppearanceTemplateInput>>;
  footer?: InputMaybe<Array<SignatureAppearanceTemplateInput>>;
  headerLeft?: InputMaybe<Array<SignatureAppearanceTemplateInput>>;
  /** Render evidence claim as identifier in the signature appearance inside the document. You can supply multiple keys and they will be tried in order. If no key is found a GUID will be rendered. */
  identifierFromEvidence: Array<Scalars['String']['input']>;
};

export type SignatureAppearanceTemplateInput = {
  replacements?: InputMaybe<Array<SignatureAppearanceTemplateReplacementInput>>;
  template: Scalars['String']['input'];
};

export type SignatureAppearanceTemplateReplacementInput = {
  fromEvidence: Array<Scalars['String']['input']>;
  placeholder: Scalars['String']['input'];
};

export type SignatureEvidenceProvider = {
  id: Scalars['ID']['output'];
};

export type SignatureOrder = {
  __typename?: 'SignatureOrder';
  application?: Maybe<Application>;
  closedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  documents: Array<Document>;
  evidenceProviders: Array<SignatureEvidenceProvider>;
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Number of max signatories for the signature order */
  maxSignatories: Scalars['Int']['output'];
  /** List of signatories for the signature order. */
  signatories: Array<Signatory>;
  status: SignatureOrderStatus;
  /** Tenants are only accessable from user viewers */
  tenant?: Maybe<Tenant>;
  timezone: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  traceId: Scalars['String']['output'];
  ui: SignatureOrderUi;
  webhook?: Maybe<SignatureOrderWebhook>;
};

/** A connection from an object to a list of objects of type SignatureOrder */
export type SignatureOrderConnection = {
  __typename?: 'SignatureOrderConnection';
  /** Information to aid in pagination. */
  edges: Array<SignatureOrderEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A count of the total number of objects in this connection, ignoring pagination. This allows a client to fetch the first five objects by passing \"5\" as the argument to `first`, then fetch the total count so it could display \"5 of 83\", for example. In cases where we employ infinite scrolling or don't have an exact count of entries, this field will return `null`. */
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** An edge in a connection from an object to another object of type SignatureOrder */
export type SignatureOrderEdge = {
  __typename?: 'SignatureOrderEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. Must NOT be an enumerable collection. */
  node: SignatureOrder;
};

export type SignatureOrderStatus =
  | 'CANCELLED'
  | 'CLOSED'
  | 'EXPIRED'
  | 'OPEN'
  | '%future added value';

export type SignatureOrderUi = {
  __typename?: 'SignatureOrderUI';
  disableRejection: Scalars['Boolean']['output'];
  language: Language;
  logo?: Maybe<SignatureOrderUiLogo>;
  renderPdfAnnotationLayer: Scalars['Boolean']['output'];
  signatoryRedirectUri?: Maybe<Scalars['String']['output']>;
  stylesheet?: Maybe<Scalars['String']['output']>;
};

export type SignatureOrderUiLogo = {
  __typename?: 'SignatureOrderUILogo';
  href?: Maybe<Scalars['String']['output']>;
  src: Scalars['String']['output'];
};

export type SignatureOrderUiLogoInput = {
  /** Turns your logo into a link with the defined href. */
  href?: InputMaybe<Scalars['String']['input']>;
  /** The image source for the logo. Must be an absolute HTTPS URL or a valid data: url */
  src: Scalars['String']['input'];
};

export type SignatureOrderWebhook = {
  __typename?: 'SignatureOrderWebhook';
  logs: Array<WebhookInvocation>;
  url: Scalars['String']['output'];
};

export type SignatureOrderWebhookLogsArgs = {
  from: Scalars['String']['input'];
  succeeded?: InputMaybe<Scalars['Boolean']['input']>;
  to: Scalars['String']['input'];
};

/** Must define a evidence provider subsection. */
export type SingleEvidenceProviderInput = {
  /** Criipto Verify based evidence for signatures. */
  criiptoVerify?: InputMaybe<CriiptoVerifyProviderInput>;
  /** Hand drawn signature evidence for signatures. */
  drawable?: InputMaybe<DrawableEvidenceProviderInput>;
  /** TEST environment only. Does not manipulate the PDF, use for integration or webhook testing. */
  noop?: InputMaybe<NoopEvidenceProviderInput>;
  /** Deprecated */
  oidc?: InputMaybe<OidcEvidenceProviderInput>;
};

export type SingleSignature = {
  signatory?: Maybe<Signatory>;
};

export type SingleSignatureEvidenceProvider = {
  id: Scalars['ID']['output'];
};

export type StartCriiptoVerifyEvidenceProviderInput = {
  acrValue: Scalars['String']['input'];
  device?: InputMaybe<DeviceInput>;
  id: Scalars['ID']['input'];
  /** Use the id_token of a previous login to infer, for instance, reauthentication or other hints for the next login. */
  idTokenHint?: InputMaybe<Scalars['String']['input']>;
  redirectUri: Scalars['String']['input'];
  stage: EvidenceValidationStage;
};

export type StartCriiptoVerifyEvidenceProviderOutput = CriiptoVerifyEvidenceProviderRedirect;

export type Tenant = {
  __typename?: 'Tenant';
  applications: Array<Application>;
  id: Scalars['ID']['output'];
  webhookLogs: Array<WebhookInvocation>;
};

export type TenantApplicationsArgs = {
  domain?: InputMaybe<Scalars['String']['input']>;
};

export type TenantWebhookLogsArgs = {
  from: Scalars['String']['input'];
  succeeded?: InputMaybe<Scalars['Boolean']['input']>;
  to: Scalars['String']['input'];
};

export type TrackSignatoryInput = {
  event: SignatoryFrontendEvent;
};

export type TrackSignatoryOutput = {
  __typename?: 'TrackSignatoryOutput';
  viewer: Viewer;
};

export type UnvalidatedSignatoryViewer = Viewer & {
  __typename?: 'UnvalidatedSignatoryViewer';
  authenticated: Scalars['Boolean']['output'];
  download?: Maybe<SignatoryViewerDownload>;
  evidenceProviders: Array<SignatureEvidenceProvider>;
  id: Scalars['ID']['output'];
  signatoryId: Scalars['ID']['output'];
  ui: SignatureOrderUi;
};

export type UnvalidatedSignatoryViewerDownloadArgs = {
  verification?: InputMaybe<DownloadVerificationInput>;
};

export type UpdateSignatoryDocumentStatusInput = {
  documentId: Scalars['ID']['input'];
  status: SignatoryDocumentStatus;
};

export type UpdateSignatoryDocumentStatusOutput = {
  __typename?: 'UpdateSignatoryDocumentStatusOutput';
  documentEdge: SignatoryDocumentEdge;
  viewer: Viewer;
};

export type UserViewer = Viewer & {
  __typename?: 'UserViewer';
  authenticated: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  tenants: Array<Tenant>;
};

export type ValidateDocumentInput = {
  pdf?: InputMaybe<Scalars['Blob']['input']>;
  xml?: InputMaybe<Scalars['Blob']['input']>;
};

export type ValidateDocumentOutput = {
  __typename?: 'ValidateDocumentOutput';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  /** Whether or not the errors are fixable using 'fixDocumentFormattingErrors' */
  fixable?: Maybe<Scalars['Boolean']['output']>;
  /** `true` if the document contains signatures. If value is `null`, we were unable to determine whether the document has been previously signed. */
  previouslySigned?: Maybe<Scalars['Boolean']['output']>;
  valid: Scalars['Boolean']['output'];
};

export type VerifyApplication = {
  __typename?: 'VerifyApplication';
  domain: Scalars['String']['output'];
  environment: VerifyApplicationEnvironment;
  realm: Scalars['String']['output'];
};

export type VerifyApplicationEnvironment = 'PRODUCTION' | 'TEST' | '%future added value';

export type VerifyApplicationQueryInput = {
  domain: Scalars['String']['input'];
  realm: Scalars['String']['input'];
  tenantId: Scalars['ID']['input'];
};

export type Viewer = {
  id: Scalars['ID']['output'];
};

export type WebhookExceptionInvocation = WebhookInvocation & {
  __typename?: 'WebhookExceptionInvocation';
  correlationId: Scalars['String']['output'];
  event?: Maybe<WebhookInvocationEvent>;
  exception: Scalars['String']['output'];
  requestBody: Scalars['String']['output'];
  responseBody?: Maybe<Scalars['String']['output']>;
  retryPayload: Scalars['String']['output'];
  retryingAt?: Maybe<Scalars['String']['output']>;
  signatureOrderId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type WebhookHttpErrorInvocation = WebhookInvocation & {
  __typename?: 'WebhookHttpErrorInvocation';
  correlationId: Scalars['String']['output'];
  event?: Maybe<WebhookInvocationEvent>;
  requestBody: Scalars['String']['output'];
  responseBody?: Maybe<Scalars['String']['output']>;
  responseStatusCode: Scalars['Int']['output'];
  retryPayload: Scalars['String']['output'];
  retryingAt?: Maybe<Scalars['String']['output']>;
  signatureOrderId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type WebhookInvocation = {
  correlationId: Scalars['String']['output'];
  event?: Maybe<WebhookInvocationEvent>;
  requestBody: Scalars['String']['output'];
  responseBody?: Maybe<Scalars['String']['output']>;
  signatureOrderId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type WebhookInvocationEvent =
  | 'SIGNATORY_DOCUMENT_STATUS_CHANGED'
  | 'SIGNATORY_DOWNLOAD_LINK_OPENED'
  | 'SIGNATORY_REJECTED'
  | 'SIGNATORY_SIGNED'
  | 'SIGNATORY_SIGN_ERROR'
  | 'SIGNATORY_SIGN_LINK_OPENED'
  | 'SIGNATURE_ORDER_EXPIRED'
  | '%future added value';

export type WebhookSuccessfulInvocation = WebhookInvocation & {
  __typename?: 'WebhookSuccessfulInvocation';
  correlationId: Scalars['String']['output'];
  event?: Maybe<WebhookInvocationEvent>;
  requestBody: Scalars['String']['output'];
  responseBody?: Maybe<Scalars['String']['output']>;
  responseStatusCode: Scalars['Int']['output'];
  signatureOrderId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type WebhookTimeoutInvocation = WebhookInvocation & {
  __typename?: 'WebhookTimeoutInvocation';
  correlationId: Scalars['String']['output'];
  event?: Maybe<WebhookInvocationEvent>;
  requestBody: Scalars['String']['output'];
  responseBody?: Maybe<Scalars['String']['output']>;
  responseTimeout: Scalars['Int']['output'];
  retryPayload: Scalars['String']['output'];
  retryingAt?: Maybe<Scalars['String']['output']>;
  signatureOrderId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type XadesDocumentInput = {
  blob: Scalars['Blob']['input'];
  /** Will not be displayed to signatories, can be used as a reference to your own system. */
  reference?: InputMaybe<Scalars['String']['input']>;
  storageMode: DocumentStorageMode;
  title: Scalars['String']['input'];
};

export type XmlDocument = Document & {
  __typename?: 'XmlDocument';
  blob?: Maybe<Scalars['Blob']['output']>;
  id: Scalars['ID']['output'];
  originalBlob?: Maybe<Scalars['Blob']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  signatoryViewerStatus?: Maybe<SignatoryDocumentStatus>;
  signatures?: Maybe<Array<Signature>>;
  title: Scalars['String']['output'];
};

type BasicDocument_PdfDocument_Fragment = {
  __typename: 'PdfDocument';
  documentID: string;
  id: string;
  title: string;
  reference?: string | null;
  form?: { __typename?: 'PdfDocumentForm'; enabled: boolean } | null;
};

type BasicDocument_XmlDocument_Fragment = {
  __typename: 'XmlDocument';
  id: string;
  title: string;
  reference?: string | null;
};

export type BasicDocumentFragment =
  | BasicDocument_PdfDocument_Fragment
  | BasicDocument_XmlDocument_Fragment;

type SignedDocument_PdfDocument_Fragment = {
  __typename?: 'PdfDocument';
  id: string;
  title: string;
  blob?: Buffer | null;
  signatures?: Array<
    | {
        __typename: 'CompositeSignature';
        signatory?: { __typename?: 'Signatory'; id: string } | null;
      }
    | {
        __typename: 'DrawableSignature';
        name?: string | null;
        image: Buffer;
        signatory?: { __typename?: 'Signatory'; id: string } | null;
      }
    | { __typename: 'EmptySignature'; signatory?: { __typename?: 'Signatory'; id: string } | null }
    | {
        __typename: 'JWTSignature';
        jwt: string;
        jwks: string;
        claims: Array<{ __typename?: 'JWTClaim'; name: string; value: string }>;
        signatory?: { __typename?: 'Signatory'; id: string } | null;
      }
  > | null;
};

type SignedDocument_XmlDocument_Fragment = {
  __typename?: 'XmlDocument';
  id: string;
  title: string;
  blob?: Buffer | null;
  signatures?: Array<
    | {
        __typename: 'CompositeSignature';
        signatory?: { __typename?: 'Signatory'; id: string } | null;
      }
    | {
        __typename: 'DrawableSignature';
        name?: string | null;
        image: Buffer;
        signatory?: { __typename?: 'Signatory'; id: string } | null;
      }
    | { __typename: 'EmptySignature'; signatory?: { __typename?: 'Signatory'; id: string } | null }
    | {
        __typename: 'JWTSignature';
        jwt: string;
        jwks: string;
        claims: Array<{ __typename?: 'JWTClaim'; name: string; value: string }>;
        signatory?: { __typename?: 'Signatory'; id: string } | null;
      }
  > | null;
};

export type SignedDocumentFragment =
  | SignedDocument_PdfDocument_Fragment
  | SignedDocument_XmlDocument_Fragment;

export type BasicSignatoryFragment = {
  __typename?: 'Signatory';
  id: string;
  status: SignatoryStatus;
  statusReason?: string | null;
  href: string;
  downloadHref?: string | null;
  token: string;
  reference?: string | null;
  role?: string | null;
  signatureOrder: {
    __typename?: 'SignatureOrder';
    id: string;
    status: SignatureOrderStatus;
    closedAt?: string | null;
    expiresAt: string;
  };
  evidenceProviders: Array<
    | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
    | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
    | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
    | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
    | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
  >;
  documents: {
    __typename?: 'SignatoryDocumentConnection';
    edges: Array<{
      __typename?: 'SignatoryDocumentEdge';
      status?: SignatoryDocumentStatus | null;
      node: { __typename: 'PdfDocument'; id: string } | { __typename: 'XmlDocument'; id: string };
    }>;
  };
  signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
};

export type BasicSignatureOrderFragment = {
  __typename?: 'SignatureOrder';
  id: string;
  status: SignatureOrderStatus;
  title?: string | null;
  closedAt?: string | null;
  expiresAt: string;
  maxSignatories: number;
  signatories: Array<{
    __typename?: 'Signatory';
    id: string;
    status: SignatoryStatus;
    statusReason?: string | null;
    href: string;
    downloadHref?: string | null;
    token: string;
    reference?: string | null;
    role?: string | null;
    signatureOrder: {
      __typename?: 'SignatureOrder';
      id: string;
      status: SignatureOrderStatus;
      closedAt?: string | null;
      expiresAt: string;
    };
    evidenceProviders: Array<
      | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
      | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
      | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
      | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
      | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
    >;
    documents: {
      __typename?: 'SignatoryDocumentConnection';
      edges: Array<{
        __typename?: 'SignatoryDocumentEdge';
        status?: SignatoryDocumentStatus | null;
        node: { __typename: 'PdfDocument'; id: string } | { __typename: 'XmlDocument'; id: string };
      }>;
    };
    signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
  }>;
  evidenceProviders: Array<
    | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
    | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
    | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
    | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
    | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
  >;
};

export type BasicBatchSignatoryFragment = {
  __typename?: 'BatchSignatory';
  id: string;
  token: string;
  href: string;
};

export type CreateSignatureOrderMutationVariables = Exact<{
  input: CreateSignatureOrderInput;
}>;

export type CreateSignatureOrderMutation = {
  __typename?: 'Mutation';
  createSignatureOrder?: {
    __typename?: 'CreateSignatureOrderOutput';
    signatureOrder: {
      __typename?: 'SignatureOrder';
      id: string;
      status: SignatureOrderStatus;
      title?: string | null;
      closedAt?: string | null;
      expiresAt: string;
      maxSignatories: number;
      documents: Array<
        | {
            __typename: 'PdfDocument';
            documentID: string;
            id: string;
            title: string;
            reference?: string | null;
            form?: { __typename?: 'PdfDocumentForm'; enabled: boolean } | null;
          }
        | { __typename: 'XmlDocument'; id: string; title: string; reference?: string | null }
      >;
      signatories: Array<{
        __typename?: 'Signatory';
        id: string;
        status: SignatoryStatus;
        statusReason?: string | null;
        href: string;
        downloadHref?: string | null;
        token: string;
        reference?: string | null;
        role?: string | null;
        signatureOrder: {
          __typename?: 'SignatureOrder';
          id: string;
          status: SignatureOrderStatus;
          closedAt?: string | null;
          expiresAt: string;
        };
        evidenceProviders: Array<
          | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
          | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
          | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
          | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
          | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
        >;
        documents: {
          __typename?: 'SignatoryDocumentConnection';
          edges: Array<{
            __typename?: 'SignatoryDocumentEdge';
            status?: SignatoryDocumentStatus | null;
            node:
              | { __typename: 'PdfDocument'; id: string }
              | { __typename: 'XmlDocument'; id: string };
          }>;
        };
        signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
      }>;
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
    };
  } | null;
};

export type CleanupSignatureOrderMutationVariables = Exact<{
  input: CleanupSignatureOrderInput;
}>;

export type CleanupSignatureOrderMutation = {
  __typename?: 'Mutation';
  cleanupSignatureOrder?: {
    __typename?: 'CleanupSignatureOrderOutput';
    signatureOrder: {
      __typename?: 'SignatureOrder';
      id: string;
      status: SignatureOrderStatus;
      title?: string | null;
      closedAt?: string | null;
      expiresAt: string;
      maxSignatories: number;
      documents: Array<
        | {
            __typename: 'PdfDocument';
            documentID: string;
            id: string;
            title: string;
            reference?: string | null;
            form?: { __typename?: 'PdfDocumentForm'; enabled: boolean } | null;
          }
        | { __typename: 'XmlDocument'; id: string; title: string; reference?: string | null }
      >;
      signatories: Array<{
        __typename?: 'Signatory';
        id: string;
        status: SignatoryStatus;
        statusReason?: string | null;
        href: string;
        downloadHref?: string | null;
        token: string;
        reference?: string | null;
        role?: string | null;
        signatureOrder: {
          __typename?: 'SignatureOrder';
          id: string;
          status: SignatureOrderStatus;
          closedAt?: string | null;
          expiresAt: string;
        };
        evidenceProviders: Array<
          | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
          | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
          | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
          | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
          | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
        >;
        documents: {
          __typename?: 'SignatoryDocumentConnection';
          edges: Array<{
            __typename?: 'SignatoryDocumentEdge';
            status?: SignatoryDocumentStatus | null;
            node:
              | { __typename: 'PdfDocument'; id: string }
              | { __typename: 'XmlDocument'; id: string };
          }>;
        };
        signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
      }>;
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
    };
  } | null;
};

export type AddSignatoryMutationVariables = Exact<{
  input: AddSignatoryInput;
}>;

export type AddSignatoryMutation = {
  __typename?: 'Mutation';
  addSignatory?: {
    __typename?: 'AddSignatoryOutput';
    signatory: {
      __typename?: 'Signatory';
      id: string;
      status: SignatoryStatus;
      statusReason?: string | null;
      href: string;
      downloadHref?: string | null;
      token: string;
      reference?: string | null;
      role?: string | null;
      signatureOrder: {
        __typename?: 'SignatureOrder';
        id: string;
        status: SignatureOrderStatus;
        closedAt?: string | null;
        expiresAt: string;
      };
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
      documents: {
        __typename?: 'SignatoryDocumentConnection';
        edges: Array<{
          __typename?: 'SignatoryDocumentEdge';
          status?: SignatoryDocumentStatus | null;
          node:
            | { __typename: 'PdfDocument'; id: string }
            | { __typename: 'XmlDocument'; id: string };
        }>;
      };
      signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
    };
  } | null;
};

export type AddSignatoriesMutationVariables = Exact<{
  input: AddSignatoriesInput;
}>;

export type AddSignatoriesMutation = {
  __typename?: 'Mutation';
  addSignatories?: {
    __typename?: 'AddSignatoriesOutput';
    signatories: Array<{
      __typename?: 'Signatory';
      id: string;
      status: SignatoryStatus;
      statusReason?: string | null;
      href: string;
      downloadHref?: string | null;
      token: string;
      reference?: string | null;
      role?: string | null;
      signatureOrder: {
        __typename?: 'SignatureOrder';
        id: string;
        status: SignatureOrderStatus;
        closedAt?: string | null;
        expiresAt: string;
      };
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
      documents: {
        __typename?: 'SignatoryDocumentConnection';
        edges: Array<{
          __typename?: 'SignatoryDocumentEdge';
          status?: SignatoryDocumentStatus | null;
          node:
            | { __typename: 'PdfDocument'; id: string }
            | { __typename: 'XmlDocument'; id: string };
        }>;
      };
      signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
    }>;
  } | null;
};

export type ChangeSignatoryMutationVariables = Exact<{
  input: ChangeSignatoryInput;
}>;

export type ChangeSignatoryMutation = {
  __typename?: 'Mutation';
  changeSignatory?: {
    __typename?: 'ChangeSignatoryOutput';
    signatory: {
      __typename?: 'Signatory';
      id: string;
      status: SignatoryStatus;
      statusReason?: string | null;
      href: string;
      downloadHref?: string | null;
      token: string;
      reference?: string | null;
      role?: string | null;
      signatureOrder: {
        __typename?: 'SignatureOrder';
        id: string;
        status: SignatureOrderStatus;
        closedAt?: string | null;
        expiresAt: string;
      };
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
      documents: {
        __typename?: 'SignatoryDocumentConnection';
        edges: Array<{
          __typename?: 'SignatoryDocumentEdge';
          status?: SignatoryDocumentStatus | null;
          node:
            | { __typename: 'PdfDocument'; id: string }
            | { __typename: 'XmlDocument'; id: string };
        }>;
      };
      signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
    };
  } | null;
};

export type CloseSignatureOrderMutationVariables = Exact<{
  input: CloseSignatureOrderInput;
}>;

export type CloseSignatureOrderMutation = {
  __typename?: 'Mutation';
  closeSignatureOrder?: {
    __typename?: 'CloseSignatureOrderOutput';
    signatureOrder: {
      __typename?: 'SignatureOrder';
      id: string;
      status: SignatureOrderStatus;
      title?: string | null;
      closedAt?: string | null;
      expiresAt: string;
      maxSignatories: number;
      documents: Array<
        | {
            __typename: 'PdfDocument';
            documentID: string;
            id: string;
            title: string;
            reference?: string | null;
            blob?: Buffer | null;
            form?: { __typename?: 'PdfDocumentForm'; enabled: boolean } | null;
            signatures?: Array<
              | {
                  __typename: 'CompositeSignature';
                  signatory?: { __typename?: 'Signatory'; id: string } | null;
                }
              | {
                  __typename: 'DrawableSignature';
                  name?: string | null;
                  image: Buffer;
                  signatory?: { __typename?: 'Signatory'; id: string } | null;
                }
              | {
                  __typename: 'EmptySignature';
                  signatory?: { __typename?: 'Signatory'; id: string } | null;
                }
              | {
                  __typename: 'JWTSignature';
                  jwt: string;
                  jwks: string;
                  claims: Array<{ __typename?: 'JWTClaim'; name: string; value: string }>;
                  signatory?: { __typename?: 'Signatory'; id: string } | null;
                }
            > | null;
          }
        | {
            __typename: 'XmlDocument';
            id: string;
            title: string;
            reference?: string | null;
            blob?: Buffer | null;
            signatures?: Array<
              | {
                  __typename: 'CompositeSignature';
                  signatory?: { __typename?: 'Signatory'; id: string } | null;
                }
              | {
                  __typename: 'DrawableSignature';
                  name?: string | null;
                  image: Buffer;
                  signatory?: { __typename?: 'Signatory'; id: string } | null;
                }
              | {
                  __typename: 'EmptySignature';
                  signatory?: { __typename?: 'Signatory'; id: string } | null;
                }
              | {
                  __typename: 'JWTSignature';
                  jwt: string;
                  jwks: string;
                  claims: Array<{ __typename?: 'JWTClaim'; name: string; value: string }>;
                  signatory?: { __typename?: 'Signatory'; id: string } | null;
                }
            > | null;
          }
      >;
      signatories: Array<{
        __typename?: 'Signatory';
        id: string;
        status: SignatoryStatus;
        statusReason?: string | null;
        href: string;
        downloadHref?: string | null;
        token: string;
        reference?: string | null;
        role?: string | null;
        signatureOrder: {
          __typename?: 'SignatureOrder';
          id: string;
          status: SignatureOrderStatus;
          closedAt?: string | null;
          expiresAt: string;
        };
        evidenceProviders: Array<
          | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
          | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
          | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
          | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
          | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
        >;
        documents: {
          __typename?: 'SignatoryDocumentConnection';
          edges: Array<{
            __typename?: 'SignatoryDocumentEdge';
            status?: SignatoryDocumentStatus | null;
            node:
              | { __typename: 'PdfDocument'; id: string }
              | { __typename: 'XmlDocument'; id: string };
          }>;
        };
        signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
      }>;
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
    };
  } | null;
};

export type CancelSignatureOrderMutationVariables = Exact<{
  input: CancelSignatureOrderInput;
}>;

export type CancelSignatureOrderMutation = {
  __typename?: 'Mutation';
  cancelSignatureOrder?: {
    __typename?: 'CancelSignatureOrderOutput';
    signatureOrder: {
      __typename?: 'SignatureOrder';
      id: string;
      status: SignatureOrderStatus;
      title?: string | null;
      closedAt?: string | null;
      expiresAt: string;
      maxSignatories: number;
      documents: Array<
        | {
            __typename: 'PdfDocument';
            documentID: string;
            id: string;
            title: string;
            reference?: string | null;
            form?: { __typename?: 'PdfDocumentForm'; enabled: boolean } | null;
          }
        | { __typename: 'XmlDocument'; id: string; title: string; reference?: string | null }
      >;
      signatories: Array<{
        __typename?: 'Signatory';
        id: string;
        status: SignatoryStatus;
        statusReason?: string | null;
        href: string;
        downloadHref?: string | null;
        token: string;
        reference?: string | null;
        role?: string | null;
        signatureOrder: {
          __typename?: 'SignatureOrder';
          id: string;
          status: SignatureOrderStatus;
          closedAt?: string | null;
          expiresAt: string;
        };
        evidenceProviders: Array<
          | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
          | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
          | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
          | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
          | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
        >;
        documents: {
          __typename?: 'SignatoryDocumentConnection';
          edges: Array<{
            __typename?: 'SignatoryDocumentEdge';
            status?: SignatoryDocumentStatus | null;
            node:
              | { __typename: 'PdfDocument'; id: string }
              | { __typename: 'XmlDocument'; id: string };
          }>;
        };
        signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
      }>;
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
    };
  } | null;
};

export type SignActingAsMutationVariables = Exact<{
  input: SignActingAsInput;
}>;

export type SignActingAsMutation = {
  __typename?: 'Mutation';
  signActingAs?: {
    __typename?: 'SignActingAsOutput';
    signatory: {
      __typename?: 'Signatory';
      id: string;
      status: SignatoryStatus;
      statusReason?: string | null;
      href: string;
      downloadHref?: string | null;
      token: string;
      reference?: string | null;
      role?: string | null;
      signatureOrder: {
        __typename?: 'SignatureOrder';
        id: string;
        status: SignatureOrderStatus;
        closedAt?: string | null;
        expiresAt: string;
      };
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
      documents: {
        __typename?: 'SignatoryDocumentConnection';
        edges: Array<{
          __typename?: 'SignatoryDocumentEdge';
          status?: SignatoryDocumentStatus | null;
          node:
            | { __typename: 'PdfDocument'; id: string }
            | { __typename: 'XmlDocument'; id: string };
        }>;
      };
      signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
    };
  } | null;
};

export type ValidateDocumentMutationVariables = Exact<{
  input: ValidateDocumentInput;
}>;

export type ValidateDocumentMutation = {
  __typename?: 'Mutation';
  validateDocument?: {
    __typename?: 'ValidateDocumentOutput';
    valid: boolean;
    errors?: Array<string> | null;
    fixable?: boolean | null;
  } | null;
};

export type ExtendSignatureOrderMutationVariables = Exact<{
  input: ExtendSignatureOrderInput;
}>;

export type ExtendSignatureOrderMutation = {
  __typename?: 'Mutation';
  extendSignatureOrder?: {
    __typename?: 'ExtendSignatureOrderOutput';
    signatureOrder: {
      __typename?: 'SignatureOrder';
      id: string;
      status: SignatureOrderStatus;
      title?: string | null;
      closedAt?: string | null;
      expiresAt: string;
      maxSignatories: number;
      documents: Array<
        | {
            __typename: 'PdfDocument';
            documentID: string;
            id: string;
            title: string;
            reference?: string | null;
            form?: { __typename?: 'PdfDocumentForm'; enabled: boolean } | null;
          }
        | { __typename: 'XmlDocument'; id: string; title: string; reference?: string | null }
      >;
      signatories: Array<{
        __typename?: 'Signatory';
        id: string;
        status: SignatoryStatus;
        statusReason?: string | null;
        href: string;
        downloadHref?: string | null;
        token: string;
        reference?: string | null;
        role?: string | null;
        signatureOrder: {
          __typename?: 'SignatureOrder';
          id: string;
          status: SignatureOrderStatus;
          closedAt?: string | null;
          expiresAt: string;
        };
        evidenceProviders: Array<
          | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
          | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
          | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
          | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
          | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
        >;
        documents: {
          __typename?: 'SignatoryDocumentConnection';
          edges: Array<{
            __typename?: 'SignatoryDocumentEdge';
            status?: SignatoryDocumentStatus | null;
            node:
              | { __typename: 'PdfDocument'; id: string }
              | { __typename: 'XmlDocument'; id: string };
          }>;
        };
        signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
      }>;
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
    };
  } | null;
};

export type DeleteSignatoryMutationVariables = Exact<{
  input: DeleteSignatoryInput;
}>;

export type DeleteSignatoryMutation = {
  __typename?: 'Mutation';
  deleteSignatory?: {
    __typename?: 'DeleteSignatoryOutput';
    signatureOrder: {
      __typename?: 'SignatureOrder';
      id: string;
      status: SignatureOrderStatus;
      title?: string | null;
      closedAt?: string | null;
      expiresAt: string;
      maxSignatories: number;
      signatories: Array<{
        __typename?: 'Signatory';
        id: string;
        status: SignatoryStatus;
        statusReason?: string | null;
        href: string;
        downloadHref?: string | null;
        token: string;
        reference?: string | null;
        role?: string | null;
        signatureOrder: {
          __typename?: 'SignatureOrder';
          id: string;
          status: SignatureOrderStatus;
          closedAt?: string | null;
          expiresAt: string;
        };
        evidenceProviders: Array<
          | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
          | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
          | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
          | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
          | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
        >;
        documents: {
          __typename?: 'SignatoryDocumentConnection';
          edges: Array<{
            __typename?: 'SignatoryDocumentEdge';
            status?: SignatoryDocumentStatus | null;
            node:
              | { __typename: 'PdfDocument'; id: string }
              | { __typename: 'XmlDocument'; id: string };
          }>;
        };
        signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
      }>;
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
    };
  } | null;
};

export type CreateBatchSignatoryMutationVariables = Exact<{
  input: CreateBatchSignatoryInput;
}>;

export type CreateBatchSignatoryMutation = {
  __typename?: 'Mutation';
  createBatchSignatory?: {
    __typename?: 'CreateBatchSignatoryOutput';
    batchSignatory: {
      __typename?: 'BatchSignatory';
      id: string;
      token: string;
      href: string;
      items: Array<{
        __typename?: 'BatchSignatoryItem';
        signatureOrder: {
          __typename?: 'SignatureOrder';
          id: string;
          status: SignatureOrderStatus;
          title?: string | null;
          closedAt?: string | null;
          expiresAt: string;
          maxSignatories: number;
          signatories: Array<{
            __typename?: 'Signatory';
            id: string;
            status: SignatoryStatus;
            statusReason?: string | null;
            href: string;
            downloadHref?: string | null;
            token: string;
            reference?: string | null;
            role?: string | null;
            signatureOrder: {
              __typename?: 'SignatureOrder';
              id: string;
              status: SignatureOrderStatus;
              closedAt?: string | null;
              expiresAt: string;
            };
            evidenceProviders: Array<
              | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
              | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
              | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
              | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
              | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
            >;
            documents: {
              __typename?: 'SignatoryDocumentConnection';
              edges: Array<{
                __typename?: 'SignatoryDocumentEdge';
                status?: SignatoryDocumentStatus | null;
                node:
                  | { __typename: 'PdfDocument'; id: string }
                  | { __typename: 'XmlDocument'; id: string };
              }>;
            };
            signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
          }>;
          evidenceProviders: Array<
            | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
            | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
            | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
            | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
            | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
          >;
        };
        signatory: {
          __typename?: 'Signatory';
          id: string;
          status: SignatoryStatus;
          statusReason?: string | null;
          href: string;
          downloadHref?: string | null;
          token: string;
          reference?: string | null;
          role?: string | null;
          signatureOrder: {
            __typename?: 'SignatureOrder';
            id: string;
            status: SignatureOrderStatus;
            closedAt?: string | null;
            expiresAt: string;
          };
          evidenceProviders: Array<
            | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
            | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
            | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
            | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
            | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
          >;
          documents: {
            __typename?: 'SignatoryDocumentConnection';
            edges: Array<{
              __typename?: 'SignatoryDocumentEdge';
              status?: SignatoryDocumentStatus | null;
              node:
                | { __typename: 'PdfDocument'; id: string }
                | { __typename: 'XmlDocument'; id: string };
            }>;
          };
          signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
        };
      }>;
    };
  } | null;
};

export type ChangeSignatureOrderMutationVariables = Exact<{
  input: ChangeSignatureOrderInput;
}>;

export type ChangeSignatureOrderMutation = {
  __typename?: 'Mutation';
  changeSignatureOrder?: {
    __typename?: 'ChangeSignatureOrderOutput';
    signatureOrder: {
      __typename?: 'SignatureOrder';
      id: string;
      status: SignatureOrderStatus;
      title?: string | null;
      closedAt?: string | null;
      expiresAt: string;
      maxSignatories: number;
      signatories: Array<{
        __typename?: 'Signatory';
        id: string;
        status: SignatoryStatus;
        statusReason?: string | null;
        href: string;
        downloadHref?: string | null;
        token: string;
        reference?: string | null;
        role?: string | null;
        signatureOrder: {
          __typename?: 'SignatureOrder';
          id: string;
          status: SignatureOrderStatus;
          closedAt?: string | null;
          expiresAt: string;
        };
        evidenceProviders: Array<
          | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
          | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
          | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
          | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
          | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
        >;
        documents: {
          __typename?: 'SignatoryDocumentConnection';
          edges: Array<{
            __typename?: 'SignatoryDocumentEdge';
            status?: SignatoryDocumentStatus | null;
            node:
              | { __typename: 'PdfDocument'; id: string }
              | { __typename: 'XmlDocument'; id: string };
          }>;
        };
        signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
      }>;
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
    };
  } | null;
};

export type SignatureOrderQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type SignatureOrderQuery = {
  __typename?: 'Query';
  signatureOrder?: {
    __typename?: 'SignatureOrder';
    id: string;
    status: SignatureOrderStatus;
    title?: string | null;
    closedAt?: string | null;
    expiresAt: string;
    maxSignatories: number;
    signatories: Array<{
      __typename?: 'Signatory';
      id: string;
      status: SignatoryStatus;
      statusReason?: string | null;
      href: string;
      downloadHref?: string | null;
      token: string;
      reference?: string | null;
      role?: string | null;
      signatureOrder: {
        __typename?: 'SignatureOrder';
        id: string;
        status: SignatureOrderStatus;
        closedAt?: string | null;
        expiresAt: string;
      };
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
      documents: {
        __typename?: 'SignatoryDocumentConnection';
        edges: Array<{
          __typename?: 'SignatoryDocumentEdge';
          status?: SignatoryDocumentStatus | null;
          node:
            | { __typename: 'PdfDocument'; id: string }
            | { __typename: 'XmlDocument'; id: string };
        }>;
      };
      signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
    }>;
    evidenceProviders: Array<
      | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
      | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
      | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
      | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
      | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
    >;
  } | null;
};

export type SignatureOrderWithDocumentsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type SignatureOrderWithDocumentsQuery = {
  __typename?: 'Query';
  signatureOrder?: {
    __typename?: 'SignatureOrder';
    id: string;
    status: SignatureOrderStatus;
    title?: string | null;
    closedAt?: string | null;
    expiresAt: string;
    maxSignatories: number;
    documents: Array<
      | {
          __typename: 'PdfDocument';
          documentID: string;
          id: string;
          title: string;
          reference?: string | null;
          blob?: Buffer | null;
          form?: { __typename?: 'PdfDocumentForm'; enabled: boolean } | null;
          signatures?: Array<
            | {
                __typename: 'CompositeSignature';
                signatory?: { __typename?: 'Signatory'; id: string } | null;
              }
            | {
                __typename: 'DrawableSignature';
                name?: string | null;
                image: Buffer;
                signatory?: { __typename?: 'Signatory'; id: string } | null;
              }
            | {
                __typename: 'EmptySignature';
                signatory?: { __typename?: 'Signatory'; id: string } | null;
              }
            | {
                __typename: 'JWTSignature';
                jwt: string;
                jwks: string;
                claims: Array<{ __typename?: 'JWTClaim'; name: string; value: string }>;
                signatory?: { __typename?: 'Signatory'; id: string } | null;
              }
          > | null;
        }
      | {
          __typename: 'XmlDocument';
          id: string;
          title: string;
          reference?: string | null;
          blob?: Buffer | null;
          signatures?: Array<
            | {
                __typename: 'CompositeSignature';
                signatory?: { __typename?: 'Signatory'; id: string } | null;
              }
            | {
                __typename: 'DrawableSignature';
                name?: string | null;
                image: Buffer;
                signatory?: { __typename?: 'Signatory'; id: string } | null;
              }
            | {
                __typename: 'EmptySignature';
                signatory?: { __typename?: 'Signatory'; id: string } | null;
              }
            | {
                __typename: 'JWTSignature';
                jwt: string;
                jwks: string;
                claims: Array<{ __typename?: 'JWTClaim'; name: string; value: string }>;
                signatory?: { __typename?: 'Signatory'; id: string } | null;
              }
          > | null;
        }
    >;
    signatories: Array<{
      __typename?: 'Signatory';
      id: string;
      status: SignatoryStatus;
      statusReason?: string | null;
      href: string;
      downloadHref?: string | null;
      token: string;
      reference?: string | null;
      role?: string | null;
      signatureOrder: {
        __typename?: 'SignatureOrder';
        id: string;
        status: SignatureOrderStatus;
        closedAt?: string | null;
        expiresAt: string;
      };
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
      documents: {
        __typename?: 'SignatoryDocumentConnection';
        edges: Array<{
          __typename?: 'SignatoryDocumentEdge';
          status?: SignatoryDocumentStatus | null;
          node:
            | { __typename: 'PdfDocument'; id: string }
            | { __typename: 'XmlDocument'; id: string };
        }>;
      };
      signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
    }>;
    evidenceProviders: Array<
      | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
      | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
      | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
      | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
      | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
    >;
  } | null;
};

export type SignatoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type SignatoryQuery = {
  __typename?: 'Query';
  signatory?: {
    __typename?: 'Signatory';
    id: string;
    status: SignatoryStatus;
    statusReason?: string | null;
    href: string;
    downloadHref?: string | null;
    token: string;
    reference?: string | null;
    role?: string | null;
    signatureOrder: {
      __typename?: 'SignatureOrder';
      id: string;
      status: SignatureOrderStatus;
      closedAt?: string | null;
      expiresAt: string;
      title?: string | null;
      maxSignatories: number;
      signatories: Array<{
        __typename?: 'Signatory';
        id: string;
        status: SignatoryStatus;
        statusReason?: string | null;
        href: string;
        downloadHref?: string | null;
        token: string;
        reference?: string | null;
        role?: string | null;
        signatureOrder: {
          __typename?: 'SignatureOrder';
          id: string;
          status: SignatureOrderStatus;
          closedAt?: string | null;
          expiresAt: string;
        };
        evidenceProviders: Array<
          | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
          | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
          | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
          | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
          | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
        >;
        documents: {
          __typename?: 'SignatoryDocumentConnection';
          edges: Array<{
            __typename?: 'SignatoryDocumentEdge';
            status?: SignatoryDocumentStatus | null;
            node:
              | { __typename: 'PdfDocument'; id: string }
              | { __typename: 'XmlDocument'; id: string };
          }>;
        };
        signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
      }>;
      evidenceProviders: Array<
        | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
        | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
        | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
        | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
        | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
      >;
    };
    evidenceProviders: Array<
      | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
      | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
      | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
      | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
      | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
    >;
    documents: {
      __typename?: 'SignatoryDocumentConnection';
      edges: Array<{
        __typename?: 'SignatoryDocumentEdge';
        status?: SignatoryDocumentStatus | null;
        node: { __typename: 'PdfDocument'; id: string } | { __typename: 'XmlDocument'; id: string };
      }>;
    };
    signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
  } | null;
};

export type SignatureOrdersQueryVariables = Exact<{
  status?: InputMaybe<SignatureOrderStatus>;
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type SignatureOrdersQuery = {
  __typename?: 'Query';
  viewer:
    | { __typename: 'AnonymousViewer' }
    | {
        __typename: 'Application';
        signatureOrders: {
          __typename?: 'SignatureOrderConnection';
          edges: Array<{
            __typename?: 'SignatureOrderEdge';
            node: {
              __typename?: 'SignatureOrder';
              id: string;
              status: SignatureOrderStatus;
              title?: string | null;
              closedAt?: string | null;
              expiresAt: string;
              maxSignatories: number;
              signatories: Array<{
                __typename?: 'Signatory';
                id: string;
                status: SignatoryStatus;
                statusReason?: string | null;
                href: string;
                downloadHref?: string | null;
                token: string;
                reference?: string | null;
                role?: string | null;
                signatureOrder: {
                  __typename?: 'SignatureOrder';
                  id: string;
                  status: SignatureOrderStatus;
                  closedAt?: string | null;
                  expiresAt: string;
                };
                evidenceProviders: Array<
                  | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
                  | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
                  | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
                  | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
                  | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
                >;
                documents: {
                  __typename?: 'SignatoryDocumentConnection';
                  edges: Array<{
                    __typename?: 'SignatoryDocumentEdge';
                    status?: SignatoryDocumentStatus | null;
                    node:
                      | { __typename: 'PdfDocument'; id: string }
                      | { __typename: 'XmlDocument'; id: string };
                  }>;
                };
                signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
              }>;
              evidenceProviders: Array<
                | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
                | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
                | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
                | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
                | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
              >;
            };
          }>;
        };
      }
    | { __typename: 'BatchSignatoryViewer' }
    | { __typename: 'SignatoryViewer' }
    | { __typename: 'UnvalidatedSignatoryViewer' }
    | { __typename: 'UserViewer' };
};

export type BatchSignatoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type BatchSignatoryQuery = {
  __typename?: 'Query';
  batchSignatory?: {
    __typename?: 'BatchSignatory';
    id: string;
    token: string;
    href: string;
    items: Array<{
      __typename?: 'BatchSignatoryItem';
      signatureOrder: {
        __typename?: 'SignatureOrder';
        id: string;
        status: SignatureOrderStatus;
        title?: string | null;
        closedAt?: string | null;
        expiresAt: string;
        maxSignatories: number;
        signatories: Array<{
          __typename?: 'Signatory';
          id: string;
          status: SignatoryStatus;
          statusReason?: string | null;
          href: string;
          downloadHref?: string | null;
          token: string;
          reference?: string | null;
          role?: string | null;
          signatureOrder: {
            __typename?: 'SignatureOrder';
            id: string;
            status: SignatureOrderStatus;
            closedAt?: string | null;
            expiresAt: string;
          };
          evidenceProviders: Array<
            | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
            | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
            | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
            | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
            | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
          >;
          documents: {
            __typename?: 'SignatoryDocumentConnection';
            edges: Array<{
              __typename?: 'SignatoryDocumentEdge';
              status?: SignatoryDocumentStatus | null;
              node:
                | { __typename: 'PdfDocument'; id: string }
                | { __typename: 'XmlDocument'; id: string };
            }>;
          };
          signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
        }>;
        evidenceProviders: Array<
          | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
          | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
          | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
          | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
          | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
        >;
      };
      signatory: {
        __typename?: 'Signatory';
        id: string;
        status: SignatoryStatus;
        statusReason?: string | null;
        href: string;
        downloadHref?: string | null;
        token: string;
        reference?: string | null;
        role?: string | null;
        signatureOrder: {
          __typename?: 'SignatureOrder';
          id: string;
          status: SignatureOrderStatus;
          closedAt?: string | null;
          expiresAt: string;
        };
        evidenceProviders: Array<
          | { __typename: 'AllOfSignatureEvidenceProvider'; id: string }
          | { __typename: 'CriiptoVerifySignatureEvidenceProvider'; id: string }
          | { __typename: 'DrawableSignatureEvidenceProvider'; id: string }
          | { __typename: 'NoopSignatureEvidenceProvider'; id: string }
          | { __typename: 'OidcJWTSignatureEvidenceProvider'; id: string }
        >;
        documents: {
          __typename?: 'SignatoryDocumentConnection';
          edges: Array<{
            __typename?: 'SignatoryDocumentEdge';
            status?: SignatoryDocumentStatus | null;
            node:
              | { __typename: 'PdfDocument'; id: string }
              | { __typename: 'XmlDocument'; id: string };
          }>;
        };
        signingSequence: { __typename?: 'SignatorySigningSequence'; initialNumber: number };
      };
    }>;
  } | null;
};

export const BasicDocumentFragmentDoc = gql`
  fragment BasicDocument on Document {
    __typename
    id
    title
    reference
    ... on PdfDocument {
      documentID
      form {
        enabled
      }
    }
  }
`;
export const SignedDocumentFragmentDoc = gql`
  fragment SignedDocument on Document {
    id
    title
    blob
    signatures {
      __typename
      signatory {
        id
      }
      ... on JWTSignature {
        jwt
        jwks
        claims {
          name
          value
        }
      }
      ... on DrawableSignature {
        name
        image
      }
    }
  }
`;
export const BasicSignatoryFragmentDoc = gql`
  fragment BasicSignatory on Signatory {
    id
    status
    statusReason
    href
    downloadHref
    token
    reference
    role
    signatureOrder {
      id
      status
      closedAt
      expiresAt
    }
    evidenceProviders {
      __typename
      id
    }
    documents {
      edges {
        status
        node {
          __typename
          id
        }
      }
    }
    signingSequence {
      initialNumber
    }
  }
`;
export const BasicSignatureOrderFragmentDoc = gql`
  fragment BasicSignatureOrder on SignatureOrder {
    id
    status
    title
    closedAt
    expiresAt
    maxSignatories
    signatories {
      ...BasicSignatory
    }
    evidenceProviders {
      __typename
      id
    }
  }
  ${BasicSignatoryFragmentDoc}
`;
export const BasicBatchSignatoryFragmentDoc = gql`
  fragment BasicBatchSignatory on BatchSignatory {
    id
    token
    href
  }
`;
export const CreateSignatureOrderDocument = gql`
  mutation createSignatureOrder($input: CreateSignatureOrderInput!) {
    createSignatureOrder(input: $input) {
      signatureOrder {
        ...BasicSignatureOrder
        documents {
          ...BasicDocument
        }
      }
    }
  }
  ${BasicSignatureOrderFragmentDoc}
  ${BasicDocumentFragmentDoc}
`;
export const CleanupSignatureOrderDocument = gql`
  mutation cleanupSignatureOrder($input: CleanupSignatureOrderInput!) {
    cleanupSignatureOrder(input: $input) {
      signatureOrder {
        ...BasicSignatureOrder
        documents {
          ...BasicDocument
        }
      }
    }
  }
  ${BasicSignatureOrderFragmentDoc}
  ${BasicDocumentFragmentDoc}
`;
export const AddSignatoryDocument = gql`
  mutation addSignatory($input: AddSignatoryInput!) {
    addSignatory(input: $input) {
      signatory {
        ...BasicSignatory
      }
    }
  }
  ${BasicSignatoryFragmentDoc}
`;
export const AddSignatoriesDocument = gql`
  mutation addSignatories($input: AddSignatoriesInput!) {
    addSignatories(input: $input) {
      signatories {
        ...BasicSignatory
      }
    }
  }
  ${BasicSignatoryFragmentDoc}
`;
export const ChangeSignatoryDocument = gql`
  mutation changeSignatory($input: ChangeSignatoryInput!) {
    changeSignatory(input: $input) {
      signatory {
        ...BasicSignatory
      }
    }
  }
  ${BasicSignatoryFragmentDoc}
`;
export const CloseSignatureOrderDocument = gql`
  mutation closeSignatureOrder($input: CloseSignatureOrderInput!) {
    closeSignatureOrder(input: $input) {
      signatureOrder {
        ...BasicSignatureOrder
        documents {
          ...BasicDocument
          ...SignedDocument
        }
      }
    }
  }
  ${BasicSignatureOrderFragmentDoc}
  ${BasicDocumentFragmentDoc}
  ${SignedDocumentFragmentDoc}
`;
export const CancelSignatureOrderDocument = gql`
  mutation cancelSignatureOrder($input: CancelSignatureOrderInput!) {
    cancelSignatureOrder(input: $input) {
      signatureOrder {
        ...BasicSignatureOrder
        documents {
          ...BasicDocument
        }
      }
    }
  }
  ${BasicSignatureOrderFragmentDoc}
  ${BasicDocumentFragmentDoc}
`;
export const SignActingAsDocument = gql`
  mutation signActingAs($input: SignActingAsInput!) {
    signActingAs(input: $input) {
      signatory {
        ...BasicSignatory
      }
    }
  }
  ${BasicSignatoryFragmentDoc}
`;
export const ValidateDocumentDocument = gql`
  mutation validateDocument($input: ValidateDocumentInput!) {
    validateDocument(input: $input) {
      valid
      errors
      fixable
    }
  }
`;
export const ExtendSignatureOrderDocument = gql`
  mutation extendSignatureOrder($input: ExtendSignatureOrderInput!) {
    extendSignatureOrder(input: $input) {
      signatureOrder {
        ...BasicSignatureOrder
        documents {
          ...BasicDocument
        }
      }
    }
  }
  ${BasicSignatureOrderFragmentDoc}
  ${BasicDocumentFragmentDoc}
`;
export const DeleteSignatoryDocument = gql`
  mutation deleteSignatory($input: DeleteSignatoryInput!) {
    deleteSignatory(input: $input) {
      signatureOrder {
        ...BasicSignatureOrder
      }
    }
  }
  ${BasicSignatureOrderFragmentDoc}
`;
export const CreateBatchSignatoryDocument = gql`
  mutation createBatchSignatory($input: CreateBatchSignatoryInput!) {
    createBatchSignatory(input: $input) {
      batchSignatory {
        ...BasicBatchSignatory
        items {
          signatureOrder {
            ...BasicSignatureOrder
          }
          signatory {
            ...BasicSignatory
          }
        }
      }
    }
  }
  ${BasicBatchSignatoryFragmentDoc}
  ${BasicSignatureOrderFragmentDoc}
  ${BasicSignatoryFragmentDoc}
`;
export const ChangeSignatureOrderDocument = gql`
  mutation changeSignatureOrder($input: ChangeSignatureOrderInput!) {
    changeSignatureOrder(input: $input) {
      signatureOrder {
        ...BasicSignatureOrder
      }
    }
  }
  ${BasicSignatureOrderFragmentDoc}
`;
export const SignatureOrderDocument = gql`
  query signatureOrder($id: ID!) {
    signatureOrder(id: $id) {
      ...BasicSignatureOrder
    }
  }
  ${BasicSignatureOrderFragmentDoc}
`;
export const SignatureOrderWithDocumentsDocument = gql`
  query signatureOrderWithDocuments($id: ID!) {
    signatureOrder(id: $id) {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
        ...SignedDocument
      }
    }
  }
  ${BasicSignatureOrderFragmentDoc}
  ${BasicDocumentFragmentDoc}
  ${SignedDocumentFragmentDoc}
`;
export const SignatoryDocument = gql`
  query signatory($id: ID!) {
    signatory(id: $id) {
      signatureOrder {
        ...BasicSignatureOrder
      }
      ...BasicSignatory
    }
  }
  ${BasicSignatureOrderFragmentDoc}
  ${BasicSignatoryFragmentDoc}
`;
export const SignatureOrdersDocument = gql`
  query signatureOrders($status: SignatureOrderStatus, $first: Int!, $after: String) {
    viewer {
      __typename
      ... on Application {
        signatureOrders(status: $status, first: $first, after: $after) {
          edges {
            node {
              ...BasicSignatureOrder
            }
          }
        }
      }
    }
  }
  ${BasicSignatureOrderFragmentDoc}
`;
export const BatchSignatoryDocument = gql`
  query batchSignatory($id: ID!) {
    batchSignatory(id: $id) {
      ...BasicBatchSignatory
      items {
        signatureOrder {
          ...BasicSignatureOrder
        }
        signatory {
          ...BasicSignatory
        }
      }
    }
  }
  ${BasicBatchSignatoryFragmentDoc}
  ${BasicSignatureOrderFragmentDoc}
  ${BasicSignatoryFragmentDoc}
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) =>
  action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createSignatureOrder(
      variables: CreateSignatureOrderMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<CreateSignatureOrderMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<CreateSignatureOrderMutation>({
            document: CreateSignatureOrderDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'createSignatureOrder',
        'mutation',
        variables,
      );
    },
    cleanupSignatureOrder(
      variables: CleanupSignatureOrderMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<CleanupSignatureOrderMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<CleanupSignatureOrderMutation>({
            document: CleanupSignatureOrderDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'cleanupSignatureOrder',
        'mutation',
        variables,
      );
    },
    addSignatory(
      variables: AddSignatoryMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<AddSignatoryMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<AddSignatoryMutation>({
            document: AddSignatoryDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'addSignatory',
        'mutation',
        variables,
      );
    },
    addSignatories(
      variables: AddSignatoriesMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<AddSignatoriesMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<AddSignatoriesMutation>({
            document: AddSignatoriesDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'addSignatories',
        'mutation',
        variables,
      );
    },
    changeSignatory(
      variables: ChangeSignatoryMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<ChangeSignatoryMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<ChangeSignatoryMutation>({
            document: ChangeSignatoryDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'changeSignatory',
        'mutation',
        variables,
      );
    },
    closeSignatureOrder(
      variables: CloseSignatureOrderMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<CloseSignatureOrderMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<CloseSignatureOrderMutation>({
            document: CloseSignatureOrderDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'closeSignatureOrder',
        'mutation',
        variables,
      );
    },
    cancelSignatureOrder(
      variables: CancelSignatureOrderMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<CancelSignatureOrderMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<CancelSignatureOrderMutation>({
            document: CancelSignatureOrderDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'cancelSignatureOrder',
        'mutation',
        variables,
      );
    },
    signActingAs(
      variables: SignActingAsMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<SignActingAsMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<SignActingAsMutation>({
            document: SignActingAsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'signActingAs',
        'mutation',
        variables,
      );
    },
    validateDocument(
      variables: ValidateDocumentMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<ValidateDocumentMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<ValidateDocumentMutation>({
            document: ValidateDocumentDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'validateDocument',
        'mutation',
        variables,
      );
    },
    extendSignatureOrder(
      variables: ExtendSignatureOrderMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<ExtendSignatureOrderMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<ExtendSignatureOrderMutation>({
            document: ExtendSignatureOrderDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'extendSignatureOrder',
        'mutation',
        variables,
      );
    },
    deleteSignatory(
      variables: DeleteSignatoryMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<DeleteSignatoryMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<DeleteSignatoryMutation>({
            document: DeleteSignatoryDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'deleteSignatory',
        'mutation',
        variables,
      );
    },
    createBatchSignatory(
      variables: CreateBatchSignatoryMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<CreateBatchSignatoryMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<CreateBatchSignatoryMutation>({
            document: CreateBatchSignatoryDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'createBatchSignatory',
        'mutation',
        variables,
      );
    },
    changeSignatureOrder(
      variables: ChangeSignatureOrderMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<ChangeSignatureOrderMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<ChangeSignatureOrderMutation>({
            document: ChangeSignatureOrderDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'changeSignatureOrder',
        'mutation',
        variables,
      );
    },
    signatureOrder(
      variables: SignatureOrderQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<SignatureOrderQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<SignatureOrderQuery>({
            document: SignatureOrderDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'signatureOrder',
        'query',
        variables,
      );
    },
    signatureOrderWithDocuments(
      variables: SignatureOrderWithDocumentsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<SignatureOrderWithDocumentsQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<SignatureOrderWithDocumentsQuery>({
            document: SignatureOrderWithDocumentsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'signatureOrderWithDocuments',
        'query',
        variables,
      );
    },
    signatory(
      variables: SignatoryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<SignatoryQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<SignatoryQuery>({
            document: SignatoryDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'signatory',
        'query',
        variables,
      );
    },
    signatureOrders(
      variables: SignatureOrdersQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<SignatureOrdersQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<SignatureOrdersQuery>({
            document: SignatureOrdersDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'signatureOrders',
        'query',
        variables,
      );
    },
    batchSignatory(
      variables: BatchSignatoryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<BatchSignatoryQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<BatchSignatoryQuery>({
            document: BatchSignatoryDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'batchSignatory',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
