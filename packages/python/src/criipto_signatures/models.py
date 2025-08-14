from enum import StrEnum
from typing import Optional
from pydantic import BaseModel, Field

type IDScalar = str
type StringScalar = str
type IntScalar = int
type FloatScalar = float
type BooleanScalar = bool
type BlobScalar = str
type DateScalar = str
type DateTimeScalar = str
type URIScalar = str


class AddSignatoriesInput(BaseModel):
  signatories: "list[Optional[CreateSignatureOrderSignatoryInput]]"
  signatureOrderId: "IDScalar"


class AddSignatoriesOutput(BaseModel):
  signatories: "Optional[list[Optional[Signatory]]]" = Field(default=None)
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class AddSignatoryInput(BaseModel):
  # Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents.
  documents: "Optional[list[Optional[SignatoryDocumentInput]]]" = Field(default=None)
  # Selectively enable evidence providers for this signatory.
  evidenceProviders: "Optional[list[Optional[SignatoryEvidenceProviderInput]]]" = Field(
    default=None
  )
  evidenceValidation: "Optional[list[Optional[SignatoryEvidenceValidationInput]]]" = (
    Field(default=None)
  )
  # Will not be displayed to signatories, can be used as a reference to your own system.
  reference: "Optional[StringScalar]" = Field(default=None)
  # Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output.
  role: "Optional[StringScalar]" = Field(default=None)
  signatureAppearance: "Optional[SignatureAppearanceInput]" = Field(default=None)
  signatureOrderId: "IDScalar"
  # Override UI settings for signatory, defaults to UI settings for signature order
  ui: "Optional[SignatoryUIInput]" = Field(default=None)


class AddSignatoryOutput(BaseModel):
  signatory: "Optional[Signatory]" = Field(default=None)
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class AllOfEvidenceProviderInput(BaseModel):
  providers: "list[Optional[SingleEvidenceProviderInput]]"


class AllOfSignatureEvidenceProvider(BaseModel):
  id: "Optional[IDScalar]" = Field(default=None)
  providers: "Optional[list[Optional[SingleSignatureEvidenceProvider]]]" = Field(
    default=None
  )


class AnonymousViewer(BaseModel):
  authenticated: "Optional[BooleanScalar]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)


class Application(BaseModel):
  apiKeys: "Optional[list[Optional[ApplicationApiKey]]]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  name: "Optional[StringScalar]" = Field(default=None)
  signatureOrders: "Optional[SignatureOrderConnection]" = Field(default=None)
  # Tenants are only accessable from user viewers
  tenant: "Optional[Tenant]" = Field(default=None)
  verifyApplication: "Optional[VerifyApplication]" = Field(default=None)
  webhookLogs: "Optional[list[Optional[WebhookInvocation]]]" = Field(default=None)


class ApplicationApiKey(BaseModel):
  clientId: "Optional[StringScalar]" = Field(default=None)
  clientSecret: "Optional[StringScalar]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  mode: "Optional[ApplicationApiKeyMode]" = Field(default=None)
  note: "Optional[StringScalar]" = Field(default=None)


class ApplicationApiKeyMode(StrEnum):
  READ_ONLY = "READ_ONLY"
  READ_WRITE = "READ_WRITE"


class BatchSignatory(BaseModel):
  href: "Optional[StringScalar]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  items: "Optional[list[Optional[BatchSignatoryItem]]]" = Field(default=None)
  # The authentication token required for performing batch operations.
  token: "Optional[StringScalar]" = Field(default=None)
  traceId: "Optional[StringScalar]" = Field(default=None)
  ui: "Optional[SignatureOrderUI]" = Field(default=None)


class BatchSignatoryItem(BaseModel):
  signatory: "Optional[Signatory]" = Field(default=None)
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class BatchSignatoryItemInput(BaseModel):
  signatoryId: "StringScalar"
  signatureOrderId: "StringScalar"


class BatchSignatoryViewer(BaseModel):
  authenticated: "Optional[BooleanScalar]" = Field(default=None)
  batchSignatoryId: "Optional[IDScalar]" = Field(default=None)
  documents: "Optional[SignatoryDocumentConnection]" = Field(default=None)
  evidenceProviders: "Optional[list[Optional[SignatureEvidenceProvider]]]" = Field(
    default=None
  )
  id: "Optional[IDScalar]" = Field(default=None)
  signer: "Optional[BooleanScalar]" = Field(default=None)
  status: "Optional[SignatoryStatus]" = Field(default=None)
  ui: "Optional[SignatureOrderUI]" = Field(default=None)


class CancelSignatureOrderInput(BaseModel):
  signatureOrderId: "IDScalar"


class CancelSignatureOrderOutput(BaseModel):
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class ChangeSignatoryInput(BaseModel):
  # Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents.
  documents: "Optional[list[Optional[SignatoryDocumentInput]]]" = Field(default=None)
  # Selectively enable evidence providers for this signatory.
  evidenceProviders: "Optional[list[Optional[SignatoryEvidenceProviderInput]]]" = Field(
    default=None
  )
  evidenceValidation: "Optional[list[Optional[SignatoryEvidenceValidationInput]]]" = (
    Field(default=None)
  )
  # Will not be displayed to signatories, can be used as a reference to your own system.
  reference: "Optional[StringScalar]" = Field(default=None)
  # Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output.
  role: "Optional[StringScalar]" = Field(default=None)
  signatoryId: "IDScalar"
  signatureAppearance: "Optional[SignatureAppearanceInput]" = Field(default=None)
  # Override UI settings for signatory, defaults to UI settings for signature order
  ui: "Optional[SignatoryUIInput]" = Field(default=None)


class ChangeSignatoryOutput(BaseModel):
  signatory: "Optional[Signatory]" = Field(default=None)
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class ChangeSignatureOrderInput(BaseModel):
  # Max allowed signatories (as it influences pages needed for seals). Cannot be changed after first signer.
  maxSignatories: "Optional[IntScalar]" = Field(default=None)
  signatureOrderId: "IDScalar"
  # Signature order webhook settings
  webhook: "Optional[CreateSignatureOrderWebhookInput]" = Field(default=None)


class ChangeSignatureOrderOutput(BaseModel):
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class CleanupSignatureOrderInput(BaseModel):
  signatureOrderId: "IDScalar"


class CleanupSignatureOrderOutput(BaseModel):
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class CloseSignatureOrderInput(BaseModel):
  # Retains documents on Criipto servers after closing a signature order. You MUST manually call the cleanupSignatureOrder mutation when you are sure you have downloaded the blobs. Maximum value is 7 days.
  retainDocumentsForDays: "Optional[IntScalar]" = Field(default=None)
  signatureOrderId: "IDScalar"


class CloseSignatureOrderOutput(BaseModel):
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class CompleteCriiptoVerifyEvidenceProviderInput(BaseModel):
  code: "StringScalar"
  state: "StringScalar"


class CompleteCriiptoVerifyEvidenceProviderOutput(BaseModel):
  jwt: "Optional[StringScalar]" = Field(default=None)


class CompositeSignature(BaseModel):
  signatory: "Optional[Signatory]" = Field(default=None)
  signatures: "Optional[list[Optional[SingleSignature]]]" = Field(default=None)


class CreateApplicationApiKeyInput(BaseModel):
  applicationId: "IDScalar"
  mode: "Optional[ApplicationApiKeyMode]" = Field(default=None)
  note: "Optional[StringScalar]" = Field(default=None)


class CreateApplicationApiKeyOutput(BaseModel):
  apiKey: "Optional[ApplicationApiKey]" = Field(default=None)
  application: "Optional[Application]" = Field(default=None)


class CreateApplicationInput(BaseModel):
  name: "StringScalar"
  tenantId: "IDScalar"
  verifyApplicationDomain: "StringScalar"
  verifyApplicationEnvironment: "VerifyApplicationEnvironment"
  verifyApplicationRealm: "StringScalar"


class CreateApplicationOutput(BaseModel):
  apiKey: "Optional[ApplicationApiKey]" = Field(default=None)
  application: "Optional[Application]" = Field(default=None)
  tenant: "Optional[Tenant]" = Field(default=None)


class CreateBatchSignatoryInput(BaseModel):
  items: "list[Optional[BatchSignatoryItemInput]]"
  # UI settings for batch signatory, will use defaults otherwise (will not use UI settings from sub signatories)
  ui: "Optional[SignatoryUIInput]" = Field(default=None)


class CreateBatchSignatoryOutput(BaseModel):
  batchSignatory: "Optional[BatchSignatory]" = Field(default=None)


class CreateSignatureOrderInput(BaseModel):
  # By default signatories will be prompted to sign with a Criipto Verify based e-ID, this setting disables it.
  disableVerifyEvidenceProvider: "Optional[BooleanScalar]" = Field(default=None)
  documents: "list[Optional[DocumentInput]]"
  # Define evidence providers for signature order if not using built-in Criipto Verify for e-IDs
  evidenceProviders: "Optional[list[Optional[EvidenceProviderInput]]]" = Field(
    default=None
  )
  # Defines when a signatory must be validated, default is when signing, but can be expanded to also be required when viewing documents.
  evidenceValidationStages: "Optional[list[Optional[EvidenceValidationStage]]]" = Field(
    default=None
  )
  # When this signature order will auto-close/expire at exactly in one of the following ISO-8601 formats: yyyy-MM-ddTHH:mm:ssZ, yyyy-MM-ddTHH:mm:ss.ffZ, yyyy-MM-ddTHH:mm:ss.fffZ, yyyy-MM-ddTHH:mm:ssK, yyyy-MM-ddTHH:mm:ss.ffK, yyyy-MM-ddTHH:mm:ss.fffK. Cannot be provided with `expiresInDays`.
  expiresAt: "Optional[StringScalar]" = Field(default=None)
  # When this signature order will auto-close/expire. Default 90 days. Cannot be provided with `expiresAt`
  expiresInDays: "Optional[IntScalar]" = Field(default=None)
  # Attempt to automatically fix document formatting errors if possible. Default 'true'.
  fixDocumentFormattingErrors: "Optional[BooleanScalar]" = Field(default=None)
  # Max allowed signatories (as it influences pages needed for seals). Default 14.
  maxSignatories: "Optional[IntScalar]" = Field(default=None)
  signatories: "Optional[list[Optional[CreateSignatureOrderSignatoryInput]]]" = Field(
    default=None
  )
  # Configure appearance of signatures inside documents
  signatureAppearance: "Optional[SignatureAppearanceInput]" = Field(default=None)
  # Timezone to render signature seals in, default UTC.
  timezone: "Optional[StringScalar]" = Field(default=None)
  title: "Optional[StringScalar]" = Field(default=None)
  # Various settings for how the UI is presented to the signatory.
  ui: "Optional[CreateSignatureOrderUIInput]" = Field(default=None)
  # Signature order webhook settings
  webhook: "Optional[CreateSignatureOrderWebhookInput]" = Field(default=None)


class CreateSignatureOrderOutput(BaseModel):
  application: "Optional[Application]" = Field(default=None)
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class CreateSignatureOrderSignatoryInput(BaseModel):
  # Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents.
  documents: "Optional[list[Optional[SignatoryDocumentInput]]]" = Field(default=None)
  # Selectively enable evidence providers for this signatory.
  evidenceProviders: "Optional[list[Optional[SignatoryEvidenceProviderInput]]]" = Field(
    default=None
  )
  evidenceValidation: "Optional[list[Optional[SignatoryEvidenceValidationInput]]]" = (
    Field(default=None)
  )
  # Will not be displayed to signatories, can be used as a reference to your own system.
  reference: "Optional[StringScalar]" = Field(default=None)
  # Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output.
  role: "Optional[StringScalar]" = Field(default=None)
  signatureAppearance: "Optional[SignatureAppearanceInput]" = Field(default=None)
  # Override UI settings for signatory, defaults to UI settings for signature order
  ui: "Optional[SignatoryUIInput]" = Field(default=None)


class CreateSignatureOrderUIInput(BaseModel):
  # Removes the UI options to reject a document or signature order.
  disableRejection: "Optional[BooleanScalar]" = Field(default=None)
  # The language of texts rendered to the signatory.
  language: "Optional[Language]" = Field(default=None)
  # Define a logo to be shown in the signatory UI.
  logo: "Optional[SignatureOrderUILogoInput]" = Field(default=None)
  # Renders a UI layer for PDF annotations, such as links, making them interactive in the UI/browser
  renderPdfAnnotationLayer: "Optional[BooleanScalar]" = Field(default=None)
  # The signatory will be redirected to this URL after signing or rejected the signature order.
  signatoryRedirectUri: "Optional[StringScalar]" = Field(default=None)
  # Add stylesheet/css via an absolute HTTPS URL.
  stylesheet: "Optional[StringScalar]" = Field(default=None)


class CreateSignatureOrderWebhookInput(BaseModel):
  # If defined, webhook invocations will have a X-Criipto-Signature header containing a HMAC-SHA256 signature (as a base64 string) of the webhook request body (utf-8). The secret should be between 256 and 512 bits.
  secret: "Optional[BlobScalar]" = Field(default=None)
  # Webhook url. POST requests will be executed towards this URL on certain signatory events.
  url: "StringScalar"
  # Validates webhook connectivity by triggering a WEBHOOK_VALIDATION event, your webhook must respond within 5 seconds with 200/OK or the signature order creation will fail.
  validateConnectivity: "Optional[BooleanScalar]" = Field(default=None)


class CriiptoVerifyEvidenceProviderRedirect(BaseModel):
  redirectUri: "Optional[StringScalar]" = Field(default=None)
  state: "Optional[StringScalar]" = Field(default=None)


# Criipto Verify based evidence for signatures.
class CriiptoVerifyProviderInput(BaseModel):
  acrValues: "Optional[list[Optional[StringScalar]]]" = Field(default=None)
  alwaysRedirect: "Optional[BooleanScalar]" = Field(default=None)
  # Define additional valid audiences (besides the main client_id) for the Criipto Verify domain/issuer underlying the application.
  audiences: "Optional[list[Optional[StringScalar]]]" = Field(default=None)
  # Set a custom login_hint for the underlying authentication request.
  loginHint: "Optional[StringScalar]" = Field(default=None)
  # Messages displayed when performing authentication (only supported by DKMitID currently).
  message: "Optional[StringScalar]" = Field(default=None)
  # Set a custom scope for the underlying authentication request.
  scope: "Optional[StringScalar]" = Field(default=None)
  # Enforces that signatories sign by unique evidence by comparing the values of previous evidence on the key you define. For Criipto Verify you likely want to use `sub` which is a unique pseudonym value present in all e-ID tokens issued.
  uniqueEvidenceKey: "Optional[StringScalar]" = Field(default=None)


class CriiptoVerifySignatureEvidenceProvider(BaseModel):
  acrValues: "Optional[list[Optional[StringScalar]]]" = Field(default=None)
  alwaysRedirect: "Optional[BooleanScalar]" = Field(default=None)
  audience: "Optional[StringScalar]" = Field(default=None)
  audiences: "Optional[list[Optional[StringScalar]]]" = Field(default=None)
  clientID: "Optional[StringScalar]" = Field(default=None)
  domain: "Optional[StringScalar]" = Field(default=None)
  environment: "Optional[VerifyApplicationEnvironment]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  loginHint: "Optional[StringScalar]" = Field(default=None)
  message: "Optional[StringScalar]" = Field(default=None)
  name: "Optional[StringScalar]" = Field(default=None)
  scope: "Optional[StringScalar]" = Field(default=None)


class DeleteApplicationApiKeyInput(BaseModel):
  apiKeyId: "IDScalar"
  applicationId: "IDScalar"


class DeleteApplicationApiKeyOutput(BaseModel):
  application: "Optional[Application]" = Field(default=None)


class DeleteSignatoryInput(BaseModel):
  signatoryId: "IDScalar"
  signatureOrderId: "IDScalar"


class DeleteSignatoryOutput(BaseModel):
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


type Document = PdfDocument | XmlDocument


class DocumentIDLocation(StrEnum):
  BOTTOM = "BOTTOM"
  LEFT = "LEFT"
  RIGHT = "RIGHT"
  TOP = "TOP"


class DocumentInput(BaseModel):
  pdf: "Optional[PadesDocumentInput]" = Field(default=None)
  # When enabled, will remove any existing signatures from the document before storing. (PDF only)
  removePreviousSignatures: "Optional[BooleanScalar]" = Field(default=None)
  # XML signing is coming soon, reach out to learn more.
  xml: "Optional[XadesDocumentInput]" = Field(default=None)


# Document storage mode. Temporary documents will be deleted once completed.
class DocumentStorageMode(StrEnum):
  Temporary = "Temporary"


class DownloadVerificationCriiptoVerifyInput(BaseModel):
  jwt: "StringScalar"


class DownloadVerificationInput(BaseModel):
  criiptoVerify: "Optional[DownloadVerificationCriiptoVerifyInput]" = Field(
    default=None
  )
  oidc: "Optional[DownloadVerificationOidcInput]" = Field(default=None)


class DownloadVerificationOidcInput(BaseModel):
  jwt: "StringScalar"


# Hand drawn signature evidence for signatures.
class DrawableEvidenceProviderInput(BaseModel):
  # Required minimum height of drawed area in pixels.
  minimumHeight: "Optional[IntScalar]" = Field(default=None)
  # Required minimum width of drawed area in pixels.
  minimumWidth: "Optional[IntScalar]" = Field(default=None)
  requireName: "Optional[BooleanScalar]" = Field(default=None)


class DrawableSignature(BaseModel):
  image: "Optional[BlobScalar]" = Field(default=None)
  name: "Optional[StringScalar]" = Field(default=None)
  signatory: "Optional[Signatory]" = Field(default=None)


class DrawableSignatureEvidenceProvider(BaseModel):
  id: "Optional[IDScalar]" = Field(default=None)
  minimumHeight: "Optional[IntScalar]" = Field(default=None)
  minimumWidth: "Optional[IntScalar]" = Field(default=None)
  requireName: "Optional[BooleanScalar]" = Field(default=None)


class EmptySignature(BaseModel):
  signatory: "Optional[Signatory]" = Field(default=None)


# Must define a evidence provider subsection.
class EvidenceProviderInput(BaseModel):
  allOf: "Optional[AllOfEvidenceProviderInput]" = Field(default=None)
  # Criipto Verify based evidence for signatures.
  criiptoVerify: "Optional[CriiptoVerifyProviderInput]" = Field(default=None)
  # Hand drawn signature evidence for signatures.
  drawable: "Optional[DrawableEvidenceProviderInput]" = Field(default=None)
  # Determined if this evidence provider should be enabled by signatories by default. Default true
  enabledByDefault: "Optional[BooleanScalar]" = Field(default=None)
  # TEST environment only. Does not manipulate the PDF, use for integration or webhook testing.
  noop: "Optional[NoopEvidenceProviderInput]" = Field(default=None)
  # Deprecated
  oidc: "Optional[OidcEvidenceProviderInput]" = Field(default=None)


class EvidenceValidationStage(StrEnum):
  SIGN = "SIGN"
  VIEW = "VIEW"


class ExtendSignatureOrderInput(BaseModel):
  # Expiration to add to order, in days, max 30.
  additionalExpirationInDays: "IntScalar"
  signatureOrderId: "IDScalar"


class ExtendSignatureOrderOutput(BaseModel):
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class JWTClaim(BaseModel):
  name: "Optional[StringScalar]" = Field(default=None)
  value: "Optional[StringScalar]" = Field(default=None)


class JWTSignature(BaseModel):
  claims: "Optional[list[Optional[JWTClaim]]]" = Field(default=None)
  jwks: "Optional[StringScalar]" = Field(default=None)
  jwt: "Optional[StringScalar]" = Field(default=None)
  signatory: "Optional[Signatory]" = Field(default=None)


class Language(StrEnum):
  DA_DK = "DA_DK"
  EN_US = "EN_US"
  NB_NO = "NB_NO"
  SV_SE = "SV_SE"


class Mutation(BaseModel):
  # Add multiple signatures to your signature order.
  addSignatories: "Optional[AddSignatoriesOutput]" = Field(default=None)
  # Add a signatory to your signature order.
  addSignatory: "Optional[AddSignatoryOutput]" = Field(default=None)
  # Cancels the signature order without closing it, use if you no longer need a signature order. Documents are deleted from storage after cancelling.
  cancelSignatureOrder: "Optional[CancelSignatureOrderOutput]" = Field(default=None)
  # Change an existing signatory
  changeSignatory: "Optional[ChangeSignatoryOutput]" = Field(default=None)
  # Change an existing signature order
  changeSignatureOrder: "Optional[ChangeSignatureOrderOutput]" = Field(default=None)
  # Cleans up the signature order and removes any saved documents from the servers.
  cleanupSignatureOrder: "Optional[CleanupSignatureOrderOutput]" = Field(default=None)
  # Finalizes the documents in the signature order and returns them to you as blobs. Documents are deleted from storage after closing.
  closeSignatureOrder: "Optional[CloseSignatureOrderOutput]" = Field(default=None)
  completeCriiptoVerifyEvidenceProvider: "Optional[CompleteCriiptoVerifyEvidenceProviderOutput]" = Field(
    default=None
  )
  # Creates a signature application for a given tenant.
  createApplication: "Optional[CreateApplicationOutput]" = Field(default=None)
  # Creates a new set of api credentials for an existing application.
  createApplicationApiKey: "Optional[CreateApplicationApiKeyOutput]" = Field(
    default=None
  )
  createBatchSignatory: "Optional[CreateBatchSignatoryOutput]" = Field(default=None)
  # Creates a signature order to be signed.
  createSignatureOrder: "Optional[CreateSignatureOrderOutput]" = Field(default=None)
  # Deletes a set of API credentials for an application.
  deleteApplicationApiKey: "Optional[DeleteApplicationApiKeyOutput]" = Field(
    default=None
  )
  # Delete a signatory from a signature order
  deleteSignatory: "Optional[DeleteSignatoryOutput]" = Field(default=None)
  # Extends the expiration of the signature order.
  extendSignatureOrder: "Optional[ExtendSignatureOrderOutput]" = Field(default=None)
  # Refreshes the client secret for an existing set of API credentials. Warning: The old client secret will stop working immediately.
  refreshApplicationApiKey: "Optional[RefreshApplicationApiKeyOutput]" = Field(
    default=None
  )
  # Used by Signatory frontends to reject a signature order in full.
  rejectSignatureOrder: "Optional[RejectSignatureOrderOutput]" = Field(default=None)
  retrySignatureOrderWebhook: "Optional[RetrySignatureOrderWebhookOutput]" = Field(
    default=None
  )
  # Used by Signatory frontends to sign the documents in a signature order.
  sign: "Optional[SignOutput]" = Field(default=None)
  # Sign with API credentials acting as a specific signatory. The signatory MUST be preapproved in this case.
  signActingAs: "Optional[SignActingAsOutput]" = Field(default=None)
  # Signatory frontend use only.
  signatoryBeacon: "Optional[SignatoryBeaconOutput]" = Field(default=None)
  # Signatory frontend use only.
  startCriiptoVerifyEvidenceProvider: "Optional[StartCriiptoVerifyEvidenceProviderOutput]" = Field(
    default=None
  )
  # Signatory frontend use only.
  trackSignatory: "Optional[TrackSignatoryOutput]" = Field(default=None)
  # Used by Signatory frontends to mark documents as opened, approved or rejected.
  updateSignatoryDocumentStatus: "Optional[UpdateSignatoryDocumentStatusOutput]" = (
    Field(default=None)
  )
  validateDocument: "Optional[ValidateDocumentOutput]" = Field(default=None)


# TEST only. Allows empty signatures for testing.
class NoopEvidenceProviderInput(BaseModel):
  name: "StringScalar"


class NoopSignatureEvidenceProvider(BaseModel):
  id: "Optional[IDScalar]" = Field(default=None)
  name: "Optional[StringScalar]" = Field(default=None)


# OIDC/JWT based evidence for signatures.
class OidcEvidenceProviderInput(BaseModel):
  acrValues: "Optional[list[Optional[StringScalar]]]" = Field(default=None)
  alwaysRedirect: "Optional[BooleanScalar]" = Field(default=None)
  audience: "StringScalar"
  clientID: "StringScalar"
  domain: "StringScalar"
  name: "StringScalar"
  # Enforces that signatories sign by unique evidence by comparing the values of previous evidence on the key you define.
  uniqueEvidenceKey: "Optional[StringScalar]" = Field(default=None)


class OidcJWTSignatureEvidenceProvider(BaseModel):
  acrValues: "Optional[list[Optional[StringScalar]]]" = Field(default=None)
  alwaysRedirect: "Optional[BooleanScalar]" = Field(default=None)
  clientID: "Optional[StringScalar]" = Field(default=None)
  domain: "Optional[StringScalar]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  name: "Optional[StringScalar]" = Field(default=None)


class PadesDocumentFormInput(BaseModel):
  enabled: "BooleanScalar"


class PadesDocumentInput(BaseModel):
  blob: "BlobScalar"
  # Will add a unique identifier for the document to the specified margin of each page. Useful when printing signed documents.
  displayDocumentID: "Optional[DocumentIDLocation]" = Field(default=None)
  form: "Optional[PadesDocumentFormInput]" = Field(default=None)
  # Will not be displayed to signatories, can be used as a reference to your own system.
  reference: "Optional[StringScalar]" = Field(default=None)
  sealsPageTemplate: "Optional[PadesDocumentSealsPageTemplateInput]" = Field(
    default=None
  )
  storageMode: "DocumentStorageMode"
  title: "StringScalar"


class PadesDocumentSealsPageTemplateInput(BaseModel):
  # Using the PDF coordinate system, with (x1, y1) being bottom-left
  area: "PdfBoundingBoxInput"
  # Must be a PDF containing a SINGLE page
  blob: "BlobScalar"
  # Validate that the defined seal area produces the expected number of columns, will error if expectation is not met
  expectedColumns: "Optional[IntScalar]" = Field(default=None)
  # Validate that the defined seal area produces the expected number of rows, will error if expectation is not met
  expectedRows: "Optional[IntScalar]" = Field(default=None)


# Information about pagination in a connection.
class PageInfo(BaseModel):
  # When paginating forwards, the cursor to continue.
  endCursor: "Optional[StringScalar]" = Field(default=None)
  # When paginating forwards, are there more items?
  hasNextPage: "Optional[BooleanScalar]" = Field(default=None)
  # When paginating backwards, are there more items?
  hasPreviousPage: "Optional[BooleanScalar]" = Field(default=None)
  # When paginating backwards, the cursor to continue.
  startCursor: "Optional[StringScalar]" = Field(default=None)


class PdfBoundingBoxInput(BaseModel):
  x1: "FloatScalar"
  x2: "FloatScalar"
  y1: "FloatScalar"
  y2: "FloatScalar"


class PdfDocument(BaseModel):
  blob: "Optional[BlobScalar]" = Field(default=None)
  # Same value as stamped on document when using displayDocumentID
  documentID: "Optional[StringScalar]" = Field(default=None)
  form: "Optional[PdfDocumentForm]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  originalBlob: "Optional[BlobScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  signatoryViewerStatus: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  signatures: "Optional[list[Optional[Signature]]]" = Field(default=None)
  title: "Optional[StringScalar]" = Field(default=None)


class PdfDocumentForm(BaseModel):
  enabled: "Optional[BooleanScalar]" = Field(default=None)


class PdfSealPosition(BaseModel):
  page: "IntScalar"
  x: "FloatScalar"
  y: "FloatScalar"


class Query(BaseModel):
  application: "Optional[Application]" = Field(default=None)
  batchSignatory: "Optional[BatchSignatory]" = Field(default=None)
  document: "Optional[Document]" = Field(default=None)
  # Query a signatory by id. Useful when using webhooks.
  signatory: "Optional[Signatory]" = Field(default=None)
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)
  # Tenants are only accessable from user viewers
  tenant: "Optional[Tenant]" = Field(default=None)
  timezones: "Optional[list[Optional[StringScalar]]]" = Field(default=None)
  viewer: "Optional[Viewer]" = Field(default=None)


class RefreshApplicationApiKeyInput(BaseModel):
  apiKeyId: "IDScalar"
  applicationId: "IDScalar"


class RefreshApplicationApiKeyOutput(BaseModel):
  apiKey: "Optional[ApplicationApiKey]" = Field(default=None)
  application: "Optional[Application]" = Field(default=None)


class RejectSignatureOrderInput(BaseModel):
  dummy: "BooleanScalar"
  reason: "Optional[StringScalar]" = Field(default=None)


class RejectSignatureOrderOutput(BaseModel):
  viewer: "Optional[Viewer]" = Field(default=None)


class RetrySignatureOrderWebhookInput(BaseModel):
  retryPayload: "StringScalar"
  signatureOrderId: "IDScalar"


class RetrySignatureOrderWebhookOutput(BaseModel):
  invocation: "Optional[WebhookInvocation]" = Field(default=None)


class SignActingAsInput(BaseModel):
  evidence: "SignInput"
  signatoryId: "IDScalar"


class SignActingAsOutput(BaseModel):
  signatory: "Optional[Signatory]" = Field(default=None)
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)


class SignAllOfInput(BaseModel):
  criiptoVerify: "Optional[SignCriiptoVerifyInput]" = Field(default=None)
  drawable: "Optional[SignDrawableInput]" = Field(default=None)
  noop: "Optional[BooleanScalar]" = Field(default=None)
  oidc: "Optional[SignOidcInput]" = Field(default=None)


class SignCriiptoVerifyInput(BaseModel):
  jwt: "StringScalar"


class SignDocumentFormFieldInput(BaseModel):
  field: "StringScalar"
  value: "StringScalar"


class SignDocumentFormInput(BaseModel):
  fields: "list[Optional[SignDocumentFormFieldInput]]"


class SignDocumentInput(BaseModel):
  form: "Optional[SignDocumentFormInput]" = Field(default=None)
  id: "IDScalar"


class SignDrawableInput(BaseModel):
  image: "BlobScalar"
  name: "Optional[StringScalar]" = Field(default=None)


class SignInput(BaseModel):
  allOf: "Optional[SignAllOfInput]" = Field(default=None)
  criiptoVerify: "Optional[SignCriiptoVerifyInput]" = Field(default=None)
  documents: "Optional[list[Optional[SignDocumentInput]]]" = Field(default=None)
  drawable: "Optional[SignDrawableInput]" = Field(default=None)
  # EvidenceProvider id
  id: "IDScalar"
  noop: "Optional[BooleanScalar]" = Field(default=None)
  oidc: "Optional[SignOidcInput]" = Field(default=None)


class SignOidcInput(BaseModel):
  jwt: "StringScalar"


class SignOutput(BaseModel):
  viewer: "Optional[Viewer]" = Field(default=None)


class Signatory(BaseModel):
  documents: "Optional[SignatoryDocumentConnection]" = Field(default=None)
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  evidenceProviders: "Optional[list[Optional[SignatureEvidenceProvider]]]" = Field(
    default=None
  )
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "Optional[StringScalar]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "Optional[SignatureOrder]" = Field(default=None)
  spanId: "Optional[StringScalar]" = Field(default=None)
  # The current status of the signatory.
  status: "Optional[SignatoryStatus]" = Field(default=None)
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # The signature frontend authentication token, only required if you need to build a custom url.
  token: "Optional[StringScalar]" = Field(default=None)
  traceId: "Optional[StringScalar]" = Field(default=None)
  ui: "Optional[SignatureOrderUI]" = Field(default=None)


class SignatoryBeaconInput(BaseModel):
  lastActionAt: "DateTimeScalar"


class SignatoryBeaconOutput(BaseModel):
  viewer: "Optional[Viewer]" = Field(default=None)


class SignatoryDocumentConnection(BaseModel):
  edges: "Optional[list[Optional[SignatoryDocumentEdge]]]" = Field(default=None)


class SignatoryDocumentEdge(BaseModel):
  node: "Optional[Document]" = Field(default=None)
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)


class SignatoryDocumentInput(BaseModel):
  id: "IDScalar"
  # Define custom position for PDF seal. Uses PDF coordinate system (bottom-left as 0,0). If defined for one signatory/document, must be defined for all.
  pdfSealPosition: "Optional[PdfSealPosition]" = Field(default=None)
  preapproved: "Optional[BooleanScalar]" = Field(default=None)


class SignatoryDocumentStatus(StrEnum):
  APPROVED = "APPROVED"
  OPENED = "OPENED"
  PREAPPROVED = "PREAPPROVED"
  REJECTED = "REJECTED"
  SIGNED = "SIGNED"


class SignatoryEvidenceProviderInput(BaseModel):
  allOf: "Optional[AllOfEvidenceProviderInput]" = Field(default=None)
  # Criipto Verify based evidence for signatures.
  criiptoVerify: "Optional[CriiptoVerifyProviderInput]" = Field(default=None)
  # Hand drawn signature evidence for signatures.
  drawable: "Optional[DrawableEvidenceProviderInput]" = Field(default=None)
  id: "IDScalar"
  # TEST environment only. Does not manipulate the PDF, use for integration or webhook testing.
  noop: "Optional[NoopEvidenceProviderInput]" = Field(default=None)
  # Deprecated
  oidc: "Optional[OidcEvidenceProviderInput]" = Field(default=None)


class SignatoryEvidenceValidationInput(BaseModel):
  boolean: "Optional[BooleanScalar]" = Field(default=None)
  key: "StringScalar"
  value: "Optional[StringScalar]" = Field(default=None)


class SignatoryFrontendEvent(StrEnum):
  DOWNLOAD_LINK_OPENED = "DOWNLOAD_LINK_OPENED"
  SIGN_LINK_OPENED = "SIGN_LINK_OPENED"


class SignatoryStatus(StrEnum):
  DELETED = "DELETED"
  ERROR = "ERROR"
  OPEN = "OPEN"
  REJECTED = "REJECTED"
  SIGNED = "SIGNED"


class SignatoryUIInput(BaseModel):
  # Removes the UI options to reject a document or signature order.
  disableRejection: "Optional[BooleanScalar]" = Field(default=None)
  # The language of texts rendered to the signatory.
  language: "Optional[Language]" = Field(default=None)
  # Define a logo to be shown in the signatory UI.
  logo: "Optional[SignatureOrderUILogoInput]" = Field(default=None)
  # Renders a UI layer for PDF annotations, such as links, making them interactive in the UI/browser
  renderPdfAnnotationLayer: "Optional[BooleanScalar]" = Field(default=None)
  # The signatory will be redirected to this URL after signing or rejected the signature order.
  signatoryRedirectUri: "Optional[StringScalar]" = Field(default=None)
  # Add stylesheet/css via an absolute HTTPS URL.
  stylesheet: "Optional[StringScalar]" = Field(default=None)


class SignatoryViewer(BaseModel):
  authenticated: "Optional[BooleanScalar]" = Field(default=None)
  documents: "Optional[SignatoryDocumentConnection]" = Field(default=None)
  download: "Optional[SignatoryViewerDownload]" = Field(default=None)
  evidenceProviders: "Optional[list[Optional[SignatureEvidenceProvider]]]" = Field(
    default=None
  )
  id: "Optional[IDScalar]" = Field(default=None)
  signatoryId: "Optional[IDScalar]" = Field(default=None)
  signatureOrderStatus: "Optional[SignatureOrderStatus]" = Field(default=None)
  signer: "Optional[BooleanScalar]" = Field(default=None)
  status: "Optional[SignatoryStatus]" = Field(default=None)
  ui: "Optional[SignatureOrderUI]" = Field(default=None)


class SignatoryViewerDownload(BaseModel):
  documents: "Optional[SignatoryDocumentConnection]" = Field(default=None)
  expired: "Optional[BooleanScalar]" = Field(default=None)
  verificationEvidenceProvider: "Optional[SignatureEvidenceProvider]" = Field(
    default=None
  )
  verificationRequired: "Optional[BooleanScalar]" = Field(default=None)


# Represents a signature on a document.
type Signature = CompositeSignature | DrawableSignature | EmptySignature | JWTSignature


class SignatureAppearanceInput(BaseModel):
  displayName: "Optional[list[Optional[SignatureAppearanceTemplateInput]]]" = Field(
    default=None
  )
  footer: "Optional[list[Optional[SignatureAppearanceTemplateInput]]]" = Field(
    default=None
  )
  headerLeft: "Optional[list[Optional[SignatureAppearanceTemplateInput]]]" = Field(
    default=None
  )
  # Render evidence claim as identifier in the signature appearance inside the document. You can supply multiple keys and they will be tried in order. If no key is found a GUID will be rendered.
  identifierFromEvidence: "list[Optional[StringScalar]]"


class SignatureAppearanceTemplateInput(BaseModel):
  replacements: "Optional[list[Optional[SignatureAppearanceTemplateReplacementInput]]]" = Field(
    default=None
  )
  template: "StringScalar"


class SignatureAppearanceTemplateReplacementInput(BaseModel):
  fromEvidence: "list[Optional[StringScalar]]"
  placeholder: "StringScalar"


type SignatureEvidenceProvider = (
  AllOfSignatureEvidenceProvider
  | CriiptoVerifySignatureEvidenceProvider
  | DrawableSignatureEvidenceProvider
  | NoopSignatureEvidenceProvider
  | OidcJWTSignatureEvidenceProvider
)


class SignatureOrder(BaseModel):
  application: "Optional[Application]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  createdAt: "Optional[DateTimeScalar]" = Field(default=None)
  documents: "Optional[list[Optional[Document]]]" = Field(default=None)
  evidenceProviders: "Optional[list[Optional[SignatureEvidenceProvider]]]" = Field(
    default=None
  )
  expiresAt: "Optional[DateTimeScalar]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  # Number of max signatories for the signature order
  maxSignatories: "Optional[IntScalar]" = Field(default=None)
  # List of signatories for the signature order.
  signatories: "Optional[list[Optional[Signatory]]]" = Field(default=None)
  status: "Optional[SignatureOrderStatus]" = Field(default=None)
  # Tenants are only accessable from user viewers
  tenant: "Optional[Tenant]" = Field(default=None)
  timezone: "Optional[StringScalar]" = Field(default=None)
  title: "Optional[StringScalar]" = Field(default=None)
  traceId: "Optional[StringScalar]" = Field(default=None)
  ui: "Optional[SignatureOrderUI]" = Field(default=None)
  webhook: "Optional[SignatureOrderWebhook]" = Field(default=None)


# A connection from an object to a list of objects of type SignatureOrder
class SignatureOrderConnection(BaseModel):
  # Information to aid in pagination.
  edges: "Optional[list[Optional[SignatureOrderEdge]]]" = Field(default=None)
  # Information to aid in pagination.
  pageInfo: "Optional[PageInfo]" = Field(default=None)
  # A count of the total number of objects in this connection, ignoring pagination. This allows a client to fetch the first five objects by passing \"5\" as the argument to `first`, then fetch the total count so it could display \"5 of 83\", for example. In cases where we employ infinite scrolling or don't have an exact count of entries, this field will return `null`.
  totalCount: "Optional[IntScalar]" = Field(default=None)


# An edge in a connection from an object to another object of type SignatureOrder
class SignatureOrderEdge(BaseModel):
  # A cursor for use in pagination
  cursor: "Optional[StringScalar]" = Field(default=None)
  # The item at the end of the edge. Must NOT be an enumerable collection.
  node: "Optional[SignatureOrder]" = Field(default=None)


class SignatureOrderStatus(StrEnum):
  CANCELLED = "CANCELLED"
  CLOSED = "CLOSED"
  EXPIRED = "EXPIRED"
  OPEN = "OPEN"


class SignatureOrderUI(BaseModel):
  disableRejection: "Optional[BooleanScalar]" = Field(default=None)
  language: "Optional[Language]" = Field(default=None)
  logo: "Optional[SignatureOrderUILogo]" = Field(default=None)
  renderPdfAnnotationLayer: "Optional[BooleanScalar]" = Field(default=None)
  signatoryRedirectUri: "Optional[StringScalar]" = Field(default=None)
  stylesheet: "Optional[StringScalar]" = Field(default=None)


class SignatureOrderUILogo(BaseModel):
  href: "Optional[StringScalar]" = Field(default=None)
  src: "Optional[StringScalar]" = Field(default=None)


class SignatureOrderUILogoInput(BaseModel):
  # Turns your logo into a link with the defined href.
  href: "Optional[StringScalar]" = Field(default=None)
  # The image source for the logo. Must be an absolute HTTPS URL or a valid data: url
  src: "StringScalar"


class SignatureOrderWebhook(BaseModel):
  logs: "Optional[list[Optional[WebhookInvocation]]]" = Field(default=None)
  url: "Optional[StringScalar]" = Field(default=None)


# Must define a evidence provider subsection.
class SingleEvidenceProviderInput(BaseModel):
  # Criipto Verify based evidence for signatures.
  criiptoVerify: "Optional[CriiptoVerifyProviderInput]" = Field(default=None)
  # Hand drawn signature evidence for signatures.
  drawable: "Optional[DrawableEvidenceProviderInput]" = Field(default=None)
  # TEST environment only. Does not manipulate the PDF, use for integration or webhook testing.
  noop: "Optional[NoopEvidenceProviderInput]" = Field(default=None)
  # Deprecated
  oidc: "Optional[OidcEvidenceProviderInput]" = Field(default=None)


type SingleSignature = DrawableSignature | EmptySignature | JWTSignature

type SingleSignatureEvidenceProvider = (
  CriiptoVerifySignatureEvidenceProvider
  | DrawableSignatureEvidenceProvider
  | NoopSignatureEvidenceProvider
  | OidcJWTSignatureEvidenceProvider
)


class StartCriiptoVerifyEvidenceProviderInput(BaseModel):
  acrValue: "StringScalar"
  id: "IDScalar"
  redirectUri: "StringScalar"
  stage: "EvidenceValidationStage"


type StartCriiptoVerifyEvidenceProviderOutput = CriiptoVerifyEvidenceProviderRedirect


class Tenant(BaseModel):
  applications: "Optional[list[Optional[Application]]]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  webhookLogs: "Optional[list[Optional[WebhookInvocation]]]" = Field(default=None)


class TrackSignatoryInput(BaseModel):
  event: "SignatoryFrontendEvent"


class TrackSignatoryOutput(BaseModel):
  viewer: "Optional[Viewer]" = Field(default=None)


class UnvalidatedSignatoryViewer(BaseModel):
  authenticated: "Optional[BooleanScalar]" = Field(default=None)
  download: "Optional[SignatoryViewerDownload]" = Field(default=None)
  evidenceProviders: "Optional[list[Optional[SignatureEvidenceProvider]]]" = Field(
    default=None
  )
  id: "Optional[IDScalar]" = Field(default=None)
  signatoryId: "Optional[IDScalar]" = Field(default=None)
  ui: "Optional[SignatureOrderUI]" = Field(default=None)


class UpdateSignatoryDocumentStatusInput(BaseModel):
  documentId: "IDScalar"
  status: "SignatoryDocumentStatus"


class UpdateSignatoryDocumentStatusOutput(BaseModel):
  documentEdge: "Optional[SignatoryDocumentEdge]" = Field(default=None)
  viewer: "Optional[Viewer]" = Field(default=None)


class UserViewer(BaseModel):
  authenticated: "Optional[BooleanScalar]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  tenants: "Optional[list[Optional[Tenant]]]" = Field(default=None)


class ValidateDocumentInput(BaseModel):
  pdf: "Optional[BlobScalar]" = Field(default=None)
  xml: "Optional[BlobScalar]" = Field(default=None)


class ValidateDocumentOutput(BaseModel):
  errors: "Optional[list[Optional[StringScalar]]]" = Field(default=None)
  # Whether or not the errors are fixable using 'fixDocumentFormattingErrors'
  fixable: "Optional[BooleanScalar]" = Field(default=None)
  # `true` if the document contains signatures. If value is `null`, we were unable to determine whether the document has been previously signed.
  previouslySigned: "Optional[BooleanScalar]" = Field(default=None)
  valid: "Optional[BooleanScalar]" = Field(default=None)


class VerifyApplication(BaseModel):
  domain: "Optional[StringScalar]" = Field(default=None)
  environment: "Optional[VerifyApplicationEnvironment]" = Field(default=None)
  realm: "Optional[StringScalar]" = Field(default=None)


class VerifyApplicationEnvironment(StrEnum):
  PRODUCTION = "PRODUCTION"
  TEST = "TEST"


class VerifyApplicationQueryInput(BaseModel):
  domain: "StringScalar"
  realm: "StringScalar"
  tenantId: "IDScalar"


type Viewer = (
  AnonymousViewer
  | Application
  | BatchSignatoryViewer
  | SignatoryViewer
  | UnvalidatedSignatoryViewer
  | UserViewer
)


class WebhookExceptionInvocation(BaseModel):
  correlationId: "Optional[StringScalar]" = Field(default=None)
  event: "Optional[WebhookInvocationEvent]" = Field(default=None)
  exception: "Optional[StringScalar]" = Field(default=None)
  requestBody: "Optional[StringScalar]" = Field(default=None)
  responseBody: "Optional[StringScalar]" = Field(default=None)
  retryPayload: "Optional[StringScalar]" = Field(default=None)
  retryingAt: "Optional[StringScalar]" = Field(default=None)
  signatureOrderId: "Optional[StringScalar]" = Field(default=None)
  timestamp: "Optional[StringScalar]" = Field(default=None)
  url: "Optional[StringScalar]" = Field(default=None)


class WebhookHttpErrorInvocation(BaseModel):
  correlationId: "Optional[StringScalar]" = Field(default=None)
  event: "Optional[WebhookInvocationEvent]" = Field(default=None)
  requestBody: "Optional[StringScalar]" = Field(default=None)
  responseBody: "Optional[StringScalar]" = Field(default=None)
  responseStatusCode: "Optional[IntScalar]" = Field(default=None)
  retryPayload: "Optional[StringScalar]" = Field(default=None)
  retryingAt: "Optional[StringScalar]" = Field(default=None)
  signatureOrderId: "Optional[StringScalar]" = Field(default=None)
  timestamp: "Optional[StringScalar]" = Field(default=None)
  url: "Optional[StringScalar]" = Field(default=None)


type WebhookInvocation = (
  WebhookExceptionInvocation
  | WebhookHttpErrorInvocation
  | WebhookSuccessfulInvocation
  | WebhookTimeoutInvocation
)


class WebhookInvocationEvent(StrEnum):
  SIGNATORY_DOCUMENT_STATUS_CHANGED = "SIGNATORY_DOCUMENT_STATUS_CHANGED"
  SIGNATORY_DOWNLOAD_LINK_OPENED = "SIGNATORY_DOWNLOAD_LINK_OPENED"
  SIGNATORY_REJECTED = "SIGNATORY_REJECTED"
  SIGNATORY_SIGNED = "SIGNATORY_SIGNED"
  SIGNATORY_SIGN_ERROR = "SIGNATORY_SIGN_ERROR"
  SIGNATORY_SIGN_LINK_OPENED = "SIGNATORY_SIGN_LINK_OPENED"
  SIGNATURE_ORDER_EXPIRED = "SIGNATURE_ORDER_EXPIRED"


class WebhookSuccessfulInvocation(BaseModel):
  correlationId: "Optional[StringScalar]" = Field(default=None)
  event: "Optional[WebhookInvocationEvent]" = Field(default=None)
  requestBody: "Optional[StringScalar]" = Field(default=None)
  responseBody: "Optional[StringScalar]" = Field(default=None)
  responseStatusCode: "Optional[IntScalar]" = Field(default=None)
  signatureOrderId: "Optional[StringScalar]" = Field(default=None)
  timestamp: "Optional[StringScalar]" = Field(default=None)
  url: "Optional[StringScalar]" = Field(default=None)


class WebhookTimeoutInvocation(BaseModel):
  correlationId: "Optional[StringScalar]" = Field(default=None)
  event: "Optional[WebhookInvocationEvent]" = Field(default=None)
  requestBody: "Optional[StringScalar]" = Field(default=None)
  responseBody: "Optional[StringScalar]" = Field(default=None)
  responseTimeout: "Optional[IntScalar]" = Field(default=None)
  retryPayload: "Optional[StringScalar]" = Field(default=None)
  retryingAt: "Optional[StringScalar]" = Field(default=None)
  signatureOrderId: "Optional[StringScalar]" = Field(default=None)
  timestamp: "Optional[StringScalar]" = Field(default=None)
  url: "Optional[StringScalar]" = Field(default=None)


class XadesDocumentInput(BaseModel):
  blob: "BlobScalar"
  # Will not be displayed to signatories, can be used as a reference to your own system.
  reference: "Optional[StringScalar]" = Field(default=None)
  storageMode: "DocumentStorageMode"
  title: "StringScalar"


class XmlDocument(BaseModel):
  blob: "Optional[BlobScalar]" = Field(default=None)
  id: "Optional[IDScalar]" = Field(default=None)
  originalBlob: "Optional[BlobScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  signatoryViewerStatus: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  signatures: "Optional[list[Optional[Signature]]]" = Field(default=None)
  title: "Optional[StringScalar]" = Field(default=None)


AddSignatoriesInput.model_rebuild()
AddSignatoriesOutput.model_rebuild()
AddSignatoryInput.model_rebuild()
AddSignatoryOutput.model_rebuild()
AllOfEvidenceProviderInput.model_rebuild()
AllOfSignatureEvidenceProvider.model_rebuild()
AnonymousViewer.model_rebuild()
Application.model_rebuild()
ApplicationApiKey.model_rebuild()
BatchSignatory.model_rebuild()
BatchSignatoryItem.model_rebuild()
BatchSignatoryItemInput.model_rebuild()
BatchSignatoryViewer.model_rebuild()
CancelSignatureOrderInput.model_rebuild()
CancelSignatureOrderOutput.model_rebuild()
ChangeSignatoryInput.model_rebuild()
ChangeSignatoryOutput.model_rebuild()
ChangeSignatureOrderInput.model_rebuild()
ChangeSignatureOrderOutput.model_rebuild()
CleanupSignatureOrderInput.model_rebuild()
CleanupSignatureOrderOutput.model_rebuild()
CloseSignatureOrderInput.model_rebuild()
CloseSignatureOrderOutput.model_rebuild()
CompleteCriiptoVerifyEvidenceProviderInput.model_rebuild()
CompleteCriiptoVerifyEvidenceProviderOutput.model_rebuild()
CompositeSignature.model_rebuild()
CreateApplicationApiKeyInput.model_rebuild()
CreateApplicationApiKeyOutput.model_rebuild()
CreateApplicationInput.model_rebuild()
CreateApplicationOutput.model_rebuild()
CreateBatchSignatoryInput.model_rebuild()
CreateBatchSignatoryOutput.model_rebuild()
CreateSignatureOrderInput.model_rebuild()
CreateSignatureOrderOutput.model_rebuild()
CreateSignatureOrderSignatoryInput.model_rebuild()
CreateSignatureOrderUIInput.model_rebuild()
CreateSignatureOrderWebhookInput.model_rebuild()
CriiptoVerifyEvidenceProviderRedirect.model_rebuild()
CriiptoVerifyProviderInput.model_rebuild()
CriiptoVerifySignatureEvidenceProvider.model_rebuild()
DeleteApplicationApiKeyInput.model_rebuild()
DeleteApplicationApiKeyOutput.model_rebuild()
DeleteSignatoryInput.model_rebuild()
DeleteSignatoryOutput.model_rebuild()
DocumentInput.model_rebuild()
DownloadVerificationCriiptoVerifyInput.model_rebuild()
DownloadVerificationInput.model_rebuild()
DownloadVerificationOidcInput.model_rebuild()
DrawableEvidenceProviderInput.model_rebuild()
DrawableSignature.model_rebuild()
DrawableSignatureEvidenceProvider.model_rebuild()
EmptySignature.model_rebuild()
EvidenceProviderInput.model_rebuild()
ExtendSignatureOrderInput.model_rebuild()
ExtendSignatureOrderOutput.model_rebuild()
JWTClaim.model_rebuild()
JWTSignature.model_rebuild()
Mutation.model_rebuild()
NoopEvidenceProviderInput.model_rebuild()
NoopSignatureEvidenceProvider.model_rebuild()
OidcEvidenceProviderInput.model_rebuild()
OidcJWTSignatureEvidenceProvider.model_rebuild()
PadesDocumentFormInput.model_rebuild()
PadesDocumentInput.model_rebuild()
PadesDocumentSealsPageTemplateInput.model_rebuild()
PageInfo.model_rebuild()
PdfBoundingBoxInput.model_rebuild()
PdfDocument.model_rebuild()
PdfDocumentForm.model_rebuild()
PdfSealPosition.model_rebuild()
Query.model_rebuild()
RefreshApplicationApiKeyInput.model_rebuild()
RefreshApplicationApiKeyOutput.model_rebuild()
RejectSignatureOrderInput.model_rebuild()
RejectSignatureOrderOutput.model_rebuild()
RetrySignatureOrderWebhookInput.model_rebuild()
RetrySignatureOrderWebhookOutput.model_rebuild()
SignActingAsInput.model_rebuild()
SignActingAsOutput.model_rebuild()
SignAllOfInput.model_rebuild()
SignCriiptoVerifyInput.model_rebuild()
SignDocumentFormFieldInput.model_rebuild()
SignDocumentFormInput.model_rebuild()
SignDocumentInput.model_rebuild()
SignDrawableInput.model_rebuild()
SignInput.model_rebuild()
SignOidcInput.model_rebuild()
SignOutput.model_rebuild()
Signatory.model_rebuild()
SignatoryBeaconInput.model_rebuild()
SignatoryBeaconOutput.model_rebuild()
SignatoryDocumentConnection.model_rebuild()
SignatoryDocumentEdge.model_rebuild()
SignatoryDocumentInput.model_rebuild()
SignatoryEvidenceProviderInput.model_rebuild()
SignatoryEvidenceValidationInput.model_rebuild()
SignatoryUIInput.model_rebuild()
SignatoryViewer.model_rebuild()
SignatoryViewerDownload.model_rebuild()
SignatureAppearanceInput.model_rebuild()
SignatureAppearanceTemplateInput.model_rebuild()
SignatureAppearanceTemplateReplacementInput.model_rebuild()
SignatureOrder.model_rebuild()
SignatureOrderConnection.model_rebuild()
SignatureOrderEdge.model_rebuild()
SignatureOrderUI.model_rebuild()
SignatureOrderUILogo.model_rebuild()
SignatureOrderUILogoInput.model_rebuild()
SignatureOrderWebhook.model_rebuild()
SingleEvidenceProviderInput.model_rebuild()
StartCriiptoVerifyEvidenceProviderInput.model_rebuild()
Tenant.model_rebuild()
TrackSignatoryInput.model_rebuild()
TrackSignatoryOutput.model_rebuild()
UnvalidatedSignatoryViewer.model_rebuild()
UpdateSignatoryDocumentStatusInput.model_rebuild()
UpdateSignatoryDocumentStatusOutput.model_rebuild()
UserViewer.model_rebuild()
ValidateDocumentInput.model_rebuild()
ValidateDocumentOutput.model_rebuild()
VerifyApplication.model_rebuild()
VerifyApplicationQueryInput.model_rebuild()
WebhookExceptionInvocation.model_rebuild()
WebhookHttpErrorInvocation.model_rebuild()
WebhookSuccessfulInvocation.model_rebuild()
WebhookTimeoutInvocation.model_rebuild()
XadesDocumentInput.model_rebuild()
XmlDocument.model_rebuild()
