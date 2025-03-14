#pragma warning disable CA1002

using System.Net.Http.Headers;
using Criipto.Signatures.Models;
using GraphQL.Client.Abstractions;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;

namespace Criipto.Signatures;

public class CriiptoSignaturesClient : IDisposable
{
    private readonly GraphQLHttpClient graphQLClient;
    private bool isDisposed;

    public CriiptoSignaturesClient(string clientId, string clientSecret, string criiptoSdk)
    {
        this.graphQLClient = new GraphQLHttpClient(
            "https://signatures-api.criipto.com/v1/graphql",
            new NewtonsoftJsonSerializer()
        );

        this.graphQLClient.HttpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Basic",
                Convert.ToBase64String(
                    System.Text.Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}")
                )
            );
        this.graphQLClient.HttpClient.DefaultRequestHeaders.Add("Criipto-Sdk", criiptoSdk);
    }

    public CriiptoSignaturesClient(string clientId, string clientSecret)
        : this(clientId, clientSecret, "criipto-signatures-dotnet") { }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (this.isDisposed)
            return;

        if (disposing)
        {
            this.graphQLClient.Dispose();
        }

        this.isDisposed = true;
    }

    private async Task<TResponse> SendMutation<TResponse>(
        GraphQL.GraphQLRequest request,
        Func<TResponse> defineResponseType,
        CancellationToken cancellationToken = default
    )
    {
        var response = await graphQLClient
            .SendMutationAsync(request, defineResponseType, cancellationToken)
            .ConfigureAwait(false);

        if (response.Errors?.Length > 0)
        {
            throw new GraphQLException(response.Errors[0].Message);
        }

        return response.Data;
    }

    public async Task<SignatureOrder> CreateSignatureOrder(
        CreateSignatureOrderInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        var data = await SendMutation(
                CreateSignatureOrderMutation.Request(new { input = input }),
                () => new { createSignatureOrder = new CreateSignatureOrderOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.createSignatureOrder.signatureOrder;
    }

    public async Task<Signatory> AddSignatory(
        AddSignatoryInput input,
        CancellationToken cancellationToken = default
    )
    {
        var data = await SendMutation(
                AddSignatoryMutation.Request(new { input = input }),
                () => new { addSignatory = new AddSignatoryOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.addSignatory.signatory;
    }

    public async Task<Signatory> AddSignatory(
        SignatureOrder signatureOrder,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrder == null)
            throw new ArgumentNullException(nameof(signatureOrder));

        var input = new AddSignatoryInput();
        input.signatureOrderId = signatureOrder.id;
        return await AddSignatory(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<Signatory> AddSignatory(
        SignatureOrder signatureOrder,
        AddSignatoryInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrder == null)
            throw new ArgumentNullException(nameof(signatureOrder));
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        input.signatureOrderId = signatureOrder.id;
        return await AddSignatory(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<Signatory> AddSignatory(
        string signatureOrderId,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrderId == null)
            throw new ArgumentNullException(nameof(signatureOrderId));

        var input = new AddSignatoryInput();
        input.signatureOrderId = signatureOrderId;
        return await AddSignatory(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<Signatory> AddSignatory(
        string signatureOrderId,
        AddSignatoryInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrderId == null)
            throw new ArgumentNullException(nameof(signatureOrderId));
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        input.signatureOrderId = signatureOrderId;
        return await AddSignatory(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<List<Signatory>> AddSignatories(
        AddSignatoriesInput input,
        CancellationToken cancellationToken = default
    )
    {
        var data = await SendMutation(
                AddSignatoriesMutation.Request(new { input = input }),
                () => new { addSignatories = new AddSignatoriesOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.addSignatories.signatories;
    }

    public async Task<List<Signatory>> AddSignatories(
        SignatureOrder signatureOrder,
        List<CreateSignatureOrderSignatoryInput> signatories,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrder == null)
            throw new ArgumentNullException(nameof(signatureOrder));
        if (signatories == null)
            throw new ArgumentNullException(nameof(signatories));

        var input = new AddSignatoriesInput();
        input.signatureOrderId = signatureOrder.id;
        input.signatories = signatories;
        return await AddSignatories(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<List<Signatory>> AddSignatories(
        string signatureOrderId,
        List<CreateSignatureOrderSignatoryInput> signatories,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrderId == null)
            throw new ArgumentNullException(nameof(signatureOrderId));
        if (signatories == null)
            throw new ArgumentNullException(nameof(signatories));

        var input = new AddSignatoriesInput();
        input.signatureOrderId = signatureOrderId;
        input.signatories = signatories;
        return await AddSignatories(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<Signatory> ChangeSignatory(
        ChangeSignatoryInput input,
        CancellationToken cancellationToken = default
    )
    {
        var data = await SendMutation(
                ChangeSignatoryMutation.Request(new { input = input }),
                () => new { changeSignatory = new ChangeSignatoryOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.changeSignatory.signatory;
    }

    public async Task<Signatory> ChangeSignatory(
        Signatory signatory,
        ChangeSignatoryInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (signatory == null)
            throw new ArgumentNullException(nameof(signatory));
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        input.signatoryId = signatory.id;
        return await ChangeSignatory(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<Signatory> ChangeSignatory(
        string signatoryId,
        ChangeSignatoryInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (signatoryId == null)
            throw new ArgumentNullException(nameof(signatoryId));
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        input.signatoryId = signatoryId;
        return await ChangeSignatory(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> ExtendSignatureOrder(
        ExtendSignatureOrderInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        var data = await SendMutation(
                ExtendSignatureOrderMutation.Request(new { input = input }),
                () => new { extendSignatureOrder = new ExtendSignatureOrderOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.extendSignatureOrder.signatureOrder;
    }

    public async Task<SignatureOrder> ExtendSignatureOrder(
        SignatureOrder signatureOrder,
        ExtendSignatureOrderInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrder == null)
            throw new ArgumentNullException(nameof(signatureOrder));
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        input.signatureOrderId = signatureOrder.id;
        return await ExtendSignatureOrder(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CloseSignatureOrder(
        CloseSignatureOrderInput input,
        CancellationToken cancellationToken = default
    )
    {
        var data = await SendMutation(
                CloseSignatureOrderMutation.Request(new { input = input }),
                () => new { closeSignatureOrder = new CloseSignatureOrderOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.closeSignatureOrder.signatureOrder;
    }

    public async Task<SignatureOrder> CloseSignatureOrder(
        SignatureOrder signatureOrder,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrder == null)
            throw new ArgumentNullException(nameof(signatureOrder));

        var input = new CloseSignatureOrderInput();
        input.signatureOrderId = signatureOrder.id;
        return await CloseSignatureOrder(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CloseSignatureOrder(
        SignatureOrder signatureOrder,
        CloseSignatureOrderInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrder == null)
            throw new ArgumentNullException(nameof(signatureOrder));
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        input.signatureOrderId = signatureOrder.id;
        return await CloseSignatureOrder(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CloseSignatureOrder(
        string signatureOrderId,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrderId == null)
            throw new ArgumentNullException(nameof(signatureOrderId));

        var input = new CloseSignatureOrderInput();
        input.signatureOrderId = signatureOrderId;
        return await CloseSignatureOrder(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CloseSignatureOrder(
        string signatureOrderId,
        CloseSignatureOrderInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrderId == null)
            throw new ArgumentNullException(nameof(signatureOrderId));
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        input.signatureOrderId = signatureOrderId;
        return await CloseSignatureOrder(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CancelSignatureOrder(
        CancelSignatureOrderInput input,
        CancellationToken cancellationToken = default
    )
    {
        var data = await SendMutation(
                CancelSignatureOrderMutation.Request(new { input = input }),
                () => new { cancelSignatureOrder = new CancelSignatureOrderOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.cancelSignatureOrder.signatureOrder;
    }

    public async Task<SignatureOrder> CancelSignatureOrder(
        SignatureOrder signatureOrder,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrder == null)
            throw new ArgumentNullException(nameof(signatureOrder));

        var input = new CancelSignatureOrderInput();
        input.signatureOrderId = signatureOrder.id;
        return await CancelSignatureOrder(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CancelSignatureOrder(
        string signatureOrderId,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrderId == null)
            throw new ArgumentNullException(nameof(signatureOrderId));

        var input = new CancelSignatureOrderInput();
        input.signatureOrderId = signatureOrderId;
        return await CancelSignatureOrder(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CleanupSignatureOrder(
        CleanupSignatureOrderInput input,
        CancellationToken cancellationToken = default
    )
    {
        var data = await SendMutation(
                CleanupSignatureOrderMutation.Request(new { input = input }),
                () => new { cleanupSignatureOrder = new CleanupSignatureOrderOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.cleanupSignatureOrder.signatureOrder;
    }

    public async Task<SignatureOrder> CleanupSignatureOrder(
        SignatureOrder signatureOrder,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrder == null)
            throw new ArgumentNullException(nameof(signatureOrder));

        var input = new CleanupSignatureOrderInput();
        input.signatureOrderId = signatureOrder.id;
        return await CleanupSignatureOrder(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CleanupSignatureOrder(
        string signatureOrderId,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrderId == null)
            throw new ArgumentNullException(nameof(signatureOrderId));

        var input = new CleanupSignatureOrderInput();
        input.signatureOrderId = signatureOrderId;
        return await CleanupSignatureOrder(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<Signatory> SignActingAs(
        SignActingAsInput input,
        CancellationToken cancellationToken = default
    )
    {
        var data = await SendMutation(
                SignActingAsMutation.Request(new { input = input }),
                () => new { SignActingAs = new SignActingAsOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.SignActingAs.signatory;
    }

    public async Task<Signatory> SignActingAs(
        Signatory signatory,
        SignActingAsInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (signatory == null)
            throw new ArgumentNullException(nameof(signatory));
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        input.signatoryId = signatory.id;
        return await SignActingAs(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<ValidateDocumentOutput> ValidateDocument(
        ValidateDocumentInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        var data = await SendMutation(
                ValidateDocumentMutation.Request(new { input = input }),
                () => new { ValidateDocument = new ValidateDocumentOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);
        return data.ValidateDocument;
    }

    public async Task<Signatory> SignActingAs(
        string signatoryId,
        SignActingAsInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (signatoryId == null)
            throw new ArgumentNullException(nameof(signatoryId));
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        input.signatoryId = signatoryId;
        return await SignActingAs(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> DeleteSignatory(
        DeleteSignatoryInput input,
        CancellationToken cancellationToken = default
    )
    {
        var data = await SendMutation(
                DeleteSignatoryMutation.Request(new { input = input }),
                () => new { deleteSignatory = new DeleteSignatoryOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.deleteSignatory.signatureOrder;
    }

    public async Task<SignatureOrder> DeleteSignatory(
        string signatureOrderId,
        string signatoryId,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrderId == null)
            throw new ArgumentNullException(nameof(signatureOrderId));
        if (signatoryId == null)
            throw new ArgumentNullException(nameof(signatoryId));

        var input = new DeleteSignatoryInput();
        input.signatureOrderId = signatureOrderId;
        input.signatoryId = signatoryId;
        return await DeleteSignatory(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> DeleteSignatory(
        Signatory signatory,
        CancellationToken cancellationToken = default
    )
    {
        if (signatory == null)
            throw new ArgumentNullException(nameof(signatory));

        var input = new DeleteSignatoryInput();
        input.signatureOrderId = signatory.signatureOrder.id;
        input.signatoryId = signatory.id;
        return await DeleteSignatory(input, cancellationToken).ConfigureAwait(false);
    }

    public async Task<BatchSignatory> CreateBatchSignatory(
        CreateBatchSignatoryInput input,
        CancellationToken cancellationToken = default
    )
    {
        if (input == null)
            throw new ArgumentNullException(nameof(input));

        var data = await SendMutation(
                CreateBatchSignatoryMutation.Request(new { input = input }),
                () => new { createBatchSignatory = new CreateBatchSignatoryOutput() },
                cancellationToken
            )
            .ConfigureAwait(false);

        return data.createBatchSignatory.batchSignatory;
    }

    public async Task<SignatureOrder?> QuerySignatureOrder(
        string signatureOrderId,
        bool includeDocuments = false,
        CancellationToken cancellationToken = default
    )
    {
        if (signatureOrderId == null)
            throw new ArgumentNullException(nameof(signatureOrderId));

        var request =
            includeDocuments == true
                ? SignatureOrderWithDocumentsQuery.Request(new { id = signatureOrderId })
                : SignatureOrderQuery.Request(new { id = signatureOrderId });

        var response = await graphQLClient
            .SendQueryAsync<Query>(request, cancellationToken)
            .ConfigureAwait(false);

        if (response.Errors?.Length > 0)
        {
            throw new GraphQLException(response.Errors[0].Message);
        }

        return response.Data.signatureOrder;
    }

    public async Task<Signatory?> QuerySignatory(
        string signatoryId,
        CancellationToken cancellationToken = default
    )
    {
        if (signatoryId == null)
            throw new ArgumentNullException(nameof(signatoryId));

        var request = SignatoryQuery.Request(new { id = signatoryId });

        var response = await graphQLClient
            .SendQueryAsync<Query>(request, cancellationToken)
            .ConfigureAwait(false);

        if (response.Errors?.Length > 0)
        {
            throw new GraphQLException(response.Errors[0].Message);
        }

        return response.Data.signatory;
    }

    public async Task<BatchSignatory?> QueryBatchSignatory(
        string batchSignatoryId,
        CancellationToken cancellationToken = default
    )
    {
        if (batchSignatoryId == null)
            throw new ArgumentNullException(nameof(batchSignatoryId));

        var request = BatchSignatoryQuery.Request(new { id = batchSignatoryId });

        var response = await graphQLClient
            .SendQueryAsync<Query>(request, cancellationToken)
            .ConfigureAwait(false);

        if (response.Errors?.Length > 0)
        {
            throw new GraphQLException(response.Errors[0].Message);
        }

        return response.Data.batchSignatory;
    }
}
