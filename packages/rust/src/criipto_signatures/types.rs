use serde_derive::{Deserialize, Serialize};
///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AddSignatoriesInput {
    pub signatories: Vec<crate::criipto_signatures::types::CreateSignatureOrderSignatoryInput>,
    pub signatureOrderId: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AddSignatoriesOutput {
    pub signatories: Vec<Signatory>,
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AddSignatoryInput {
    pub documents: Option<Vec<crate::criipto_signatures::types::SignatoryDocumentInput>>,
    pub evidenceProviders: Option<Vec<crate::criipto_signatures::types::SignatoryEvidenceProviderInput>>,
    pub evidenceValidation: Option<Vec<crate::criipto_signatures::types::SignatoryEvidenceValidationInput>>,
    pub reference: Option<crate::scalars::String>,
    pub role: Option<crate::scalars::String>,
    pub signatoryRole: Option<crate::criipto_signatures::types::SignatoryRole>,
    pub signatureAppearance: Option<crate::criipto_signatures::types::SignatureAppearanceInput>,
    pub signatureOrderId: crate::scalars::ID,
    pub signingAs: Option<crate::scalars::String>,
    pub signingSequence: Option<crate::scalars::Int>,
    pub ui: Option<crate::criipto_signatures::types::SignatoryUIInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AddSignatoryOutput {
    pub signatory: Signatory,
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AllOfEvidenceProviderInput {
    pub providers: Vec<crate::criipto_signatures::types::SingleEvidenceProviderInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AllOfSignatureEvidenceProvider {
    pub id: crate::scalars::ID,
    pub providers: Vec<SingleSignatureEvidenceProvider>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnonymousViewer {
    pub authenticated: crate::scalars::Boolean,
    pub id: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Application {
    pub apiKeys: Vec<ApplicationApiKey>,
    pub id: crate::scalars::ID,
    pub name: crate::scalars::String,
    pub signatureOrders: SignatureOrderConnection,
    pub tenant: Option<Tenant>,
    pub verifyApplication: VerifyApplication,
    pub webhookLogs: Vec<WebhookInvocation>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApplicationApiKey {
    pub clientId: crate::scalars::String,
    pub clientSecret: Option<crate::scalars::String>,
    pub id: crate::scalars::ID,
    pub mode: crate::criipto_signatures::types::ApplicationApiKeyMode,
    pub note: Option<crate::scalars::String>,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ApplicationApiKeyMode {
    READ_ONLY,
    READ_WRITE,
}

impl ::serde::Serialize for ApplicationApiKeyMode {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            ApplicationApiKeyMode::READ_ONLY => serializer.serialize_str("READ_ONLY"),
            ApplicationApiKeyMode::READ_WRITE => serializer.serialize_str("READ_WRITE"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for ApplicationApiKeyMode {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "READ_ONLY" => Ok(ApplicationApiKeyMode::READ_ONLY),
            "READ_WRITE" => Ok(ApplicationApiKeyMode::READ_WRITE),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BatchSignatory {
    pub href: crate::scalars::String,
    pub id: crate::scalars::ID,
    pub items: Vec<BatchSignatoryItem>,
    pub token: crate::scalars::String,
    pub traceId: crate::scalars::String,
    pub ui: SignatureOrderUI,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BatchSignatoryItem {
    pub signatory: Signatory,
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BatchSignatoryItemInput {
    pub signatoryId: crate::scalars::String,
    pub signatureOrderId: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BatchSignatoryViewer {
    pub authenticated: crate::scalars::Boolean,
    pub batchSignatoryId: crate::scalars::ID,
    pub documents: SignatoryDocumentConnection,
    pub evidenceProviders: Vec<SignatureEvidenceProvider>,
    pub id: crate::scalars::ID,
    pub signer: crate::scalars::Boolean,
    pub status: crate::criipto_signatures::types::SignatoryStatus,
    pub ui: SignatureOrderUI,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CancelSignatureOrderInput {
    pub signatureOrderId: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CancelSignatureOrderOutput {
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChangeSignatoryInput {
    pub documents: Option<Vec<crate::criipto_signatures::types::SignatoryDocumentInput>>,
    pub evidenceProviders: Option<Vec<crate::criipto_signatures::types::SignatoryEvidenceProviderInput>>,
    pub evidenceValidation: Option<Vec<crate::criipto_signatures::types::SignatoryEvidenceValidationInput>>,
    pub reference: Option<crate::scalars::String>,
    pub role: Option<crate::scalars::String>,
    pub signatoryId: crate::scalars::ID,
    pub signatureAppearance: Option<crate::criipto_signatures::types::SignatureAppearanceInput>,
    pub signingAs: Option<crate::scalars::String>,
    pub signingSequence: Option<crate::scalars::Int>,
    pub ui: Option<crate::criipto_signatures::types::SignatoryUIInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChangeSignatoryOutput {
    pub signatory: Signatory,
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChangeSignatureOrderInput {
    pub maxSignatories: Option<crate::scalars::Int>,
    pub signatureOrderId: crate::scalars::ID,
    pub webhook: Option<crate::criipto_signatures::types::CreateSignatureOrderWebhookInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChangeSignatureOrderOutput {
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CleanupSignatureOrderInput {
    pub signatureOrderId: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CleanupSignatureOrderOutput {
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CloseSignatureOrderInput {
    pub retainDocumentsForDays: Option<crate::scalars::Int>,
    pub signatureOrderId: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CloseSignatureOrderOutput {
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompleteCriiptoVerifyEvidenceProviderInput {
    pub code: crate::scalars::String,
    pub state: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompleteCriiptoVerifyEvidenceProviderOutput {
    pub jwt: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompositeSignature {
    pub signatory: Option<Signatory>,
    pub signatures: Vec<SingleSignature>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateApplicationApiKeyInput {
    pub applicationId: crate::scalars::ID,
    pub mode: Option<crate::criipto_signatures::types::ApplicationApiKeyMode>,
    pub note: Option<crate::scalars::String>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateApplicationApiKeyOutput {
    pub apiKey: ApplicationApiKey,
    pub application: Application,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateApplicationInput {
    pub name: crate::scalars::String,
    pub tenantId: crate::scalars::ID,
    pub verifyApplicationDomain: crate::scalars::String,
    pub verifyApplicationEnvironment: crate::criipto_signatures::types::VerifyApplicationEnvironment,
    pub verifyApplicationRealm: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateApplicationOutput {
    pub apiKey: ApplicationApiKey,
    pub application: Application,
    pub tenant: Tenant,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CreateBatchSignatoryInput {
    pub items: Vec<crate::criipto_signatures::types::BatchSignatoryItemInput>,
    pub ui: Option<crate::criipto_signatures::types::SignatoryUIInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateBatchSignatoryOutput {
    pub batchSignatory: BatchSignatory,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CreateSignatureOrderInput {
    pub disableVerifyEvidenceProvider: Option<crate::scalars::Boolean>,
    pub documents: Vec<crate::criipto_signatures::types::DocumentInput>,
    pub evidenceProviders: Option<Vec<crate::criipto_signatures::types::EvidenceProviderInput>>,
    pub evidenceValidationStages: Option<Vec<crate::criipto_signatures::types::EvidenceValidationStage>>,
    pub expiresAt: Option<crate::scalars::String>,
    pub expiresInDays: Option<crate::scalars::Int>,
    pub fixDocumentFormattingErrors: Option<crate::scalars::Boolean>,
    pub maxSignatories: Option<crate::scalars::Int>,
    pub signatories: Option<Vec<crate::criipto_signatures::types::CreateSignatureOrderSignatoryInput>>,
    pub signatureAppearance: Option<crate::criipto_signatures::types::SignatureAppearanceInput>,
    pub timezone: Option<crate::scalars::String>,
    pub title: Option<crate::scalars::String>,
    pub ui: Option<crate::criipto_signatures::types::CreateSignatureOrderUIInput>,
    pub webhook: Option<crate::criipto_signatures::types::CreateSignatureOrderWebhookInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateSignatureOrderOutput {
    pub application: Application,
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CreateSignatureOrderSignatoryInput {
    pub documents: Option<Vec<crate::criipto_signatures::types::SignatoryDocumentInput>>,
    pub evidenceProviders: Option<Vec<crate::criipto_signatures::types::SignatoryEvidenceProviderInput>>,
    pub evidenceValidation: Option<Vec<crate::criipto_signatures::types::SignatoryEvidenceValidationInput>>,
    pub reference: Option<crate::scalars::String>,
    pub role: Option<crate::scalars::String>,
    pub signatoryRole: Option<crate::criipto_signatures::types::SignatoryRole>,
    pub signatureAppearance: Option<crate::criipto_signatures::types::SignatureAppearanceInput>,
    pub signingAs: Option<crate::scalars::String>,
    pub signingSequence: Option<crate::scalars::Int>,
    pub ui: Option<crate::criipto_signatures::types::SignatoryUIInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CreateSignatureOrderUIInput {
    pub disableRejection: Option<crate::scalars::Boolean>,
    pub language: Option<crate::criipto_signatures::types::Language>,
    pub logo: Option<crate::criipto_signatures::types::SignatureOrderUILogoInput>,
    pub renderPdfAnnotationLayer: Option<crate::scalars::Boolean>,
    pub signatoryRedirectUri: Option<crate::scalars::String>,
    pub stylesheet: Option<crate::scalars::String>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateSignatureOrderWebhookInput {
    pub secret: Option<crate::scalars::Blob>,
    pub url: crate::scalars::String,
    pub validateConnectivity: Option<crate::scalars::Boolean>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CriiptoVerifyEvidenceProviderRedirect {
    pub redirectUri: crate::scalars::String,
    pub state: crate::scalars::String,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CriiptoVerifyEvidenceProviderVersion {
    V1,
    V2,
}

impl ::serde::Serialize for CriiptoVerifyEvidenceProviderVersion {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            CriiptoVerifyEvidenceProviderVersion::V1 => serializer.serialize_str("V1"),
            CriiptoVerifyEvidenceProviderVersion::V2 => serializer.serialize_str("V2"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for CriiptoVerifyEvidenceProviderVersion {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "V1" => Ok(CriiptoVerifyEvidenceProviderVersion::V1),
            "V2" => Ok(CriiptoVerifyEvidenceProviderVersion::V2),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CriiptoVerifyProviderInput {
    pub acrValues: Option<Vec<crate::scalars::String>>,
    pub alwaysRedirect: Option<crate::scalars::Boolean>,
    pub audiences: Option<Vec<crate::scalars::String>>,
    pub loginHint: Option<crate::scalars::String>,
    pub message: Option<crate::scalars::String>,
    pub scope: Option<crate::scalars::String>,
    pub uniqueEvidenceKey: Option<crate::scalars::String>,
    pub version: Option<crate::criipto_signatures::types::CriiptoVerifyEvidenceProviderVersion>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CriiptoVerifySignatureEvidenceProvider {
    pub acrValues: Vec<crate::scalars::String>,
    pub alwaysRedirect: crate::scalars::Boolean,
    pub audience: crate::scalars::String,
    pub audiences: Vec<crate::scalars::String>,
    pub clientID: crate::scalars::String,
    pub domain: crate::scalars::String,
    pub environment: Option<crate::criipto_signatures::types::VerifyApplicationEnvironment>,
    pub id: crate::scalars::ID,
    pub loginHint: Option<crate::scalars::String>,
    pub message: Option<crate::scalars::String>,
    pub name: crate::scalars::String,
    pub scope: Option<crate::scalars::String>,
    pub version: crate::criipto_signatures::types::CriiptoVerifyEvidenceProviderVersion,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeleteApplicationApiKeyInput {
    pub apiKeyId: crate::scalars::ID,
    pub applicationId: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeleteApplicationApiKeyOutput {
    pub application: Application,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeleteSignatoryInput {
    pub signatoryId: crate::scalars::ID,
    pub signatureOrderId: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeleteSignatoryOutput {
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DeviceInput {
    pub os: Option<crate::criipto_signatures::types::DeviceOperatingSystem>,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DeviceOperatingSystem {
    ANDROID,
    IOS,
}

impl ::serde::Serialize for DeviceOperatingSystem {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            DeviceOperatingSystem::ANDROID => serializer.serialize_str("ANDROID"),
            DeviceOperatingSystem::IOS => serializer.serialize_str("IOS"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for DeviceOperatingSystem {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "ANDROID" => Ok(DeviceOperatingSystem::ANDROID),
            "IOS" => Ok(DeviceOperatingSystem::IOS),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

/// interface
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Document {
    PdfDocument(PdfDocument),
    XmlDocument(XmlDocument),
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DocumentIDLocation {
    BOTTOM,
    LEFT,
    RIGHT,
    TOP,
}

impl ::serde::Serialize for DocumentIDLocation {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            DocumentIDLocation::BOTTOM => serializer.serialize_str("BOTTOM"),
            DocumentIDLocation::LEFT => serializer.serialize_str("LEFT"),
            DocumentIDLocation::RIGHT => serializer.serialize_str("RIGHT"),
            DocumentIDLocation::TOP => serializer.serialize_str("TOP"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for DocumentIDLocation {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "BOTTOM" => Ok(DocumentIDLocation::BOTTOM),
            "LEFT" => Ok(DocumentIDLocation::LEFT),
            "RIGHT" => Ok(DocumentIDLocation::RIGHT),
            "TOP" => Ok(DocumentIDLocation::TOP),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DocumentInput {
    pub pdf: Option<crate::criipto_signatures::types::PadesDocumentInput>,
    pub removePreviousSignatures: Option<crate::scalars::Boolean>,
    pub xml: Option<crate::criipto_signatures::types::XadesDocumentInput>,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DocumentStorageMode {
    Temporary,
}

impl ::serde::Serialize for DocumentStorageMode {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            DocumentStorageMode::Temporary => serializer.serialize_str("Temporary"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for DocumentStorageMode {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "Temporary" => Ok(DocumentStorageMode::Temporary),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DownloadVerificationCriiptoVerifyInput {
    pub jwt: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DownloadVerificationInput {
    pub criiptoVerify: Option<crate::criipto_signatures::types::DownloadVerificationCriiptoVerifyInput>,
    pub oidc: Option<crate::criipto_signatures::types::DownloadVerificationOidcInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DownloadVerificationOidcInput {
    pub jwt: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DrawableEvidenceProviderInput {
    pub minimumHeight: Option<crate::scalars::Int>,
    pub minimumWidth: Option<crate::scalars::Int>,
    pub requireName: Option<crate::scalars::Boolean>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DrawableSignature {
    pub image: crate::scalars::Blob,
    pub name: Option<crate::scalars::String>,
    pub signatory: Option<Signatory>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DrawableSignatureEvidenceProvider {
    pub id: crate::scalars::ID,
    pub minimumHeight: Option<crate::scalars::Int>,
    pub minimumWidth: Option<crate::scalars::Int>,
    pub requireName: crate::scalars::Boolean,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmptySignature {
    pub signatory: Option<Signatory>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct EvidenceProviderInput {
    pub allOf: Option<crate::criipto_signatures::types::AllOfEvidenceProviderInput>,
    pub criiptoVerify: Option<crate::criipto_signatures::types::CriiptoVerifyProviderInput>,
    pub drawable: Option<crate::criipto_signatures::types::DrawableEvidenceProviderInput>,
    pub enabledByDefault: Option<crate::scalars::Boolean>,
    pub noop: Option<crate::criipto_signatures::types::NoopEvidenceProviderInput>,
    pub oidc: Option<crate::criipto_signatures::types::OidcEvidenceProviderInput>,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum EvidenceValidationStage {
    SIGN,
    VIEW,
}

impl ::serde::Serialize for EvidenceValidationStage {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            EvidenceValidationStage::SIGN => serializer.serialize_str("SIGN"),
            EvidenceValidationStage::VIEW => serializer.serialize_str("VIEW"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for EvidenceValidationStage {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "SIGN" => Ok(EvidenceValidationStage::SIGN),
            "VIEW" => Ok(EvidenceValidationStage::VIEW),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtendSignatureOrderInput {
    pub additionalExpirationInDays: crate::scalars::Int,
    pub signatureOrderId: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtendSignatureOrderOutput {
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JWTClaim {
    pub name: crate::scalars::String,
    pub value: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JWTSignature {
    pub claims: Vec<JWTClaim>,
    pub jwks: crate::scalars::String,
    pub jwt: crate::scalars::String,
    pub signatory: Option<Signatory>,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Language {
    DA_DK,
    EN_US,
    NB_NO,
    SV_SE,
}

impl ::serde::Serialize for Language {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            Language::DA_DK => serializer.serialize_str("DA_DK"),
            Language::EN_US => serializer.serialize_str("EN_US"),
            Language::NB_NO => serializer.serialize_str("NB_NO"),
            Language::SV_SE => serializer.serialize_str("SV_SE"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for Language {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "DA_DK" => Ok(Language::DA_DK),
            "EN_US" => Ok(Language::EN_US),
            "NB_NO" => Ok(Language::NB_NO),
            "SV_SE" => Ok(Language::SV_SE),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Mutation {
    pub addSignatories: Option<AddSignatoriesOutput>,
    pub addSignatory: Option<AddSignatoryOutput>,
    pub cancelSignatureOrder: Option<CancelSignatureOrderOutput>,
    pub changeSignatory: Option<ChangeSignatoryOutput>,
    pub changeSignatureOrder: Option<ChangeSignatureOrderOutput>,
    pub cleanupSignatureOrder: Option<CleanupSignatureOrderOutput>,
    pub closeSignatureOrder: Option<CloseSignatureOrderOutput>,
    pub completeCriiptoVerifyEvidenceProvider: Option<CompleteCriiptoVerifyEvidenceProviderOutput>,
    pub createApplication: Option<CreateApplicationOutput>,
    pub createApplicationApiKey: Option<CreateApplicationApiKeyOutput>,
    pub createBatchSignatory: Option<CreateBatchSignatoryOutput>,
    pub createSignatureOrder: Option<CreateSignatureOrderOutput>,
    pub deleteApplicationApiKey: Option<DeleteApplicationApiKeyOutput>,
    pub deleteSignatory: Option<DeleteSignatoryOutput>,
    pub extendSignatureOrder: Option<ExtendSignatureOrderOutput>,
    pub refreshApplicationApiKey: Option<RefreshApplicationApiKeyOutput>,
    pub rejectSignatureOrder: Option<RejectSignatureOrderOutput>,
    pub retrySignatureOrderWebhook: Option<RetrySignatureOrderWebhookOutput>,
    pub sign: Option<SignOutput>,
    pub signActingAs: Option<SignActingAsOutput>,
    pub signatoryBeacon: Option<SignatoryBeaconOutput>,
    pub startCriiptoVerifyEvidenceProvider: Option<crate::criipto_signatures::types::StartCriiptoVerifyEvidenceProviderOutput>,
    pub trackSignatory: Option<TrackSignatoryOutput>,
    pub updateSignatoryDocumentStatus: Option<UpdateSignatoryDocumentStatusOutput>,
    pub validateDocument: Option<ValidateDocumentOutput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoopEvidenceProviderInput {
    pub name: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoopSignatureEvidenceProvider {
    pub id: crate::scalars::ID,
    pub name: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OidcEvidenceProviderInput {
    pub acrValues: Option<Vec<crate::scalars::String>>,
    pub alwaysRedirect: Option<crate::scalars::Boolean>,
    pub audience: crate::scalars::String,
    pub clientID: crate::scalars::String,
    pub domain: crate::scalars::String,
    pub name: crate::scalars::String,
    pub uniqueEvidenceKey: Option<crate::scalars::String>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OidcJWTSignatureEvidenceProvider {
    pub acrValues: Vec<crate::scalars::String>,
    pub alwaysRedirect: crate::scalars::Boolean,
    pub clientID: crate::scalars::String,
    pub domain: crate::scalars::String,
    pub id: crate::scalars::ID,
    pub name: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PadesDocumentFormInput {
    pub enabled: crate::scalars::Boolean,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PadesDocumentInput {
    pub blob: crate::scalars::Blob,
    pub displayDocumentID: Option<crate::criipto_signatures::types::DocumentIDLocation>,
    pub form: Option<crate::criipto_signatures::types::PadesDocumentFormInput>,
    pub reference: Option<crate::scalars::String>,
    pub sealsPageTemplate: Option<crate::criipto_signatures::types::PadesDocumentSealsPageTemplateInput>,
    pub storageMode: crate::criipto_signatures::types::DocumentStorageMode,
    pub title: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PadesDocumentSealsPageTemplateInput {
    pub area: crate::criipto_signatures::types::PdfBoundingBoxInput,
    pub blob: crate::scalars::Blob,
    pub expectedColumns: Option<crate::scalars::Int>,
    pub expectedRows: Option<crate::scalars::Int>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PageInfo {
    pub endCursor: Option<crate::scalars::String>,
    pub hasNextPage: crate::scalars::Boolean,
    pub hasPreviousPage: crate::scalars::Boolean,
    pub startCursor: Option<crate::scalars::String>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PdfBoundingBoxInput {
    pub x1: crate::scalars::Float,
    pub x2: crate::scalars::Float,
    pub y1: crate::scalars::Float,
    pub y2: crate::scalars::Float,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PdfDocument {
    pub blob: Option<crate::scalars::Blob>,
    pub documentID: crate::scalars::String,
    pub form: Option<PdfDocumentForm>,
    pub id: crate::scalars::ID,
    pub originalBlob: Option<crate::scalars::Blob>,
    pub reference: Option<crate::scalars::String>,
    pub signatoryViewerStatus: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
    pub signatures: Option<Vec<Signature>>,
    pub title: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PdfDocumentForm {
    pub enabled: crate::scalars::Boolean,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PdfSealPosition {
    pub page: crate::scalars::Int,
    pub x: crate::scalars::Float,
    pub y: crate::scalars::Float,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Query {
    pub application: Option<Application>,
    pub batchSignatory: Option<BatchSignatory>,
    pub document: Option<Document>,
    pub signatory: Option<Signatory>,
    pub signatureOrder: Option<SignatureOrder>,
    pub tenant: Option<Tenant>,
    pub timezones: Vec<crate::scalars::String>,
    pub viewer: Viewer,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RefreshApplicationApiKeyInput {
    pub apiKeyId: crate::scalars::ID,
    pub applicationId: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RefreshApplicationApiKeyOutput {
    pub apiKey: ApplicationApiKey,
    pub application: Application,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RejectSignatureOrderInput {
    pub dummy: crate::scalars::Boolean,
    pub reason: Option<crate::scalars::String>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RejectSignatureOrderOutput {
    pub viewer: Viewer,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RetrySignatureOrderWebhookInput {
    pub retryPayload: crate::scalars::String,
    pub signatureOrderId: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RetrySignatureOrderWebhookOutput {
    pub invocation: WebhookInvocation,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignActingAsInput {
    pub evidence: crate::criipto_signatures::types::SignInput,
    pub signatoryId: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignActingAsOutput {
    pub signatory: Signatory,
    pub signatureOrder: SignatureOrder,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SignAllOfInput {
    pub criiptoVerify: Option<crate::criipto_signatures::types::SignCriiptoVerifyInput>,
    pub criiptoVerifyV2: Option<crate::criipto_signatures::types::SignCriiptoVerifyV2Input>,
    pub drawable: Option<crate::criipto_signatures::types::SignDrawableInput>,
    pub noop: Option<crate::scalars::Boolean>,
    pub oidc: Option<crate::criipto_signatures::types::SignOidcInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignCriiptoVerifyInput {
    pub jwt: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignCriiptoVerifyV2Input {
    pub code: crate::scalars::String,
    pub state: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignDocumentFormFieldInput {
    pub field: crate::scalars::String,
    pub value: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SignDocumentFormInput {
    pub fields: Vec<crate::criipto_signatures::types::SignDocumentFormFieldInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignDocumentInput {
    pub form: Option<crate::criipto_signatures::types::SignDocumentFormInput>,
    pub id: crate::scalars::ID,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignDrawableInput {
    pub image: crate::scalars::Blob,
    pub name: Option<crate::scalars::String>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignInput {
    pub allOf: Option<crate::criipto_signatures::types::SignAllOfInput>,
    pub criiptoVerify: Option<crate::criipto_signatures::types::SignCriiptoVerifyInput>,
    pub criiptoVerifyV2: Option<crate::criipto_signatures::types::SignCriiptoVerifyV2Input>,
    pub documents: Option<Vec<crate::criipto_signatures::types::SignDocumentInput>>,
    pub drawable: Option<crate::criipto_signatures::types::SignDrawableInput>,
    pub id: crate::scalars::ID,
    pub noop: Option<crate::scalars::Boolean>,
    pub oidc: Option<crate::criipto_signatures::types::SignOidcInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignOidcInput {
    pub jwt: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignOutput {
    pub viewer: Viewer,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Signatory {
    pub documents: SignatoryDocumentConnection,
    pub downloadHref: Option<crate::scalars::String>,
    pub evidenceProviders: Vec<SignatureEvidenceProvider>,
    pub href: crate::scalars::String,
    pub id: crate::scalars::ID,
    pub reference: Option<crate::scalars::String>,
    pub role: Option<crate::scalars::String>,
    pub signatoryRole: crate::criipto_signatures::types::SignatoryRole,
    pub signatureOrder: SignatureOrder,
    pub signingAs: Option<crate::scalars::String>,
    pub signingSequence: SignatorySigningSequence,
    pub spanId: crate::scalars::String,
    pub status: crate::criipto_signatures::types::SignatoryStatus,
    pub statusReason: Option<crate::scalars::String>,
    pub token: crate::scalars::String,
    pub traceId: crate::scalars::String,
    pub ui: SignatureOrderUI,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatoryBeaconInput {
    pub lastActionAt: crate::scalars::DateTime,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatoryBeaconOutput {
    pub viewer: Viewer,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatoryDocumentConnection {
    pub edges: Vec<SignatoryDocumentEdge>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatoryDocumentEdge {
    pub node: Document,
    pub status: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatoryDocumentInput {
    pub id: crate::scalars::ID,
    pub pdfSealPosition: Option<crate::criipto_signatures::types::PdfSealPosition>,
    pub pdfSealPositions: Option<Vec<crate::criipto_signatures::types::PdfSealPosition>>,
    pub preapproved: Option<crate::scalars::Boolean>,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum SignatoryDocumentStatus {
    APPROVED,
    OPENED,
    PREAPPROVED,
    REJECTED,
    SIGNED,
}

impl ::serde::Serialize for SignatoryDocumentStatus {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            SignatoryDocumentStatus::APPROVED => serializer.serialize_str("APPROVED"),
            SignatoryDocumentStatus::OPENED => serializer.serialize_str("OPENED"),
            SignatoryDocumentStatus::PREAPPROVED => serializer.serialize_str("PREAPPROVED"),
            SignatoryDocumentStatus::REJECTED => serializer.serialize_str("REJECTED"),
            SignatoryDocumentStatus::SIGNED => serializer.serialize_str("SIGNED"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for SignatoryDocumentStatus {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "APPROVED" => Ok(SignatoryDocumentStatus::APPROVED),
            "OPENED" => Ok(SignatoryDocumentStatus::OPENED),
            "PREAPPROVED" => Ok(SignatoryDocumentStatus::PREAPPROVED),
            "REJECTED" => Ok(SignatoryDocumentStatus::REJECTED),
            "SIGNED" => Ok(SignatoryDocumentStatus::SIGNED),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatoryEvidenceProviderInput {
    pub allOf: Option<crate::criipto_signatures::types::AllOfEvidenceProviderInput>,
    pub criiptoVerify: Option<crate::criipto_signatures::types::CriiptoVerifyProviderInput>,
    pub drawable: Option<crate::criipto_signatures::types::DrawableEvidenceProviderInput>,
    pub id: crate::scalars::ID,
    pub noop: Option<crate::criipto_signatures::types::NoopEvidenceProviderInput>,
    pub oidc: Option<crate::criipto_signatures::types::OidcEvidenceProviderInput>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatoryEvidenceValidationInput {
    pub boolean: Option<crate::scalars::Boolean>,
    pub key: crate::scalars::String,
    pub value: Option<crate::scalars::String>,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum SignatoryFrontendEvent {
    DOWNLOAD_LINK_OPENED,
    SIGN_LINK_OPENED,
}

impl ::serde::Serialize for SignatoryFrontendEvent {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            SignatoryFrontendEvent::DOWNLOAD_LINK_OPENED => serializer.serialize_str("DOWNLOAD_LINK_OPENED"),
            SignatoryFrontendEvent::SIGN_LINK_OPENED => serializer.serialize_str("SIGN_LINK_OPENED"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for SignatoryFrontendEvent {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "DOWNLOAD_LINK_OPENED" => Ok(SignatoryFrontendEvent::DOWNLOAD_LINK_OPENED),
            "SIGN_LINK_OPENED" => Ok(SignatoryFrontendEvent::SIGN_LINK_OPENED),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum SignatoryRole {
    SIGNER,
    VIEWER,
}

impl ::serde::Serialize for SignatoryRole {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            SignatoryRole::SIGNER => serializer.serialize_str("SIGNER"),
            SignatoryRole::VIEWER => serializer.serialize_str("VIEWER"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for SignatoryRole {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "SIGNER" => Ok(SignatoryRole::SIGNER),
            "VIEWER" => Ok(SignatoryRole::VIEWER),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatorySigningSequence {
    pub initialNumber: crate::scalars::Int,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum SignatoryStatus {
    DELETED,
    ERROR,
    OPEN,
    REJECTED,
    SIGNED,
}

impl ::serde::Serialize for SignatoryStatus {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            SignatoryStatus::DELETED => serializer.serialize_str("DELETED"),
            SignatoryStatus::ERROR => serializer.serialize_str("ERROR"),
            SignatoryStatus::OPEN => serializer.serialize_str("OPEN"),
            SignatoryStatus::REJECTED => serializer.serialize_str("REJECTED"),
            SignatoryStatus::SIGNED => serializer.serialize_str("SIGNED"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for SignatoryStatus {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "DELETED" => Ok(SignatoryStatus::DELETED),
            "ERROR" => Ok(SignatoryStatus::ERROR),
            "OPEN" => Ok(SignatoryStatus::OPEN),
            "REJECTED" => Ok(SignatoryStatus::REJECTED),
            "SIGNED" => Ok(SignatoryStatus::SIGNED),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SignatoryUIInput {
    pub disableRejection: Option<crate::scalars::Boolean>,
    pub language: Option<crate::criipto_signatures::types::Language>,
    pub logo: Option<crate::criipto_signatures::types::SignatureOrderUILogoInput>,
    pub renderPdfAnnotationLayer: Option<crate::scalars::Boolean>,
    pub signatoryRedirectUri: Option<crate::scalars::String>,
    pub stylesheet: Option<crate::scalars::String>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatoryViewer {
    pub authenticated: crate::scalars::Boolean,
    pub documents: SignatoryDocumentConnection,
    pub download: Option<SignatoryViewerDownload>,
    pub evidenceProviders: Vec<SignatureEvidenceProvider>,
    pub id: crate::scalars::ID,
    pub role: crate::criipto_signatures::types::SignatoryRole,
    pub signatoryId: crate::scalars::ID,
    pub signatureOrderStatus: crate::criipto_signatures::types::SignatureOrderStatus,
    pub signer: crate::scalars::Boolean,
    pub status: crate::criipto_signatures::types::SignatoryStatus,
    pub ui: SignatureOrderUI,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatoryViewerDownload {
    pub documents: Option<SignatoryDocumentConnection>,
    pub expired: crate::scalars::Boolean,
    pub verificationEvidenceProvider: Option<SignatureEvidenceProvider>,
    pub verificationRequired: crate::scalars::Boolean,
}

/// interface
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Signature {
    CompositeSignature(CompositeSignature),
    DrawableSignature(DrawableSignature),
    EmptySignature(EmptySignature),
    JWTSignature(JWTSignature),
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SignatureAppearanceInput {
    pub displayName: Option<Vec<crate::criipto_signatures::types::SignatureAppearanceTemplateInput>>,
    pub footer: Option<Vec<crate::criipto_signatures::types::SignatureAppearanceTemplateInput>>,
    pub headerLeft: Option<Vec<crate::criipto_signatures::types::SignatureAppearanceTemplateInput>>,
    pub identifierFromEvidence: Vec<crate::scalars::String>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureAppearanceTemplateInput {
    pub replacements: Option<Vec<crate::criipto_signatures::types::SignatureAppearanceTemplateReplacementInput>>,
    pub template: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureAppearanceTemplateReplacementInput {
    pub fromEvidence: Vec<crate::scalars::String>,
    pub placeholder: crate::scalars::String,
}

/// interface
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SignatureEvidenceProvider {
    AllOfSignatureEvidenceProvider(AllOfSignatureEvidenceProvider),
    CriiptoVerifySignatureEvidenceProvider(CriiptoVerifySignatureEvidenceProvider),
    DrawableSignatureEvidenceProvider(DrawableSignatureEvidenceProvider),
    NoopSignatureEvidenceProvider(NoopSignatureEvidenceProvider),
    OidcJWTSignatureEvidenceProvider(OidcJWTSignatureEvidenceProvider),
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureOrder {
    pub application: Option<Application>,
    pub closedAt: Option<crate::scalars::DateTime>,
    pub createdAt: crate::scalars::DateTime,
    pub documents: Vec<Document>,
    pub evidenceProviders: Vec<SignatureEvidenceProvider>,
    pub expiresAt: crate::scalars::DateTime,
    pub id: crate::scalars::ID,
    pub maxSignatories: crate::scalars::Int,
    pub signatories: Vec<Signatory>,
    pub status: crate::criipto_signatures::types::SignatureOrderStatus,
    pub tenant: Option<Tenant>,
    pub timezone: crate::scalars::String,
    pub title: Option<crate::scalars::String>,
    pub traceId: crate::scalars::String,
    pub ui: SignatureOrderUI,
    pub webhook: Option<SignatureOrderWebhook>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureOrderConnection {
    pub edges: Vec<SignatureOrderEdge>,
    pub pageInfo: PageInfo,
    pub totalCount: Option<crate::scalars::Int>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureOrderEdge {
    pub cursor: crate::scalars::String,
    pub node: SignatureOrder,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum SignatureOrderStatus {
    CANCELLED,
    CLOSED,
    EXPIRED,
    OPEN,
}

impl ::serde::Serialize for SignatureOrderStatus {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            SignatureOrderStatus::CANCELLED => serializer.serialize_str("CANCELLED"),
            SignatureOrderStatus::CLOSED => serializer.serialize_str("CLOSED"),
            SignatureOrderStatus::EXPIRED => serializer.serialize_str("EXPIRED"),
            SignatureOrderStatus::OPEN => serializer.serialize_str("OPEN"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for SignatureOrderStatus {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "CANCELLED" => Ok(SignatureOrderStatus::CANCELLED),
            "CLOSED" => Ok(SignatureOrderStatus::CLOSED),
            "EXPIRED" => Ok(SignatureOrderStatus::EXPIRED),
            "OPEN" => Ok(SignatureOrderStatus::OPEN),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureOrderUI {
    pub disableRejection: crate::scalars::Boolean,
    pub language: crate::criipto_signatures::types::Language,
    pub logo: Option<SignatureOrderUILogo>,
    pub renderPdfAnnotationLayer: crate::scalars::Boolean,
    pub signatoryRedirectUri: Option<crate::scalars::String>,
    pub stylesheet: Option<crate::scalars::String>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureOrderUILogo {
    pub href: Option<crate::scalars::String>,
    pub src: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureOrderUILogoInput {
    pub href: Option<crate::scalars::String>,
    pub src: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureOrderWebhook {
    pub logs: Vec<WebhookInvocation>,
    pub url: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SingleEvidenceProviderInput {
    pub criiptoVerify: Option<crate::criipto_signatures::types::CriiptoVerifyProviderInput>,
    pub drawable: Option<crate::criipto_signatures::types::DrawableEvidenceProviderInput>,
    pub noop: Option<crate::criipto_signatures::types::NoopEvidenceProviderInput>,
    pub oidc: Option<crate::criipto_signatures::types::OidcEvidenceProviderInput>,
}

/// interface
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SingleSignature {
    DrawableSignature(DrawableSignature),
    EmptySignature(EmptySignature),
    JWTSignature(JWTSignature),
}

/// interface
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SingleSignatureEvidenceProvider {
    CriiptoVerifySignatureEvidenceProvider(CriiptoVerifySignatureEvidenceProvider),
    DrawableSignatureEvidenceProvider(DrawableSignatureEvidenceProvider),
    NoopSignatureEvidenceProvider(NoopSignatureEvidenceProvider),
    OidcJWTSignatureEvidenceProvider(OidcJWTSignatureEvidenceProvider),
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StartCriiptoVerifyEvidenceProviderInput {
    pub acrValue: crate::scalars::String,
    pub device: Option<crate::criipto_signatures::types::DeviceInput>,
    pub id: crate::scalars::ID,
    pub idTokenHint: Option<crate::scalars::String>,
    pub redirectUri: crate::scalars::String,
    pub stage: crate::criipto_signatures::types::EvidenceValidationStage,
}

/// union
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "__typename")]
pub enum StartCriiptoVerifyEvidenceProviderOutput {
    CriiptoVerifyEvidenceProviderRedirect(CriiptoVerifyEvidenceProviderRedirect),
}

impl StartCriiptoVerifyEvidenceProviderOutput {
    pub fn as_CriiptoVerifyEvidenceProviderRedirect(&self) -> Option<&CriiptoVerifyEvidenceProviderRedirect> {
        match self {
            Self::CriiptoVerifyEvidenceProviderRedirect(inner) => Some(inner),
            _ => None,
        }
    }
}
///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tenant {
    pub applications: Vec<Application>,
    pub id: crate::scalars::ID,
    pub webhookLogs: Vec<WebhookInvocation>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrackSignatoryInput {
    pub event: crate::criipto_signatures::types::SignatoryFrontendEvent,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrackSignatoryOutput {
    pub viewer: Viewer,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UnvalidatedSignatoryViewer {
    pub authenticated: crate::scalars::Boolean,
    pub download: Option<SignatoryViewerDownload>,
    pub evidenceProviders: Vec<SignatureEvidenceProvider>,
    pub id: crate::scalars::ID,
    pub signatoryId: crate::scalars::ID,
    pub ui: SignatureOrderUI,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateSignatoryDocumentStatusInput {
    pub documentId: crate::scalars::ID,
    pub status: crate::criipto_signatures::types::SignatoryDocumentStatus,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateSignatoryDocumentStatusOutput {
    pub documentEdge: SignatoryDocumentEdge,
    pub viewer: Viewer,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserViewer {
    pub authenticated: crate::scalars::Boolean,
    pub id: crate::scalars::ID,
    pub tenants: Vec<Tenant>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ValidateDocumentInput {
    pub pdf: Option<crate::scalars::Blob>,
    pub xml: Option<crate::scalars::Blob>,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidateDocumentOutput {
    pub errors: Option<Vec<crate::scalars::String>>,
    pub fixable: Option<crate::scalars::Boolean>,
    pub previouslySigned: Option<crate::scalars::Boolean>,
    pub valid: crate::scalars::Boolean,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerifyApplication {
    pub domain: crate::scalars::String,
    pub environment: crate::criipto_signatures::types::VerifyApplicationEnvironment,
    pub realm: crate::scalars::String,
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum VerifyApplicationEnvironment {
    PRODUCTION,
    TEST,
}

impl ::serde::Serialize for VerifyApplicationEnvironment {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            VerifyApplicationEnvironment::PRODUCTION => serializer.serialize_str("PRODUCTION"),
            VerifyApplicationEnvironment::TEST => serializer.serialize_str("TEST"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for VerifyApplicationEnvironment {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "PRODUCTION" => Ok(VerifyApplicationEnvironment::PRODUCTION),
            "TEST" => Ok(VerifyApplicationEnvironment::TEST),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerifyApplicationQueryInput {
    pub domain: crate::scalars::String,
    pub realm: crate::scalars::String,
    pub tenantId: crate::scalars::ID,
}

/// interface
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Viewer {
    AnonymousViewer(AnonymousViewer),
    Application(Application),
    BatchSignatoryViewer(BatchSignatoryViewer),
    SignatoryViewer(SignatoryViewer),
    UnvalidatedSignatoryViewer(UnvalidatedSignatoryViewer),
    UserViewer(UserViewer),
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebhookExceptionInvocation {
    pub correlationId: crate::scalars::String,
    pub event: Option<crate::criipto_signatures::types::WebhookInvocationEvent>,
    pub exception: crate::scalars::String,
    pub requestBody: crate::scalars::String,
    pub responseBody: Option<crate::scalars::String>,
    pub retryPayload: crate::scalars::String,
    pub retryingAt: Option<crate::scalars::String>,
    pub signatureOrderId: Option<crate::scalars::String>,
    pub timestamp: crate::scalars::String,
    pub url: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebhookHttpErrorInvocation {
    pub correlationId: crate::scalars::String,
    pub event: Option<crate::criipto_signatures::types::WebhookInvocationEvent>,
    pub requestBody: crate::scalars::String,
    pub responseBody: Option<crate::scalars::String>,
    pub responseStatusCode: crate::scalars::Int,
    pub retryPayload: crate::scalars::String,
    pub retryingAt: Option<crate::scalars::String>,
    pub signatureOrderId: Option<crate::scalars::String>,
    pub timestamp: crate::scalars::String,
    pub url: crate::scalars::String,
}

/// interface
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WebhookInvocation {
    WebhookExceptionInvocation(WebhookExceptionInvocation),
    WebhookHttpErrorInvocation(WebhookHttpErrorInvocation),
    WebhookSuccessfulInvocation(WebhookSuccessfulInvocation),
    WebhookTimeoutInvocation(WebhookTimeoutInvocation),
}

///
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum WebhookInvocationEvent {
    SIGNATORY_DOCUMENT_STATUS_CHANGED,
    SIGNATORY_DOWNLOAD_LINK_OPENED,
    SIGNATORY_REJECTED,
    SIGNATORY_SIGNED,
    SIGNATORY_SIGN_ERROR,
    SIGNATORY_SIGN_LINK_OPENED,
    SIGNATURE_ORDER_EXPIRED,
}

impl ::serde::Serialize for WebhookInvocationEvent {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            WebhookInvocationEvent::SIGNATORY_DOCUMENT_STATUS_CHANGED => serializer.serialize_str("SIGNATORY_DOCUMENT_STATUS_CHANGED"),
            WebhookInvocationEvent::SIGNATORY_DOWNLOAD_LINK_OPENED => serializer.serialize_str("SIGNATORY_DOWNLOAD_LINK_OPENED"),
            WebhookInvocationEvent::SIGNATORY_REJECTED => serializer.serialize_str("SIGNATORY_REJECTED"),
            WebhookInvocationEvent::SIGNATORY_SIGNED => serializer.serialize_str("SIGNATORY_SIGNED"),
            WebhookInvocationEvent::SIGNATORY_SIGN_ERROR => serializer.serialize_str("SIGNATORY_SIGN_ERROR"),
            WebhookInvocationEvent::SIGNATORY_SIGN_LINK_OPENED => serializer.serialize_str("SIGNATORY_SIGN_LINK_OPENED"),
            WebhookInvocationEvent::SIGNATURE_ORDER_EXPIRED => serializer.serialize_str("SIGNATURE_ORDER_EXPIRED"),
        }
    }
}

impl<'de> ::serde::Deserialize<'de> for WebhookInvocationEvent {
    fn deserialize<D>(deserializer: D) -> ::std::result::Result<Self, D::Error>
    where
        D: ::serde::Deserializer<'de>,
    {
        let s: String = ::serde::Deserialize::deserialize(deserializer)?;
        match s.as_ref() {
            "SIGNATORY_DOCUMENT_STATUS_CHANGED" => Ok(WebhookInvocationEvent::SIGNATORY_DOCUMENT_STATUS_CHANGED),
            "SIGNATORY_DOWNLOAD_LINK_OPENED" => Ok(WebhookInvocationEvent::SIGNATORY_DOWNLOAD_LINK_OPENED),
            "SIGNATORY_REJECTED" => Ok(WebhookInvocationEvent::SIGNATORY_REJECTED),
            "SIGNATORY_SIGNED" => Ok(WebhookInvocationEvent::SIGNATORY_SIGNED),
            "SIGNATORY_SIGN_ERROR" => Ok(WebhookInvocationEvent::SIGNATORY_SIGN_ERROR),
            "SIGNATORY_SIGN_LINK_OPENED" => Ok(WebhookInvocationEvent::SIGNATORY_SIGN_LINK_OPENED),
            "SIGNATURE_ORDER_EXPIRED" => Ok(WebhookInvocationEvent::SIGNATURE_ORDER_EXPIRED),
            _ => Err(::serde::de::Error::custom(format!("Unknown variant: {}", s))),
        }
    }
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebhookSuccessfulInvocation {
    pub correlationId: crate::scalars::String,
    pub event: Option<crate::criipto_signatures::types::WebhookInvocationEvent>,
    pub requestBody: crate::scalars::String,
    pub responseBody: Option<crate::scalars::String>,
    pub responseStatusCode: crate::scalars::Int,
    pub signatureOrderId: Option<crate::scalars::String>,
    pub timestamp: crate::scalars::String,
    pub url: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebhookTimeoutInvocation {
    pub correlationId: crate::scalars::String,
    pub event: Option<crate::criipto_signatures::types::WebhookInvocationEvent>,
    pub requestBody: crate::scalars::String,
    pub responseBody: Option<crate::scalars::String>,
    pub responseTimeout: crate::scalars::Int,
    pub retryPayload: crate::scalars::String,
    pub retryingAt: Option<crate::scalars::String>,
    pub signatureOrderId: Option<crate::scalars::String>,
    pub timestamp: crate::scalars::String,
    pub url: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct XadesDocumentInput {
    pub blob: crate::scalars::Blob,
    pub reference: Option<crate::scalars::String>,
    pub storageMode: crate::criipto_signatures::types::DocumentStorageMode,
    pub title: crate::scalars::String,
}

///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct XmlDocument {
    pub blob: Option<crate::scalars::Blob>,
    pub id: crate::scalars::ID,
    pub originalBlob: Option<crate::scalars::Blob>,
    pub reference: Option<crate::scalars::String>,
    pub signatoryViewerStatus: Option<crate::criipto_signatures::types::SignatoryDocumentStatus>,
    pub signatures: Option<Vec<Signature>>,
    pub title: crate::scalars::String,
}
