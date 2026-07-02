package eu.idura.signatures
class AddSignatoriesInputBuilder(
    private val signatories: List<CreateSignatureOrderSignatoryInput>,
    private val signatureOrderId: String
) {
    fun build() = AddSignatoriesInput(
        signatories = signatories,
        signatureOrderId = signatureOrderId
    )
}

class AddSignatoryInputBuilder(
    private val signatureOrderId: String
) {
    private var documents: List<SignatoryDocumentInput>? = null
    private var evidenceProviders: List<SignatoryEvidenceProviderInput>? = null
    private var evidenceValidation: List<SignatoryEvidenceValidationInput>? = null
    private var reference: String? = null
    private var role: String? = null
    private var signatoryRole: SignatoryRole? = null
    private var signatureAppearance: SignatureAppearanceInput? = null
    private var signingAs: String? = null
    private var signingSequence: Int? = null
    private var ui: SignatoryUiInput? = null

    fun documents(value: List<SignatoryDocumentInput>) = apply { this.documents = value }
    fun evidenceProviders(value: List<SignatoryEvidenceProviderInput>) = apply { this.evidenceProviders = value }
    fun evidenceValidation(value: List<SignatoryEvidenceValidationInput>) = apply { this.evidenceValidation = value }
    fun reference(value: String) = apply { this.reference = value }
    fun role(value: String) = apply { this.role = value }
    fun signatoryRole(value: SignatoryRole) = apply { this.signatoryRole = value }
    fun signatureAppearance(value: SignatureAppearanceInput) = apply { this.signatureAppearance = value }
    fun signingAs(value: String) = apply { this.signingAs = value }
    fun signingSequence(value: Int) = apply { this.signingSequence = value }
    fun ui(value: SignatoryUiInput) = apply { this.ui = value }

    fun build() = AddSignatoryInput(
        documents = documents,
        evidenceProviders = evidenceProviders,
        evidenceValidation = evidenceValidation,
        reference = reference,
        role = role,
        signatoryRole = signatoryRole,
        signatureAppearance = signatureAppearance,
        signatureOrderId = signatureOrderId,
        signingAs = signingAs,
        signingSequence = signingSequence,
        ui = ui
    )
}

class AllOfEvidenceProviderInputBuilder(
    private val providers: List<SingleEvidenceProviderInput>
) {
    fun build() = AllOfEvidenceProviderInput(
        providers = providers
    )
}

class BatchSignatoryItemInputBuilder(
    private val signatoryId: String,
    private val signatureOrderId: String
) {
    fun build() = BatchSignatoryItemInput(
        signatoryId = signatoryId,
        signatureOrderId = signatureOrderId
    )
}

class CancelSignatureOrderInputBuilder(
    private val signatureOrderId: String
) {
    fun build() = CancelSignatureOrderInput(
        signatureOrderId = signatureOrderId
    )
}

class ChangeSignatoryInputBuilder(
    private val signatoryId: String
) {
    private var documents: List<SignatoryDocumentInput>? = null
    private var evidenceProviders: List<SignatoryEvidenceProviderInput>? = null
    private var evidenceValidation: List<SignatoryEvidenceValidationInput>? = null
    private var reference: String? = null
    private var role: String? = null
    private var signatureAppearance: SignatureAppearanceInput? = null
    private var signingAs: String? = null
    private var signingSequence: Int? = null
    private var ui: SignatoryUiInput? = null

    fun documents(value: List<SignatoryDocumentInput>) = apply { this.documents = value }
    fun evidenceProviders(value: List<SignatoryEvidenceProviderInput>) = apply { this.evidenceProviders = value }
    fun evidenceValidation(value: List<SignatoryEvidenceValidationInput>) = apply { this.evidenceValidation = value }
    fun reference(value: String) = apply { this.reference = value }
    fun role(value: String) = apply { this.role = value }
    fun signatureAppearance(value: SignatureAppearanceInput) = apply { this.signatureAppearance = value }
    fun signingAs(value: String) = apply { this.signingAs = value }
    fun signingSequence(value: Int) = apply { this.signingSequence = value }
    fun ui(value: SignatoryUiInput) = apply { this.ui = value }

    fun build() = ChangeSignatoryInput(
        documents = documents,
        evidenceProviders = evidenceProviders,
        evidenceValidation = evidenceValidation,
        reference = reference,
        role = role,
        signatoryId = signatoryId,
        signatureAppearance = signatureAppearance,
        signingAs = signingAs,
        signingSequence = signingSequence,
        ui = ui
    )
}

class ChangeSignatureOrderInputBuilder(
    private val signatureOrderId: String
) {
    private var maxSignatories: Int? = null
    private var webhook: CreateSignatureOrderWebhookInput? = null

    fun maxSignatories(value: Int) = apply { this.maxSignatories = value }
    fun webhook(value: CreateSignatureOrderWebhookInput) = apply { this.webhook = value }

    fun build() = ChangeSignatureOrderInput(
        maxSignatories = maxSignatories,
        signatureOrderId = signatureOrderId,
        webhook = webhook
    )
}

class CleanupSignatureOrderInputBuilder(
    private val signatureOrderId: String
) {
    fun build() = CleanupSignatureOrderInput(
        signatureOrderId = signatureOrderId
    )
}

class CloseSignatureOrderInputBuilder(
    private val signatureOrderId: String
) {
    private var retainDocumentsForDays: Int? = null

    fun retainDocumentsForDays(value: Int) = apply { this.retainDocumentsForDays = value }

    fun build() = CloseSignatureOrderInput(
        retainDocumentsForDays = retainDocumentsForDays,
        signatureOrderId = signatureOrderId
    )
}

class CompleteCriiptoVerifyEvidenceProviderInputBuilder(
    private val code: String,
    private val state: String
) {
    fun build() = CompleteCriiptoVerifyEvidenceProviderInput(
        code = code,
        state = state
    )
}

class CreateApplicationApiKeyInputBuilder(
    private val applicationId: String
) {
    private var mode: ApplicationApiKeyMode? = null
    private var note: String? = null

    fun mode(value: ApplicationApiKeyMode) = apply { this.mode = value }
    fun note(value: String) = apply { this.note = value }

    fun build() = CreateApplicationApiKeyInput(
        applicationId = applicationId,
        mode = mode,
        note = note
    )
}

class CreateApplicationInputBuilder(
    private val name: String,
    private val tenantId: String,
    private val verifyApplicationDomain: String,
    private val verifyApplicationEnvironment: VerifyApplicationEnvironment,
    private val verifyApplicationRealm: String
) {
    fun build() = CreateApplicationInput(
        name = name,
        tenantId = tenantId,
        verifyApplicationDomain = verifyApplicationDomain,
        verifyApplicationEnvironment = verifyApplicationEnvironment,
        verifyApplicationRealm = verifyApplicationRealm
    )
}

class CreateBatchSignatoryInputBuilder(
    private val items: List<BatchSignatoryItemInput>
) {
    private var ui: SignatoryUiInput? = null

    fun ui(value: SignatoryUiInput) = apply { this.ui = value }

    fun build() = CreateBatchSignatoryInput(
        items = items,
        ui = ui
    )
}

class CreateSignatureOrderInputBuilder(
    private val documents: List<DocumentInput>
) {
    private var disableVerifyEvidenceProvider: Boolean? = null
    private var evidenceProviders: List<EvidenceProviderInput>? = null
    private var evidenceValidationStages: List<EvidenceValidationStage>? = null
    private var expiresAt: String? = null
    private var expiresInDays: Int? = null
    private var fixDocumentFormattingErrors: Boolean? = null
    private var maxSignatories: Int? = 14
    private var signatories: List<CreateSignatureOrderSignatoryInput>? = null
    private var signatureAppearance: SignatureAppearanceInput? = null
    private var timezone: String? = null
    private var title: String? = null
    private var ui: CreateSignatureOrderUiInput? = null
    private var webhook: CreateSignatureOrderWebhookInput? = null

    fun disableVerifyEvidenceProvider(value: Boolean) = apply { this.disableVerifyEvidenceProvider = value }
    fun evidenceProviders(value: List<EvidenceProviderInput>) = apply { this.evidenceProviders = value }
    fun evidenceValidationStages(value: List<EvidenceValidationStage>) = apply { this.evidenceValidationStages = value }
    fun expiresAt(value: String) = apply { this.expiresAt = value }
    fun expiresInDays(value: Int) = apply { this.expiresInDays = value }
    fun fixDocumentFormattingErrors(value: Boolean) = apply { this.fixDocumentFormattingErrors = value }
    fun maxSignatories(value: Int) = apply { this.maxSignatories = value }
    fun signatories(value: List<CreateSignatureOrderSignatoryInput>) = apply { this.signatories = value }
    fun signatureAppearance(value: SignatureAppearanceInput) = apply { this.signatureAppearance = value }
    fun timezone(value: String) = apply { this.timezone = value }
    fun title(value: String) = apply { this.title = value }
    fun ui(value: CreateSignatureOrderUiInput) = apply { this.ui = value }
    fun webhook(value: CreateSignatureOrderWebhookInput) = apply { this.webhook = value }

    fun build() = CreateSignatureOrderInput(
        disableVerifyEvidenceProvider = disableVerifyEvidenceProvider,
        documents = documents,
        evidenceProviders = evidenceProviders,
        evidenceValidationStages = evidenceValidationStages,
        expiresAt = expiresAt,
        expiresInDays = expiresInDays,
        fixDocumentFormattingErrors = fixDocumentFormattingErrors,
        maxSignatories = maxSignatories,
        signatories = signatories,
        signatureAppearance = signatureAppearance,
        timezone = timezone,
        title = title,
        ui = ui,
        webhook = webhook
    )
}

class CreateSignatureOrderSignatoryInputBuilder {
    private var documents: List<SignatoryDocumentInput>? = null
    private var evidenceProviders: List<SignatoryEvidenceProviderInput>? = null
    private var evidenceValidation: List<SignatoryEvidenceValidationInput>? = null
    private var reference: String? = null
    private var role: String? = null
    private var signatoryRole: SignatoryRole? = null
    private var signatureAppearance: SignatureAppearanceInput? = null
    private var signingAs: String? = null
    private var signingSequence: Int? = null
    private var ui: SignatoryUiInput? = null

    fun documents(value: List<SignatoryDocumentInput>) = apply { this.documents = value }
    fun evidenceProviders(value: List<SignatoryEvidenceProviderInput>) = apply { this.evidenceProviders = value }
    fun evidenceValidation(value: List<SignatoryEvidenceValidationInput>) = apply { this.evidenceValidation = value }
    fun reference(value: String) = apply { this.reference = value }
    fun role(value: String) = apply { this.role = value }
    fun signatoryRole(value: SignatoryRole) = apply { this.signatoryRole = value }
    fun signatureAppearance(value: SignatureAppearanceInput) = apply { this.signatureAppearance = value }
    fun signingAs(value: String) = apply { this.signingAs = value }
    fun signingSequence(value: Int) = apply { this.signingSequence = value }
    fun ui(value: SignatoryUiInput) = apply { this.ui = value }

    fun build() = CreateSignatureOrderSignatoryInput(
        documents = documents,
        evidenceProviders = evidenceProviders,
        evidenceValidation = evidenceValidation,
        reference = reference,
        role = role,
        signatoryRole = signatoryRole,
        signatureAppearance = signatureAppearance,
        signingAs = signingAs,
        signingSequence = signingSequence,
        ui = ui
    )
}

class CreateSignatureOrderUiInputBuilder {
    private var disableRejection: Boolean? = null
    private var enableCancel: Boolean? = null
    private var language: Language? = Language.EnUs
    private var logo: SignatureOrderUiLogoInput? = null
    private var renderPdfAnnotationLayer: Boolean? = null
    private var signatoryRedirectUri: String? = null
    private var stylesheet: String? = null

    fun disableRejection(value: Boolean) = apply { this.disableRejection = value }
    fun enableCancel(value: Boolean) = apply { this.enableCancel = value }
    fun language(value: Language) = apply { this.language = value }
    fun logo(value: SignatureOrderUiLogoInput) = apply { this.logo = value }
    fun renderPdfAnnotationLayer(value: Boolean) = apply { this.renderPdfAnnotationLayer = value }
    fun signatoryRedirectUri(value: String) = apply { this.signatoryRedirectUri = value }
    fun stylesheet(value: String) = apply { this.stylesheet = value }

    fun build() = CreateSignatureOrderUiInput(
        disableRejection = disableRejection,
        enableCancel = enableCancel,
        language = language,
        logo = logo,
        renderPdfAnnotationLayer = renderPdfAnnotationLayer,
        signatoryRedirectUri = signatoryRedirectUri,
        stylesheet = stylesheet
    )
}

class CreateSignatureOrderWebhookInputBuilder(
    private val url: String
) {
    private var secret: ByteArray? = null
    private var validateConnectivity: Boolean? = null

    fun secret(value: ByteArray) = apply { this.secret = value }
    fun validateConnectivity(value: Boolean) = apply { this.validateConnectivity = value }

    fun build() = CreateSignatureOrderWebhookInput(
        secret = secret,
        url = url,
        validateConnectivity = validateConnectivity
    )
}

class CriiptoVerifyProviderInputBuilder {
    private var acrValues: List<String>? = null
    private var alwaysRedirect: Boolean? = null
    private var audiences: List<String>? = null
    private var loginHint: String? = null
    private var message: String? = null
    private var scope: String? = null
    private var uniqueEvidenceKey: String? = null
    private var version: CriiptoVerifyEvidenceProviderVersion? = null

    fun acrValues(value: List<String>) = apply { this.acrValues = value }
    fun alwaysRedirect(value: Boolean) = apply { this.alwaysRedirect = value }
    fun audiences(value: List<String>) = apply { this.audiences = value }
    fun loginHint(value: String) = apply { this.loginHint = value }
    fun message(value: String) = apply { this.message = value }
    fun scope(value: String) = apply { this.scope = value }
    fun uniqueEvidenceKey(value: String) = apply { this.uniqueEvidenceKey = value }
    fun version(value: CriiptoVerifyEvidenceProviderVersion) = apply { this.version = value }

    fun build() = CriiptoVerifyProviderInput(
        acrValues = acrValues,
        alwaysRedirect = alwaysRedirect,
        audiences = audiences,
        loginHint = loginHint,
        message = message,
        scope = scope,
        uniqueEvidenceKey = uniqueEvidenceKey,
        version = version
    )
}

class DeleteApplicationApiKeyInputBuilder(
    private val apiKeyId: String,
    private val applicationId: String
) {
    fun build() = DeleteApplicationApiKeyInput(
        apiKeyId = apiKeyId,
        applicationId = applicationId
    )
}

class DeleteSignatoryInputBuilder(
    private val signatoryId: String,
    private val signatureOrderId: String
) {
    fun build() = DeleteSignatoryInput(
        signatoryId = signatoryId,
        signatureOrderId = signatureOrderId
    )
}

class DeviceInputBuilder {
    private var os: DeviceOperatingSystem? = null

    fun os(value: DeviceOperatingSystem) = apply { this.os = value }

    fun build() = DeviceInput(
        os = os
    )
}

class DocumentInputBuilder {
    private var keepPreviousSignatures: Boolean? = null
    private var pdf: PadesDocumentInput? = null
    private var removePreviousSignatures: Boolean? = null
    private var xml: XadesDocumentInput? = null

    fun keepPreviousSignatures(value: Boolean) = apply { this.keepPreviousSignatures = value }
    fun pdf(value: PadesDocumentInput) = apply { this.pdf = value }
    fun removePreviousSignatures(value: Boolean) = apply { this.removePreviousSignatures = value }
    fun xml(value: XadesDocumentInput) = apply { this.xml = value }

    fun build() = DocumentInput(
        keepPreviousSignatures = keepPreviousSignatures,
        pdf = pdf,
        removePreviousSignatures = removePreviousSignatures,
        xml = xml
    )
}

class DownloadVerificationCriiptoVerifyInputBuilder(
    private val jwt: String
) {
    fun build() = DownloadVerificationCriiptoVerifyInput(
        jwt = jwt
    )
}

class DownloadVerificationInputBuilder {
    private var criiptoVerify: DownloadVerificationCriiptoVerifyInput? = null
    private var oidc: DownloadVerificationOidcInput? = null

    fun criiptoVerify(value: DownloadVerificationCriiptoVerifyInput) = apply { this.criiptoVerify = value }
    fun oidc(value: DownloadVerificationOidcInput) = apply { this.oidc = value }

    fun build() = DownloadVerificationInput(
        criiptoVerify = criiptoVerify,
        oidc = oidc
    )
}

class DownloadVerificationOidcInputBuilder(
    private val jwt: String
) {
    fun build() = DownloadVerificationOidcInput(
        jwt = jwt
    )
}

class DrawableEvidenceProviderInputBuilder {
    private var minimumHeight: Int? = null
    private var minimumWidth: Int? = null
    private var requireName: Boolean? = null

    fun minimumHeight(value: Int) = apply { this.minimumHeight = value }
    fun minimumWidth(value: Int) = apply { this.minimumWidth = value }
    fun requireName(value: Boolean) = apply { this.requireName = value }

    fun build() = DrawableEvidenceProviderInput(
        minimumHeight = minimumHeight,
        minimumWidth = minimumWidth,
        requireName = requireName
    )
}

class EvidenceProviderInputBuilder {
    private var allOf: AllOfEvidenceProviderInput? = null
    private var criiptoVerify: CriiptoVerifyProviderInput? = null
    private var drawable: DrawableEvidenceProviderInput? = null
    private var enabledByDefault: Boolean? = null
    private var noop: NoopEvidenceProviderInput? = null
    private var oidc: OidcEvidenceProviderInput? = null

    fun allOf(value: AllOfEvidenceProviderInput) = apply { this.allOf = value }
    fun criiptoVerify(value: CriiptoVerifyProviderInput) = apply { this.criiptoVerify = value }
    fun drawable(value: DrawableEvidenceProviderInput) = apply { this.drawable = value }
    fun enabledByDefault(value: Boolean) = apply { this.enabledByDefault = value }
    fun noop(value: NoopEvidenceProviderInput) = apply { this.noop = value }
    fun oidc(value: OidcEvidenceProviderInput) = apply { this.oidc = value }

    fun build() = EvidenceProviderInput(
        allOf = allOf,
        criiptoVerify = criiptoVerify,
        drawable = drawable,
        enabledByDefault = enabledByDefault,
        noop = noop,
        oidc = oidc
    )
}

class ExtendSignatureOrderInputBuilder(
    private val additionalExpirationInDays: Int,
    private val signatureOrderId: String
) {
    fun build() = ExtendSignatureOrderInput(
        additionalExpirationInDays = additionalExpirationInDays,
        signatureOrderId = signatureOrderId
    )
}

class NoopEvidenceProviderInputBuilder(
    private val name: String
) {
    fun build() = NoopEvidenceProviderInput(
        name = name
    )
}

class OidcEvidenceProviderInputBuilder(
    private val audience: String,
    private val clientID: String,
    private val domain: String,
    private val name: String
) {
    private var acrValues: List<String>? = null
    private var alwaysRedirect: Boolean? = null
    private var uniqueEvidenceKey: String? = null

    fun acrValues(value: List<String>) = apply { this.acrValues = value }
    fun alwaysRedirect(value: Boolean) = apply { this.alwaysRedirect = value }
    fun uniqueEvidenceKey(value: String) = apply { this.uniqueEvidenceKey = value }

    fun build() = OidcEvidenceProviderInput(
        acrValues = acrValues,
        alwaysRedirect = alwaysRedirect,
        audience = audience,
        clientID = clientID,
        domain = domain,
        name = name,
        uniqueEvidenceKey = uniqueEvidenceKey
    )
}

class PadesDocumentFormInputBuilder(
    private val enabled: Boolean
) {
    fun build() = PadesDocumentFormInput(
        enabled = enabled
    )
}

class PadesDocumentInputBuilder(
    private val blob: ByteArray,
    private val storageMode: DocumentStorageMode,
    private val title: String
) {
    private var displayDocumentID: DocumentIdLocation? = null
    private var form: PadesDocumentFormInput? = null
    private var reference: String? = null
    private var removeBookmarks: Boolean? = null
    private var sealsPageTemplate: PadesDocumentSealsPageTemplateInput? = null

    fun displayDocumentID(value: DocumentIdLocation) = apply { this.displayDocumentID = value }
    fun form(value: PadesDocumentFormInput) = apply { this.form = value }
    fun reference(value: String) = apply { this.reference = value }
    fun removeBookmarks(value: Boolean) = apply { this.removeBookmarks = value }
    fun sealsPageTemplate(value: PadesDocumentSealsPageTemplateInput) = apply { this.sealsPageTemplate = value }

    fun build() = PadesDocumentInput(
        blob = blob,
        displayDocumentID = displayDocumentID,
        form = form,
        reference = reference,
        removeBookmarks = removeBookmarks,
        sealsPageTemplate = sealsPageTemplate,
        storageMode = storageMode,
        title = title
    )
}

class PadesDocumentSealsPageTemplateInputBuilder(
    private val area: PdfBoundingBoxInput,
    private val blob: ByteArray
) {
    private var expectedColumns: Int? = null
    private var expectedRows: Int? = null

    fun expectedColumns(value: Int) = apply { this.expectedColumns = value }
    fun expectedRows(value: Int) = apply { this.expectedRows = value }

    fun build() = PadesDocumentSealsPageTemplateInput(
        area = area,
        blob = blob,
        expectedColumns = expectedColumns,
        expectedRows = expectedRows
    )
}

class PdfBoundingBoxInputBuilder(
    private val x1: Float,
    private val x2: Float,
    private val y1: Float,
    private val y2: Float
) {
    fun build() = PdfBoundingBoxInput(
        x1 = x1,
        x2 = x2,
        y1 = y1,
        y2 = y2
    )
}

class PdfSealPositionInputBuilder(
    private val page: Int,
    private val x: Float,
    private val y: Float
) {
    private var scale: Float? = null

    fun scale(value: Float) = apply { this.scale = value }

    fun build() = PdfSealPositionInput(
        page = page,
        scale = scale,
        x = x,
        y = y
    )
}

class RefreshApplicationApiKeyInputBuilder(
    private val apiKeyId: String,
    private val applicationId: String
) {
    fun build() = RefreshApplicationApiKeyInput(
        apiKeyId = apiKeyId,
        applicationId = applicationId
    )
}

class RejectSignatureOrderInputBuilder(
    private val dummy: Boolean
) {
    private var reason: String? = null

    fun reason(value: String) = apply { this.reason = value }

    fun build() = RejectSignatureOrderInput(
        dummy = dummy,
        reason = reason
    )
}

class RetrySignatureOrderWebhookInputBuilder(
    private val retryPayload: String,
    private val signatureOrderId: String
) {
    fun build() = RetrySignatureOrderWebhookInput(
        retryPayload = retryPayload,
        signatureOrderId = signatureOrderId
    )
}

class SignActingAsInputBuilder(
    private val evidence: SignInput,
    private val signatoryId: String
) {
    fun build() = SignActingAsInput(
        evidence = evidence,
        signatoryId = signatoryId
    )
}

class SignAllOfInputBuilder {
    private var criiptoVerify: SignCriiptoVerifyInput? = null
    private var criiptoVerifyV2: SignCriiptoVerifyV2Input? = null
    private var drawable: SignDrawableInput? = null
    private var noop: Boolean? = null
    private var oidc: SignOidcInput? = null

    fun criiptoVerify(value: SignCriiptoVerifyInput) = apply { this.criiptoVerify = value }
    fun criiptoVerifyV2(value: SignCriiptoVerifyV2Input) = apply { this.criiptoVerifyV2 = value }
    fun drawable(value: SignDrawableInput) = apply { this.drawable = value }
    fun noop(value: Boolean) = apply { this.noop = value }
    fun oidc(value: SignOidcInput) = apply { this.oidc = value }

    fun build() = SignAllOfInput(
        criiptoVerify = criiptoVerify,
        criiptoVerifyV2 = criiptoVerifyV2,
        drawable = drawable,
        noop = noop,
        oidc = oidc
    )
}

class SignCriiptoVerifyInputBuilder(
    private val jwt: String
) {
    fun build() = SignCriiptoVerifyInput(
        jwt = jwt
    )
}

class SignCriiptoVerifyV2InputBuilder(
    private val code: String,
    private val state: String
) {
    fun build() = SignCriiptoVerifyV2Input(
        code = code,
        state = state
    )
}

class SignDocumentFormFieldInputBuilder(
    private val field: String,
    private val value: String
) {
    fun build() = SignDocumentFormFieldInput(
        field = field,
        value = value
    )
}

class SignDocumentFormInputBuilder(
    private val fields: List<SignDocumentFormFieldInput>
) {
    fun build() = SignDocumentFormInput(
        fields = fields
    )
}

class SignDocumentInputBuilder(
    private val id: String
) {
    private var form: SignDocumentFormInput? = null

    fun form(value: SignDocumentFormInput) = apply { this.form = value }

    fun build() = SignDocumentInput(
        form = form,
        id = id
    )
}

class SignDrawableInputBuilder(
    private val image: ByteArray
) {
    private var name: String? = null

    fun name(value: String) = apply { this.name = value }

    fun build() = SignDrawableInput(
        image = image,
        name = name
    )
}

class SignInputBuilder(
    private val id: String
) {
    private var allOf: SignAllOfInput? = null
    private var criiptoVerify: SignCriiptoVerifyInput? = null
    private var criiptoVerifyV2: SignCriiptoVerifyV2Input? = null
    private var documents: List<SignDocumentInput>? = null
    private var drawable: SignDrawableInput? = null
    private var noop: Boolean? = null
    private var oidc: SignOidcInput? = null

    fun allOf(value: SignAllOfInput) = apply { this.allOf = value }
    fun criiptoVerify(value: SignCriiptoVerifyInput) = apply { this.criiptoVerify = value }
    fun criiptoVerifyV2(value: SignCriiptoVerifyV2Input) = apply { this.criiptoVerifyV2 = value }
    fun documents(value: List<SignDocumentInput>) = apply { this.documents = value }
    fun drawable(value: SignDrawableInput) = apply { this.drawable = value }
    fun noop(value: Boolean) = apply { this.noop = value }
    fun oidc(value: SignOidcInput) = apply { this.oidc = value }

    fun build() = SignInput(
        allOf = allOf,
        criiptoVerify = criiptoVerify,
        criiptoVerifyV2 = criiptoVerifyV2,
        documents = documents,
        drawable = drawable,
        id = id,
        noop = noop,
        oidc = oidc
    )
}

class SignOidcInputBuilder(
    private val jwt: String
) {
    fun build() = SignOidcInput(
        jwt = jwt
    )
}

class SignatoryBeaconInputBuilder(
    private val lastActionAt: String
) {
    private var now: String? = null

    fun now(value: String) = apply { this.now = value }

    fun build() = SignatoryBeaconInput(
        lastActionAt = lastActionAt,
        now = now
    )
}

class SignatoryDocumentInputBuilder(
    private val id: String
) {
    private var pdfSealPosition: PdfSealPositionInput? = null
    private var pdfSealPositions: List<PdfSealPositionInput>? = null
    private var preapproved: Boolean? = null

    fun pdfSealPosition(value: PdfSealPositionInput) = apply { this.pdfSealPosition = value }
    fun pdfSealPositions(value: List<PdfSealPositionInput>) = apply { this.pdfSealPositions = value }
    fun preapproved(value: Boolean) = apply { this.preapproved = value }

    fun build() = SignatoryDocumentInput(
        id = id,
        pdfSealPosition = pdfSealPosition,
        pdfSealPositions = pdfSealPositions,
        preapproved = preapproved
    )
}

class SignatoryEvidenceProviderInputBuilder(
    private val id: String
) {
    private var allOf: AllOfEvidenceProviderInput? = null
    private var criiptoVerify: CriiptoVerifyProviderInput? = null
    private var drawable: DrawableEvidenceProviderInput? = null
    private var noop: NoopEvidenceProviderInput? = null
    private var oidc: OidcEvidenceProviderInput? = null

    fun allOf(value: AllOfEvidenceProviderInput) = apply { this.allOf = value }
    fun criiptoVerify(value: CriiptoVerifyProviderInput) = apply { this.criiptoVerify = value }
    fun drawable(value: DrawableEvidenceProviderInput) = apply { this.drawable = value }
    fun noop(value: NoopEvidenceProviderInput) = apply { this.noop = value }
    fun oidc(value: OidcEvidenceProviderInput) = apply { this.oidc = value }

    fun build() = SignatoryEvidenceProviderInput(
        allOf = allOf,
        criiptoVerify = criiptoVerify,
        drawable = drawable,
        id = id,
        noop = noop,
        oidc = oidc
    )
}

class SignatoryEvidenceValidationInputBuilder(
    private val key: String
) {
    private var boolean: Boolean? = null
    private var value: String? = null

    fun boolean(value: Boolean) = apply { this.boolean = value }
    fun value(value: String) = apply { this.value = value }

    fun build() = SignatoryEvidenceValidationInput(
        boolean = boolean,
        key = key,
        value = value
    )
}

class SignatoryUiInputBuilder {
    private var disableRejection: Boolean? = null
    private var enableCancel: Boolean? = null
    private var language: Language? = Language.EnUs
    private var logo: SignatureOrderUiLogoInput? = null
    private var renderPdfAnnotationLayer: Boolean? = null
    private var signatoryRedirectUri: String? = null
    private var stylesheet: String? = null

    fun disableRejection(value: Boolean) = apply { this.disableRejection = value }
    fun enableCancel(value: Boolean) = apply { this.enableCancel = value }
    fun language(value: Language) = apply { this.language = value }
    fun logo(value: SignatureOrderUiLogoInput) = apply { this.logo = value }
    fun renderPdfAnnotationLayer(value: Boolean) = apply { this.renderPdfAnnotationLayer = value }
    fun signatoryRedirectUri(value: String) = apply { this.signatoryRedirectUri = value }
    fun stylesheet(value: String) = apply { this.stylesheet = value }

    fun build() = SignatoryUiInput(
        disableRejection = disableRejection,
        enableCancel = enableCancel,
        language = language,
        logo = logo,
        renderPdfAnnotationLayer = renderPdfAnnotationLayer,
        signatoryRedirectUri = signatoryRedirectUri,
        stylesheet = stylesheet
    )
}

class SignatureAppearanceInputBuilder(
    private val identifierFromEvidence: List<String>
) {
    private var displayName: List<SignatureAppearanceTemplateInput>? = null
    private var footer: List<SignatureAppearanceTemplateInput>? = null
    private var headerLeft: List<SignatureAppearanceTemplateInput>? = null

    fun displayName(value: List<SignatureAppearanceTemplateInput>) = apply { this.displayName = value }
    fun footer(value: List<SignatureAppearanceTemplateInput>) = apply { this.footer = value }
    fun headerLeft(value: List<SignatureAppearanceTemplateInput>) = apply { this.headerLeft = value }

    fun build() = SignatureAppearanceInput(
        displayName = displayName,
        footer = footer,
        headerLeft = headerLeft,
        identifierFromEvidence = identifierFromEvidence
    )
}

class SignatureAppearanceTemplateInputBuilder(
    private val template: String
) {
    private var replacements: List<SignatureAppearanceTemplateReplacementInput>? = null

    fun replacements(value: List<SignatureAppearanceTemplateReplacementInput>) = apply { this.replacements = value }

    fun build() = SignatureAppearanceTemplateInput(
        replacements = replacements,
        template = template
    )
}

class SignatureAppearanceTemplateReplacementInputBuilder(
    private val fromEvidence: List<String>,
    private val placeholder: String
) {
    fun build() = SignatureAppearanceTemplateReplacementInput(
        fromEvidence = fromEvidence,
        placeholder = placeholder
    )
}

class SignatureOrderUiLogoInputBuilder(
    private val src: String
) {
    private var href: String? = null

    fun href(value: String) = apply { this.href = value }

    fun build() = SignatureOrderUiLogoInput(
        href = href,
        src = src
    )
}

class SingleEvidenceProviderInputBuilder {
    private var criiptoVerify: CriiptoVerifyProviderInput? = null
    private var drawable: DrawableEvidenceProviderInput? = null
    private var noop: NoopEvidenceProviderInput? = null
    private var oidc: OidcEvidenceProviderInput? = null

    fun criiptoVerify(value: CriiptoVerifyProviderInput) = apply { this.criiptoVerify = value }
    fun drawable(value: DrawableEvidenceProviderInput) = apply { this.drawable = value }
    fun noop(value: NoopEvidenceProviderInput) = apply { this.noop = value }
    fun oidc(value: OidcEvidenceProviderInput) = apply { this.oidc = value }

    fun build() = SingleEvidenceProviderInput(
        criiptoVerify = criiptoVerify,
        drawable = drawable,
        noop = noop,
        oidc = oidc
    )
}

class StartCriiptoVerifyEvidenceProviderInputBuilder(
    private val acrValue: String,
    private val id: String,
    private val redirectUri: String,
    private val stage: EvidenceValidationStage
) {
    private var device: DeviceInput? = null
    private var idTokenHint: String? = null

    fun device(value: DeviceInput) = apply { this.device = value }
    fun idTokenHint(value: String) = apply { this.idTokenHint = value }

    fun build() = StartCriiptoVerifyEvidenceProviderInput(
        acrValue = acrValue,
        device = device,
        id = id,
        idTokenHint = idTokenHint,
        redirectUri = redirectUri,
        stage = stage
    )
}

class TrackSignatoryInputBuilder(
    private val event: SignatoryFrontendEvent
) {
    fun build() = TrackSignatoryInput(
        event = event
    )
}

class UpdateSignatoryDocumentStatusInputBuilder(
    private val documentId: String,
    private val status: SignatoryDocumentStatus
) {
    fun build() = UpdateSignatoryDocumentStatusInput(
        documentId = documentId,
        status = status
    )
}

class ValidateDocumentInputBuilder {
    private var pdf: ByteArray? = null
    private var xml: ByteArray? = null

    fun pdf(value: ByteArray) = apply { this.pdf = value }
    fun xml(value: ByteArray) = apply { this.xml = value }

    fun build() = ValidateDocumentInput(
        pdf = pdf,
        xml = xml
    )
}

class VerifyApplicationQueryInputBuilder(
    private val domain: String,
    private val realm: String,
    private val tenantId: String
) {
    fun build() = VerifyApplicationQueryInput(
        domain = domain,
        realm = realm,
        tenantId = tenantId
    )
}

class XadesDocumentInputBuilder(
    private val blob: ByteArray,
    private val storageMode: DocumentStorageMode,
    private val title: String
) {
    private var reference: String? = null

    fun reference(value: String) = apply { this.reference = value }

    fun build() = XadesDocumentInput(
        blob = blob,
        reference = reference,
        storageMode = storageMode,
        title = title
    )
}