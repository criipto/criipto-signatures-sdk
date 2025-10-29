#pragma warning disable CS8625
#pragma warning disable CA1052
#pragma warning disable CA2211
using GraphQL;

namespace Criipto.Signatures
{
    public class CreateSignatureOrderMutation
    {
        /// <summary>
        /// CreateSignatureOrderMutation.Request
        /// <para>Required variables:<br/> { input=(CreateSignatureOrderInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = CreateSignatureOrderDocument,
                OperationName = "createSignatureOrder",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getCreateSignatureOrderMutation()
        {
            return Request();
        }

        public static string CreateSignatureOrderDocument =
            @"
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
        }";
    }

    public class CleanupSignatureOrderMutation
    {
        /// <summary>
        /// CleanupSignatureOrderMutation.Request
        /// <para>Required variables:<br/> { input=(CleanupSignatureOrderInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = CleanupSignatureOrderDocument,
                OperationName = "cleanupSignatureOrder",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getCleanupSignatureOrderMutation()
        {
            return Request();
        }

        public static string CleanupSignatureOrderDocument =
            @"
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
        }";
    }

    public class AddSignatoryMutation
    {
        /// <summary>
        /// AddSignatoryMutation.Request
        /// <para>Required variables:<br/> { input=(AddSignatoryInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = AddSignatoryDocument,
                OperationName = "addSignatory",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getAddSignatoryMutation()
        {
            return Request();
        }

        public static string AddSignatoryDocument =
            @"
        mutation addSignatory($input: AddSignatoryInput!) {
          addSignatory(input: $input) {
            signatory {
              ...BasicSignatory
            }
          }
        }
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
        }";
    }

    public class AddSignatoriesMutation
    {
        /// <summary>
        /// AddSignatoriesMutation.Request
        /// <para>Required variables:<br/> { input=(AddSignatoriesInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = AddSignatoriesDocument,
                OperationName = "addSignatories",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getAddSignatoriesMutation()
        {
            return Request();
        }

        public static string AddSignatoriesDocument =
            @"
        mutation addSignatories($input: AddSignatoriesInput!) {
          addSignatories(input: $input) {
            signatories {
              ...BasicSignatory
            }
          }
        }
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
        }";
    }

    public class ChangeSignatoryMutation
    {
        /// <summary>
        /// ChangeSignatoryMutation.Request
        /// <para>Required variables:<br/> { input=(ChangeSignatoryInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = ChangeSignatoryDocument,
                OperationName = "changeSignatory",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getChangeSignatoryMutation()
        {
            return Request();
        }

        public static string ChangeSignatoryDocument =
            @"
        mutation changeSignatory($input: ChangeSignatoryInput!) {
          changeSignatory(input: $input) {
            signatory {
              ...BasicSignatory
            }
          }
        }
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
        }";
    }

    public class CloseSignatureOrderMutation
    {
        /// <summary>
        /// CloseSignatureOrderMutation.Request
        /// <para>Required variables:<br/> { input=(CloseSignatureOrderInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = CloseSignatureOrderDocument,
                OperationName = "closeSignatureOrder",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getCloseSignatureOrderMutation()
        {
            return Request();
        }

        public static string CloseSignatureOrderDocument =
            @"
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
        }";
    }

    public class CancelSignatureOrderMutation
    {
        /// <summary>
        /// CancelSignatureOrderMutation.Request
        /// <para>Required variables:<br/> { input=(CancelSignatureOrderInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = CancelSignatureOrderDocument,
                OperationName = "cancelSignatureOrder",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getCancelSignatureOrderMutation()
        {
            return Request();
        }

        public static string CancelSignatureOrderDocument =
            @"
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
        }";
    }

    public class SignActingAsMutation
    {
        /// <summary>
        /// SignActingAsMutation.Request
        /// <para>Required variables:<br/> { input=(SignActingAsInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = SignActingAsDocument,
                OperationName = "signActingAs",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getSignActingAsMutation()
        {
            return Request();
        }

        public static string SignActingAsDocument =
            @"
        mutation signActingAs($input: SignActingAsInput!) {
          signActingAs(input: $input) {
            signatory {
              ...BasicSignatory
            }
          }
        }
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
        }";
    }

    public class ValidateDocumentMutation
    {
        /// <summary>
        /// ValidateDocumentMutation.Request
        /// <para>Required variables:<br/> { input=(ValidateDocumentInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = ValidateDocumentDocument,
                OperationName = "validateDocument",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getValidateDocumentMutation()
        {
            return Request();
        }

        public static string ValidateDocumentDocument =
            @"
        mutation validateDocument($input: ValidateDocumentInput!) {
          validateDocument(input: $input) {
            valid
            errors
            fixable
          }
        }
        ";
    }

    public class ExtendSignatureOrderMutation
    {
        /// <summary>
        /// ExtendSignatureOrderMutation.Request
        /// <para>Required variables:<br/> { input=(ExtendSignatureOrderInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = ExtendSignatureOrderDocument,
                OperationName = "extendSignatureOrder",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getExtendSignatureOrderMutation()
        {
            return Request();
        }

        public static string ExtendSignatureOrderDocument =
            @"
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
        }";
    }

    public class DeleteSignatoryMutation
    {
        /// <summary>
        /// DeleteSignatoryMutation.Request
        /// <para>Required variables:<br/> { input=(DeleteSignatoryInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = DeleteSignatoryDocument,
                OperationName = "deleteSignatory",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getDeleteSignatoryMutation()
        {
            return Request();
        }

        public static string DeleteSignatoryDocument =
            @"
        mutation deleteSignatory($input: DeleteSignatoryInput!) {
          deleteSignatory(input: $input) {
            signatureOrder {
              ...BasicSignatureOrder
            }
          }
        }
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
        }";
    }

    public class CreateBatchSignatoryMutation
    {
        /// <summary>
        /// CreateBatchSignatoryMutation.Request
        /// <para>Required variables:<br/> { input=(CreateBatchSignatoryInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = CreateBatchSignatoryDocument,
                OperationName = "createBatchSignatory",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getCreateBatchSignatoryMutation()
        {
            return Request();
        }

        public static string CreateBatchSignatoryDocument =
            @"
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
        fragment BasicBatchSignatory on BatchSignatory {
          id
          token
          href
        }";
    }

    public class ChangeSignatureOrderMutation
    {
        /// <summary>
        /// ChangeSignatureOrderMutation.Request
        /// <para>Required variables:<br/> { input=(ChangeSignatureOrderInput) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = ChangeSignatureOrderDocument,
                OperationName = "changeSignatureOrder",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getChangeSignatureOrderMutation()
        {
            return Request();
        }

        public static string ChangeSignatureOrderDocument =
            @"
        mutation changeSignatureOrder($input: ChangeSignatureOrderInput!) {
          changeSignatureOrder(input: $input) {
            signatureOrder {
              ...BasicSignatureOrder
            }
          }
        }
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
        }";
    }

    public class SignatureOrderQuery
    {
        /// <summary>
        /// SignatureOrderQuery.Request
        /// <para>Required variables:<br/> { id=(string) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = SignatureOrderDocument,
                OperationName = "signatureOrder",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getSignatureOrderQuery()
        {
            return Request();
        }

        public static string SignatureOrderDocument =
            @"
        query signatureOrder($id: ID!) {
          signatureOrder(id: $id) {
            ...BasicSignatureOrder
          }
        }
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
        }";
    }

    public class SignatureOrderWithDocumentsQuery
    {
        /// <summary>
        /// SignatureOrderWithDocumentsQuery.Request
        /// <para>Required variables:<br/> { id=(string) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = SignatureOrderWithDocumentsDocument,
                OperationName = "signatureOrderWithDocuments",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getSignatureOrderWithDocumentsQuery()
        {
            return Request();
        }

        public static string SignatureOrderWithDocumentsDocument =
            @"
        query signatureOrderWithDocuments($id: ID!) {
          signatureOrder(id: $id) {
            ...BasicSignatureOrder
            documents {
              ...BasicDocument
              ...SignedDocument
            }
          }
        }
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
        }";
    }

    public class SignatoryQuery
    {
        /// <summary>
        /// SignatoryQuery.Request
        /// <para>Required variables:<br/> { id=(string) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = SignatoryDocument,
                OperationName = "signatory",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getSignatoryQuery()
        {
            return Request();
        }

        public static string SignatoryDocument =
            @"
        query signatory($id: ID!) {
          signatory(id: $id) {
            signatureOrder {
              ...BasicSignatureOrder
            }
            ...BasicSignatory
          }
        }
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
        }";
    }

    public class SignatureOrdersQuery
    {
        /// <summary>
        /// SignatureOrdersQuery.Request
        /// <para>Required variables:<br/> { first=(int) }</para>
        /// <para>Optional variables:<br/> { status=(SignatureOrderStatus), after=(string) }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = SignatureOrdersDocument,
                OperationName = "signatureOrders",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getSignatureOrdersQuery()
        {
            return Request();
        }

        public static string SignatureOrdersDocument =
            @"
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
        }";
    }

    public class BatchSignatoryQuery
    {
        /// <summary>
        /// BatchSignatoryQuery.Request
        /// <para>Required variables:<br/> { id=(string) }</para>
        /// <para>Optional variables:<br/> {  }</para>
        /// </summary>
        public static GraphQLRequest Request(object variables = null)
        {
            return new GraphQLRequest
            {
                Query = BatchSignatoryDocument,
                OperationName = "batchSignatory",
                Variables = variables,
            };
        }

        /// <remarks>This method is obsolete. Use Request instead.</remarks>
        public static GraphQLRequest getBatchSignatoryQuery()
        {
            return Request();
        }

        public static string BatchSignatoryDocument =
            @"
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
        fragment BasicBatchSignatory on BatchSignatory {
          id
          token
          href
        }";
    }
}
