#pragma warning disable CS8601
#pragma warning disable CS8603
#pragma warning disable CS8604
#pragma warning disable CS8618
#pragma warning disable CS8619
#pragma warning disable CS0111
#pragma warning disable CA1507
#pragma warning disable CA1715
#pragma warning disable CA1724
#pragma warning disable CA1062
#pragma warning disable CA2227
#pragma warning disable CA1724
#pragma warning disable CA1002
#pragma warning disable CA1034
#pragma warning disable CA1056
#pragma warning disable CA1707
#pragma warning disable CA1720
#pragma warning disable CA1052
#pragma warning disable CA1819
#pragma warning disable CA1716
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Criipto.Signatures.Models
{


    #region AddSignatoriesInput
    public class AddSignatoriesInput
    {
        #region members
        [Required]
        [JsonRequired]
        public List<CreateSignatureOrderSignatoryInput> signatories { get; set; }

        [Required]
        [JsonRequired]
        public string signatureOrderId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region AddSignatoriesOutput
    public class AddSignatoriesOutput
    {
        #region members
        [JsonProperty("signatories")]
        public List<Signatory> signatories { get; set; }

        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    #region AddSignatoryInput
    public class AddSignatoryInput
    {
        #region members
        /// <summary>
        /// Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents.
        /// </summary>
        public List<SignatoryDocumentInput> documents { get; set; }

        /// <summary>
        /// Selectively enable evidence providers for this signatory.
        /// </summary>
        public List<SignatoryEvidenceProviderInput> evidenceProviders { get; set; }

        public List<SignatoryEvidenceValidationInput> evidenceValidation { get; set; }

        /// <summary>
        /// Will not be displayed to signatories, can be used as a reference to your own system.
        /// </summary>
        public string reference { get; set; }

        /// <summary>
        /// Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output.
        /// </summary>
        public string role { get; set; }

        public SignatureAppearanceInput signatureAppearance { get; set; }

        [Required]
        [JsonRequired]
        public string signatureOrderId { get; set; }

        /// <summary>
        /// Override UI settings for signatory, defaults to UI settings for signature order
        /// </summary>
        public SignatoryUiInput ui { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region AddSignatoryOutput
    public class AddSignatoryOutput
    {
        #region members
        [JsonProperty("signatory")]
        public Signatory signatory { get; set; }

        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    #region AllOfEvidenceProviderInput
    public class AllOfEvidenceProviderInput
    {
        #region members
        [Required]
        [JsonRequired]
        public List<SingleEvidenceProviderInput> providers { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region AllOfSignatureEvidenceProvider
    public class AllOfSignatureEvidenceProvider : SignatureEvidenceProvider
    {
        #region members
        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("providers")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<SingleSignatureEvidenceProvider> providers { get; set; }
        #endregion
    }
    #endregion

    #region AnonymousViewer
    public class AnonymousViewer : Viewer
    {
        #region members
        [JsonProperty("authenticated")]
        public bool authenticated { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }
        #endregion
    }
    #endregion

    #region Application
    public class Application : Viewer
    {
        #region members
        [JsonProperty("apiKeys")]
        public List<ApplicationApiKey> apiKeys { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("name")]
        public string name { get; set; }

        [JsonProperty("signatureOrders")]
        public SignatureOrderConnection signatureOrders { get; set; }

        /// <summary>
        /// Tenants are only accessable from user viewers
        /// </summary>
        [JsonProperty("tenant")]
        public Tenant tenant { get; set; }

        [JsonProperty("verifyApplication")]
        public VerifyApplication verifyApplication { get; set; }

        [JsonProperty("webhookLogs")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<WebhookInvocation> webhookLogs { get; set; }
        #endregion
    }
    #endregion

    #region ApplicationApiKey
    public class ApplicationApiKey
    {
        #region members
        [JsonProperty("clientId")]
        public string clientId { get; set; }

        [JsonProperty("clientSecret")]
        public string clientSecret { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("mode")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public ApplicationApiKeyMode mode { get; set; }

        [JsonProperty("note")]
        public string note { get; set; }
        #endregion
    }
    #endregion
    public enum ApplicationApiKeyMode
    {
        READ_ONLY,
        READ_WRITE,
        FUTURE_ADDED_VALUE = 999
    }


    #region BatchSignatory
    public class BatchSignatory
    {
        #region members
        [JsonProperty("href")]
        public string href { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("items")]
        public List<BatchSignatoryItem> items { get; set; }

        /// <summary>
        /// The authentication token required for performing batch operations.
        /// </summary>
        [JsonProperty("token")]
        public string token { get; set; }

        [JsonProperty("ui")]
        public SignatureOrderUI ui { get; set; }
        #endregion
    }
    #endregion

    #region BatchSignatoryItem
    public class BatchSignatoryItem
    {
        #region members
        [JsonProperty("signatory")]
        public Signatory signatory { get; set; }

        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    #region BatchSignatoryItemInput
    public class BatchSignatoryItemInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string signatoryId { get; set; }

        [Required]
        [JsonRequired]
        public string signatureOrderId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region BatchSignatoryViewer
    public class BatchSignatoryViewer : Viewer
    {
        #region members
        [JsonProperty("authenticated")]
        public bool authenticated { get; set; }

        [JsonProperty("batchSignatoryId")]
        public string batchSignatoryId { get; set; }

        [JsonProperty("documents")]
        public SignatoryDocumentConnection documents { get; set; }

        [JsonProperty("evidenceProviders")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<SignatureEvidenceProvider> evidenceProviders { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("signer")]
        public bool signer { get; set; }

        [JsonProperty("status")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public SignatoryStatus status { get; set; }

        [JsonProperty("ui")]
        public SignatureOrderUI ui { get; set; }
        #endregion
    }
    #endregion

    #region CancelSignatureOrderInput
    public class CancelSignatureOrderInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string signatureOrderId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CancelSignatureOrderOutput
    public class CancelSignatureOrderOutput
    {
        #region members
        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    #region ChangeSignatoryInput
    public class ChangeSignatoryInput
    {
        #region members
        /// <summary>
        /// Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents.
        /// </summary>
        public List<SignatoryDocumentInput> documents { get; set; }

        /// <summary>
        /// Selectively enable evidence providers for this signatory.
        /// </summary>
        public List<SignatoryEvidenceProviderInput> evidenceProviders { get; set; }

        public List<SignatoryEvidenceValidationInput> evidenceValidation { get; set; }

        /// <summary>
        /// Will not be displayed to signatories, can be used as a reference to your own system.
        /// </summary>
        public string reference { get; set; }

        /// <summary>
        /// Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output.
        /// </summary>
        public string role { get; set; }

        [Required]
        [JsonRequired]
        public string signatoryId { get; set; }

        public SignatureAppearanceInput signatureAppearance { get; set; }

        /// <summary>
        /// Override UI settings for signatory, defaults to UI settings for signature order
        /// </summary>
        public SignatoryUiInput ui { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region ChangeSignatoryOutput
    public class ChangeSignatoryOutput
    {
        #region members
        [JsonProperty("signatory")]
        public Signatory signatory { get; set; }

        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    #region CleanupSignatureOrderInput
    public class CleanupSignatureOrderInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string signatureOrderId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CleanupSignatureOrderOutput
    public class CleanupSignatureOrderOutput
    {
        #region members
        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    #region CloseSignatureOrderInput
    public class CloseSignatureOrderInput
    {
        #region members
        /// <summary>
        /// Retains documents on Criipto servers after closing a signature order. You MUST manually call the cleanupSignatureOrder mutation when you are sure you have downloaded the blobs. Maximum value is 7 days.
        /// </summary>
        public int? retainDocumentsForDays { get; set; }

        [Required]
        [JsonRequired]
        public string signatureOrderId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CloseSignatureOrderOutput
    public class CloseSignatureOrderOutput
    {
        #region members
        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    #region CompositeSignature
    public class CompositeSignature : Signature
    {
        #region members
        [JsonProperty("signatory")]
        public Signatory signatory { get; set; }

        [JsonProperty("signatures")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<SingleSignature> signatures { get; set; }
        #endregion
    }
    #endregion

    #region CreateApplicationApiKeyInput
    public class CreateApplicationApiKeyInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string applicationId { get; set; }

        [JsonConverter(typeof(TolerantEnumConverter))]
        public ApplicationApiKeyMode? mode { get; set; }

        public string note { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CreateApplicationApiKeyOutput
    public class CreateApplicationApiKeyOutput
    {
        #region members
        [JsonProperty("apiKey")]
        public ApplicationApiKey apiKey { get; set; }

        [JsonProperty("application")]
        public Application application { get; set; }
        #endregion
    }
    #endregion

    #region CreateApplicationInput
    public class CreateApplicationInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string name { get; set; }

        [Required]
        [JsonRequired]
        public string tenantId { get; set; }

        [Required]
        [JsonRequired]
        public string verifyApplicationDomain { get; set; }

        [Required]
        [JsonRequired]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public VerifyApplicationEnvironment verifyApplicationEnvironment { get; set; }

        [Required]
        [JsonRequired]
        public string verifyApplicationRealm { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CreateApplicationOutput
    public class CreateApplicationOutput
    {
        #region members
        [JsonProperty("apiKey")]
        public ApplicationApiKey apiKey { get; set; }

        [JsonProperty("application")]
        public Application application { get; set; }

        [JsonProperty("tenant")]
        public Tenant tenant { get; set; }
        #endregion
    }
    #endregion

    #region CreateBatchSignatoryInput
    public class CreateBatchSignatoryInput
    {
        #region members
        [Required]
        [JsonRequired]
        public List<BatchSignatoryItemInput> items { get; set; }

        /// <summary>
        /// UI settings for batch signatory, will use defaults otherwise (will not use UI settings from sub signatories)
        /// </summary>
        public SignatoryUiInput ui { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CreateBatchSignatoryOutput
    public class CreateBatchSignatoryOutput
    {
        #region members
        [JsonProperty("batchSignatory")]
        public BatchSignatory batchSignatory { get; set; }
        #endregion
    }
    #endregion

    #region CreateSignatureOrderInput
    public class CreateSignatureOrderInput
    {
        #region members
        /// <summary>
        /// By default signatories will be prompted to sign with a Criipto Verify based e-ID, this setting disables it.
        /// </summary>
        public bool? disableVerifyEvidenceProvider { get; set; }

        [Required]
        [JsonRequired]
        public List<DocumentInput> documents { get; set; }

        /// <summary>
        /// Define evidence providers for signature order if not using built-in Criipto Verify for e-IDs
        /// </summary>
        public List<EvidenceProviderInput> evidenceProviders { get; set; }

        /// <summary>
        /// Defines when a signatory must be validated, default is when signing, but can be expanded to also be required when viewing documents.
        /// </summary>
        public List<EvidenceValidationStage> evidenceValidationStages { get; set; }

        /// <summary>
        /// When this signature order will auto-close/expire at exactly in one of the following ISO-8601 formats: yyyy-MM-ddTHH:mm:ssZ, yyyy-MM-ddTHH:mm:ss.ffZ, yyyy-MM-ddTHH:mm:ss.fffZ, yyyy-MM-ddTHH:mm:ssK, yyyy-MM-ddTHH:mm:ss.ffK, yyyy-MM-ddTHH:mm:ss.fffK. Cannot be provided with `expiresInDays`.
        /// </summary>
        public string expiresAt { get; set; }

        /// <summary>
        /// When this signature order will auto-close/expire. Default 90 days. Cannot be provided with `expiresAt`
        /// </summary>
        public int? expiresInDays { get; set; }

        /// <summary>
        /// Attempt to automatically fix document formatting errors if possible. Default 'true'.
        /// </summary>
        public bool? fixDocumentFormattingErrors { get; set; }

        /// <summary>
        /// Max allowed signatories (as it influences pages needed for seals). Default 14.
        /// </summary>
        public int? maxSignatories { get; set; }

        public List<CreateSignatureOrderSignatoryInput> signatories { get; set; }

        /// <summary>
        /// Configure appearance of signatures inside documents
        /// </summary>
        public SignatureAppearanceInput signatureAppearance { get; set; }

        /// <summary>
        /// Timezone to render signature seals in, default UTC.
        /// </summary>
        public string timezone { get; set; }

        public string title { get; set; }

        /// <summary>
        /// Various settings for how the UI is presented to the signatory.
        /// </summary>
        public CreateSignatureOrderUiInput ui { get; set; }

        /// <summary>
        /// Signature order webhook settings
        /// </summary>
        public CreateSignatureOrderWebhookInput webhook { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CreateSignatureOrderOutput
    public class CreateSignatureOrderOutput
    {
        #region members
        [JsonProperty("application")]
        public Application application { get; set; }

        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    #region CreateSignatureOrderSignatoryInput
    public class CreateSignatureOrderSignatoryInput
    {
        #region members
        /// <summary>
        /// Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents.
        /// </summary>
        public List<SignatoryDocumentInput> documents { get; set; }

        /// <summary>
        /// Selectively enable evidence providers for this signatory.
        /// </summary>
        public List<SignatoryEvidenceProviderInput> evidenceProviders { get; set; }

        public List<SignatoryEvidenceValidationInput> evidenceValidation { get; set; }

        /// <summary>
        /// Will not be displayed to signatories, can be used as a reference to your own system.
        /// </summary>
        public string reference { get; set; }

        /// <summary>
        /// Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output.
        /// </summary>
        public string role { get; set; }

        public SignatureAppearanceInput signatureAppearance { get; set; }

        /// <summary>
        /// Override UI settings for signatory, defaults to UI settings for signature order
        /// </summary>
        public SignatoryUiInput ui { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CreateSignatureOrderUiInput
    public class CreateSignatureOrderUiInput
    {
        #region members
        /// <summary>
        /// Removes the UI options to reject a document or signature order.
        /// </summary>
        public bool? disableRejection { get; set; }

        /// <summary>
        /// The language of texts rendered to the signatory.
        /// </summary>
        [JsonConverter(typeof(TolerantEnumConverter))]
        public Language? language { get; set; }

        /// <summary>
        /// Define a logo to be shown in the signatory UI.
        /// </summary>
        public SignatureOrderUiLogoInput logo { get; set; }

        /// <summary>
        /// Renders a UI layer for PDF annotations, such as links, making them interactive in the UI/browser
        /// </summary>
        public bool? renderPdfAnnotationLayer { get; set; }

        /// <summary>
        /// The signatory will be redirected to this URL after signing or rejected the signature order.
        /// </summary>
        public string signatoryRedirectUri { get; set; }

        /// <summary>
        /// Add stylesheet/css via an absolute HTTPS URL.
        /// </summary>
        public string stylesheet { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CreateSignatureOrderWebhookInput
    public class CreateSignatureOrderWebhookInput
    {
        #region members
        /// <summary>
        /// If defined, webhook invocations will have a X-Criipto-Signature header containing a HMAC-SHA256 signature (as a base64 string) of the webhook request body (utf-8). The secret should be between 256 and 512 bits.
        /// </summary>
        public byte[] secret { get; set; }

        /// <summary>
        /// Webhook url. POST requests will be executed towards this URL on certain signatory events.
        /// </summary>
        [Required]
        [JsonRequired]
        public string url { get; set; }

        /// <summary>
        /// Validates webhook connectivity by triggering a WEBHOOK_VALIDATION event, your webhook must respond within 5 seconds with 200/OK or the signature order creation will fail.
        /// </summary>
        public bool? validateConnectivity { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CriiptoVerifyProviderInput
    /// <summary>
    /// Criipto Verify based evidence for signatures.
    /// </summary>
    public class CriiptoVerifyProviderInput
    {
        #region members
        public List<string> acrValues { get; set; }

        public bool? alwaysRedirect { get; set; }

        /// <summary>
        /// Set a custom login_hint for the underlying authentication request.
        /// </summary>
        public string loginHint { get; set; }

        /// <summary>
        /// Messages displayed when performing authentication (only supported by DKMitID currently).
        /// </summary>
        public string message { get; set; }

        /// <summary>
        /// Set a custom scope for the underlying authentication request.
        /// </summary>
        public string scope { get; set; }

        /// <summary>
        /// Enforces that signatories sign by unique evidence by comparing the values of previous evidence on the key you define. For Criipto Verify you likely want to use `sub` which is a unique pseudonym value present in all e-ID tokens issued.
        /// </summary>
        public string uniqueEvidenceKey { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region CriiptoVerifySignatureEvidenceProvider
    public class CriiptoVerifySignatureEvidenceProvider : SignatureEvidenceProvider, SingleSignatureEvidenceProvider
    {
        #region members
        [JsonProperty("acrValues")]
        public List<string> acrValues { get; set; }

        [JsonProperty("alwaysRedirect")]
        public bool alwaysRedirect { get; set; }

        [JsonProperty("clientID")]
        public string clientID { get; set; }

        [JsonProperty("domain")]
        public string domain { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("loginHint")]
        public string loginHint { get; set; }

        [JsonProperty("message")]
        public string message { get; set; }

        [JsonProperty("name")]
        public string name { get; set; }

        [JsonProperty("scope")]
        public string scope { get; set; }
        #endregion
    }
    #endregion

    #region DeleteApplicationApiKeyInput
    public class DeleteApplicationApiKeyInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string apiKeyId { get; set; }

        [Required]
        [JsonRequired]
        public string applicationId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region DeleteApplicationApiKeyOutput
    public class DeleteApplicationApiKeyOutput
    {
        #region members
        [JsonProperty("application")]
        public Application application { get; set; }
        #endregion
    }
    #endregion

    #region DeleteSignatoryInput
    public class DeleteSignatoryInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string signatoryId { get; set; }

        [Required]
        [JsonRequired]
        public string signatureOrderId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region DeleteSignatoryOutput
    public class DeleteSignatoryOutput
    {
        #region members
        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    public interface Document
    {
        [JsonProperty("blob")]
        byte[] blob { get; set; }

        [JsonProperty("id")]
        string id { get; set; }

        [JsonProperty("originalBlob")]
        byte[] originalBlob { get; set; }

        [JsonProperty("reference")]
        string reference { get; set; }

        [JsonProperty("signatoryViewerStatus")]
        SignatoryDocumentStatus? signatoryViewerStatus { get; set; }

        [JsonProperty("signatures")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        List<Signature> signatures { get; set; }

        [JsonProperty("title")]
        string title { get; set; }
    }
    public enum DocumentIdLocation
    {
        BOTTOM,
        LEFT,
        RIGHT,
        TOP,
        FUTURE_ADDED_VALUE = 999
    }


    #region DocumentInput
    public class DocumentInput
    {
        #region members
        public PadesDocumentInput pdf { get; set; }

        /// <summary>
        /// When enabled, will remove any existing signatures from the document before storing. (PDF only)
        /// </summary>
        public bool? removePreviousSignatures { get; set; }

        /// <summary>
        /// XML signing is coming soon, reach out to learn more.
        /// </summary>
        public XadesDocumentInput xml { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion
    /// <summary>
    /// Document storage mode. Temporary documents will be deleted once completed.
    /// </summary>
    public enum DocumentStorageMode
    {
        /// <summary>
        /// Temporary documents will be deleted once completed.
        /// </summary>
        Temporary,
        FUTURE_ADDED_VALUE = 999
    }


    #region DownloadVerificationCriiptoVerifyInput
    public class DownloadVerificationCriiptoVerifyInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string jwt { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region DownloadVerificationInput
    public class DownloadVerificationInput
    {
        #region members
        public DownloadVerificationCriiptoVerifyInput criiptoVerify { get; set; }

        public DownloadVerificationOidcInput oidc { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region DownloadVerificationOidcInput
    public class DownloadVerificationOidcInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string jwt { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region DrawableEvidenceProviderInput
    /// <summary>
    /// Hand drawn signature evidence for signatures.
    /// </summary>
    public class DrawableEvidenceProviderInput
    {
        #region members
        /// <summary>
        /// Required minimum height of drawed area in pixels.
        /// </summary>
        public int? minimumHeight { get; set; }

        /// <summary>
        /// Required minimum width of drawed area in pixels.
        /// </summary>
        public int? minimumWidth { get; set; }

        public bool? requireName { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region DrawableSignature
    public class DrawableSignature : Signature, SingleSignature
    {
        #region members
        [JsonProperty("image")]
        public byte[] image { get; set; }

        [JsonProperty("name")]
        public string name { get; set; }

        [JsonProperty("signatory")]
        public Signatory signatory { get; set; }
        #endregion
    }
    #endregion

    #region DrawableSignatureEvidenceProvider
    public class DrawableSignatureEvidenceProvider : SignatureEvidenceProvider, SingleSignatureEvidenceProvider
    {
        #region members
        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("minimumHeight")]
        public int? minimumHeight { get; set; }

        [JsonProperty("minimumWidth")]
        public int? minimumWidth { get; set; }

        [JsonProperty("requireName")]
        public bool requireName { get; set; }
        #endregion
    }
    #endregion

    #region EmptySignature
    public class EmptySignature : Signature, SingleSignature
    {
        #region members
        [JsonProperty("signatory")]
        public Signatory signatory { get; set; }
        #endregion
    }
    #endregion

    #region EvidenceProviderInput
    /// <summary>
    /// Must define a evidence provider subsection.
    /// </summary>
    public class EvidenceProviderInput
    {
        #region members
        public AllOfEvidenceProviderInput allOf { get; set; }

        /// <summary>
        /// Criipto Verify based evidence for signatures.
        /// </summary>
        public CriiptoVerifyProviderInput criiptoVerify { get; set; }

        /// <summary>
        /// Hand drawn signature evidence for signatures.
        /// </summary>
        public DrawableEvidenceProviderInput drawable { get; set; }

        /// <summary>
        /// Determined if this evidence provider should be enabled by signatories by default. Default true
        /// </summary>
        public bool? enabledByDefault { get; set; }

        /// <summary>
        /// TEST environment only. Does not manipulate the PDF, use for integration or webhook testing.
        /// </summary>
        public NoopEvidenceProviderInput noop { get; set; }

        /// <summary>
        /// Deprecated
        /// </summary>
        public OidcEvidenceProviderInput oidc { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion
    public enum EvidenceValidationStage
    {
        SIGN,
        /// <summary>
        /// Require the signatory to be validated before viewing documents
        /// </summary>
        VIEW,
        FUTURE_ADDED_VALUE = 999
    }


    #region ExtendSignatureOrderInput
    public class ExtendSignatureOrderInput
    {
        #region members
        /// <summary>
        /// Expiration to add to order, in days, max 30.
        /// </summary>
        [Required]
        [JsonRequired]
        public int additionalExpirationInDays { get; set; }

        [Required]
        [JsonRequired]
        public string signatureOrderId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region ExtendSignatureOrderOutput
    public class ExtendSignatureOrderOutput
    {
        #region members
        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    #region JWTSignature
    public class JWTSignature : Signature, SingleSignature
    {
        #region members
        [JsonProperty("jwks")]
        public string jwks { get; set; }

        [JsonProperty("jwt")]
        public string jwt { get; set; }

        [JsonProperty("signatory")]
        public Signatory signatory { get; set; }
        #endregion
    }
    #endregion
    public enum Language
    {
        DA_DK,
        EN_US,
        NB_NO,
        SV_SE,
        FUTURE_ADDED_VALUE = 999
    }


    #region Mutation
    public class Mutation
    {
        #region members
        /// <summary>
        /// Add multiple signatures to your signature order.
        /// </summary>
        [JsonProperty("addSignatories")]
        public AddSignatoriesOutput addSignatories { get; set; }

        /// <summary>
        /// Add a signatory to your signature order.
        /// </summary>
        [JsonProperty("addSignatory")]
        public AddSignatoryOutput addSignatory { get; set; }

        /// <summary>
        /// Cancels the signature order without closing it, use if you no longer need a signature order. Documents are deleted from storage after cancelling.
        /// </summary>
        [JsonProperty("cancelSignatureOrder")]
        public CancelSignatureOrderOutput cancelSignatureOrder { get; set; }

        /// <summary>
        /// Change an existing signatory
        /// </summary>
        [JsonProperty("changeSignatory")]
        public ChangeSignatoryOutput changeSignatory { get; set; }

        /// <summary>
        /// Cleans up the signature order and removes any saved documents from the servers.
        /// </summary>
        [JsonProperty("cleanupSignatureOrder")]
        public CleanupSignatureOrderOutput cleanupSignatureOrder { get; set; }

        /// <summary>
        /// Finalizes the documents in the signature order and returns them to you as blobs. Documents are deleted from storage after closing.
        /// </summary>
        [JsonProperty("closeSignatureOrder")]
        public CloseSignatureOrderOutput closeSignatureOrder { get; set; }

        /// <summary>
        /// Creates a signature application for a given tenant.
        /// </summary>
        [JsonProperty("createApplication")]
        public CreateApplicationOutput createApplication { get; set; }

        /// <summary>
        /// Creates a new set of api credentials for an existing application.
        /// </summary>
        [JsonProperty("createApplicationApiKey")]
        public CreateApplicationApiKeyOutput createApplicationApiKey { get; set; }

        [JsonProperty("createBatchSignatory")]
        public CreateBatchSignatoryOutput createBatchSignatory { get; set; }

        /// <summary>
        /// Creates a signature order to be signed.
        /// </summary>
        [JsonProperty("createSignatureOrder")]
        public CreateSignatureOrderOutput createSignatureOrder { get; set; }

        /// <summary>
        /// Deletes a set of API credentials for an application.
        /// </summary>
        [JsonProperty("deleteApplicationApiKey")]
        public DeleteApplicationApiKeyOutput deleteApplicationApiKey { get; set; }

        /// <summary>
        /// Delete a signatory from a signature order
        /// </summary>
        [JsonProperty("deleteSignatory")]
        public DeleteSignatoryOutput deleteSignatory { get; set; }

        /// <summary>
        /// Extends the expiration of the signature order.
        /// </summary>
        [JsonProperty("extendSignatureOrder")]
        public ExtendSignatureOrderOutput extendSignatureOrder { get; set; }

        /// <summary>
        /// Refreshes the client secret for an existing set of API credentials. Warning: The old client secret will stop working immediately.
        /// </summary>
        [JsonProperty("refreshApplicationApiKey")]
        public RefreshApplicationApiKeyOutput refreshApplicationApiKey { get; set; }

        /// <summary>
        /// Used by Signatory frontends to reject a signature order in full.
        /// </summary>
        [JsonProperty("rejectSignatureOrder")]
        public RejectSignatureOrderOutput rejectSignatureOrder { get; set; }

        [JsonProperty("retrySignatureOrderWebhook")]
        public RetrySignatureOrderWebhookOutput retrySignatureOrderWebhook { get; set; }

        /// <summary>
        /// Used by Signatory frontends to sign the documents in a signature order.
        /// </summary>
        [JsonProperty("sign")]
        public SignOutput sign { get; set; }

        /// <summary>
        /// Sign with API credentials acting as a specific signatory. The signatory MUST be preapproved in this case.
        /// </summary>
        [JsonProperty("signActingAs")]
        public SignActingAsOutput signActingAs { get; set; }

        /// <summary>
        /// Signatory frontend use only.
        /// </summary>
        [JsonProperty("signatoryBeacon")]
        public SignatoryBeaconOutput signatoryBeacon { get; set; }

        /// <summary>
        /// Signatory frontend use only.
        /// </summary>
        [JsonProperty("trackSignatory")]
        public TrackSignatoryOutput trackSignatory { get; set; }

        /// <summary>
        /// Used by Signatory frontends to mark documents as opened, approved or rejected.
        /// </summary>
        [JsonProperty("updateSignatoryDocumentStatus")]
        public UpdateSignatoryDocumentStatusOutput updateSignatoryDocumentStatus { get; set; }

        [JsonProperty("validateDocument")]
        public ValidateDocumentOutput validateDocument { get; set; }
        #endregion
    }
    #endregion

    #region NoopEvidenceProviderInput
    /// <summary>
    /// TEST only. Allows empty signatures for testing.
    /// </summary>
    public class NoopEvidenceProviderInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string name { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region NoopSignatureEvidenceProvider
    public class NoopSignatureEvidenceProvider : SignatureEvidenceProvider, SingleSignatureEvidenceProvider
    {
        #region members
        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("name")]
        public string name { get; set; }
        #endregion
    }
    #endregion

    #region OidcEvidenceProviderInput
    /// <summary>
    /// OIDC/JWT based evidence for signatures.
    /// </summary>
    public class OidcEvidenceProviderInput
    {
        #region members
        public List<string> acrValues { get; set; }

        public bool? alwaysRedirect { get; set; }

        [Required]
        [JsonRequired]
        public string audience { get; set; }

        [Required]
        [JsonRequired]
        public string clientID { get; set; }

        [Required]
        [JsonRequired]
        public string domain { get; set; }

        [Required]
        [JsonRequired]
        public string name { get; set; }

        /// <summary>
        /// Enforces that signatories sign by unique evidence by comparing the values of previous evidence on the key you define.
        /// </summary>
        public string uniqueEvidenceKey { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region OidcJWTSignatureEvidenceProvider
    public class OidcJWTSignatureEvidenceProvider : SignatureEvidenceProvider, SingleSignatureEvidenceProvider
    {
        #region members
        [JsonProperty("acrValues")]
        public List<string> acrValues { get; set; }

        [JsonProperty("alwaysRedirect")]
        public bool alwaysRedirect { get; set; }

        [JsonProperty("clientID")]
        public string clientID { get; set; }

        [JsonProperty("domain")]
        public string domain { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("name")]
        public string name { get; set; }
        #endregion
    }
    #endregion

    #region PadesDocumentFormInput
    public class PadesDocumentFormInput
    {
        #region members
        [Required]
        [JsonRequired]
        public bool enabled { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region PadesDocumentInput
    public class PadesDocumentInput
    {
        #region members
        [Required]
        [JsonRequired]
        public byte[] blob { get; set; }

        /// <summary>
        /// Will add a unique identifier for the document to the specified margin of each page. Useful when printing signed documents.
        /// </summary>
        [JsonConverter(typeof(TolerantEnumConverter))]
        public DocumentIdLocation? displayDocumentID { get; set; }

        public PadesDocumentFormInput form { get; set; }

        /// <summary>
        /// Will not be displayed to signatories, can be used as a reference to your own system.
        /// </summary>
        public string reference { get; set; }

        [Required]
        [JsonRequired]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public DocumentStorageMode storageMode { get; set; }

        [Required]
        [JsonRequired]
        public string title { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region PageInfo
    /// <summary>
    /// Information about pagination in a connection.
    /// </summary>
    public class PageInfo
    {
        #region members
        /// <summary>
        /// When paginating forwards, the cursor to continue.
        /// </summary>
        [JsonProperty("endCursor")]
        public string endCursor { get; set; }

        /// <summary>
        /// When paginating forwards, are there more items?
        /// </summary>
        [JsonProperty("hasNextPage")]
        public bool hasNextPage { get; set; }

        /// <summary>
        /// When paginating backwards, are there more items?
        /// </summary>
        [JsonProperty("hasPreviousPage")]
        public bool hasPreviousPage { get; set; }

        /// <summary>
        /// When paginating backwards, the cursor to continue.
        /// </summary>
        [JsonProperty("startCursor")]
        public string startCursor { get; set; }
        #endregion
    }
    #endregion

    #region PdfDocument
    public class PdfDocument : Document
    {
        #region members
        [JsonProperty("blob")]
        public byte[] blob { get; set; }

        /// <summary>
        /// Same value as stamped on document when using displayDocumentID
        /// </summary>
        [JsonProperty("documentID")]
        public string documentID { get; set; }

        [JsonProperty("form")]
        public PdfDocumentForm form { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("originalBlob")]
        public byte[] originalBlob { get; set; }

        [JsonProperty("reference")]
        public string reference { get; set; }

        [JsonProperty("signatoryViewerStatus")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public SignatoryDocumentStatus? signatoryViewerStatus { get; set; }

        [JsonProperty("signatures")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<Signature> signatures { get; set; }

        [JsonProperty("title")]
        public string title { get; set; }
        #endregion
    }
    #endregion

    #region PdfDocumentForm
    public class PdfDocumentForm
    {
        #region members
        [JsonProperty("enabled")]
        public bool enabled { get; set; }
        #endregion
    }
    #endregion

    #region PdfSealPosition
    public class PdfSealPosition
    {
        #region members
        [Required]
        [JsonRequired]
        public int page { get; set; }

        [Required]
        [JsonRequired]
        public double x { get; set; }

        [Required]
        [JsonRequired]
        public double y { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region Query
    public class Query
    {
        #region members
        [JsonProperty("application")]
        public Application application { get; set; }

        [JsonProperty("batchSignatory")]
        public BatchSignatory batchSignatory { get; set; }

        [JsonProperty("document")]
        [JsonConverter(typeof(CompositionTypeConverter))]
        public Document document { get; set; }

        /// <summary>
        /// Query a signatory by id. Useful when using webhooks.
        /// </summary>
        [JsonProperty("signatory")]
        public Signatory signatory { get; set; }

        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }

        /// <summary>
        /// Tenants are only accessable from user viewers
        /// </summary>
        [JsonProperty("tenant")]
        public Tenant tenant { get; set; }

        [JsonProperty("timezones")]
        public List<string> timezones { get; set; }

        [JsonProperty("viewer")]
        [JsonConverter(typeof(CompositionTypeConverter))]
        public Viewer viewer { get; set; }
        #endregion
    }
    #endregion

    #region RefreshApplicationApiKeyInput
    public class RefreshApplicationApiKeyInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string apiKeyId { get; set; }

        [Required]
        [JsonRequired]
        public string applicationId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region RefreshApplicationApiKeyOutput
    public class RefreshApplicationApiKeyOutput
    {
        #region members
        [JsonProperty("apiKey")]
        public ApplicationApiKey apiKey { get; set; }

        [JsonProperty("application")]
        public Application application { get; set; }
        #endregion
    }
    #endregion

    #region RejectSignatureOrderInput
    public class RejectSignatureOrderInput
    {
        #region members
        [Required]
        [JsonRequired]
        public bool dummy { get; set; }

        public string reason { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region RejectSignatureOrderOutput
    public class RejectSignatureOrderOutput
    {
        #region members
        [JsonProperty("viewer")]
        [JsonConverter(typeof(CompositionTypeConverter))]
        public Viewer viewer { get; set; }
        #endregion
    }
    #endregion

    #region RetrySignatureOrderWebhookInput
    public class RetrySignatureOrderWebhookInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string retryPayload { get; set; }

        [Required]
        [JsonRequired]
        public string signatureOrderId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region RetrySignatureOrderWebhookOutput
    public class RetrySignatureOrderWebhookOutput
    {
        #region members
        [JsonProperty("invocation")]
        [JsonConverter(typeof(CompositionTypeConverter))]
        public WebhookInvocation invocation { get; set; }
        #endregion
    }
    #endregion

    #region SignActingAsInput
    public class SignActingAsInput
    {
        #region members
        [Required]
        [JsonRequired]
        public SignInput evidence { get; set; }

        [Required]
        [JsonRequired]
        public string signatoryId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignActingAsOutput
    public class SignActingAsOutput
    {
        #region members
        [JsonProperty("signatory")]
        public Signatory signatory { get; set; }

        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }
        #endregion
    }
    #endregion

    #region SignAllOfInput
    public class SignAllOfInput
    {
        #region members
        public SignCriiptoVerifyInput criiptoVerify { get; set; }

        public SignDrawableInput drawable { get; set; }

        public bool? noop { get; set; }

        public SignOidcInput oidc { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignCriiptoVerifyInput
    public class SignCriiptoVerifyInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string jwt { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignDocumentFormFieldInput
    public class SignDocumentFormFieldInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string field { get; set; }

        [Required]
        [JsonRequired]
        public string value { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignDocumentFormInput
    public class SignDocumentFormInput
    {
        #region members
        [Required]
        [JsonRequired]
        public List<SignDocumentFormFieldInput> fields { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignDocumentInput
    public class SignDocumentInput
    {
        #region members
        public SignDocumentFormInput form { get; set; }

        [Required]
        [JsonRequired]
        public string id { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignDrawableInput
    public class SignDrawableInput
    {
        #region members
        [Required]
        [JsonRequired]
        public byte[] image { get; set; }

        public string name { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignInput
    public class SignInput
    {
        #region members
        public SignAllOfInput allOf { get; set; }

        public SignCriiptoVerifyInput criiptoVerify { get; set; }

        public List<SignDocumentInput> documents { get; set; }

        public SignDrawableInput drawable { get; set; }

        /// <summary>
        /// EvidenceProvider id
        /// </summary>
        [Required]
        [JsonRequired]
        public string id { get; set; }

        public bool? noop { get; set; }

        public SignOidcInput oidc { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignOidcInput
    public class SignOidcInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string jwt { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignOutput
    public class SignOutput
    {
        #region members
        [JsonProperty("viewer")]
        [JsonConverter(typeof(CompositionTypeConverter))]
        public Viewer viewer { get; set; }
        #endregion
    }
    #endregion

    #region Signatory
    public class Signatory
    {
        #region members
        [JsonProperty("documents")]
        public SignatoryDocumentConnection documents { get; set; }

        /// <summary>
        /// A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention.
        /// </summary>
        [JsonProperty("downloadHref")]
        public string downloadHref { get; set; }

        [JsonProperty("evidenceProviders")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<SignatureEvidenceProvider> evidenceProviders { get; set; }

        /// <summary>
        /// A link to the signatures frontend, you can send this link to your users to enable them to sign your documents.
        /// </summary>
        [JsonProperty("href")]
        public string href { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("reference")]
        public string reference { get; set; }

        [JsonProperty("role")]
        public string role { get; set; }

        /// <summary>
        /// Signature order for the signatory.
        /// </summary>
        [JsonProperty("signatureOrder")]
        public SignatureOrder signatureOrder { get; set; }

        /// <summary>
        /// The current status of the signatory.
        /// </summary>
        [JsonProperty("status")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public SignatoryStatus status { get; set; }

        /// <summary>
        /// The reason for the signatory status (rejection reason when rejected).
        /// </summary>
        [JsonProperty("statusReason")]
        public string statusReason { get; set; }

        /// <summary>
        /// The signature frontend authentication token, only required if you need to build a custom url.
        /// </summary>
        [JsonProperty("token")]
        public string token { get; set; }

        [JsonProperty("ui")]
        public SignatureOrderUI ui { get; set; }
        #endregion
    }
    #endregion

    #region SignatoryBeaconInput
    public class SignatoryBeaconInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string lastActionAt { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignatoryBeaconOutput
    public class SignatoryBeaconOutput
    {
        #region members
        [JsonProperty("viewer")]
        [JsonConverter(typeof(CompositionTypeConverter))]
        public Viewer viewer { get; set; }
        #endregion
    }
    #endregion

    #region SignatoryDocumentConnection
    public class SignatoryDocumentConnection
    {
        #region members
        [JsonProperty("edges")]
        public List<SignatoryDocumentEdge> edges { get; set; }
        #endregion
    }
    #endregion

    #region SignatoryDocumentEdge
    public class SignatoryDocumentEdge
    {
        #region members
        [JsonProperty("node")]
        [JsonConverter(typeof(CompositionTypeConverter))]
        public Document node { get; set; }

        [JsonProperty("status")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public SignatoryDocumentStatus? status { get; set; }
        #endregion
    }
    #endregion

    #region SignatoryDocumentInput
    public class SignatoryDocumentInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string id { get; set; }

        /// <summary>
        /// Define custom position for PDF seal. Uses PDF coordinate system (bottom-left as 0,0). If defined for one signatory/document, must be defined for all.
        /// </summary>
        public PdfSealPosition pdfSealPosition { get; set; }

        public bool? preapproved { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion
    public enum SignatoryDocumentStatus
    {
        APPROVED,
        OPENED,
        PREAPPROVED,
        REJECTED,
        SIGNED,
        FUTURE_ADDED_VALUE = 999
    }


    #region SignatoryEvidenceProviderInput
    public class SignatoryEvidenceProviderInput
    {
        #region members
        public AllOfEvidenceProviderInput allOf { get; set; }

        /// <summary>
        /// Criipto Verify based evidence for signatures.
        /// </summary>
        public CriiptoVerifyProviderInput criiptoVerify { get; set; }

        /// <summary>
        /// Hand drawn signature evidence for signatures.
        /// </summary>
        public DrawableEvidenceProviderInput drawable { get; set; }

        [Required]
        [JsonRequired]
        public string id { get; set; }

        /// <summary>
        /// TEST environment only. Does not manipulate the PDF, use for integration or webhook testing.
        /// </summary>
        public NoopEvidenceProviderInput noop { get; set; }

        /// <summary>
        /// Deprecated
        /// </summary>
        public OidcEvidenceProviderInput oidc { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignatoryEvidenceValidationInput
    public class SignatoryEvidenceValidationInput
    {
        #region members
        public bool? boolean { get; set; }

        [Required]
        [JsonRequired]
        public string key { get; set; }

        public string value { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion
    public enum SignatoryFrontendEvent
    {
        DOWNLOAD_LINK_OPENED,
        SIGN_LINK_OPENED,
        FUTURE_ADDED_VALUE = 999
    }

    public enum SignatoryStatus
    {
        DELETED,
        ERROR,
        OPEN,
        REJECTED,
        SIGNED,
        FUTURE_ADDED_VALUE = 999
    }


    #region SignatoryUiInput
    public class SignatoryUiInput
    {
        #region members
        /// <summary>
        /// Removes the UI options to reject a document or signature order.
        /// </summary>
        public bool? disableRejection { get; set; }

        /// <summary>
        /// The language of texts rendered to the signatory.
        /// </summary>
        [JsonConverter(typeof(TolerantEnumConverter))]
        public Language? language { get; set; }

        /// <summary>
        /// Define a logo to be shown in the signatory UI.
        /// </summary>
        public SignatureOrderUiLogoInput logo { get; set; }

        /// <summary>
        /// Renders a UI layer for PDF annotations, such as links, making them interactive in the UI/browser
        /// </summary>
        public bool? renderPdfAnnotationLayer { get; set; }

        /// <summary>
        /// The signatory will be redirected to this URL after signing or rejected the signature order.
        /// </summary>
        public string signatoryRedirectUri { get; set; }

        /// <summary>
        /// Add stylesheet/css via an absolute HTTPS URL.
        /// </summary>
        public string stylesheet { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignatoryViewer
    public class SignatoryViewer : Viewer
    {
        #region members
        [JsonProperty("authenticated")]
        public bool authenticated { get; set; }

        [JsonProperty("documents")]
        public SignatoryDocumentConnection documents { get; set; }

        [JsonProperty("download")]
        public SignatoryViewerDownload download { get; set; }

        [JsonProperty("evidenceProviders")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<SignatureEvidenceProvider> evidenceProviders { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("signatoryId")]
        public string signatoryId { get; set; }

        [JsonProperty("signatureOrderStatus")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public SignatureOrderStatus signatureOrderStatus { get; set; }

        [JsonProperty("signer")]
        public bool signer { get; set; }

        [JsonProperty("status")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public SignatoryStatus status { get; set; }

        [JsonProperty("ui")]
        public SignatureOrderUI ui { get; set; }
        #endregion
    }
    #endregion

    #region SignatoryViewerDownload
    public class SignatoryViewerDownload
    {
        #region members
        [JsonProperty("documents")]
        public SignatoryDocumentConnection documents { get; set; }

        [JsonProperty("expired")]
        public bool expired { get; set; }

        [JsonProperty("verificationEvidenceProvider")]
        [JsonConverter(typeof(CompositionTypeConverter))]
        public SignatureEvidenceProvider verificationEvidenceProvider { get; set; }

        [JsonProperty("verificationRequired")]
        public bool verificationRequired { get; set; }
        #endregion
    }
    #endregion

    /// <summary>
    /// Represents a signature on a document.
    /// </summary>
    public interface Signature
    {
        [JsonProperty("signatory")]
        Signatory signatory { get; set; }
    }

    #region SignatureAppearanceInput
    public class SignatureAppearanceInput
    {
        #region members
        public List<SignatureAppearanceTemplateInput> displayName { get; set; }

        public List<SignatureAppearanceTemplateInput> footer { get; set; }

        public List<SignatureAppearanceTemplateInput> headerLeft { get; set; }

        /// <summary>
        /// Render evidence claim as identifier in the signature appearance inside the document. You can supply multiple keys and they will be tried in order. If no key is found a GUID will be rendered.
        /// </summary>
        [Required]
        [JsonRequired]
        public List<string> identifierFromEvidence { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignatureAppearanceTemplateInput
    public class SignatureAppearanceTemplateInput
    {
        #region members
        public List<SignatureAppearanceTemplateReplacementInput> replacements { get; set; }

        [Required]
        [JsonRequired]
        public string template { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignatureAppearanceTemplateReplacementInput
    public class SignatureAppearanceTemplateReplacementInput
    {
        #region members
        [Required]
        [JsonRequired]
        public List<string> fromEvidence { get; set; }

        [Required]
        [JsonRequired]
        public string placeholder { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    public interface SignatureEvidenceProvider
    {
        [JsonProperty("id")]
        string id { get; set; }
    }

    #region SignatureOrder
    public class SignatureOrder
    {
        #region members
        [JsonProperty("application")]
        public Application application { get; set; }

        [JsonProperty("closedAt")]
        public string closedAt { get; set; }

        [JsonProperty("createdAt")]
        public string createdAt { get; set; }

        [JsonProperty("documents")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<Document> documents { get; set; }

        [JsonProperty("evidenceProviders")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<SignatureEvidenceProvider> evidenceProviders { get; set; }

        [JsonProperty("expiresAt")]
        public string expiresAt { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        /// <summary>
        /// List of signatories for the signature order.
        /// </summary>
        [JsonProperty("signatories")]
        public List<Signatory> signatories { get; set; }

        [JsonProperty("status")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public SignatureOrderStatus status { get; set; }

        /// <summary>
        /// Tenants are only accessable from user viewers
        /// </summary>
        [JsonProperty("tenant")]
        public Tenant tenant { get; set; }

        [JsonProperty("timezone")]
        public string timezone { get; set; }

        [JsonProperty("title")]
        public string title { get; set; }

        [JsonProperty("ui")]
        public SignatureOrderUI ui { get; set; }

        [JsonProperty("webhook")]
        public SignatureOrderWebhook webhook { get; set; }
        #endregion
    }
    #endregion

    #region SignatureOrderConnection
    /// <summary>
    /// A connection from an object to a list of objects of type SignatureOrder
    /// </summary>
    public class SignatureOrderConnection
    {
        #region members
        /// <summary>
        /// Information to aid in pagination.
        /// </summary>
        [JsonProperty("edges")]
        public List<SignatureOrderEdge> edges { get; set; }

        /// <summary>
        /// Information to aid in pagination.
        /// </summary>
        [JsonProperty("pageInfo")]
        public PageInfo pageInfo { get; set; }

        /// <summary>
        /// A count of the total number of objects in this connection, ignoring pagination. This allows a client to fetch the first five objects by passing \"5\" as the argument to `first`, then fetch the total count so it could display \"5 of 83\", for example. In cases where we employ infinite scrolling or don't have an exact count of entries, this field will return `null`.
        /// </summary>
        [JsonProperty("totalCount")]
        public int? totalCount { get; set; }
        #endregion
    }
    #endregion

    #region SignatureOrderEdge
    /// <summary>
    /// An edge in a connection from an object to another object of type SignatureOrder
    /// </summary>
    public class SignatureOrderEdge
    {
        #region members
        /// <summary>
        /// A cursor for use in pagination
        /// </summary>
        [JsonProperty("cursor")]
        public string cursor { get; set; }

        /// <summary>
        /// The item at the end of the edge. Must NOT be an enumerable collection.
        /// </summary>
        [JsonProperty("node")]
        public SignatureOrder node { get; set; }
        #endregion
    }
    #endregion
    public enum SignatureOrderStatus
    {
        CANCELLED,
        CLOSED,
        EXPIRED,
        OPEN,
        FUTURE_ADDED_VALUE = 999
    }


    #region SignatureOrderUI
    public class SignatureOrderUI
    {
        #region members
        [JsonProperty("disableRejection")]
        public bool disableRejection { get; set; }

        [JsonProperty("language")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public Language language { get; set; }

        [JsonProperty("logo")]
        public SignatureOrderUILogo logo { get; set; }

        [JsonProperty("renderPdfAnnotationLayer")]
        public bool renderPdfAnnotationLayer { get; set; }

        [JsonProperty("signatoryRedirectUri")]
        public string signatoryRedirectUri { get; set; }

        [JsonProperty("stylesheet")]
        public string stylesheet { get; set; }
        #endregion
    }
    #endregion

    #region SignatureOrderUILogo
    public class SignatureOrderUILogo
    {
        #region members
        [JsonProperty("href")]
        public string href { get; set; }

        [JsonProperty("src")]
        public string src { get; set; }
        #endregion
    }
    #endregion

    #region SignatureOrderUiLogoInput
    public class SignatureOrderUiLogoInput
    {
        #region members
        /// <summary>
        /// Turns your logo into a link with the defined href.
        /// </summary>
        public string href { get; set; }

        /// <summary>
        /// The image source for the logo. Must be an absolute HTTPS URL or a valid data: url
        /// </summary>
        [Required]
        [JsonRequired]
        public string src { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region SignatureOrderWebhook
    public class SignatureOrderWebhook
    {
        #region members
        [JsonProperty("logs")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<WebhookInvocation> logs { get; set; }

        [JsonProperty("url")]
        public string url { get; set; }
        #endregion
    }
    #endregion

    #region SingleEvidenceProviderInput
    /// <summary>
    /// Must define a evidence provider subsection.
    /// </summary>
    public class SingleEvidenceProviderInput
    {
        #region members
        /// <summary>
        /// Criipto Verify based evidence for signatures.
        /// </summary>
        public CriiptoVerifyProviderInput criiptoVerify { get; set; }

        /// <summary>
        /// Hand drawn signature evidence for signatures.
        /// </summary>
        public DrawableEvidenceProviderInput drawable { get; set; }

        /// <summary>
        /// TEST environment only. Does not manipulate the PDF, use for integration or webhook testing.
        /// </summary>
        public NoopEvidenceProviderInput noop { get; set; }

        /// <summary>
        /// Deprecated
        /// </summary>
        public OidcEvidenceProviderInput oidc { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    public interface SingleSignature
    {
        [JsonProperty("signatory")]
        Signatory signatory { get; set; }
    }

    public interface SingleSignatureEvidenceProvider
    {
        [JsonProperty("id")]
        string id { get; set; }
    }

    #region Tenant
    public class Tenant
    {
        #region members
        [JsonProperty("applications")]
        public List<Application> applications { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("webhookLogs")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<WebhookInvocation> webhookLogs { get; set; }
        #endregion
    }
    #endregion

    #region TrackSignatoryInput
    public class TrackSignatoryInput
    {
        #region members
        [Required]
        [JsonRequired]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public SignatoryFrontendEvent @event { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region TrackSignatoryOutput
    public class TrackSignatoryOutput
    {
        #region members
        [JsonProperty("viewer")]
        [JsonConverter(typeof(CompositionTypeConverter))]
        public Viewer viewer { get; set; }
        #endregion
    }
    #endregion

    #region UnvalidatedSignatoryViewer
    public class UnvalidatedSignatoryViewer : Viewer
    {
        #region members
        [JsonProperty("authenticated")]
        public bool authenticated { get; set; }

        [JsonProperty("download")]
        public SignatoryViewerDownload download { get; set; }

        [JsonProperty("evidenceProviders")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<SignatureEvidenceProvider> evidenceProviders { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("signatoryId")]
        public string signatoryId { get; set; }

        [JsonProperty("ui")]
        public SignatureOrderUI ui { get; set; }
        #endregion
    }
    #endregion

    #region UpdateSignatoryDocumentStatusInput
    public class UpdateSignatoryDocumentStatusInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string documentId { get; set; }

        [Required]
        [JsonRequired]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public SignatoryDocumentStatus status { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region UpdateSignatoryDocumentStatusOutput
    public class UpdateSignatoryDocumentStatusOutput
    {
        #region members
        [JsonProperty("documentEdge")]
        public SignatoryDocumentEdge documentEdge { get; set; }

        [JsonProperty("viewer")]
        [JsonConverter(typeof(CompositionTypeConverter))]
        public Viewer viewer { get; set; }
        #endregion
    }
    #endregion

    #region UserViewer
    public class UserViewer : Viewer
    {
        #region members
        [JsonProperty("authenticated")]
        public bool authenticated { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("tenants")]
        public List<Tenant> tenants { get; set; }
        #endregion
    }
    #endregion

    #region ValidateDocumentInput
    public class ValidateDocumentInput
    {
        #region members
        public byte[] pdf { get; set; }

        public byte[] xml { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region ValidateDocumentOutput
    public class ValidateDocumentOutput
    {
        #region members
        [JsonProperty("errors")]
        public List<string> errors { get; set; }

        /// <summary>
        /// Whether or not the errors are fixable using 'fixDocumentFormattingErrors'
        /// </summary>
        [JsonProperty("fixable")]
        public bool? fixable { get; set; }

        [JsonProperty("valid")]
        public bool valid { get; set; }
        #endregion
    }
    #endregion

    #region VerifyApplication
    public class VerifyApplication
    {
        #region members
        [JsonProperty("domain")]
        public string domain { get; set; }

        [JsonProperty("environment")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public VerifyApplicationEnvironment environment { get; set; }

        [JsonProperty("realm")]
        public string realm { get; set; }
        #endregion
    }
    #endregion
    public enum VerifyApplicationEnvironment
    {
        PRODUCTION,
        TEST,
        FUTURE_ADDED_VALUE = 999
    }


    #region VerifyApplicationQueryInput
    public class VerifyApplicationQueryInput
    {
        #region members
        [Required]
        [JsonRequired]
        public string domain { get; set; }

        [Required]
        [JsonRequired]
        public string realm { get; set; }

        [Required]
        [JsonRequired]
        public string tenantId { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    public interface Viewer
    {
        [JsonProperty("id")]
        string id { get; set; }
    }

    #region WebhookExceptionInvocation
    public class WebhookExceptionInvocation : WebhookInvocation
    {
        #region members
        [JsonProperty("correlationId")]
        public string correlationId { get; set; }

        [JsonProperty("event")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public WebhookInvocationEvent? @event { get; set; }

        [JsonProperty("exception")]
        public string exception { get; set; }

        [JsonProperty("requestBody")]
        public string requestBody { get; set; }

        [JsonProperty("responseBody")]
        public string responseBody { get; set; }

        [JsonProperty("retryPayload")]
        public string retryPayload { get; set; }

        [JsonProperty("retryingAt")]
        public string retryingAt { get; set; }

        [JsonProperty("signatureOrderId")]
        public string signatureOrderId { get; set; }

        [JsonProperty("timestamp")]
        public string timestamp { get; set; }

        [JsonProperty("url")]
        public string url { get; set; }
        #endregion
    }
    #endregion

    #region WebhookHttpErrorInvocation
    public class WebhookHttpErrorInvocation : WebhookInvocation
    {
        #region members
        [JsonProperty("correlationId")]
        public string correlationId { get; set; }

        [JsonProperty("event")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public WebhookInvocationEvent? @event { get; set; }

        [JsonProperty("requestBody")]
        public string requestBody { get; set; }

        [JsonProperty("responseBody")]
        public string responseBody { get; set; }

        [JsonProperty("responseStatusCode")]
        public int responseStatusCode { get; set; }

        [JsonProperty("retryPayload")]
        public string retryPayload { get; set; }

        [JsonProperty("retryingAt")]
        public string retryingAt { get; set; }

        [JsonProperty("signatureOrderId")]
        public string signatureOrderId { get; set; }

        [JsonProperty("timestamp")]
        public string timestamp { get; set; }

        [JsonProperty("url")]
        public string url { get; set; }
        #endregion
    }
    #endregion

    public interface WebhookInvocation
    {
        [JsonProperty("correlationId")]
        string correlationId { get; set; }

        [JsonProperty("event")]
        WebhookInvocationEvent? @event { get; set; }

        [JsonProperty("requestBody")]
        string requestBody { get; set; }

        [JsonProperty("responseBody")]
        string responseBody { get; set; }

        [JsonProperty("signatureOrderId")]
        string signatureOrderId { get; set; }

        [JsonProperty("timestamp")]
        string timestamp { get; set; }

        [JsonProperty("url")]
        string url { get; set; }
    }
    public enum WebhookInvocationEvent
    {
        SIGNATORY_DOCUMENT_STATUS_CHANGED,
        SIGNATORY_DOWNLOAD_LINK_OPENED,
        SIGNATORY_REJECTED,
        SIGNATORY_SIGNED,
        SIGNATORY_SIGN_ERROR,
        SIGNATORY_SIGN_LINK_OPENED,
        SIGNATURE_ORDER_EXPIRED,
        FUTURE_ADDED_VALUE = 999
    }


    #region WebhookSuccessfulInvocation
    public class WebhookSuccessfulInvocation : WebhookInvocation
    {
        #region members
        [JsonProperty("correlationId")]
        public string correlationId { get; set; }

        [JsonProperty("event")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public WebhookInvocationEvent? @event { get; set; }

        [JsonProperty("requestBody")]
        public string requestBody { get; set; }

        [JsonProperty("responseBody")]
        public string responseBody { get; set; }

        [JsonProperty("responseStatusCode")]
        public int responseStatusCode { get; set; }

        [JsonProperty("signatureOrderId")]
        public string signatureOrderId { get; set; }

        [JsonProperty("timestamp")]
        public string timestamp { get; set; }

        [JsonProperty("url")]
        public string url { get; set; }
        #endregion
    }
    #endregion

    #region WebhookTimeoutInvocation
    public class WebhookTimeoutInvocation : WebhookInvocation
    {
        #region members
        [JsonProperty("correlationId")]
        public string correlationId { get; set; }

        [JsonProperty("event")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public WebhookInvocationEvent? @event { get; set; }

        [JsonProperty("requestBody")]
        public string requestBody { get; set; }

        [JsonProperty("responseBody")]
        public string responseBody { get; set; }

        [JsonProperty("responseTimeout")]
        public int responseTimeout { get; set; }

        [JsonProperty("retryPayload")]
        public string retryPayload { get; set; }

        [JsonProperty("retryingAt")]
        public string retryingAt { get; set; }

        [JsonProperty("signatureOrderId")]
        public string signatureOrderId { get; set; }

        [JsonProperty("timestamp")]
        public string timestamp { get; set; }

        [JsonProperty("url")]
        public string url { get; set; }
        #endregion
    }
    #endregion

    #region XadesDocumentInput
    public class XadesDocumentInput
    {
        #region members
        [Required]
        [JsonRequired]
        public byte[] blob { get; set; }

        /// <summary>
        /// Will not be displayed to signatories, can be used as a reference to your own system.
        /// </summary>
        public string reference { get; set; }

        [Required]
        [JsonRequired]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public DocumentStorageMode storageMode { get; set; }

        [Required]
        [JsonRequired]
        public string title { get; set; }
        #endregion

        #region methods
        public dynamic GetInputObject()
        {
            IDictionary<string, object> d = new System.Dynamic.ExpandoObject();

            var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (var propertyInfo in properties)
            {
                var value = propertyInfo.GetValue(this);
                var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;

                var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;

                if (requiredProp || value != defaultValue)
                {
                    d[propertyInfo.Name] = value;
                }
            }
            return d;
        }
        #endregion
    }
    #endregion

    #region XmlDocument
    public class XmlDocument : Document
    {
        #region members
        [JsonProperty("blob")]
        public byte[] blob { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        [JsonProperty("originalBlob")]
        public byte[] originalBlob { get; set; }

        [JsonProperty("reference")]
        public string reference { get; set; }

        [JsonProperty("signatoryViewerStatus")]
        [JsonConverter(typeof(TolerantEnumConverter))]
        public SignatoryDocumentStatus? signatoryViewerStatus { get; set; }

        [JsonProperty("signatures")]
        [JsonConverter(typeof(CompositionTypeListConverter))]
        public List<Signature> signatures { get; set; }

        [JsonProperty("title")]
        public string title { get; set; }
        #endregion
    }
    #endregion
}
