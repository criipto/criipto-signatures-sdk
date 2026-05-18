package eu.idura.signatures

data class AddSignatoriesInput(
    val signatories: Iterable<CreateSignatureOrderSignatoryInput>,
    val signatureOrderId: Any
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["signatories"]!!.let { signatories -> (signatories as List<Map<String, Any>>).map { CreateSignatureOrderSignatoryInput(it) } },
      args["signatureOrderId"] as Any
  )
}



data class AddSignatoryInput(
    val documents: Iterable<SignatoryDocumentInput>? = null,
    val evidenceProviders: Iterable<SignatoryEvidenceProviderInput>? = null,
    val evidenceValidation: Iterable<SignatoryEvidenceValidationInput>? = null,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole? = null,
    val signatureAppearance: SignatureAppearanceInput? = null,
    val signatureOrderId: Any,
    val signingAs: String? = null,
    val signingSequence: Int? = null,
    val ui: SignatoryUiInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["documents"]?.let { documents -> (documents as List<Map<String, Any>>).map { SignatoryDocumentInput(it) } },
      args["evidenceProviders"]?.let { evidenceProviders -> (evidenceProviders as List<Map<String, Any>>).map { SignatoryEvidenceProviderInput(it) } },
      args["evidenceValidation"]?.let { evidenceValidation -> (evidenceValidation as List<Map<String, Any>>).map { SignatoryEvidenceValidationInput(it) } },
      args["reference"] as String?,
      args["role"] as String?,
      args["signatoryRole"] as SignatoryRole?,
      args["signatureAppearance"]?.let { SignatureAppearanceInput(it as Map<String, Any>) },
      args["signatureOrderId"] as Any,
      args["signingAs"] as String?,
      args["signingSequence"] as Int?,
      args["ui"]?.let { SignatoryUiInput(it as Map<String, Any>) }
  )
}



data class AllOfEvidenceProviderInput(
    val providers: Iterable<SingleEvidenceProviderInput>
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["providers"]!!.let { providers -> (providers as List<Map<String, Any>>).map { SingleEvidenceProviderInput(it) } }
  )
}





data class ApplicationSignatureOrdersArgs(
    val after: String? = null,
    val first: Int? = null,
    val status: SignatureOrderStatus? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["after"] as String?,
      args["first"] as Int?,
      args["status"] as SignatureOrderStatus?
  )
}
data class ApplicationWebhookLogsArgs(
    val from: String,
    val succeeded: Boolean? = null,
    val to: String
) {
  constructor(args: Map<String, Any>) : this(
      args["from"] as String,
      args["succeeded"] as Boolean?,
      args["to"] as String
  )
}



enum class ApplicationApiKeyMode(val label: String) {
      ReadOnly("READ_ONLY"),
      ReadWrite("READ_WRITE");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): ApplicationApiKeyMode? {
      return values().find { it.label == label }
    }
  }
}





data class BatchSignatoryItemInput(
    val signatoryId: String,
    val signatureOrderId: String
) {
  constructor(args: Map<String, Any>) : this(
      args["signatoryId"] as String,
      args["signatureOrderId"] as String
  )
}



data class CancelSignatureOrderInput(
    val signatureOrderId: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["signatureOrderId"] as Any
  )
}





data class ChangeSignatoryInput(
    val documents: Iterable<SignatoryDocumentInput>? = null,
    val evidenceProviders: Iterable<SignatoryEvidenceProviderInput>? = null,
    val evidenceValidation: Iterable<SignatoryEvidenceValidationInput>? = null,
    val reference: String? = null,
    val role: String? = null,
    val signatoryId: Any,
    val signatureAppearance: SignatureAppearanceInput? = null,
    val signingAs: String? = null,
    val signingSequence: Int? = null,
    val ui: SignatoryUiInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["documents"]?.let { documents -> (documents as List<Map<String, Any>>).map { SignatoryDocumentInput(it) } },
      args["evidenceProviders"]?.let { evidenceProviders -> (evidenceProviders as List<Map<String, Any>>).map { SignatoryEvidenceProviderInput(it) } },
      args["evidenceValidation"]?.let { evidenceValidation -> (evidenceValidation as List<Map<String, Any>>).map { SignatoryEvidenceValidationInput(it) } },
      args["reference"] as String?,
      args["role"] as String?,
      args["signatoryId"] as Any,
      args["signatureAppearance"]?.let { SignatureAppearanceInput(it as Map<String, Any>) },
      args["signingAs"] as String?,
      args["signingSequence"] as Int?,
      args["ui"]?.let { SignatoryUiInput(it as Map<String, Any>) }
  )
}



data class ChangeSignatureOrderInput(
    val maxSignatories: Int? = null,
    val signatureOrderId: Any,
    val webhook: CreateSignatureOrderWebhookInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["maxSignatories"] as Int?,
      args["signatureOrderId"] as Any,
      args["webhook"]?.let { CreateSignatureOrderWebhookInput(it as Map<String, Any>) }
  )
}



data class CleanupSignatureOrderInput(
    val signatureOrderId: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["signatureOrderId"] as Any
  )
}



data class CloseSignatureOrderInput(
    val retainDocumentsForDays: Int? = null,
    val signatureOrderId: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["retainDocumentsForDays"] as Int?,
      args["signatureOrderId"] as Any
  )
}



data class CompleteCriiptoVerifyEvidenceProviderInput(
    val code: String,
    val state: String
) {
  constructor(args: Map<String, Any>) : this(
      args["code"] as String,
      args["state"] as String
  )
}





data class CreateApplicationApiKeyInput(
    val applicationId: Any,
    val mode: ApplicationApiKeyMode? = null,
    val note: String? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["applicationId"] as Any,
      args["mode"] as ApplicationApiKeyMode?,
      args["note"] as String?
  )
}



data class CreateApplicationInput(
    val name: String,
    val tenantId: Any,
    val verifyApplicationDomain: String,
    val verifyApplicationEnvironment: VerifyApplicationEnvironment,
    val verifyApplicationRealm: String
) {
  constructor(args: Map<String, Any>) : this(
      args["name"] as String,
      args["tenantId"] as Any,
      args["verifyApplicationDomain"] as String,
      args["verifyApplicationEnvironment"] as VerifyApplicationEnvironment,
      args["verifyApplicationRealm"] as String
  )
}



data class CreateBatchSignatoryInput(
    val items: Iterable<BatchSignatoryItemInput>,
    val ui: SignatoryUiInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["items"]!!.let { items -> (items as List<Map<String, Any>>).map { BatchSignatoryItemInput(it) } },
      args["ui"]?.let { SignatoryUiInput(it as Map<String, Any>) }
  )
}



data class CreateSignatureOrderInput(
    val disableVerifyEvidenceProvider: Boolean? = null,
    val documents: Iterable<DocumentInput>,
    val evidenceProviders: Iterable<EvidenceProviderInput>? = null,
    val evidenceValidationStages: Iterable<EvidenceValidationStage>? = null,
    val expiresAt: String? = null,
    val expiresInDays: Int? = null,
    val fixDocumentFormattingErrors: Boolean? = null,
    val maxSignatories: Int? = 14,
    val signatories: Iterable<CreateSignatureOrderSignatoryInput>? = null,
    val signatureAppearance: SignatureAppearanceInput? = null,
    val timezone: String? = null,
    val title: String? = null,
    val ui: CreateSignatureOrderUiInput? = null,
    val webhook: CreateSignatureOrderWebhookInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["disableVerifyEvidenceProvider"] as Boolean?,
      args["documents"]!!.let { documents -> (documents as List<Map<String, Any>>).map { DocumentInput(it) } },
      args["evidenceProviders"]?.let { evidenceProviders -> (evidenceProviders as List<Map<String, Any>>).map { EvidenceProviderInput(it) } },
      args["evidenceValidationStages"] as Iterable<EvidenceValidationStage>?,
      args["expiresAt"] as String?,
      args["expiresInDays"] as Int?,
      args["fixDocumentFormattingErrors"] as Boolean?,
      args["maxSignatories"] as Int? ?: 14,
      args["signatories"]?.let { signatories -> (signatories as List<Map<String, Any>>).map { CreateSignatureOrderSignatoryInput(it) } },
      args["signatureAppearance"]?.let { SignatureAppearanceInput(it as Map<String, Any>) },
      args["timezone"] as String?,
      args["title"] as String?,
      args["ui"]?.let { CreateSignatureOrderUiInput(it as Map<String, Any>) },
      args["webhook"]?.let { CreateSignatureOrderWebhookInput(it as Map<String, Any>) }
  )
}



data class CreateSignatureOrderSignatoryInput(
    val documents: Iterable<SignatoryDocumentInput>? = null,
    val evidenceProviders: Iterable<SignatoryEvidenceProviderInput>? = null,
    val evidenceValidation: Iterable<SignatoryEvidenceValidationInput>? = null,
    val reference: String? = null,
    val role: String? = null,
    val signatoryRole: SignatoryRole? = null,
    val signatureAppearance: SignatureAppearanceInput? = null,
    val signingAs: String? = null,
    val signingSequence: Int? = null,
    val ui: SignatoryUiInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["documents"]?.let { documents -> (documents as List<Map<String, Any>>).map { SignatoryDocumentInput(it) } },
      args["evidenceProviders"]?.let { evidenceProviders -> (evidenceProviders as List<Map<String, Any>>).map { SignatoryEvidenceProviderInput(it) } },
      args["evidenceValidation"]?.let { evidenceValidation -> (evidenceValidation as List<Map<String, Any>>).map { SignatoryEvidenceValidationInput(it) } },
      args["reference"] as String?,
      args["role"] as String?,
      args["signatoryRole"] as SignatoryRole?,
      args["signatureAppearance"]?.let { SignatureAppearanceInput(it as Map<String, Any>) },
      args["signingAs"] as String?,
      args["signingSequence"] as Int?,
      args["ui"]?.let { SignatoryUiInput(it as Map<String, Any>) }
  )
}

data class CreateSignatureOrderUiInput(
    val disableRejection: Boolean? = null,
    val enableCancel: Boolean? = null,
    val language: Language? = Language.EnUs,
    val logo: SignatureOrderUiLogoInput? = null,
    val renderPdfAnnotationLayer: Boolean? = null,
    val signatoryRedirectUri: String? = null,
    val stylesheet: String? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["disableRejection"] as Boolean?,
      args["enableCancel"] as Boolean?,
      args["language"] as Language? ?: Language.EnUs,
      args["logo"]?.let { SignatureOrderUiLogoInput(it as Map<String, Any>) },
      args["renderPdfAnnotationLayer"] as Boolean?,
      args["signatoryRedirectUri"] as String?,
      args["stylesheet"] as String?
  )
}

data class CreateSignatureOrderWebhookInput(
    val secret: ByteArray? = null,
    val url: String,
    val validateConnectivity: Boolean? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["secret"] as ByteArray?,
      args["url"] as String,
      args["validateConnectivity"] as Boolean?
  )
}



enum class CriiptoVerifyEvidenceProviderVersion(val label: String) {
      V1("V1"),
      V2("V2");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): CriiptoVerifyEvidenceProviderVersion? {
      return values().find { it.label == label }
    }
  }
}

data class CriiptoVerifyProviderInput(
    val acrValues: Iterable<String>? = null,
    val alwaysRedirect: Boolean? = null,
    val audiences: Iterable<String>? = null,
    val loginHint: String? = null,
    val message: String? = null,
    val scope: String? = null,
    val uniqueEvidenceKey: String? = null,
    val version: CriiptoVerifyEvidenceProviderVersion? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["acrValues"] as Iterable<String>?,
      args["alwaysRedirect"] as Boolean?,
      args["audiences"] as Iterable<String>?,
      args["loginHint"] as String?,
      args["message"] as String?,
      args["scope"] as String?,
      args["uniqueEvidenceKey"] as String?,
      args["version"] as CriiptoVerifyEvidenceProviderVersion?
  )
}



data class DeleteApplicationApiKeyInput(
    val apiKeyId: Any,
    val applicationId: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["apiKeyId"] as Any,
      args["applicationId"] as Any
  )
}



data class DeleteSignatoryInput(
    val signatoryId: Any,
    val signatureOrderId: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["signatoryId"] as Any,
      args["signatureOrderId"] as Any
  )
}



data class DeviceInput(
    val os: DeviceOperatingSystem? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["os"] as DeviceOperatingSystem?
  )
}

enum class DeviceOperatingSystem(val label: String) {
      Android("ANDROID"),
      Ios("IOS");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): DeviceOperatingSystem? {
      return values().find { it.label == label }
    }
  }
}

enum class DocumentIdLocation(val label: String) {
      Bottom("BOTTOM"),
      Left("LEFT"),
      Right("RIGHT"),
      Top("TOP");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): DocumentIdLocation? {
      return values().find { it.label == label }
    }
  }
}

data class DocumentInput(
    val keepPreviousSignatures: Boolean? = null,
    val pdf: PadesDocumentInput? = null,
    val removePreviousSignatures: Boolean? = null,
    val xml: XadesDocumentInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["keepPreviousSignatures"] as Boolean?,
      args["pdf"]?.let { PadesDocumentInput(it as Map<String, Any>) },
      args["removePreviousSignatures"] as Boolean?,
      args["xml"]?.let { XadesDocumentInput(it as Map<String, Any>) }
  )
}

/** Document storage mode. Temporary documents will be deleted once completed. */
enum class DocumentStorageMode(val label: String) {
      Temporary("Temporary");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): DocumentStorageMode? {
      return values().find { it.label == label }
    }
  }
}

data class DownloadVerificationCriiptoVerifyInput(
    val jwt: String
) {
  constructor(args: Map<String, Any>) : this(
      args["jwt"] as String
  )
}

data class DownloadVerificationInput(
    val criiptoVerify: DownloadVerificationCriiptoVerifyInput? = null,
    val oidc: DownloadVerificationOidcInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["criiptoVerify"]?.let { DownloadVerificationCriiptoVerifyInput(it as Map<String, Any>) },
      args["oidc"]?.let { DownloadVerificationOidcInput(it as Map<String, Any>) }
  )
}

data class DownloadVerificationOidcInput(
    val jwt: String
) {
  constructor(args: Map<String, Any>) : this(
      args["jwt"] as String
  )
}

data class DrawableEvidenceProviderInput(
    val minimumHeight: Int? = null,
    val minimumWidth: Int? = null,
    val requireName: Boolean? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["minimumHeight"] as Int?,
      args["minimumWidth"] as Int?,
      args["requireName"] as Boolean?
  )
}







data class EvidenceProviderInput(
    val allOf: AllOfEvidenceProviderInput? = null,
    val criiptoVerify: CriiptoVerifyProviderInput? = null,
    val drawable: DrawableEvidenceProviderInput? = null,
    val enabledByDefault: Boolean? = null,
    val noop: NoopEvidenceProviderInput? = null,
    val oidc: OidcEvidenceProviderInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["allOf"]?.let { AllOfEvidenceProviderInput(it as Map<String, Any>) },
      args["criiptoVerify"]?.let { CriiptoVerifyProviderInput(it as Map<String, Any>) },
      args["drawable"]?.let { DrawableEvidenceProviderInput(it as Map<String, Any>) },
      args["enabledByDefault"] as Boolean?,
      args["noop"]?.let { NoopEvidenceProviderInput(it as Map<String, Any>) },
      args["oidc"]?.let { OidcEvidenceProviderInput(it as Map<String, Any>) }
  )
}

enum class EvidenceValidationStage(val label: String) {
      Sign("SIGN"),
      View("VIEW");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): EvidenceValidationStage? {
      return values().find { it.label == label }
    }
  }
}

data class ExtendSignatureOrderInput(
    val additionalExpirationInDays: Int,
    val signatureOrderId: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["additionalExpirationInDays"] as Int,
      args["signatureOrderId"] as Any
  )
}







enum class Language(val label: String) {
      DaDk("DA_DK"),
      EnUs("EN_US"),
      NbNo("NB_NO"),
      SvSe("SV_SE");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): Language? {
      return values().find { it.label == label }
    }
  }
}

data class MutationAddSignatoriesArgs(
    val input: AddSignatoriesInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      AddSignatoriesInput(args["input"] as Map<String, Any>)
  )
}
data class MutationAddSignatoryArgs(
    val input: AddSignatoryInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      AddSignatoryInput(args["input"] as Map<String, Any>)
  )
}
data class MutationCancelSignatureOrderArgs(
    val input: CancelSignatureOrderInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      CancelSignatureOrderInput(args["input"] as Map<String, Any>)
  )
}
data class MutationChangeSignatoryArgs(
    val input: ChangeSignatoryInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      ChangeSignatoryInput(args["input"] as Map<String, Any>)
  )
}
data class MutationChangeSignatureOrderArgs(
    val input: ChangeSignatureOrderInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      ChangeSignatureOrderInput(args["input"] as Map<String, Any>)
  )
}
data class MutationCleanupSignatureOrderArgs(
    val input: CleanupSignatureOrderInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      CleanupSignatureOrderInput(args["input"] as Map<String, Any>)
  )
}
data class MutationCloseSignatureOrderArgs(
    val input: CloseSignatureOrderInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      CloseSignatureOrderInput(args["input"] as Map<String, Any>)
  )
}
data class MutationCompleteCriiptoVerifyEvidenceProviderArgs(
    val input: CompleteCriiptoVerifyEvidenceProviderInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      CompleteCriiptoVerifyEvidenceProviderInput(args["input"] as Map<String, Any>)
  )
}
data class MutationCreateApplicationArgs(
    val input: CreateApplicationInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      CreateApplicationInput(args["input"] as Map<String, Any>)
  )
}
data class MutationCreateApplicationApiKeyArgs(
    val input: CreateApplicationApiKeyInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      CreateApplicationApiKeyInput(args["input"] as Map<String, Any>)
  )
}
data class MutationCreateBatchSignatoryArgs(
    val input: CreateBatchSignatoryInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      CreateBatchSignatoryInput(args["input"] as Map<String, Any>)
  )
}
data class MutationCreateSignatureOrderArgs(
    val input: CreateSignatureOrderInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      CreateSignatureOrderInput(args["input"] as Map<String, Any>)
  )
}
data class MutationDeleteApplicationApiKeyArgs(
    val input: DeleteApplicationApiKeyInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      DeleteApplicationApiKeyInput(args["input"] as Map<String, Any>)
  )
}
data class MutationDeleteSignatoryArgs(
    val input: DeleteSignatoryInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      DeleteSignatoryInput(args["input"] as Map<String, Any>)
  )
}
data class MutationExtendSignatureOrderArgs(
    val input: ExtendSignatureOrderInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      ExtendSignatureOrderInput(args["input"] as Map<String, Any>)
  )
}
data class MutationRefreshApplicationApiKeyArgs(
    val input: RefreshApplicationApiKeyInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      RefreshApplicationApiKeyInput(args["input"] as Map<String, Any>)
  )
}
data class MutationRejectSignatureOrderArgs(
    val input: RejectSignatureOrderInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      RejectSignatureOrderInput(args["input"] as Map<String, Any>)
  )
}
data class MutationRetrySignatureOrderWebhookArgs(
    val input: RetrySignatureOrderWebhookInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      RetrySignatureOrderWebhookInput(args["input"] as Map<String, Any>)
  )
}
data class MutationSignArgs(
    val input: SignInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      SignInput(args["input"] as Map<String, Any>)
  )
}
data class MutationSignActingAsArgs(
    val input: SignActingAsInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      SignActingAsInput(args["input"] as Map<String, Any>)
  )
}
data class MutationSignatoryBeaconArgs(
    val input: SignatoryBeaconInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      SignatoryBeaconInput(args["input"] as Map<String, Any>)
  )
}
data class MutationStartCriiptoVerifyEvidenceProviderArgs(
    val input: StartCriiptoVerifyEvidenceProviderInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      StartCriiptoVerifyEvidenceProviderInput(args["input"] as Map<String, Any>)
  )
}
data class MutationTrackSignatoryArgs(
    val input: TrackSignatoryInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      TrackSignatoryInput(args["input"] as Map<String, Any>)
  )
}
data class MutationUpdateSignatoryDocumentStatusArgs(
    val input: UpdateSignatoryDocumentStatusInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      UpdateSignatoryDocumentStatusInput(args["input"] as Map<String, Any>)
  )
}
data class MutationValidateDocumentArgs(
    val input: ValidateDocumentInput
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      ValidateDocumentInput(args["input"] as Map<String, Any>)
  )
}

data class NoopEvidenceProviderInput(
    val name: String
) {
  constructor(args: Map<String, Any>) : this(
      args["name"] as String
  )
}





data class OidcEvidenceProviderInput(
    val acrValues: Iterable<String>? = null,
    val alwaysRedirect: Boolean? = null,
    val audience: String,
    val clientID: String,
    val domain: String,
    val name: String,
    val uniqueEvidenceKey: String? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["acrValues"] as Iterable<String>?,
      args["alwaysRedirect"] as Boolean?,
      args["audience"] as String,
      args["clientID"] as String,
      args["domain"] as String,
      args["name"] as String,
      args["uniqueEvidenceKey"] as String?
  )
}



data class PadesDocumentFormInput(
    val enabled: Boolean
) {
  constructor(args: Map<String, Any>) : this(
      args["enabled"] as Boolean
  )
}

data class PadesDocumentInput(
    val blob: ByteArray,
    val displayDocumentID: DocumentIdLocation? = null,
    val form: PadesDocumentFormInput? = null,
    val reference: String? = null,
    val removeBookmarks: Boolean? = null,
    val sealsPageTemplate: PadesDocumentSealsPageTemplateInput? = null,
    val storageMode: DocumentStorageMode,
    val title: String
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["blob"] as ByteArray,
      args["displayDocumentID"] as DocumentIdLocation?,
      args["form"]?.let { PadesDocumentFormInput(it as Map<String, Any>) },
      args["reference"] as String?,
      args["removeBookmarks"] as Boolean?,
      args["sealsPageTemplate"]?.let { PadesDocumentSealsPageTemplateInput(it as Map<String, Any>) },
      args["storageMode"] as DocumentStorageMode,
      args["title"] as String
  )
}

data class PadesDocumentSealsPageTemplateInput(
    val area: PdfBoundingBoxInput,
    val blob: ByteArray,
    val expectedColumns: Int? = null,
    val expectedRows: Int? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      PdfBoundingBoxInput(args["area"] as Map<String, Any>),
      args["blob"] as ByteArray,
      args["expectedColumns"] as Int?,
      args["expectedRows"] as Int?
  )
}



data class PdfBoundingBoxInput(
    val x1: Float,
    val x2: Float,
    val y1: Float,
    val y2: Float
) {
  constructor(args: Map<String, Any>) : this(
      args["x1"] as Float,
      args["x2"] as Float,
      args["y1"] as Float,
      args["y2"] as Float
  )
}





data class PdfSealPositionInput(
    val page: Int,
    val scale: Float? = null,
    val x: Float,
    val y: Float
) {
  constructor(args: Map<String, Any>) : this(
      args["page"] as Int,
      args["scale"] as Float?,
      args["x"] as Float,
      args["y"] as Float
  )
}

data class QueryApplicationArgs(
    val id: Any? = null,
    val verifyApplication: VerifyApplicationQueryInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["id"] as Any?,
      args["verifyApplication"]?.let { VerifyApplicationQueryInput(it as Map<String, Any>) }
  )
}
data class QueryBatchSignatoryArgs(
    val id: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["id"] as Any
  )
}
data class QueryDocumentArgs(
    val id: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["id"] as Any
  )
}
data class QuerySignatoryArgs(
    val id: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["id"] as Any
  )
}
data class QuerySignatureOrderArgs(
    val id: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["id"] as Any
  )
}
data class QueryTenantArgs(
    val id: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["id"] as Any
  )
}

data class RefreshApplicationApiKeyInput(
    val apiKeyId: Any,
    val applicationId: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["apiKeyId"] as Any,
      args["applicationId"] as Any
  )
}



data class RejectSignatureOrderInput(
    val dummy: Boolean,
    val reason: String? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["dummy"] as Boolean,
      args["reason"] as String?
  )
}



data class RetrySignatureOrderWebhookInput(
    val retryPayload: String,
    val signatureOrderId: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["retryPayload"] as String,
      args["signatureOrderId"] as Any
  )
}



data class SignActingAsInput(
    val evidence: SignInput,
    val signatoryId: Any
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      SignInput(args["evidence"] as Map<String, Any>),
      args["signatoryId"] as Any
  )
}



data class SignAllOfInput(
    val criiptoVerify: SignCriiptoVerifyInput? = null,
    val criiptoVerifyV2: SignCriiptoVerifyV2Input? = null,
    val drawable: SignDrawableInput? = null,
    val noop: Boolean? = null,
    val oidc: SignOidcInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["criiptoVerify"]?.let { SignCriiptoVerifyInput(it as Map<String, Any>) },
      args["criiptoVerifyV2"]?.let { SignCriiptoVerifyV2Input(it as Map<String, Any>) },
      args["drawable"]?.let { SignDrawableInput(it as Map<String, Any>) },
      args["noop"] as Boolean?,
      args["oidc"]?.let { SignOidcInput(it as Map<String, Any>) }
  )
}

data class SignCriiptoVerifyInput(
    val jwt: String
) {
  constructor(args: Map<String, Any>) : this(
      args["jwt"] as String
  )
}

data class SignCriiptoVerifyV2Input(
    val code: String,
    val state: String
) {
  constructor(args: Map<String, Any>) : this(
      args["code"] as String,
      args["state"] as String
  )
}

data class SignDocumentFormFieldInput(
    val field: String,
    val value: String
) {
  constructor(args: Map<String, Any>) : this(
      args["field"] as String,
      args["value"] as String
  )
}

data class SignDocumentFormInput(
    val fields: Iterable<SignDocumentFormFieldInput>
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["fields"]!!.let { fields -> (fields as List<Map<String, Any>>).map { SignDocumentFormFieldInput(it) } }
  )
}

data class SignDocumentInput(
    val form: SignDocumentFormInput? = null,
    val id: Any
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["form"]?.let { SignDocumentFormInput(it as Map<String, Any>) },
      args["id"] as Any
  )
}

data class SignDrawableInput(
    val image: ByteArray,
    val name: String? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["image"] as ByteArray,
      args["name"] as String?
  )
}

data class SignInput(
    val allOf: SignAllOfInput? = null,
    val criiptoVerify: SignCriiptoVerifyInput? = null,
    val criiptoVerifyV2: SignCriiptoVerifyV2Input? = null,
    val documents: Iterable<SignDocumentInput>? = null,
    val drawable: SignDrawableInput? = null,
    val id: Any,
    val noop: Boolean? = null,
    val oidc: SignOidcInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["allOf"]?.let { SignAllOfInput(it as Map<String, Any>) },
      args["criiptoVerify"]?.let { SignCriiptoVerifyInput(it as Map<String, Any>) },
      args["criiptoVerifyV2"]?.let { SignCriiptoVerifyV2Input(it as Map<String, Any>) },
      args["documents"]?.let { documents -> (documents as List<Map<String, Any>>).map { SignDocumentInput(it) } },
      args["drawable"]?.let { SignDrawableInput(it as Map<String, Any>) },
      args["id"] as Any,
      args["noop"] as Boolean?,
      args["oidc"]?.let { SignOidcInput(it as Map<String, Any>) }
  )
}

data class SignOidcInput(
    val jwt: String
) {
  constructor(args: Map<String, Any>) : this(
      args["jwt"] as String
  )
}





data class SignatoryBeaconInput(
    val lastActionAt: String,
    val now: String? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["lastActionAt"] as String,
      args["now"] as String?
  )
}







data class SignatoryDocumentInput(
    val id: Any,
    val pdfSealPosition: PdfSealPositionInput? = null,
    val pdfSealPositions: Iterable<PdfSealPositionInput>? = null,
    val preapproved: Boolean? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["id"] as Any,
      args["pdfSealPosition"]?.let { PdfSealPositionInput(it as Map<String, Any>) },
      args["pdfSealPositions"]?.let { pdfSealPositions -> (pdfSealPositions as List<Map<String, Any>>).map { PdfSealPositionInput(it) } },
      args["preapproved"] as Boolean?
  )
}

enum class SignatoryDocumentStatus(val label: String) {
      Approved("APPROVED"),
      Opened("OPENED"),
      Preapproved("PREAPPROVED"),
      Rejected("REJECTED"),
      Signed("SIGNED");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): SignatoryDocumentStatus? {
      return values().find { it.label == label }
    }
  }
}

data class SignatoryEvidenceProviderInput(
    val allOf: AllOfEvidenceProviderInput? = null,
    val criiptoVerify: CriiptoVerifyProviderInput? = null,
    val drawable: DrawableEvidenceProviderInput? = null,
    val id: Any,
    val noop: NoopEvidenceProviderInput? = null,
    val oidc: OidcEvidenceProviderInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["allOf"]?.let { AllOfEvidenceProviderInput(it as Map<String, Any>) },
      args["criiptoVerify"]?.let { CriiptoVerifyProviderInput(it as Map<String, Any>) },
      args["drawable"]?.let { DrawableEvidenceProviderInput(it as Map<String, Any>) },
      args["id"] as Any,
      args["noop"]?.let { NoopEvidenceProviderInput(it as Map<String, Any>) },
      args["oidc"]?.let { OidcEvidenceProviderInput(it as Map<String, Any>) }
  )
}

data class SignatoryEvidenceValidationInput(
    val boolean: Boolean? = null,
    val key: String,
    val value: String? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["boolean"] as Boolean?,
      args["key"] as String,
      args["value"] as String?
  )
}

enum class SignatoryFrontendEvent(val label: String) {
      DownloadLinkOpened("DOWNLOAD_LINK_OPENED"),
      SignLinkOpened("SIGN_LINK_OPENED");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): SignatoryFrontendEvent? {
      return values().find { it.label == label }
    }
  }
}

enum class SignatoryRole(val label: String) {
      Approver("APPROVER"),
      Signer("SIGNER"),
      Viewer("VIEWER");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): SignatoryRole? {
      return values().find { it.label == label }
    }
  }
}



enum class SignatoryStatus(val label: String) {
      Approved("APPROVED"),
      Deleted("DELETED"),
      Error("ERROR"),
      Open("OPEN"),
      Rejected("REJECTED"),
      Signed("SIGNED");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): SignatoryStatus? {
      return values().find { it.label == label }
    }
  }
}

data class SignatoryUiInput(
    val disableRejection: Boolean? = null,
    val enableCancel: Boolean? = null,
    val language: Language? = Language.EnUs,
    val logo: SignatureOrderUiLogoInput? = null,
    val renderPdfAnnotationLayer: Boolean? = null,
    val signatoryRedirectUri: String? = null,
    val stylesheet: String? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["disableRejection"] as Boolean?,
      args["enableCancel"] as Boolean?,
      args["language"] as Language? ?: Language.EnUs,
      args["logo"]?.let { SignatureOrderUiLogoInput(it as Map<String, Any>) },
      args["renderPdfAnnotationLayer"] as Boolean?,
      args["signatoryRedirectUri"] as String?,
      args["stylesheet"] as String?
  )
}

data class SignatoryViewerDownloadArgs(
    val verification: DownloadVerificationInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["verification"]?.let { DownloadVerificationInput(it as Map<String, Any>) }
  )
}



data class SignatureAppearanceInput(
    val displayName: Iterable<SignatureAppearanceTemplateInput>? = null,
    val footer: Iterable<SignatureAppearanceTemplateInput>? = null,
    val headerLeft: Iterable<SignatureAppearanceTemplateInput>? = null,
    val identifierFromEvidence: Iterable<String>
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["displayName"]?.let { displayName -> (displayName as List<Map<String, Any>>).map { SignatureAppearanceTemplateInput(it) } },
      args["footer"]?.let { footer -> (footer as List<Map<String, Any>>).map { SignatureAppearanceTemplateInput(it) } },
      args["headerLeft"]?.let { headerLeft -> (headerLeft as List<Map<String, Any>>).map { SignatureAppearanceTemplateInput(it) } },
      args["identifierFromEvidence"] as Iterable<String>
  )
}

data class SignatureAppearanceTemplateInput(
    val replacements: Iterable<SignatureAppearanceTemplateReplacementInput>? = null,
    val template: String
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["replacements"]?.let { replacements -> (replacements as List<Map<String, Any>>).map { SignatureAppearanceTemplateReplacementInput(it) } },
      args["template"] as String
  )
}

data class SignatureAppearanceTemplateReplacementInput(
    val fromEvidence: Iterable<String>,
    val placeholder: String
) {
  constructor(args: Map<String, Any>) : this(
      args["fromEvidence"] as Iterable<String>,
      args["placeholder"] as String
  )
}







enum class SignatureOrderStatus(val label: String) {
      Cancelled("CANCELLED"),
      Closed("CLOSED"),
      Expired("EXPIRED"),
      Open("OPEN");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): SignatureOrderStatus? {
      return values().find { it.label == label }
    }
  }
}





data class SignatureOrderUiLogoInput(
    val href: String? = null,
    val src: String
) {
  constructor(args: Map<String, Any>) : this(
      args["href"] as String?,
      args["src"] as String
  )
}

data class SignatureOrderWebhookLogsArgs(
    val from: String,
    val succeeded: Boolean? = null,
    val to: String
) {
  constructor(args: Map<String, Any>) : this(
      args["from"] as String,
      args["succeeded"] as Boolean?,
      args["to"] as String
  )
}

data class SingleEvidenceProviderInput(
    val criiptoVerify: CriiptoVerifyProviderInput? = null,
    val drawable: DrawableEvidenceProviderInput? = null,
    val noop: NoopEvidenceProviderInput? = null,
    val oidc: OidcEvidenceProviderInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["criiptoVerify"]?.let { CriiptoVerifyProviderInput(it as Map<String, Any>) },
      args["drawable"]?.let { DrawableEvidenceProviderInput(it as Map<String, Any>) },
      args["noop"]?.let { NoopEvidenceProviderInput(it as Map<String, Any>) },
      args["oidc"]?.let { OidcEvidenceProviderInput(it as Map<String, Any>) }
  )
}

data class StartCriiptoVerifyEvidenceProviderInput(
    val acrValue: String,
    val device: DeviceInput? = null,
    val id: Any,
    val idTokenHint: String? = null,
    val redirectUri: String,
    val stage: EvidenceValidationStage
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["acrValue"] as String,
      args["device"]?.let { DeviceInput(it as Map<String, Any>) },
      args["id"] as Any,
      args["idTokenHint"] as String?,
      args["redirectUri"] as String,
      args["stage"] as EvidenceValidationStage
  )
}

data class TenantApplicationsArgs(
    val domain: String? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["domain"] as String?
  )
}
data class TenantWebhookLogsArgs(
    val from: String,
    val succeeded: Boolean? = null,
    val to: String
) {
  constructor(args: Map<String, Any>) : this(
      args["from"] as String,
      args["succeeded"] as Boolean?,
      args["to"] as String
  )
}



data class TrackSignatoryInput(
    val event: SignatoryFrontendEvent
) {
  constructor(args: Map<String, Any>) : this(
      args["event"] as SignatoryFrontendEvent
  )
}



data class UnvalidatedSignatoryViewerDownloadArgs(
    val verification: DownloadVerificationInput? = null
) {
  @Suppress("UNCHECKED_CAST")
  constructor(args: Map<String, Any>) : this(
      args["verification"]?.let { DownloadVerificationInput(it as Map<String, Any>) }
  )
}

data class UpdateSignatoryDocumentStatusInput(
    val documentId: Any,
    val status: SignatoryDocumentStatus
) {
  constructor(args: Map<String, Any>) : this(
      args["documentId"] as Any,
      args["status"] as SignatoryDocumentStatus
  )
}





data class ValidateDocumentInput(
    val pdf: ByteArray? = null,
    val xml: ByteArray? = null
) {
  constructor(args: Map<String, Any>) : this(
      args["pdf"] as ByteArray?,
      args["xml"] as ByteArray?
  )
}





enum class VerifyApplicationEnvironment(val label: String) {
      Production("PRODUCTION"),
      Test("TEST");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): VerifyApplicationEnvironment? {
      return values().find { it.label == label }
    }
  }
}

data class VerifyApplicationQueryInput(
    val domain: String,
    val realm: String,
    val tenantId: Any
) {
  constructor(args: Map<String, Any>) : this(
      args["domain"] as String,
      args["realm"] as String,
      args["tenantId"] as Any
  )
}





enum class WebhookInvocationEvent(val label: String) {
      SignatoryApproved("SIGNATORY_APPROVED"),
      SignatoryDocumentStatusChanged("SIGNATORY_DOCUMENT_STATUS_CHANGED"),
      SignatoryDownloadLinkOpened("SIGNATORY_DOWNLOAD_LINK_OPENED"),
      SignatoryRejected("SIGNATORY_REJECTED"),
      SignatorySigned("SIGNATORY_SIGNED"),
      SignatorySignError("SIGNATORY_SIGN_ERROR"),
      SignatorySignLinkOpened("SIGNATORY_SIGN_LINK_OPENED"),
      SignatureOrderExpired("SIGNATURE_ORDER_EXPIRED");

  companion object {
    @JvmStatic
    fun valueOfLabel(label: String): WebhookInvocationEvent? {
      return values().find { it.label == label }
    }
  }
}





data class XadesDocumentInput(
    val blob: ByteArray,
    val reference: String? = null,
    val storageMode: DocumentStorageMode,
    val title: String
) {
  constructor(args: Map<String, Any>) : this(
      args["blob"] as ByteArray,
      args["reference"] as String?,
      args["storageMode"] as DocumentStorageMode,
      args["title"] as String
  )
}

