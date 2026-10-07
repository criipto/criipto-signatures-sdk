#pragma warning disable CA1002

using Criipto.Signatures.Models;

namespace Criipto.Signatures;

/// <summary>
/// Client for the Criipto Signatures API, implemented by <see cref="CriiptoSignaturesClient"/>.
/// Depend on this interface to register the client with dependency injection or to mock it in tests.
/// </summary>
/// <remarks>
/// New members may be added to this interface in minor releases as the API grows.
/// Implement it with a mocking library rather than a hand-written class if you want to avoid compile errors on upgrade.
/// </remarks>
public interface ICriiptoSignaturesClient
{
    Task<SignatureOrder> CreateSignatureOrder(
        CreateSignatureOrderInput input,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> AddSignatory(
        AddSignatoryInput input,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> AddSignatory(
        SignatureOrder signatureOrder,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> AddSignatory(
        SignatureOrder signatureOrder,
        AddSignatoryInput input,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> AddSignatory(
        string signatureOrderId,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> AddSignatory(
        string signatureOrderId,
        AddSignatoryInput input,
        CancellationToken cancellationToken = default
    );

    Task<List<Signatory>> AddSignatories(
        AddSignatoriesInput input,
        CancellationToken cancellationToken = default
    );

    Task<List<Signatory>> AddSignatories(
        SignatureOrder signatureOrder,
        List<CreateSignatureOrderSignatoryInput> signatories,
        CancellationToken cancellationToken = default
    );

    Task<List<Signatory>> AddSignatories(
        string signatureOrderId,
        List<CreateSignatureOrderSignatoryInput> signatories,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> ChangeSignatory(
        ChangeSignatoryInput input,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> ChangeSignatory(
        Signatory signatory,
        ChangeSignatoryInput input,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> ChangeSignatory(
        string signatoryId,
        ChangeSignatoryInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> ExtendSignatureOrder(
        ExtendSignatureOrderInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> ExtendSignatureOrder(
        SignatureOrder signatureOrder,
        ExtendSignatureOrderInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CloseSignatureOrder(
        CloseSignatureOrderInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CloseSignatureOrder(
        SignatureOrder signatureOrder,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CloseSignatureOrder(
        SignatureOrder signatureOrder,
        CloseSignatureOrderInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CloseSignatureOrder(
        string signatureOrderId,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CloseSignatureOrder(
        string signatureOrderId,
        CloseSignatureOrderInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CancelSignatureOrder(
        CancelSignatureOrderInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CancelSignatureOrder(
        SignatureOrder signatureOrder,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CancelSignatureOrder(
        string signatureOrderId,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CleanupSignatureOrder(
        CleanupSignatureOrderInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CleanupSignatureOrder(
        SignatureOrder signatureOrder,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> CleanupSignatureOrder(
        string signatureOrderId,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> SignActingAs(
        SignActingAsInput input,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> SignActingAs(
        Signatory signatory,
        SignActingAsInput input,
        CancellationToken cancellationToken = default
    );

    Task<Signatory> SignActingAs(
        string signatoryId,
        SignActingAsInput input,
        CancellationToken cancellationToken = default
    );

    Task<ValidateDocumentOutput> ValidateDocument(
        ValidateDocumentInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> DeleteSignatory(
        DeleteSignatoryInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> DeleteSignatory(
        string signatureOrderId,
        string signatoryId,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> DeleteSignatory(
        Signatory signatory,
        CancellationToken cancellationToken = default
    );

    Task<BatchSignatory> CreateBatchSignatory(
        CreateBatchSignatoryInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder> ChangeSignatureOrder(
        ChangeSignatureOrderInput input,
        CancellationToken cancellationToken = default
    );

    Task<SignatureOrder?> QuerySignatureOrder(
        string signatureOrderId,
        bool includeDocuments = false,
        CancellationToken cancellationToken = default
    );

    Task<Signatory?> QuerySignatory(
        string signatoryId,
        CancellationToken cancellationToken = default
    );

    Task<BatchSignatory?> QueryBatchSignatory(
        string batchSignatoryId,
        CancellationToken cancellationToken = default
    );
}
