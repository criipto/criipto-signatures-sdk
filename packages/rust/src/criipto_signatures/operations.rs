use serde_derive::{Deserialize, Serialize};
pub mod op_createSignatureOrder {
    pub const OPERATION_NAME: &str = "createSignatureOrder";
    pub const QUERY: &str = r#"mutation createSignatureOrder($input: CreateSignatureOrderInput!) {
  createSignatureOrder(input: $input) {
    signatureOrder {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
      }
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput {
        pub signatureOrder: CreateSignatureOrderOutput_SignatureOrder,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub documents: Vec<CreateSignatureOrderOutput_SignatureOrder_Document>,
        pub evidenceProviders:
            Vec<CreateSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<CreateSignatureOrderOutput_SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum CreateSignatureOrderOutput_SignatureOrder_Document {
        PdfDocument(CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument),
        XmlDocument(CreateSignatureOrderOutput_SignatureOrder_Document_XmlDocument),
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_Signatory {
        pub documents:
            CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders:
            Vec<CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence:
            CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument {
        pub documentID: crate::scalars::String,
        pub form:
            Option<CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm>,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_Document_XmlDocument {
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm {
        pub enabled: crate::scalars::Boolean,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_cleanupSignatureOrder {
    pub const OPERATION_NAME: &str = "cleanupSignatureOrder";
    pub const QUERY: &str = r#"mutation cleanupSignatureOrder($input: CleanupSignatureOrderInput!) {
  cleanupSignatureOrder(input: $input) {
    signatureOrder {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
      }
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput {
        pub signatureOrder: CleanupSignatureOrderOutput_SignatureOrder,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub documents: Vec<CleanupSignatureOrderOutput_SignatureOrder_Document>,
        pub evidenceProviders:
            Vec<CleanupSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<CleanupSignatureOrderOutput_SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum CleanupSignatureOrderOutput_SignatureOrder_Document {
        PdfDocument(CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument),
        XmlDocument(CleanupSignatureOrderOutput_SignatureOrder_Document_XmlDocument),
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_Signatory {
        pub documents:
            CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders:
            Vec<CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence:
            CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument {
        pub documentID: crate::scalars::String,
        pub form:
            Option<CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm>,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_Document_XmlDocument {
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm {
        pub enabled: crate::scalars::Boolean,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CleanupSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_addSignatory {
    pub const OPERATION_NAME: &str = "addSignatory";
    pub const QUERY: &str = r#"mutation addSignatory($input: AddSignatoryInput!) {
  addSignatory(input: $input) {
    signatory {
      ...BasicSignatory
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoryOutput {
        pub signatory: AddSignatoryOutput_Signatory,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoryOutput_Signatory {
        pub documents: AddSignatoryOutput_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders: Vec<AddSignatoryOutput_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: AddSignatoryOutput_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence: AddSignatoryOutput_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoryOutput_Signatory_SignatoryDocumentConnection {
        pub edges:
            Vec<AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoryOutput_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoryOutput_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoryOutput_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
        pub node:
            AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
        pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document {
        pub id: crate::scalars::ID,
    }
}
pub mod op_addSignatories {
    pub const OPERATION_NAME: &str = "addSignatories";
    pub const QUERY: &str = r#"mutation addSignatories($input: AddSignatoriesInput!) {
  addSignatories(input: $input) {
    signatories {
      ...BasicSignatory
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoriesOutput {
        pub signatories: Vec<AddSignatoriesOutput_Signatory>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoriesOutput_Signatory {
        pub documents: AddSignatoriesOutput_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders: Vec<AddSignatoriesOutput_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: AddSignatoriesOutput_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence: AddSignatoriesOutput_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoriesOutput_Signatory_SignatoryDocumentConnection {
        pub edges:
            Vec<AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoriesOutput_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoriesOutput_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoriesOutput_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct AddSignatoriesOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_changeSignatory {
    pub const OPERATION_NAME: &str = "changeSignatory";
    pub const QUERY: &str = r#"mutation changeSignatory($input: ChangeSignatoryInput!) {
  changeSignatory(input: $input) {
    signatory {
      ...BasicSignatory
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatoryOutput {
        pub signatory: ChangeSignatoryOutput_Signatory,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatoryOutput_Signatory {
        pub documents: ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders: Vec<ChangeSignatoryOutput_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: ChangeSignatoryOutput_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence: ChangeSignatoryOutput_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection {
        pub edges:
            Vec<ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatoryOutput_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatoryOutput_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatoryOutput_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatoryOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_closeSignatureOrder {
    pub const OPERATION_NAME: &str = "closeSignatureOrder";
    pub const QUERY: &str = r#"mutation closeSignatureOrder($input: CloseSignatureOrderInput!) {
  closeSignatureOrder(input: $input) {
    signatureOrder {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
        ...SignedDocument
      }
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput {
        pub signatureOrder: CloseSignatureOrderOutput_SignatureOrder,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub documents: Vec<CloseSignatureOrderOutput_SignatureOrder_Document>,
        pub evidenceProviders:
            Vec<CloseSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<CloseSignatureOrderOutput_SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum CloseSignatureOrderOutput_SignatureOrder_Document {
        PdfDocument(CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument),
        XmlDocument(CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument),
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Signatory {
        pub documents:
            CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders:
            Vec<CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence:
            CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument {
        pub blob: Option<crate::scalars::Blob>,
        pub documentID: crate::scalars::String,
        pub form:
            Option<CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm>,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub signatures:
            Option<Vec<CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature>>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument {
        pub blob: Option<crate::scalars::Blob>,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub signatures:
            Option<Vec<CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature>>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm {
        pub enabled: crate::scalars::Boolean,
    }

    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature {
        CompositeSignature(CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature),
    DrawableSignature(CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature),
    EmptySignature(CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature),
    JWTSignature(CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature),
}

    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature {
        CompositeSignature(CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature),
    DrawableSignature(CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature),
    EmptySignature(CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature),
    JWTSignature(CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature),
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature {
    pub signatory: Option<CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature {
    pub image: crate::scalars::Blob,
    pub name: Option<crate::scalars::String>,
    pub signatory: Option<CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature {
    pub signatory: Option<CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature {
    pub claims: Vec<CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim>,
    pub jwks: crate::scalars::String,
    pub jwt: crate::scalars::String,
    pub signatory: Option<CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature {
    pub signatory: Option<CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature {
    pub image: crate::scalars::Blob,
    pub name: Option<crate::scalars::String>,
    pub signatory: Option<CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature {
    pub signatory: Option<CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature {
    pub claims: Vec<CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim>,
    pub jwks: crate::scalars::String,
    pub jwt: crate::scalars::String,
    pub signatory: Option<CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim
    {
        pub name: crate::scalars::String,
        pub value: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim
    {
        pub name: crate::scalars::String,
        pub value: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CloseSignatureOrderOutput_SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_cancelSignatureOrder {
    pub const OPERATION_NAME: &str = "cancelSignatureOrder";
    pub const QUERY: &str = r#"mutation cancelSignatureOrder($input: CancelSignatureOrderInput!) {
  cancelSignatureOrder(input: $input) {
    signatureOrder {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
      }
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput {
        pub signatureOrder: CancelSignatureOrderOutput_SignatureOrder,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub documents: Vec<CancelSignatureOrderOutput_SignatureOrder_Document>,
        pub evidenceProviders:
            Vec<CancelSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<CancelSignatureOrderOutput_SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum CancelSignatureOrderOutput_SignatureOrder_Document {
        PdfDocument(CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument),
        XmlDocument(CancelSignatureOrderOutput_SignatureOrder_Document_XmlDocument),
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_Signatory {
        pub documents:
            CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders:
            Vec<CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence:
            CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument {
        pub documentID: crate::scalars::String,
        pub form:
            Option<CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm>,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_Document_XmlDocument {
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm {
        pub enabled: crate::scalars::Boolean,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CancelSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_signActingAs {
    pub const OPERATION_NAME: &str = "signActingAs";
    pub const QUERY: &str = r#"mutation signActingAs($input: SignActingAsInput!) {
  signActingAs(input: $input) {
    signatory {
      ...BasicSignatory
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignActingAsOutput {
        pub signatory: SignActingAsOutput_Signatory,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignActingAsOutput_Signatory {
        pub documents: SignActingAsOutput_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders: Vec<SignActingAsOutput_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: SignActingAsOutput_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence: SignActingAsOutput_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignActingAsOutput_Signatory_SignatoryDocumentConnection {
        pub edges:
            Vec<SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignActingAsOutput_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignActingAsOutput_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignActingAsOutput_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
        pub node:
            SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
        pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignActingAsOutput_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document {
        pub id: crate::scalars::ID,
    }
}
pub mod op_validateDocument {
    pub const OPERATION_NAME: &str = "validateDocument";
    pub const QUERY: &str = r#"mutation validateDocument($input: ValidateDocumentInput!) {
  validateDocument(input: $input) {
    valid
    errors
    fixable
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ValidateDocumentOutput {
        pub errors: Option<Vec<crate::scalars::String>>,
        pub fixable: Option<crate::scalars::Boolean>,
        pub valid: crate::scalars::Boolean,
    }
}
pub mod op_extendSignatureOrder {
    pub const OPERATION_NAME: &str = "extendSignatureOrder";
    pub const QUERY: &str = r#"mutation extendSignatureOrder($input: ExtendSignatureOrderInput!) {
  extendSignatureOrder(input: $input) {
    signatureOrder {
      ...BasicSignatureOrder
      documents {
        ...BasicDocument
      }
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput {
        pub signatureOrder: ExtendSignatureOrderOutput_SignatureOrder,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub documents: Vec<ExtendSignatureOrderOutput_SignatureOrder_Document>,
        pub evidenceProviders:
            Vec<ExtendSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<ExtendSignatureOrderOutput_SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum ExtendSignatureOrderOutput_SignatureOrder_Document {
        PdfDocument(ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument),
        XmlDocument(ExtendSignatureOrderOutput_SignatureOrder_Document_XmlDocument),
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_Signatory {
        pub documents:
            ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders:
            Vec<ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence:
            ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument {
        pub documentID: crate::scalars::String,
        pub form:
            Option<ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm>,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_Document_XmlDocument {
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_Document_PdfDocument_PdfDocumentForm {
        pub enabled: crate::scalars::Boolean,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ExtendSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_deleteSignatory {
    pub const OPERATION_NAME: &str = "deleteSignatory";
    pub const QUERY: &str = r#"mutation deleteSignatory($input: DeleteSignatoryInput!) {
  deleteSignatory(input: $input) {
    signatureOrder {
      ...BasicSignatureOrder
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct DeleteSignatoryOutput {
        pub signatureOrder: DeleteSignatoryOutput_SignatureOrder,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct DeleteSignatoryOutput_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub evidenceProviders: Vec<DeleteSignatoryOutput_SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<DeleteSignatoryOutput_SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct DeleteSignatoryOutput_SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct DeleteSignatoryOutput_SignatureOrder_Signatory {
        pub documents: DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders:
            Vec<DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence:
            DeleteSignatoryOutput_SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct DeleteSignatoryOutput_SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct DeleteSignatoryOutput_SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct DeleteSignatoryOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_createBatchSignatory {
    pub const OPERATION_NAME: &str = "createBatchSignatory";
    pub const QUERY: &str = r#"mutation createBatchSignatory($input: CreateBatchSignatoryInput!) {
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
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput {
        pub batchSignatory: CreateBatchSignatoryOutput_BatchSignatory,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory {
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub items: Vec<CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem {
        pub signatory: CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory,
        pub signatureOrder:
            CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory {
    pub documents: CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection,
    pub downloadHref: Option<crate::scalars::String>,
    pub evidenceProviders: Vec<CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider>,
    pub href: crate::scalars::String,
    pub id: crate::scalars::ID,
    pub reference: Option<crate::scalars::String>,
    pub role: Option<crate::scalars::String>,
    pub signatureOrder: CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder,
    pub signingAs: Option<crate::scalars::String>,
    pub signingSequence: CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatorySigningSequence,
    pub status: crate::criipto_signatures::types::SignatoryStatus,
    pub statusReason: Option<crate::scalars::String>,
    pub token: crate::scalars::String,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder {
    pub closedAt: Option<crate::scalars::DateTime>,
    pub evidenceProviders: Vec<CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider>,
    pub expiresAt: crate::scalars::DateTime,
    pub id: crate::scalars::ID,
    pub maxSignatories: crate::scalars::Int,
    pub signatories: Vec<CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory>,
    pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    pub title: Option<crate::scalars::String>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatorySigningSequence
    {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory {
    pub documents: CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection,
    pub downloadHref: Option<crate::scalars::String>,
    pub evidenceProviders: Vec<CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    pub href: crate::scalars::String,
    pub id: crate::scalars::ID,
    pub reference: Option<crate::scalars::String>,
    pub role: Option<crate::scalars::String>,
    pub signatureOrder: CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder,
    pub signingAs: Option<crate::scalars::String>,
    pub signingSequence: CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatorySigningSequence,
    pub status: crate::criipto_signatures::types::SignatoryStatus,
    pub statusReason: Option<crate::scalars::String>,
    pub token: crate::scalars::String,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder
    {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatorySigningSequence
    {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct CreateBatchSignatoryOutput_BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_changeSignatureOrder {
    pub const OPERATION_NAME: &str = "changeSignatureOrder";
    pub const QUERY: &str = r#"mutation changeSignatureOrder($input: ChangeSignatureOrderInput!) {
  changeSignatureOrder(input: $input) {
    signatureOrder {
      ...BasicSignatureOrder
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatureOrderOutput {
        pub signatureOrder: ChangeSignatureOrderOutput_SignatureOrder,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatureOrderOutput_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub evidenceProviders:
            Vec<ChangeSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<ChangeSignatureOrderOutput_SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatureOrderOutput_SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatureOrderOutput_SignatureOrder_Signatory {
        pub documents:
            ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders:
            Vec<ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence:
            ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ChangeSignatureOrderOutput_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_querySignatureOrder {
    pub const OPERATION_NAME: &str = "querySignatureOrder";
    pub const QUERY: &str = r#"query signatureOrder($id: ID!) {
  signatureOrder(id: $id) {
    ...BasicSignatureOrder
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub evidenceProviders: Vec<SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory {
        pub documents: SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders: Vec<SignatureOrder_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence: SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatoryDocumentConnection {
        pub edges: Vec<SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
        pub node:
            SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
        pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document {
        pub id: crate::scalars::ID,
    }
}
pub mod op_querySignatureOrderWithDocuments {
    pub const OPERATION_NAME: &str = "querySignatureOrderWithDocuments";
    pub const QUERY: &str = r#"query signatureOrderWithDocuments($id: ID!) {
  signatureOrder(id: $id) {
    ...BasicSignatureOrder
    documents {
      ...BasicDocument
      ...SignedDocument
    }
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub documents: Vec<SignatureOrder_Document>,
        pub evidenceProviders: Vec<SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum SignatureOrder_Document {
        PdfDocument(SignatureOrder_Document_PdfDocument),
        XmlDocument(SignatureOrder_Document_XmlDocument),
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory {
        pub documents: SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders: Vec<SignatureOrder_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence: SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument {
        pub blob: Option<crate::scalars::Blob>,
        pub documentID: crate::scalars::String,
        pub form: Option<SignatureOrder_Document_PdfDocument_PdfDocumentForm>,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub signatures: Option<Vec<SignatureOrder_Document_PdfDocument_Signature>>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_XmlDocument {
        pub blob: Option<crate::scalars::Blob>,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub signatures: Option<Vec<SignatureOrder_Document_XmlDocument_Signature>>,
        pub title: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatoryDocumentConnection {
        pub edges: Vec<SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument_PdfDocumentForm {
        pub enabled: crate::scalars::Boolean,
    }

    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum SignatureOrder_Document_PdfDocument_Signature {
        CompositeSignature(SignatureOrder_Document_PdfDocument_Signature_CompositeSignature),
        DrawableSignature(SignatureOrder_Document_PdfDocument_Signature_DrawableSignature),
        EmptySignature(SignatureOrder_Document_PdfDocument_Signature_EmptySignature),
        JWTSignature(SignatureOrder_Document_PdfDocument_Signature_JWTSignature),
    }

    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum SignatureOrder_Document_XmlDocument_Signature {
        CompositeSignature(SignatureOrder_Document_XmlDocument_Signature_CompositeSignature),
        DrawableSignature(SignatureOrder_Document_XmlDocument_Signature_DrawableSignature),
        EmptySignature(SignatureOrder_Document_XmlDocument_Signature_EmptySignature),
        JWTSignature(SignatureOrder_Document_XmlDocument_Signature_JWTSignature),
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
        pub node:
            SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
        pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument_Signature_CompositeSignature {
        pub signatory:
            Option<SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument_Signature_DrawableSignature {
        pub image: crate::scalars::Blob,
        pub name: Option<crate::scalars::String>,
        pub signatory:
            Option<SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument_Signature_EmptySignature {
        pub signatory:
            Option<SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument_Signature_JWTSignature {
        pub claims: Vec<SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim>,
        pub jwks: crate::scalars::String,
        pub jwt: crate::scalars::String,
        pub signatory: Option<SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_XmlDocument_Signature_CompositeSignature {
        pub signatory:
            Option<SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_XmlDocument_Signature_DrawableSignature {
        pub image: crate::scalars::Blob,
        pub name: Option<crate::scalars::String>,
        pub signatory:
            Option<SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_XmlDocument_Signature_EmptySignature {
        pub signatory:
            Option<SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_XmlDocument_Signature_JWTSignature {
        pub claims: Vec<SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim>,
        pub jwks: crate::scalars::String,
        pub jwt: crate::scalars::String,
        pub signatory: Option<SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument_Signature_CompositeSignature_Signatory {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument_Signature_DrawableSignature_Signatory {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument_Signature_EmptySignature_Signatory {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument_Signature_JWTSignature_JWTClaim {
        pub name: crate::scalars::String,
        pub value: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_PdfDocument_Signature_JWTSignature_Signatory {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_XmlDocument_Signature_CompositeSignature_Signatory {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_XmlDocument_Signature_DrawableSignature_Signatory {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_XmlDocument_Signature_EmptySignature_Signatory {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_XmlDocument_Signature_JWTSignature_JWTClaim {
        pub name: crate::scalars::String,
        pub value: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct SignatureOrder_Document_XmlDocument_Signature_JWTSignature_Signatory {
        pub id: crate::scalars::ID,
    }
}
pub mod op_querySignatory {
    pub const OPERATION_NAME: &str = "querySignatory";
    pub const QUERY: &str = r#"query signatory($id: ID!) {
  signatory(id: $id) {
    signatureOrder {
      ...BasicSignatureOrder
    }
    ...BasicSignatory
  }
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory {
        pub documents: Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders: Vec<Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence: Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatoryDocumentConnection {
        pub edges: Vec<Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub evidenceProviders: Vec<Signatory_SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<Signatory_SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
        pub node: Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
        pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatureOrder_Signatory {
        pub documents: Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders: Vec<Signatory_SignatureOrder_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: Signatory_SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence: Signatory_SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection {
        pub edges: Vec<
            Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge,
        >,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Signatory_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_querySignatureOrders {
    pub const OPERATION_NAME: &str = "querySignatureOrders";
    pub const QUERY: &str = r#"query signatureOrders($status: SignatureOrderStatus, $first: Int!, $after: String) {
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
}"#;
    use super::*;
    /// union
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum Viewer {
        AnonymousViewer(Viewer_AnonymousViewer),
        Application(Viewer_Application),
        BatchSignatoryViewer(Viewer_BatchSignatoryViewer),
        SignatoryViewer(Viewer_SignatoryViewer),
        UnvalidatedSignatoryViewer(Viewer_UnvalidatedSignatoryViewer),
        UserViewer(Viewer_UserViewer),
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_AnonymousViewer {}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application {
        pub signatureOrders: Viewer_Application_SignatureOrderConnection,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_BatchSignatoryViewer {}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_SignatoryViewer {}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_UnvalidatedSignatoryViewer {}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_UserViewer {}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection {
        pub edges: Vec<Viewer_Application_SignatureOrderConnection_SignatureOrderEdge>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection_SignatureOrderEdge {
        pub node: Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder {
    pub closedAt: Option<crate::scalars::DateTime>,
    pub evidenceProviders: Vec<Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_SignatureEvidenceProvider>,
    pub expiresAt: crate::scalars::DateTime,
    pub id: crate::scalars::ID,
    pub maxSignatories: crate::scalars::Int,
    pub signatories: Vec<Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory>,
    pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    pub title: Option<crate::scalars::String>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_SignatureEvidenceProvider
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory {
    pub documents: Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection,
    pub downloadHref: Option<crate::scalars::String>,
    pub evidenceProviders: Vec<Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureEvidenceProvider>,
    pub href: crate::scalars::String,
    pub id: crate::scalars::ID,
    pub reference: Option<crate::scalars::String>,
    pub role: Option<crate::scalars::String>,
    pub signatureOrder: Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureOrder,
    pub signingAs: Option<crate::scalars::String>,
    pub signingSequence: Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatorySigningSequence,
    pub status: crate::criipto_signatures::types::SignatoryStatus,
    pub statusReason: Option<crate::scalars::String>,
    pub token: crate::scalars::String,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureEvidenceProvider
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatureOrder
    {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatorySigningSequence
    {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Viewer_Application_SignatureOrderConnection_SignatureOrderEdge_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
pub mod op_queryBatchSignatory {
    pub const OPERATION_NAME: &str = "queryBatchSignatory";
    pub const QUERY: &str = r#"query batchSignatory($id: ID!) {
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
}"#;
    use super::*;
    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory {
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub items: Vec<BatchSignatory_BatchSignatoryItem>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem {
        pub signatory: BatchSignatory_BatchSignatoryItem_Signatory,
        pub signatureOrder: BatchSignatory_BatchSignatoryItem_SignatureOrder,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_Signatory {
        pub documents: BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders:
            Vec<BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider>,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder: BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence: BatchSignatory_BatchSignatoryItem_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub evidenceProviders:
            Vec<BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub maxSignatories: crate::scalars::Int,
        pub signatories: Vec<BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory>,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
        pub title: Option<crate::scalars::String>,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_SignatureOrder_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory {
        pub documents:
            BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection,
        pub downloadHref: Option<crate::scalars::String>,
        pub evidenceProviders: Vec<
            BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider,
        >,
        pub href: crate::scalars::String,
        pub id: crate::scalars::ID,
        pub reference: Option<crate::scalars::String>,
        pub role: Option<crate::scalars::String>,
        pub signatureOrder:
            BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder,
        pub signingAs: Option<crate::scalars::String>,
        pub signingSequence:
            BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatorySigningSequence,
        pub status: crate::criipto_signatures::types::SignatoryStatus,
        pub statusReason: Option<crate::scalars::String>,
        pub token: crate::scalars::String,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection {
    pub edges: Vec<BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureEvidenceProvider {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatureOrder {
        pub closedAt: Option<crate::scalars::DateTime>,
        pub expiresAt: crate::scalars::DateTime,
        pub id: crate::scalars::ID,
        pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatorySigningSequence {
        pub initialNumber: crate::scalars::Int,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge {
    pub node: BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

    ///
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct BatchSignatory_BatchSignatoryItem_SignatureOrder_Signatory_SignatoryDocumentConnection_SignatoryDocumentEdge_Document
    {
        pub id: crate::scalars::ID,
    }
}
