from enum import StrEnum
from typing import Optional
from pydantic import BaseModel, Field
from .models import (
  CreateSignatureOrderInput,
  CleanupSignatureOrderInput,
  AddSignatoryInput,
  AddSignatoriesInput,
  ChangeSignatoryInput,
  CloseSignatureOrderInput,
  CancelSignatureOrderInput,
  SignActingAsInput,
  ValidateDocumentInput,
  ExtendSignatureOrderInput,
  DeleteSignatoryInput,
  CreateBatchSignatoryInput,
  ChangeSignatureOrderInput,
)
from .models import (
  IDScalar,
  StringScalar,
  BooleanScalar,
  IntScalar,
  BlobScalar,
  DateScalar,
  DateTimeScalar,
  FloatScalar,
  URIScalar,
)
from .models import (
  ApplicationApiKeyMode,
  DocumentIDLocation,
  DocumentStorageMode,
  EvidenceValidationStage,
  Language,
  SignatoryDocumentStatus,
  SignatoryFrontendEvent,
  SignatoryStatus,
  SignatureOrderStatus,
  VerifyApplicationEnvironment,
  WebhookInvocationEvent,
)
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport, BasicAuth

BasicDocumentFragment = """fragment BasicDocument on Document {
  __typename
  id
  title
  reference
  ... on PdfDocument {
    form {
      enabled
    }
  }
}"""
SignedDocumentFragment = """fragment SignedDocument on Document {
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
}"""
BasicSignatoryFragment = """fragment BasicSignatory on Signatory {
  id
  status
  statusReason
  href
  downloadHref
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
}"""
BasicSignatureOrderFragment = """fragment BasicSignatureOrder on SignatureOrder {
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
}"""
BasicBatchSignatoryFragment = """fragment BasicBatchSignatory on BatchSignatory {
  id
  token
  href
}"""


class CreateSignatureOrder_CreateSignatureOrderOutput(BaseModel):
  signatureOrder: "CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder"


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: (
    "list[CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory]"
  )
  evidenceProviders: "list[CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider]"
  documents: (
    "list[CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document]"
  )


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory(
  BaseModel
):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: "list[CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection"


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


type CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document = (
  CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument
  | CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_XmlDocument
)


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument(
  BaseModel
):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)
  form: "Optional[CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm]" = Field(
    default=None
  )


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_XmlDocument(
  BaseModel
):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
  BaseModel
):
  enabled: "BooleanScalar"


class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


createSignatureOrderDocument = f"""mutation createSignatureOrder($input: CreateSignatureOrderInput!) {{
  createSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
      documents {{
        ...BasicDocument
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}"""


class CleanupSignatureOrder_CleanupSignatureOrderOutput(BaseModel):
  signatureOrder: "CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder"


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: (
    "list[CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory]"
  )
  evidenceProviders: "list[CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider]"
  documents: (
    "list[CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document]"
  )


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory(
  BaseModel
):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: "list[CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection"


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


type CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document = (
  CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument
  | CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_XmlDocument
)


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument(
  BaseModel
):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)
  form: "Optional[CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm]" = Field(
    default=None
  )


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_XmlDocument(
  BaseModel
):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
  BaseModel
):
  enabled: "BooleanScalar"


class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


cleanupSignatureOrderDocument = f"""mutation cleanupSignatureOrder($input: CleanupSignatureOrderInput!) {{
  cleanupSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
      documents {{
        ...BasicDocument
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}"""


class AddSignatory_AddSignatoryOutput(BaseModel):
  signatory: "AddSignatory_AddSignatoryOutput_Signatory"


class AddSignatory_AddSignatoryOutput_Signatory(BaseModel):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "AddSignatory_AddSignatoryOutput_Signatory_SignatureOrder"
  evidenceProviders: (
    "list[AddSignatory_AddSignatoryOutput_Signatory_SignatureEvidenceProvider]"
  )
  documents: "AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection"


class AddSignatory_AddSignatoryOutput_Signatory_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class AddSignatory_AddSignatoryOutput_Signatory_SignatureEvidenceProvider(BaseModel):
  id: "IDScalar"


class AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection(BaseModel):
  edges: "list[AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


addSignatoryDocument = f"""mutation addSignatory($input: AddSignatoryInput!) {{
  addSignatory(input: $input) {{
    signatory {{
      ...BasicSignatory
    }}
  }}
}}
{BasicSignatoryFragment}"""


class AddSignatories_AddSignatoriesOutput(BaseModel):
  signatories: "list[AddSignatories_AddSignatoriesOutput_Signatory]"


class AddSignatories_AddSignatoriesOutput_Signatory(BaseModel):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "AddSignatories_AddSignatoriesOutput_Signatory_SignatureOrder"
  evidenceProviders: (
    "list[AddSignatories_AddSignatoriesOutput_Signatory_SignatureEvidenceProvider]"
  )
  documents: "AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection"


class AddSignatories_AddSignatoriesOutput_Signatory_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class AddSignatories_AddSignatoriesOutput_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


addSignatoriesDocument = f"""mutation addSignatories($input: AddSignatoriesInput!) {{
  addSignatories(input: $input) {{
    signatories {{
      ...BasicSignatory
    }}
  }}
}}
{BasicSignatoryFragment}"""


class ChangeSignatory_ChangeSignatoryOutput(BaseModel):
  signatory: "ChangeSignatory_ChangeSignatoryOutput_Signatory"


class ChangeSignatory_ChangeSignatoryOutput_Signatory(BaseModel):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatureOrder"
  evidenceProviders: (
    "list[ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatureEvidenceProvider]"
  )
  documents: (
    "ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection"
  )


class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


changeSignatoryDocument = f"""mutation changeSignatory($input: ChangeSignatoryInput!) {{
  changeSignatory(input: $input) {{
    signatory {{
      ...BasicSignatory
    }}
  }}
}}
{BasicSignatoryFragment}"""


class CloseSignatureOrder_CloseSignatureOrderOutput(BaseModel):
  signatureOrder: "CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: (
    "list[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory]"
  )
  evidenceProviders: "list[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider]"
  documents: (
    "list[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document]"
  )


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory(BaseModel):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: "list[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


type CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document = (
  CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument
  | CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument
)


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument(
  BaseModel
):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)
  blob: "Optional[BlobScalar]" = Field(default=None)
  signatures: "Optional[list[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature]]" = Field(
    default=None
  )
  form: "Optional[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm]" = Field(
    default=None
  )


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument(
  BaseModel
):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)
  blob: "Optional[BlobScalar]" = Field(default=None)
  signatures: "Optional[list[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature]]" = Field(
    default=None
  )


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


type CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature = (
  CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature
  | CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature
  | CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature
  | CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature
)


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
  BaseModel
):
  enabled: "BooleanScalar"


type CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature = (
  CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature
  | CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature
  | CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature
  | CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature
)


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature(
  BaseModel
):
  signatory: "Optional[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory]" = Field(
    default=None
  )


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature(
  BaseModel
):
  signatory: "Optional[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory]" = Field(
    default=None
  )
  name: "Optional[StringScalar]" = Field(default=None)
  image: "BlobScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature(
  BaseModel
):
  signatory: "Optional[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory]" = Field(
    default=None
  )


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature(
  BaseModel
):
  signatory: "Optional[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory]" = Field(
    default=None
  )
  jwt: "StringScalar"
  jwks: "StringScalar"
  claims: "list[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim]"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature(
  BaseModel
):
  signatory: "Optional[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory]" = Field(
    default=None
  )


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature(
  BaseModel
):
  signatory: "Optional[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory]" = Field(
    default=None
  )
  name: "Optional[StringScalar]" = Field(default=None)
  image: "BlobScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature(
  BaseModel
):
  signatory: "Optional[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory]" = Field(
    default=None
  )


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature(
  BaseModel
):
  signatory: "Optional[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory]" = Field(
    default=None
  )
  jwt: "StringScalar"
  jwks: "StringScalar"
  claims: "list[CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim]"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim(
  BaseModel
):
  name: "StringScalar"
  value: "StringScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim(
  BaseModel
):
  name: "StringScalar"
  value: "StringScalar"


closeSignatureOrderDocument = f"""mutation closeSignatureOrder($input: CloseSignatureOrderInput!) {{
  closeSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
      documents {{
        ...BasicDocument
        ...SignedDocument
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}
{SignedDocumentFragment}"""


class CancelSignatureOrder_CancelSignatureOrderOutput(BaseModel):
  signatureOrder: "CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder"


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: (
    "list[CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory]"
  )
  evidenceProviders: "list[CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider]"
  documents: (
    "list[CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document]"
  )


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory(
  BaseModel
):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: "list[CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection"


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


type CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document = (
  CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument
  | CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_XmlDocument
)


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument(
  BaseModel
):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)
  form: "Optional[CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm]" = Field(
    default=None
  )


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_XmlDocument(
  BaseModel
):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
  BaseModel
):
  enabled: "BooleanScalar"


class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


cancelSignatureOrderDocument = f"""mutation cancelSignatureOrder($input: CancelSignatureOrderInput!) {{
  cancelSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
      documents {{
        ...BasicDocument
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}"""


class SignActingAs_SignActingAsOutput(BaseModel):
  signatory: "SignActingAs_SignActingAsOutput_Signatory"


class SignActingAs_SignActingAsOutput_Signatory(BaseModel):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "SignActingAs_SignActingAsOutput_Signatory_SignatureOrder"
  evidenceProviders: (
    "list[SignActingAs_SignActingAsOutput_Signatory_SignatureEvidenceProvider]"
  )
  documents: "SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection"


class SignActingAs_SignActingAsOutput_Signatory_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class SignActingAs_SignActingAsOutput_Signatory_SignatureEvidenceProvider(BaseModel):
  id: "IDScalar"


class SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection(BaseModel):
  edges: "list[SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


signActingAsDocument = f"""mutation signActingAs($input: SignActingAsInput!) {{
  signActingAs(input: $input) {{
    signatory {{
      ...BasicSignatory
    }}
  }}
}}
{BasicSignatoryFragment}"""


class ValidateDocument_ValidateDocumentOutput(BaseModel):
  valid: "BooleanScalar"
  errors: "Optional[list[StringScalar]]" = Field(default=None)
  # Whether or not the errors are fixable using 'fixDocumentFormattingErrors'
  fixable: "Optional[BooleanScalar]" = Field(default=None)


validateDocumentDocument = """mutation validateDocument($input: ValidateDocumentInput!) {
  validateDocument(input: $input) {
    valid
    errors
    fixable
  }
}"""


class ExtendSignatureOrder_ExtendSignatureOrderOutput(BaseModel):
  signatureOrder: "ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder"


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: (
    "list[ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory]"
  )
  evidenceProviders: "list[ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider]"
  documents: (
    "list[ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document]"
  )


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory(
  BaseModel
):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: "list[ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection"


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


type ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document = (
  ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument
  | ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_XmlDocument
)


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument(
  BaseModel
):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)
  form: "Optional[ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm]" = Field(
    default=None
  )


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_XmlDocument(
  BaseModel
):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
  BaseModel
):
  enabled: "BooleanScalar"


class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


extendSignatureOrderDocument = f"""mutation extendSignatureOrder($input: ExtendSignatureOrderInput!) {{
  extendSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
      documents {{
        ...BasicDocument
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}"""


class DeleteSignatory_DeleteSignatoryOutput(BaseModel):
  signatureOrder: "DeleteSignatory_DeleteSignatoryOutput_SignatureOrder"


class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: "list[DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory]"
  evidenceProviders: "list[DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_SignatureEvidenceProvider]"


class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory(BaseModel):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: (
    "DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureOrder"
  )
  evidenceProviders: "list[DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection"


class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


deleteSignatoryDocument = f"""mutation deleteSignatory($input: DeleteSignatoryInput!) {{
  deleteSignatory(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""


class CreateBatchSignatory_CreateBatchSignatoryOutput(BaseModel):
  batchSignatory: "CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory(BaseModel):
  id: "IDScalar"
  # The authentication token required for performing batch operations.
  token: "StringScalar"
  href: "StringScalar"
  items: "list[CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem]"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem(
  BaseModel
):
  signatureOrder: "CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder"
  signatory: "CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: "list[CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory]"
  evidenceProviders: "list[CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider]"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory(
  BaseModel
):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder"
  evidenceProviders: "list[CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider]"
  documents: "CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory(
  BaseModel
):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: "list[CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


createBatchSignatoryDocument = f"""mutation createBatchSignatory($input: CreateBatchSignatoryInput!) {{
  createBatchSignatory(input: $input) {{
    batchSignatory {{
      ...BasicBatchSignatory
      items {{
        signatureOrder {{
          ...BasicSignatureOrder
        }}
        signatory {{
          ...BasicSignatory
        }}
      }}
    }}
  }}
}}
{BasicBatchSignatoryFragment}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""


class ChangeSignatureOrder_ChangeSignatureOrderOutput(BaseModel):
  signatureOrder: "ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder"


class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: (
    "list[ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory]"
  )
  evidenceProviders: "list[ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider]"


class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory(
  BaseModel
):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: "list[ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection"


class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


changeSignatureOrderDocument = f"""mutation changeSignatureOrder($input: ChangeSignatureOrderInput!) {{
  changeSignatureOrder(input: $input) {{
    signatureOrder {{
      ...BasicSignatureOrder
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""


class QuerySignatureOrder_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: "list[QuerySignatureOrder_SignatureOrder_Signatory]"
  evidenceProviders: (
    "list[QuerySignatureOrder_SignatureOrder_SignatureEvidenceProvider]"
  )


class QuerySignatureOrder_SignatureOrder_Signatory(BaseModel):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "QuerySignatureOrder_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: (
    "list[QuerySignatureOrder_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  )
  documents: "QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection"


class QuerySignatureOrder_SignatureOrder_SignatureEvidenceProvider(BaseModel):
  id: "IDScalar"


class QuerySignatureOrder_SignatureOrder_Signatory_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class QuerySignatureOrder_SignatureOrder_Signatory_SignatureEvidenceProvider(BaseModel):
  id: "IDScalar"


class QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


querySignatureOrderDocument = f"""query signatureOrder($id: ID!) {{
  signatureOrder(id: $id) {{
    ...BasicSignatureOrder
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""


class QuerySignatureOrderWithDocuments_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: "list[QuerySignatureOrderWithDocuments_SignatureOrder_Signatory]"
  evidenceProviders: (
    "list[QuerySignatureOrderWithDocuments_SignatureOrder_SignatureEvidenceProvider]"
  )
  documents: "list[QuerySignatureOrderWithDocuments_SignatureOrder_Document]"


class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory(BaseModel):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: (
    "QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatureOrder"
  )
  evidenceProviders: "list[QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection"


class QuerySignatureOrderWithDocuments_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


type QuerySignatureOrderWithDocuments_SignatureOrder_Document = (
  QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument
  | QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument
)


class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument(BaseModel):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)
  blob: "Optional[BlobScalar]" = Field(default=None)
  signatures: "Optional[list[QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature]]" = Field(
    default=None
  )
  form: "Optional[QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_PdfDocumentForm]" = Field(
    default=None
  )


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument(BaseModel):
  id: "IDScalar"
  title: "StringScalar"
  reference: "Optional[StringScalar]" = Field(default=None)
  blob: "Optional[BlobScalar]" = Field(default=None)
  signatures: "Optional[list[QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature]]" = Field(
    default=None
  )


class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


type QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature = (
  QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature
  | QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature
  | QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_EmptySignature
  | QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature
)


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
  BaseModel
):
  enabled: "BooleanScalar"


type QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature = (
  QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature
  | QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature
  | QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_EmptySignature
  | QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature
)


class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature(
  BaseModel
):
  signatory: "Optional[QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory]" = Field(
    default=None
  )


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature(
  BaseModel
):
  signatory: "Optional[QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory]" = Field(
    default=None
  )
  name: "Optional[StringScalar]" = Field(default=None)
  image: "BlobScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_EmptySignature(
  BaseModel
):
  signatory: "Optional[QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory]" = Field(
    default=None
  )


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature(
  BaseModel
):
  signatory: "Optional[QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory]" = Field(
    default=None
  )
  jwt: "StringScalar"
  jwks: "StringScalar"
  claims: "list[QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim]"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature(
  BaseModel
):
  signatory: "Optional[QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory]" = Field(
    default=None
  )


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature(
  BaseModel
):
  signatory: "Optional[QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory]" = Field(
    default=None
  )
  name: "Optional[StringScalar]" = Field(default=None)
  image: "BlobScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_EmptySignature(
  BaseModel
):
  signatory: "Optional[QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory]" = Field(
    default=None
  )


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature(
  BaseModel
):
  signatory: "Optional[QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory]" = Field(
    default=None
  )
  jwt: "StringScalar"
  jwks: "StringScalar"
  claims: "list[QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim]"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim(
  BaseModel
):
  name: "StringScalar"
  value: "StringScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim(
  BaseModel
):
  name: "StringScalar"
  value: "StringScalar"


querySignatureOrderWithDocumentsDocument = f"""query signatureOrderWithDocuments($id: ID!) {{
  signatureOrder(id: $id) {{
    ...BasicSignatureOrder
    documents {{
      ...BasicDocument
      ...SignedDocument
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}
{BasicDocumentFragment}
{SignedDocumentFragment}"""


class QuerySignatory_Signatory(BaseModel):
  # Signature order for the signatory.
  signatureOrder: "QuerySignatory_Signatory_SignatureOrder"
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "QuerySignatory_Signatory_SignatureOrder"
  evidenceProviders: "list[QuerySignatory_Signatory_SignatureEvidenceProvider]"
  documents: "QuerySignatory_Signatory_SignatoryDocumentConnection"


class QuerySignatory_Signatory_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: "list[QuerySignatory_Signatory_SignatureOrder_Signatory]"
  evidenceProviders: (
    "list[QuerySignatory_Signatory_SignatureOrder_SignatureEvidenceProvider]"
  )


class QuerySignatory_Signatory_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class QuerySignatory_Signatory_SignatureEvidenceProvider(BaseModel):
  id: "IDScalar"


class QuerySignatory_Signatory_SignatoryDocumentConnection(BaseModel):
  edges: (
    "list[QuerySignatory_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"
  )


class QuerySignatory_Signatory_SignatureOrder_Signatory(BaseModel):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "QuerySignatory_Signatory_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: (
    "list[QuerySignatory_Signatory_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  )
  documents: (
    "QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection"
  )


class QuerySignatory_Signatory_SignatureOrder_SignatureEvidenceProvider(BaseModel):
  id: "IDScalar"


class QuerySignatory_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "QuerySignatory_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class QuerySignatory_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


querySignatoryDocument = f"""query signatory($id: ID!) {{
  signatory(id: $id) {{
    signatureOrder {{
      ...BasicSignatureOrder
    }}
    ...BasicSignatory
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""
type QuerySignatureOrders_Viewer = (
  QuerySignatureOrders_Viewer_AnonymousViewer
  | QuerySignatureOrders_Viewer_Application
  | QuerySignatureOrders_Viewer_BatchSignatoryViewer
  | QuerySignatureOrders_Viewer_SignatoryViewer
  | QuerySignatureOrders_Viewer_UnvalidatedSignatoryViewer
  | QuerySignatureOrders_Viewer_UserViewer
)


class QuerySignatureOrders_Viewer_AnonymousViewer(BaseModel):
  pass


class QuerySignatureOrders_Viewer_Application(BaseModel):
  signatureOrders: "QuerySignatureOrders_Viewer_Application_SignatureOrderConnection"


class QuerySignatureOrders_Viewer_BatchSignatoryViewer(BaseModel):
  pass


class QuerySignatureOrders_Viewer_SignatoryViewer(BaseModel):
  pass


class QuerySignatureOrders_Viewer_UnvalidatedSignatoryViewer(BaseModel):
  pass


class QuerySignatureOrders_Viewer_UserViewer(BaseModel):
  pass


# A connection from an object to a list of objects of type SignatureOrder
class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection(BaseModel):
  # Information to aid in pagination.
  edges: "list[QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge]"


# An edge in a connection from an object to another object of type SignatureOrder
class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge(
  BaseModel
):
  # The item at the end of the edge. Must NOT be an enumerable collection.
  node: "QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder"


class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: "list[QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory]"
  evidenceProviders: "list[QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_SignatureEvidenceProvider]"


class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory(
  BaseModel
):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: "list[QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection"


class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


querySignatureOrdersDocument = f"""query signatureOrders($status: SignatureOrderStatus, $first: Int!, $after: String) {{
  viewer {{
    __typename
    ... on Application {{
      signatureOrders(status: $status, first: $first, after: $after) {{
        edges {{
          node {{
            ...BasicSignatureOrder
          }}
        }}
      }}
    }}
  }}
}}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""


class QueryBatchSignatory_BatchSignatory(BaseModel):
  id: "IDScalar"
  # The authentication token required for performing batch operations.
  token: "StringScalar"
  href: "StringScalar"
  items: "list[QueryBatchSignatory_BatchSignatory_BatchSignatoryItem]"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem(BaseModel):
  signatureOrder: "QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder"
  signatory: "QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder(BaseModel):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  title: "Optional[StringScalar]" = Field(default=None)
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"
  # Number of max signatories for the signature order
  maxSignatories: "IntScalar"
  # List of signatories for the signature order.
  signatories: "list[QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory]"
  evidenceProviders: "list[QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider]"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory(BaseModel):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: (
    "QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder"
  )
  evidenceProviders: "list[QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider]"
  documents: "QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory(
  BaseModel
):
  id: "IDScalar"
  # The current status of the signatory.
  status: "SignatoryStatus"
  # The reason for the signatory status (rejection reason when rejected).
  statusReason: "Optional[StringScalar]" = Field(default=None)
  # A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
  href: "StringScalar"
  # A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
  downloadHref: "Optional[StringScalar]" = Field(default=None)
  reference: "Optional[StringScalar]" = Field(default=None)
  role: "Optional[StringScalar]" = Field(default=None)
  # Signature order for the signatory.
  signatureOrder: "QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder"
  evidenceProviders: "list[QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider]"
  documents: "QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder(
  BaseModel
):
  id: "IDScalar"
  status: "SignatureOrderStatus"
  closedAt: "Optional[DateTimeScalar]" = Field(default=None)
  expiresAt: "DateTimeScalar"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider(
  BaseModel
):
  id: "IDScalar"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection(
  BaseModel
):
  edges: "list[QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge]"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
  BaseModel
):
  status: "Optional[SignatoryDocumentStatus]" = Field(default=None)
  node: "QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
  BaseModel
):
  id: "IDScalar"


queryBatchSignatoryDocument = f"""query batchSignatory($id: ID!) {{
  batchSignatory(id: $id) {{
    ...BasicBatchSignatory
    items {{
      signatureOrder {{
        ...BasicSignatureOrder
      }}
      signatory {{
        ...BasicSignatory
      }}
    }}
  }}
}}
{BasicBatchSignatoryFragment}
{BasicSignatureOrderFragment}
{BasicSignatoryFragment}"""


class CriiptoSignaturesSDK:
  def __init__(self, clientId: str, clientSecret: str):
    auth = BasicAuth(clientId, clientSecret)
    transport = AIOHTTPTransport(
      url=" https://signatures-api.criipto.com/v1/graphql", auth=auth
    )
    self.client = Client(transport=transport, fetch_schema_from_transport=False)

  def createSignatureOrder(
    self, input: CreateSignatureOrderInput
  ) -> CreateSignatureOrder_CreateSignatureOrderOutput:
    query = gql(createSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = CreateSignatureOrder_CreateSignatureOrderOutput.model_validate(
      result.get("createSignatureOrder")
    )
    return parsed

  def cleanupSignatureOrder(
    self, input: CleanupSignatureOrderInput
  ) -> CleanupSignatureOrder_CleanupSignatureOrderOutput:
    query = gql(cleanupSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = CleanupSignatureOrder_CleanupSignatureOrderOutput.model_validate(
      result.get("cleanupSignatureOrder")
    )
    return parsed

  def addSignatory(self, input: AddSignatoryInput) -> AddSignatory_AddSignatoryOutput:
    query = gql(addSignatoryDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = AddSignatory_AddSignatoryOutput.model_validate(result.get("addSignatory"))
    return parsed

  def addSignatories(
    self, input: AddSignatoriesInput
  ) -> AddSignatories_AddSignatoriesOutput:
    query = gql(addSignatoriesDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = AddSignatories_AddSignatoriesOutput.model_validate(
      result.get("addSignatories")
    )
    return parsed

  def changeSignatory(
    self, input: ChangeSignatoryInput
  ) -> ChangeSignatory_ChangeSignatoryOutput:
    query = gql(changeSignatoryDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = ChangeSignatory_ChangeSignatoryOutput.model_validate(
      result.get("changeSignatory")
    )
    return parsed

  def closeSignatureOrder(
    self, input: CloseSignatureOrderInput
  ) -> CloseSignatureOrder_CloseSignatureOrderOutput:
    query = gql(closeSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = CloseSignatureOrder_CloseSignatureOrderOutput.model_validate(
      result.get("closeSignatureOrder")
    )
    return parsed

  def cancelSignatureOrder(
    self, input: CancelSignatureOrderInput
  ) -> CancelSignatureOrder_CancelSignatureOrderOutput:
    query = gql(cancelSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = CancelSignatureOrder_CancelSignatureOrderOutput.model_validate(
      result.get("cancelSignatureOrder")
    )
    return parsed

  def signActingAs(self, input: SignActingAsInput) -> SignActingAs_SignActingAsOutput:
    query = gql(signActingAsDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = SignActingAs_SignActingAsOutput.model_validate(result.get("signActingAs"))
    return parsed

  def validateDocument(
    self, input: ValidateDocumentInput
  ) -> ValidateDocument_ValidateDocumentOutput:
    query = gql(validateDocumentDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = ValidateDocument_ValidateDocumentOutput.model_validate(
      result.get("validateDocument")
    )
    return parsed

  def extendSignatureOrder(
    self, input: ExtendSignatureOrderInput
  ) -> ExtendSignatureOrder_ExtendSignatureOrderOutput:
    query = gql(extendSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = ExtendSignatureOrder_ExtendSignatureOrderOutput.model_validate(
      result.get("extendSignatureOrder")
    )
    return parsed

  def deleteSignatory(
    self, input: DeleteSignatoryInput
  ) -> DeleteSignatory_DeleteSignatoryOutput:
    query = gql(deleteSignatoryDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = DeleteSignatory_DeleteSignatoryOutput.model_validate(
      result.get("deleteSignatory")
    )
    return parsed

  def createBatchSignatory(
    self, input: CreateBatchSignatoryInput
  ) -> CreateBatchSignatory_CreateBatchSignatoryOutput:
    query = gql(createBatchSignatoryDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = CreateBatchSignatory_CreateBatchSignatoryOutput.model_validate(
      result.get("createBatchSignatory")
    )
    return parsed

  def changeSignatureOrder(
    self, input: ChangeSignatureOrderInput
  ) -> ChangeSignatureOrder_ChangeSignatureOrderOutput:
    query = gql(changeSignatureOrderDocument)
    variables = {"input": input.model_dump()}
    result = self.client.execute(query, variable_values=variables)
    parsed = ChangeSignatureOrder_ChangeSignatureOrderOutput.model_validate(
      result.get("changeSignatureOrder")
    )
    return parsed

  def querySignatureOrder(self, id: IDScalar) -> QuerySignatureOrder_SignatureOrder:
    query = gql(querySignatureOrderDocument)
    variables = {"id": id}
    result = self.client.execute(query, variable_values=variables)
    parsed = QuerySignatureOrder_SignatureOrder.model_validate(
      result.get("signatureOrder")
    )
    return parsed

  def querySignatureOrderWithDocuments(
    self, id: IDScalar
  ) -> QuerySignatureOrderWithDocuments_SignatureOrder:
    query = gql(querySignatureOrderWithDocumentsDocument)
    variables = {"id": id}
    result = self.client.execute(query, variable_values=variables)
    parsed = QuerySignatureOrderWithDocuments_SignatureOrder.model_validate(
      result.get("signatureOrder")
    )
    return parsed

  def querySignatory(self, id: IDScalar) -> QuerySignatory_Signatory:
    query = gql(querySignatoryDocument)
    variables = {"id": id}
    result = self.client.execute(query, variable_values=variables)
    parsed = QuerySignatory_Signatory.model_validate(result.get("signatory"))
    return parsed

  def querySignatureOrders(
    self,
    status: Optional[SignatureOrderStatus],
    first: IntScalar,
    after: Optional[StringScalar],
  ) -> QuerySignatureOrders_Viewer:
    query = gql(querySignatureOrdersDocument)
    variables = {"status": status, "first": first, "after": after}
    result = self.client.execute(query, variable_values=variables)
    parsed = QuerySignatureOrders_Viewer.model_validate(result.get("viewer"))
    return parsed

  def queryBatchSignatory(self, id: IDScalar) -> QueryBatchSignatory_BatchSignatory:
    query = gql(queryBatchSignatoryDocument)
    variables = {"id": id}
    result = self.client.execute(query, variable_values=variables)
    parsed = QueryBatchSignatory_BatchSignatory.model_validate(
      result.get("batchSignatory")
    )
    return parsed
