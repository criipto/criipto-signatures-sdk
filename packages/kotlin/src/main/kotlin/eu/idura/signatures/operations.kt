package eu.idura.signatures
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import kotlinx.coroutines.future.await
import java.io.IOException
const val BasicDocumentFragment = """
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
"""
const val SingleSignatureFragment = """
fragment SingleSignature on SingleSignature {
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
  ... on NorwegianBankIdSignature {
    claims {
      name
      value
    }
    signingCertificate {
      raw
      issuer
      subject
    }
  }
}
"""
const val SignedDocumentFragment = """
fragment SignedDocument on Document {
  id
  title
  blob
  signatures {
    __typename
    signatory {
      id
    }
    timestampToken {
      timestamp
    }
    ...SingleSignature
    ... on CompositeSignature {
      signatures {
        ...SingleSignature
      }
    }
  }
}
"""
const val BasicSignatoryFragment = """
fragment BasicSignatory on Signatory {
  id
  status
  statusReason
  href
  downloadHref
  token
  reference
  role
  signingAs
  signatoryRole
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
"""
const val BasicSignatureOrderFragment = """
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
"""
const val BasicBatchSignatoryFragment = """
fragment BasicBatchSignatory on BatchSignatory {
  id
  token
  href
}
"""
data class CreateSignatureOrder_CreateSignatureOrderOutput(
    val signatureOrder: CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder
)
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder(
    val closedAt: String? = null,
    val documents: List<CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document>,
    val evidenceProviders: List<CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument::class, name = "PdfDocument"),
    JsonSubTypes.Type(value = CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_XmlDocument::class, name = "XmlDocument")
)
sealed class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document {
    data class Unknown(val __typename: String = "") : CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document()
}
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory(
    val documents: CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument(
    val documentID: String,
    val form: CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm? = null,
    val id: String,
    val reference: String? = null,
    val title: String
) : CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document()
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_XmlDocument(
    val id: String,
    val reference: String? = null,
    val title: String
) : CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document()
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
    val enabled: Boolean
)
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val createSignatureOrderDocument = """
mutation createSignatureOrder(${'$'}input: CreateSignatureOrderInput!) {
  createSignatureOrder(input: ${'$'}input) {
    signatureOrder {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
      }
    }
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment + BasicDocumentFragment
data class CleanupSignatureOrder_CleanupSignatureOrderOutput(
    val signatureOrder: CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder
)
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder(
    val closedAt: String? = null,
    val documents: List<CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document>,
    val evidenceProviders: List<CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument::class, name = "PdfDocument"),
    JsonSubTypes.Type(value = CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_XmlDocument::class, name = "XmlDocument")
)
sealed class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document {
    data class Unknown(val __typename: String = "") : CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document()
}
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory(
    val documents: CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument(
    val documentID: String,
    val form: CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm? = null,
    val id: String,
    val reference: String? = null,
    val title: String
) : CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document()
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_XmlDocument(
    val id: String,
    val reference: String? = null,
    val title: String
) : CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document()
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
    val enabled: Boolean
)
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val cleanupSignatureOrderDocument = """
mutation cleanupSignatureOrder(${'$'}input: CleanupSignatureOrderInput!) {
  cleanupSignatureOrder(input: ${'$'}input) {
    signatureOrder {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
      }
    }
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment + BasicDocumentFragment
data class AddSignatory_AddSignatoryOutput(
    val signatory: AddSignatory_AddSignatoryOutput_Signatory
)
data class AddSignatory_AddSignatoryOutput_Signatory(
    val documents: AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<AddSignatory_AddSignatoryOutput_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: AddSignatory_AddSignatoryOutput_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: AddSignatory_AddSignatoryOutput_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection(
    val edges: List<AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class AddSignatory_AddSignatoryOutput_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class AddSignatory_AddSignatoryOutput_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class AddSignatory_AddSignatoryOutput_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class AddSignatory_AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val addSignatoryDocument = """
mutation addSignatory(${'$'}input: AddSignatoryInput!) {
  addSignatory(input: ${'$'}input) {
    signatory {
      ...BasicSignatory
    }
  }
}
""" + BasicSignatoryFragment
data class AddSignatories_AddSignatoriesOutput(
    val signatories: List<AddSignatories_AddSignatoriesOutput_Signatory>
)
data class AddSignatories_AddSignatoriesOutput_Signatory(
    val documents: AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<AddSignatories_AddSignatoriesOutput_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: AddSignatories_AddSignatoriesOutput_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: AddSignatories_AddSignatoriesOutput_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection(
    val edges: List<AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class AddSignatories_AddSignatoriesOutput_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class AddSignatories_AddSignatoriesOutput_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class AddSignatories_AddSignatoriesOutput_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class AddSignatories_AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val addSignatoriesDocument = """
mutation addSignatories(${'$'}input: AddSignatoriesInput!) {
  addSignatories(input: ${'$'}input) {
    signatories {
      ...BasicSignatory
    }
  }
}
""" + BasicSignatoryFragment
data class ChangeSignatory_ChangeSignatoryOutput(
    val signatory: ChangeSignatory_ChangeSignatoryOutput_Signatory
)
data class ChangeSignatory_ChangeSignatoryOutput_Signatory(
    val documents: ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection(
    val edges: List<ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class ChangeSignatory_ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val changeSignatoryDocument = """
mutation changeSignatory(${'$'}input: ChangeSignatoryInput!) {
  changeSignatory(input: ${'$'}input) {
    signatory {
      ...BasicSignatory
    }
  }
}
""" + BasicSignatoryFragment
data class CloseSignatureOrder_CloseSignatureOrderOutput(
    val signatureOrder: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder(
    val closedAt: String? = null,
    val documents: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document>,
    val evidenceProviders: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument::class, name = "PdfDocument"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument::class, name = "XmlDocument")
)
sealed class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document {
    data class Unknown(val __typename: String = "") : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document()
}
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory(
    val documents: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument(
    val blob: ByteArray? = null,
    val documentID: String,
    val form: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm? = null,
    val id: String,
    val reference: String? = null,
    val signatures: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature>? = null,
    val title: String
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument(
    val blob: ByteArray? = null,
    val id: String,
    val reference: String? = null,
    val signatures: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature>? = null,
    val title: String
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
    val enabled: Boolean
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature::class, name = "CompositeSignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature::class, name = "DrawableSignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature::class, name = "EmptySignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature::class, name = "JWTSignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature::class, name = "NorwegianBankIdSignature")
)
sealed class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature {
    data class Unknown(val __typename: String = "") : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature()
}
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature::class, name = "CompositeSignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature::class, name = "DrawableSignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature::class, name = "EmptySignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature::class, name = "JWTSignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature::class, name = "NorwegianBankIdSignature")
)
sealed class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature {
    data class Unknown(val __typename: String = "") : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature()
}
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature(
    val signatory: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory? = null,
    val signatures: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature>,
    val timestampToken: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_TimestampToken
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature(
    val image: ByteArray,
    val name: String? = null,
    val signatory: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory? = null,
    val timestampToken: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_TimestampToken
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature(
    val signatory: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory? = null,
    val timestampToken: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_TimestampToken
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature(
    val claims: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim>,
    val jwks: String,
    val jwt: String,
    val signatory: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory? = null,
    val timestampToken: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_TimestampToken
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature(
    val claims: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_JWTClaim>,
    val signatory: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_Signatory? = null,
    val signingCertificate: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_Certificate,
    val timestampToken: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_TimestampToken
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature(
    val signatory: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory? = null,
    val signatures: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature>,
    val timestampToken: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_TimestampToken
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature(
    val image: ByteArray,
    val name: String? = null,
    val signatory: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory? = null,
    val timestampToken: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_TimestampToken
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature(
    val signatory: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory? = null,
    val timestampToken: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_TimestampToken
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature(
    val claims: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim>,
    val jwks: String,
    val jwt: String,
    val signatory: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory? = null,
    val timestampToken: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_TimestampToken
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature(
    val claims: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_JWTClaim>,
    val signatory: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_Signatory? = null,
    val signingCertificate: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_Certificate,
    val timestampToken: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_TimestampToken
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory(
    val id: String
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_DrawableSignature::class, name = "DrawableSignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_EmptySignature::class, name = "EmptySignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_JWTSignature::class, name = "JWTSignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature::class, name = "NorwegianBankIdSignature")
)
sealed class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature {
    data class Unknown(val __typename: String = "") : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature()
}
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_TimestampToken(
    val timestamp: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_TimestampToken(
    val timestamp: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_TimestampToken(
    val timestamp: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim(
    val name: String,
    val value: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_TimestampToken(
    val timestamp: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_JWTClaim(
    val name: String,
    val value: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_Signatory(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_Certificate(
    val issuer: String,
    val raw: ByteArray,
    val subject: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_TimestampToken(
    val timestamp: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory(
    val id: String
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_DrawableSignature::class, name = "DrawableSignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_EmptySignature::class, name = "EmptySignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_JWTSignature::class, name = "JWTSignature"),
    JsonSubTypes.Type(value = CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature::class, name = "NorwegianBankIdSignature")
)
sealed class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature {
    data class Unknown(val __typename: String = "") : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature()
}
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_TimestampToken(
    val timestamp: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_TimestampToken(
    val timestamp: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_TimestampToken(
    val timestamp: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim(
    val name: String,
    val value: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_TimestampToken(
    val timestamp: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_JWTClaim(
    val name: String,
    val value: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_Signatory(
    val id: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_Certificate(
    val issuer: String,
    val raw: ByteArray,
    val subject: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_TimestampToken(
    val timestamp: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_DrawableSignature(
    val image: ByteArray,
    val name: String? = null
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature()
class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_EmptySignature() : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_JWTSignature(
    val claims: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_JWTSignature_JWTClaim>,
    val jwks: String,
    val jwt: String
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature(
    val claims: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_JWTClaim>,
    val signingCertificate: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_Certificate
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_DrawableSignature(
    val image: ByteArray,
    val name: String? = null
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature()
class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_EmptySignature() : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_JWTSignature(
    val claims: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_JWTSignature_JWTClaim>,
    val jwks: String,
    val jwt: String
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature(
    val claims: List<CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_JWTClaim>,
    val signingCertificate: CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_Certificate
) : CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature()
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_JWTSignature_JWTClaim(
    val name: String,
    val value: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_JWTClaim(
    val name: String,
    val value: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_Certificate(
    val issuer: String,
    val raw: ByteArray,
    val subject: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_JWTSignature_JWTClaim(
    val name: String,
    val value: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_JWTClaim(
    val name: String,
    val value: String
)
data class CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_Certificate(
    val issuer: String,
    val raw: ByteArray,
    val subject: String
)
const val closeSignatureOrderDocument = """
mutation closeSignatureOrder(${'$'}input: CloseSignatureOrderInput!) {
  closeSignatureOrder(input: ${'$'}input) {
    signatureOrder {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
        ...SignedDocument
      }
    }
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment + BasicDocumentFragment + SignedDocumentFragment + SingleSignatureFragment
data class CancelSignatureOrder_CancelSignatureOrderOutput(
    val signatureOrder: CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder
)
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder(
    val closedAt: String? = null,
    val documents: List<CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document>,
    val evidenceProviders: List<CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument::class, name = "PdfDocument"),
    JsonSubTypes.Type(value = CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_XmlDocument::class, name = "XmlDocument")
)
sealed class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document {
    data class Unknown(val __typename: String = "") : CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document()
}
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory(
    val documents: CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument(
    val documentID: String,
    val form: CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm? = null,
    val id: String,
    val reference: String? = null,
    val title: String
) : CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document()
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_XmlDocument(
    val id: String,
    val reference: String? = null,
    val title: String
) : CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document()
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
    val enabled: Boolean
)
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val cancelSignatureOrderDocument = """
mutation cancelSignatureOrder(${'$'}input: CancelSignatureOrderInput!) {
  cancelSignatureOrder(input: ${'$'}input) {
    signatureOrder {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
      }
    }
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment + BasicDocumentFragment
data class SignActingAs_SignActingAsOutput(
    val signatory: SignActingAs_SignActingAsOutput_Signatory
)
data class SignActingAs_SignActingAsOutput_Signatory(
    val documents: SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<SignActingAs_SignActingAsOutput_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: SignActingAs_SignActingAsOutput_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: SignActingAs_SignActingAsOutput_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection(
    val edges: List<SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class SignActingAs_SignActingAsOutput_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class SignActingAs_SignActingAsOutput_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class SignActingAs_SignActingAsOutput_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class SignActingAs_SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val signActingAsDocument = """
mutation signActingAs(${'$'}input: SignActingAsInput!) {
  signActingAs(input: ${'$'}input) {
    signatory {
      ...BasicSignatory
    }
  }
}
""" + BasicSignatoryFragment
data class ValidateDocument_ValidateDocumentOutput(
    val errors: List<String>? = null,
    val fixable: Boolean? = null,
    val valid: Boolean
)
const val validateDocumentDocument = """
mutation validateDocument(${'$'}input: ValidateDocumentInput!) {
  validateDocument(input: ${'$'}input) {
    valid
    errors
    fixable
  }
}
"""
data class ExtendSignatureOrder_ExtendSignatureOrderOutput(
    val signatureOrder: ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder
)
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder(
    val closedAt: String? = null,
    val documents: List<ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document>,
    val evidenceProviders: List<ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument::class, name = "PdfDocument"),
    JsonSubTypes.Type(value = ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_XmlDocument::class, name = "XmlDocument")
)
sealed class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document {
    data class Unknown(val __typename: String = "") : ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document()
}
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory(
    val documents: ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument(
    val documentID: String,
    val form: ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm? = null,
    val id: String,
    val reference: String? = null,
    val title: String
) : ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document()
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_XmlDocument(
    val id: String,
    val reference: String? = null,
    val title: String
) : ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document()
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
    val enabled: Boolean
)
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val extendSignatureOrderDocument = """
mutation extendSignatureOrder(${'$'}input: ExtendSignatureOrderInput!) {
  extendSignatureOrder(input: ${'$'}input) {
    signatureOrder {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
      }
    }
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment + BasicDocumentFragment
data class DeleteSignatory_DeleteSignatoryOutput(
    val signatureOrder: DeleteSignatory_DeleteSignatoryOutput_SignatureOrder
)
data class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder(
    val closedAt: String? = null,
    val evidenceProviders: List<DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
data class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory(
    val documents: DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class DeleteSignatory_DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val deleteSignatoryDocument = """
mutation deleteSignatory(${'$'}input: DeleteSignatoryInput!) {
  deleteSignatory(input: ${'$'}input) {
    signatureOrder {
      ...BasicSignatureOrder
    }
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment
data class CreateBatchSignatory_CreateBatchSignatoryOutput(
    val batchSignatory: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory(
    val href: String,
    val id: String,
    val items: List<CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem>,
    val token: String
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem(
    val signatory: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory,
    val signatureOrder: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory(
    val documents: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder(
    val closedAt: String? = null,
    val evidenceProviders: List<CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection(
    val edges: List<CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory(
    val documents: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val createBatchSignatoryDocument = """
mutation createBatchSignatory(${'$'}input: CreateBatchSignatoryInput!) {
  createBatchSignatory(input: ${'$'}input) {
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
""" + BasicBatchSignatoryFragment + BasicSignatureOrderFragment + BasicSignatoryFragment
data class ChangeSignatureOrder_ChangeSignatureOrderOutput(
    val signatureOrder: ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder
)
data class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder(
    val closedAt: String? = null,
    val evidenceProviders: List<ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
data class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory(
    val documents: ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val changeSignatureOrderDocument = """
mutation changeSignatureOrder(${'$'}input: ChangeSignatureOrderInput!) {
  changeSignatureOrder(input: ${'$'}input) {
    signatureOrder {
      ...BasicSignatureOrder
    }
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment
data class QuerySignatureOrder_SignatureOrder(
    val closedAt: String? = null,
    val evidenceProviders: List<QuerySignatureOrder_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<QuerySignatureOrder_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
data class QuerySignatureOrder_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class QuerySignatureOrder_SignatureOrder_Signatory(
    val documents: QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<QuerySignatureOrder_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: QuerySignatureOrder_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: QuerySignatureOrder_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class QuerySignatureOrder_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class QuerySignatureOrder_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class QuerySignatureOrder_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class QuerySignatureOrder_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val querySignatureOrderDocument = """
query signatureOrder(${'$'}id: ID!) {
  signatureOrder(id: ${'$'}id) {
    ...BasicSignatureOrder
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment
data class QuerySignatureOrderWithDocuments_SignatureOrder(
    val closedAt: String? = null,
    val documents: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document>,
    val evidenceProviders: List<QuerySignatureOrderWithDocuments_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<QuerySignatureOrderWithDocuments_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = QuerySignatureOrderWithDocuments_SignatureOrder_Document.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument::class, name = "PdfDocument"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument::class, name = "XmlDocument")
)
sealed class QuerySignatureOrderWithDocuments_SignatureOrder_Document {
    data class Unknown(val __typename: String = "") : QuerySignatureOrderWithDocuments_SignatureOrder_Document()
}
data class QuerySignatureOrderWithDocuments_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory(
    val documents: QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument(
    val blob: ByteArray? = null,
    val documentID: String,
    val form: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_PdfDocumentForm? = null,
    val id: String,
    val reference: String? = null,
    val signatures: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature>? = null,
    val title: String
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument(
    val blob: ByteArray? = null,
    val id: String,
    val reference: String? = null,
    val signatures: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature>? = null,
    val title: String
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_PdfDocumentForm(
    val enabled: Boolean
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature::class, name = "CompositeSignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature::class, name = "DrawableSignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_EmptySignature::class, name = "EmptySignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature::class, name = "JWTSignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature::class, name = "NorwegianBankIdSignature")
)
sealed class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature {
    data class Unknown(val __typename: String = "") : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature()
}
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature::class, name = "CompositeSignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature::class, name = "DrawableSignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_EmptySignature::class, name = "EmptySignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature::class, name = "JWTSignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature::class, name = "NorwegianBankIdSignature")
)
sealed class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature {
    data class Unknown(val __typename: String = "") : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature()
}
data class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature(
    val signatory: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory? = null,
    val signatures: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature>,
    val timestampToken: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_TimestampToken
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature(
    val image: ByteArray,
    val name: String? = null,
    val signatory: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory? = null,
    val timestampToken: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_TimestampToken
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_EmptySignature(
    val signatory: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory? = null,
    val timestampToken: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_TimestampToken
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature(
    val claims: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim>,
    val jwks: String,
    val jwt: String,
    val signatory: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory? = null,
    val timestampToken: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_TimestampToken
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature(
    val claims: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_JWTClaim>,
    val signatory: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_Signatory? = null,
    val signingCertificate: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_Certificate,
    val timestampToken: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_TimestampToken
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature(
    val signatory: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory? = null,
    val signatures: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature>,
    val timestampToken: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_TimestampToken
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature(
    val image: ByteArray,
    val name: String? = null,
    val signatory: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory? = null,
    val timestampToken: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_TimestampToken
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_EmptySignature(
    val signatory: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory? = null,
    val timestampToken: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_TimestampToken
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature(
    val claims: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim>,
    val jwks: String,
    val jwt: String,
    val signatory: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory? = null,
    val timestampToken: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_TimestampToken
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature(
    val claims: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_JWTClaim>,
    val signatory: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_Signatory? = null,
    val signingCertificate: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_Certificate,
    val timestampToken: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_TimestampToken
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory(
    val id: String
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_DrawableSignature::class, name = "DrawableSignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_EmptySignature::class, name = "EmptySignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_JWTSignature::class, name = "JWTSignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature::class, name = "NorwegianBankIdSignature")
)
sealed class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature {
    data class Unknown(val __typename: String = "") : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature()
}
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_TimestampToken(
    val timestamp: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_TimestampToken(
    val timestamp: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_TimestampToken(
    val timestamp: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim(
    val name: String,
    val value: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_TimestampToken(
    val timestamp: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_JWTClaim(
    val name: String,
    val value: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_Signatory(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_Certificate(
    val issuer: String,
    val raw: ByteArray,
    val subject: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_NorwegianBankIdSignature_TimestampToken(
    val timestamp: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory(
    val id: String
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_DrawableSignature::class, name = "DrawableSignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_EmptySignature::class, name = "EmptySignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_JWTSignature::class, name = "JWTSignature"),
    JsonSubTypes.Type(value = QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature::class, name = "NorwegianBankIdSignature")
)
sealed class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature {
    data class Unknown(val __typename: String = "") : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature()
}
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_TimestampToken(
    val timestamp: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_TimestampToken(
    val timestamp: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_TimestampToken(
    val timestamp: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim(
    val name: String,
    val value: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_TimestampToken(
    val timestamp: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_JWTClaim(
    val name: String,
    val value: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_Signatory(
    val id: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_Certificate(
    val issuer: String,
    val raw: ByteArray,
    val subject: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_NorwegianBankIdSignature_TimestampToken(
    val timestamp: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_DrawableSignature(
    val image: ByteArray,
    val name: String? = null
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature()
class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_EmptySignature() : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_JWTSignature(
    val claims: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_JWTSignature_JWTClaim>,
    val jwks: String,
    val jwt: String
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature(
    val claims: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_JWTClaim>,
    val signingCertificate: QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_Certificate
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_DrawableSignature(
    val image: ByteArray,
    val name: String? = null
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature()
class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_EmptySignature() : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_JWTSignature(
    val claims: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_JWTSignature_JWTClaim>,
    val jwks: String,
    val jwt: String
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature(
    val claims: List<QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_JWTClaim>,
    val signingCertificate: QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_Certificate
) : QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature()
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_JWTSignature_JWTClaim(
    val name: String,
    val value: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_JWTClaim(
    val name: String,
    val value: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_Certificate(
    val issuer: String,
    val raw: ByteArray,
    val subject: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_JWTSignature_JWTClaim(
    val name: String,
    val value: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_JWTClaim(
    val name: String,
    val value: String
)
data class QuerySignatureOrderWithDocuments_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_SingleSignature_NorwegianBankIdSignature_Certificate(
    val issuer: String,
    val raw: ByteArray,
    val subject: String
)
const val querySignatureOrderWithDocumentsDocument = """
query signatureOrderWithDocuments(${'$'}id: ID!) {
  signatureOrder(id: ${'$'}id) {
    ...BasicSignatureOrder
    documents {
      ...BasicDocument
      ...SignedDocument
    }
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment + BasicDocumentFragment + SignedDocumentFragment + SingleSignatureFragment
data class QuerySignatory_Signatory(
    val documents: QuerySignatory_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<QuerySignatory_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: QuerySignatory_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: QuerySignatory_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class QuerySignatory_Signatory_SignatoryDocumentConnection(
    val edges: List<QuerySignatory_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class QuerySignatory_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class QuerySignatory_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val evidenceProviders: List<QuerySignatory_Signatory_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<QuerySignatory_Signatory_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
data class QuerySignatory_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class QuerySignatory_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: QuerySignatory_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class QuerySignatory_Signatory_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class QuerySignatory_Signatory_SignatureOrder_Signatory(
    val documents: QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<QuerySignatory_Signatory_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: QuerySignatory_Signatory_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: QuerySignatory_Signatory_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class QuerySignatory_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
data class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class QuerySignatory_Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val querySignatoryDocument = """
query signatory(${'$'}id: ID!) {
  signatory(id: ${'$'}id) {
    signatureOrder {
      ...BasicSignatureOrder
    }
    ...BasicSignatory
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "__typename", visible = true, defaultImpl = QuerySignatureOrders_Viewer.Unknown::class)
@JsonSubTypes(
    JsonSubTypes.Type(value = QuerySignatureOrders_Viewer_AnonymousViewer::class, name = "AnonymousViewer"),
    JsonSubTypes.Type(value = QuerySignatureOrders_Viewer_Application::class, name = "Application"),
    JsonSubTypes.Type(value = QuerySignatureOrders_Viewer_BatchSignatoryViewer::class, name = "BatchSignatoryViewer"),
    JsonSubTypes.Type(value = QuerySignatureOrders_Viewer_SignatoryViewer::class, name = "SignatoryViewer"),
    JsonSubTypes.Type(value = QuerySignatureOrders_Viewer_UnvalidatedSignatoryViewer::class, name = "UnvalidatedSignatoryViewer"),
    JsonSubTypes.Type(value = QuerySignatureOrders_Viewer_UserViewer::class, name = "UserViewer")
)
sealed class QuerySignatureOrders_Viewer {
    data class Unknown(val __typename: String = "") : QuerySignatureOrders_Viewer()
}
class QuerySignatureOrders_Viewer_AnonymousViewer() : QuerySignatureOrders_Viewer()
data class QuerySignatureOrders_Viewer_Application(
    val signatureOrders: QuerySignatureOrders_Viewer_Application_SignatureOrderConnection
) : QuerySignatureOrders_Viewer()
class QuerySignatureOrders_Viewer_BatchSignatoryViewer() : QuerySignatureOrders_Viewer()
class QuerySignatureOrders_Viewer_SignatoryViewer() : QuerySignatureOrders_Viewer()
class QuerySignatureOrders_Viewer_UnvalidatedSignatoryViewer() : QuerySignatureOrders_Viewer()
class QuerySignatureOrders_Viewer_UserViewer() : QuerySignatureOrders_Viewer()
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection(
    val edges: List<QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge>
)
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge(
    val node: QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder
)
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder(
    val closedAt: String? = null,
    val evidenceProviders: List<QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory(
    val documents: QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class QuerySignatureOrders_Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val querySignatureOrdersDocument = """
query signatureOrders(${'$'}status: SignatureOrderStatus, ${'$'}first: Int!, ${'$'}after: String) {
  viewer {
    __typename
    ... on Application {
      signatureOrders(status: ${'$'}status, first: ${'$'}first, after: ${'$'}after) {
        edges {
          node {
            ...BasicSignatureOrder
          }
        }
      }
    }
  }
}
""" + BasicSignatureOrderFragment + BasicSignatoryFragment
data class QueryBatchSignatory_BatchSignatory(
    val href: String,
    val id: String,
    val items: List<QueryBatchSignatory_BatchSignatory_BatchSignatoryItem>,
    val token: String
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem(
    val signatory: QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory,
    val signatureOrder: QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory(
    val documents: QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder(
    val closedAt: String? = null,
    val evidenceProviders: List<QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider>,
    val expiresAt: String,
    val id: String,
    val maxSignatories: Int,
    val signatories: List<QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory>,
    val status: SignatureOrderStatus,
    val title: String? = null
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection(
    val edges: List<QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider(
    val id: String
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory(
    val documents: QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection,
    val downloadHref: String? = null,
    val evidenceProviders: List<QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    val href: String,
    val id: String,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole,
    val signatureOrder: QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder,
    val signingAs: String? = null,
    val signingSequence: QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatorySigningSequence,
    val status: SignatoryStatus,
    val statusReason: String? = null,
    val token: String
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection(
    val edges: List<QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider(
    val id: String
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder(
    val closedAt: String? = null,
    val expiresAt: String,
    val id: String,
    val status: SignatureOrderStatus
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatorySigningSequence(
    val initialNumber: Int
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge(
    val node: QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    val status: SignatoryDocumentStatus? = null
)
data class QueryBatchSignatory_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document(
    val id: String
)
const val queryBatchSignatoryDocument = """
query batchSignatory(${'$'}id: ID!) {
  batchSignatory(id: ${'$'}id) {
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
""" + BasicBatchSignatoryFragment + BasicSignatureOrderFragment + BasicSignatoryFragment
internal interface IduraSignaturesOperations {
  suspend fun createSignatureOrder(input: CreateSignatureOrderInput): CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder
  suspend fun cleanupSignatureOrder(input: CleanupSignatureOrderInput): CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder
  suspend fun addSignatory(input: AddSignatoryInput): AddSignatory_AddSignatoryOutput_Signatory
  suspend fun addSignatories(input: AddSignatoriesInput): List<AddSignatories_AddSignatoriesOutput_Signatory>
  suspend fun changeSignatory(input: ChangeSignatoryInput): ChangeSignatory_ChangeSignatoryOutput_Signatory
  suspend fun closeSignatureOrder(input: CloseSignatureOrderInput): CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder
  suspend fun cancelSignatureOrder(input: CancelSignatureOrderInput): CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder
  suspend fun signActingAs(input: SignActingAsInput): SignActingAs_SignActingAsOutput_Signatory
  suspend fun validateDocument(input: ValidateDocumentInput): ValidateDocument_ValidateDocumentOutput
  suspend fun extendSignatureOrder(input: ExtendSignatureOrderInput): ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder
  suspend fun deleteSignatory(input: DeleteSignatoryInput): DeleteSignatory_DeleteSignatoryOutput_SignatureOrder
  suspend fun createBatchSignatory(input: CreateBatchSignatoryInput): CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory
  suspend fun changeSignatureOrder(input: ChangeSignatureOrderInput): ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder
  suspend fun querySignatureOrder(id: String): QuerySignatureOrder_SignatureOrder
  suspend fun querySignatureOrderWithDocuments(id: String): QuerySignatureOrderWithDocuments_SignatureOrder
  suspend fun querySignatory(id: String): QuerySignatory_Signatory
  suspend fun querySignatureOrders(first: Int, status: SignatureOrderStatus? = null, after: String? = null): QuerySignatureOrders_Viewer
  suspend fun queryBatchSignatory(id: String): QueryBatchSignatory_BatchSignatory
}

internal open class IduraSignaturesClient(private val clientId: String, private val clientSecret: String) : IduraSignaturesOperations {
    private val mapper: ObjectMapper = ObjectMapper()
        .registerKotlinModule()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        .enable(com.fasterxml.jackson.databind.MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS)
    private val httpClient: java.net.http.HttpClient = java.net.http.HttpClient.newHttpClient()
    private val endpoint = "https://signatures-api.criipto.com/v1/graphql"
    private val authHeader = "Basic " + java.util.Base64.getEncoder().encodeToString("$clientId:$clientSecret".toByteArray())

    private suspend fun executeRaw(document: String, variables: Map<String, Any?>): JsonNode {
        val body = mapper.writeValueAsString(mapOf("query" to document, "variables" to variables))
        val request = java.net.http.HttpRequest.newBuilder()
            .uri(java.net.URI.create(endpoint))
            .header("Content-Type", "application/json")
            .header("Authorization", authHeader)
            .header("Criipto-Sdk", "idura-signatures-kotlin")
            .POST(java.net.http.HttpRequest.BodyPublishers.ofString(body))
            .build()
        val response = httpClient.sendAsync(request, java.net.http.HttpResponse.BodyHandlers.ofString()).await()
        val json = mapper.readTree(response.body())
        val errors = json.get("errors")
        if (errors != null && errors.isArray && errors.size() > 0) {
            throw IOException("GraphQL errors: $errors")
        }
        return json.get("data")
            ?: throw IOException("No data field in GraphQL response")
    }

  override suspend fun createSignatureOrder(input: CreateSignatureOrderInput): CreateSignatureOrder_CreateSignatureOrderOutput_SignatureOrder {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(createSignatureOrderDocument, variables)
    val element = data.get("createSignatureOrder") ?: throw IOException("Field 'createSignatureOrder' missing in response")
    val output = mapper.treeToValue(element, CreateSignatureOrder_CreateSignatureOrderOutput::class.java)
    return output.signatureOrder
  }
  
  override suspend fun cleanupSignatureOrder(input: CleanupSignatureOrderInput): CleanupSignatureOrder_CleanupSignatureOrderOutput_SignatureOrder {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(cleanupSignatureOrderDocument, variables)
    val element = data.get("cleanupSignatureOrder") ?: throw IOException("Field 'cleanupSignatureOrder' missing in response")
    val output = mapper.treeToValue(element, CleanupSignatureOrder_CleanupSignatureOrderOutput::class.java)
    return output.signatureOrder
  }
  
  override suspend fun addSignatory(input: AddSignatoryInput): AddSignatory_AddSignatoryOutput_Signatory {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(addSignatoryDocument, variables)
    val element = data.get("addSignatory") ?: throw IOException("Field 'addSignatory' missing in response")
    val output = mapper.treeToValue(element, AddSignatory_AddSignatoryOutput::class.java)
    return output.signatory
  }
  
  override suspend fun addSignatories(input: AddSignatoriesInput): List<AddSignatories_AddSignatoriesOutput_Signatory> {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(addSignatoriesDocument, variables)
    val element = data.get("addSignatories") ?: throw IOException("Field 'addSignatories' missing in response")
    val output = mapper.treeToValue(element, AddSignatories_AddSignatoriesOutput::class.java)
    return output.signatories
  }
  
  override suspend fun changeSignatory(input: ChangeSignatoryInput): ChangeSignatory_ChangeSignatoryOutput_Signatory {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(changeSignatoryDocument, variables)
    val element = data.get("changeSignatory") ?: throw IOException("Field 'changeSignatory' missing in response")
    val output = mapper.treeToValue(element, ChangeSignatory_ChangeSignatoryOutput::class.java)
    return output.signatory
  }
  
  override suspend fun closeSignatureOrder(input: CloseSignatureOrderInput): CloseSignatureOrder_CloseSignatureOrderOutput_SignatureOrder {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(closeSignatureOrderDocument, variables)
    val element = data.get("closeSignatureOrder") ?: throw IOException("Field 'closeSignatureOrder' missing in response")
    val output = mapper.treeToValue(element, CloseSignatureOrder_CloseSignatureOrderOutput::class.java)
    return output.signatureOrder
  }
  
  override suspend fun cancelSignatureOrder(input: CancelSignatureOrderInput): CancelSignatureOrder_CancelSignatureOrderOutput_SignatureOrder {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(cancelSignatureOrderDocument, variables)
    val element = data.get("cancelSignatureOrder") ?: throw IOException("Field 'cancelSignatureOrder' missing in response")
    val output = mapper.treeToValue(element, CancelSignatureOrder_CancelSignatureOrderOutput::class.java)
    return output.signatureOrder
  }
  
  override suspend fun signActingAs(input: SignActingAsInput): SignActingAs_SignActingAsOutput_Signatory {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(signActingAsDocument, variables)
    val element = data.get("signActingAs") ?: throw IOException("Field 'signActingAs' missing in response")
    val output = mapper.treeToValue(element, SignActingAs_SignActingAsOutput::class.java)
    return output.signatory
  }
  
  override suspend fun validateDocument(input: ValidateDocumentInput): ValidateDocument_ValidateDocumentOutput {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(validateDocumentDocument, variables)
    val element = data.get("validateDocument") ?: throw IOException("Field 'validateDocument' missing in response")
    return mapper.treeToValue(element, ValidateDocument_ValidateDocumentOutput::class.java)
  }
  
  override suspend fun extendSignatureOrder(input: ExtendSignatureOrderInput): ExtendSignatureOrder_ExtendSignatureOrderOutput_SignatureOrder {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(extendSignatureOrderDocument, variables)
    val element = data.get("extendSignatureOrder") ?: throw IOException("Field 'extendSignatureOrder' missing in response")
    val output = mapper.treeToValue(element, ExtendSignatureOrder_ExtendSignatureOrderOutput::class.java)
    return output.signatureOrder
  }
  
  override suspend fun deleteSignatory(input: DeleteSignatoryInput): DeleteSignatory_DeleteSignatoryOutput_SignatureOrder {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(deleteSignatoryDocument, variables)
    val element = data.get("deleteSignatory") ?: throw IOException("Field 'deleteSignatory' missing in response")
    val output = mapper.treeToValue(element, DeleteSignatory_DeleteSignatoryOutput::class.java)
    return output.signatureOrder
  }
  
  override suspend fun createBatchSignatory(input: CreateBatchSignatoryInput): CreateBatchSignatory_CreateBatchSignatoryOutput_BatchSignatory {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(createBatchSignatoryDocument, variables)
    val element = data.get("createBatchSignatory") ?: throw IOException("Field 'createBatchSignatory' missing in response")
    val output = mapper.treeToValue(element, CreateBatchSignatory_CreateBatchSignatoryOutput::class.java)
    return output.batchSignatory
  }
  
  override suspend fun changeSignatureOrder(input: ChangeSignatureOrderInput): ChangeSignatureOrder_ChangeSignatureOrderOutput_SignatureOrder {
    val variables = mapOf<String, Any?>("input" to input)
    val data = executeRaw(changeSignatureOrderDocument, variables)
    val element = data.get("changeSignatureOrder") ?: throw IOException("Field 'changeSignatureOrder' missing in response")
    val output = mapper.treeToValue(element, ChangeSignatureOrder_ChangeSignatureOrderOutput::class.java)
    return output.signatureOrder
  }
  
  override suspend fun querySignatureOrder(id: String): QuerySignatureOrder_SignatureOrder {
    val variables = mapOf<String, Any?>("id" to id)
    val data = executeRaw(querySignatureOrderDocument, variables)
    val element = data.get("signatureOrder") ?: throw IOException("Field 'signatureOrder' missing in response")
    return mapper.treeToValue(element, QuerySignatureOrder_SignatureOrder::class.java)
  }
  
  override suspend fun querySignatureOrderWithDocuments(id: String): QuerySignatureOrderWithDocuments_SignatureOrder {
    val variables = mapOf<String, Any?>("id" to id)
    val data = executeRaw(querySignatureOrderWithDocumentsDocument, variables)
    val element = data.get("signatureOrder") ?: throw IOException("Field 'signatureOrder' missing in response")
    return mapper.treeToValue(element, QuerySignatureOrderWithDocuments_SignatureOrder::class.java)
  }
  
  override suspend fun querySignatory(id: String): QuerySignatory_Signatory {
    val variables = mapOf<String, Any?>("id" to id)
    val data = executeRaw(querySignatoryDocument, variables)
    val element = data.get("signatory") ?: throw IOException("Field 'signatory' missing in response")
    return mapper.treeToValue(element, QuerySignatory_Signatory::class.java)
  }
  
  override suspend fun querySignatureOrders(first: Int, status: SignatureOrderStatus?, after: String?): QuerySignatureOrders_Viewer {
    val variables = mapOf<String, Any?>("first" to first, "status" to status?.label, "after" to after).filterValues { it != null }
    val data = executeRaw(querySignatureOrdersDocument, variables)
    val element = data.get("viewer") ?: throw IOException("Field 'viewer' missing in response")
    return mapper.treeToValue(element, QuerySignatureOrders_Viewer::class.java)
  }
  
  override suspend fun queryBatchSignatory(id: String): QueryBatchSignatory_BatchSignatory {
    val variables = mapOf<String, Any?>("id" to id)
    val data = executeRaw(queryBatchSignatoryDocument, variables)
    val element = data.get("batchSignatory") ?: throw IOException("Field 'batchSignatory' missing in response")
    return mapper.treeToValue(element, QueryBatchSignatory_BatchSignatory::class.java)
  }
}