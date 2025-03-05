#pragma warning disable CA1002

using GraphQL.Client.Abstractions;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using System.Net.Http.Headers;
using Criipto.Signatures.Models;

namespace Criipto.Signatures;

public class CriiptoSignaturesClient : IDisposable
{
    private readonly GraphQLHttpClient graphQLClient;
    private bool isDisposed;

    public CriiptoSignaturesClient(
        string clientId,
        string clientSecret,
        string criiptoSdk
    )
    {
        this.graphQLClient =
            new GraphQLHttpClient(
                "https://signatures-api.criipto.com/v1/graphql", new NewtonsoftJsonSerializer()
            );

        this.graphQLClient.HttpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Basic",
                Convert.ToBase64String(
                    System.Text.Encoding.ASCII.GetBytes(
                        $"{clientId}:{clientSecret}"
                    )
                )
            );
        this.graphQLClient.HttpClient.DefaultRequestHeaders.Add(
            "Criipto-Sdk",
            criiptoSdk
        );
    }

    public CriiptoSignaturesClient(
        string clientId,
        string clientSecret
    ) : this(
        clientId,
        clientSecret,
        "criipto-signatures-dotnet"
    )
    { }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (this.isDisposed) return;

        if (disposing)
        {
            this.graphQLClient.Dispose();
        }

        this.isDisposed = true;
    }

    private async Task<TResponse> SendMutation<TResponse>(GraphQL.GraphQLRequest request, Func<TResponse> defineResponseType)
    {
        var response = await graphQLClient.SendMutationAsync(
            request,
            defineResponseType
        ).ConfigureAwait(false);

        if (response.Errors?.Length > 0)
        {
            throw new GraphQLException(response.Errors[0].Message);
        }

        return response.Data;
    }

    public async Task<SignatureOrder> CreateSignatureOrder(CreateSignatureOrderInput input)
    {
        if (input == null) throw new ArgumentNullException(nameof(input));

        var data = await SendMutation(
            CreateSignatureOrderMutation.Request(new { input = input }),
            () => new { createSignatureOrder = new CreateSignatureOrderOutput() }
        ).ConfigureAwait(false);

        return data.createSignatureOrder.signatureOrder;
    }

    public async Task<Signatory> AddSignatory(AddSignatoryInput input)
    {
        var data = await SendMutation(
            AddSignatoryMutation.Request(new { input = input }),
            () => new { addSignatory = new AddSignatoryOutput() }
        ).ConfigureAwait(false);

        return data.addSignatory.signatory;
    }

    public async Task<Signatory> AddSignatory(SignatureOrder signatureOrder)
    {
        if (signatureOrder == null) throw new ArgumentNullException(nameof(signatureOrder));

        var input = new AddSignatoryInput();
        input.signatureOrderId = signatureOrder.id;
        return await AddSignatory(input).ConfigureAwait(false);
    }

    public async Task<Signatory> AddSignatory(SignatureOrder signatureOrder, AddSignatoryInput input)
    {
        if (signatureOrder == null) throw new ArgumentNullException(nameof(signatureOrder));
        if (input == null) throw new ArgumentNullException(nameof(input));

        input.signatureOrderId = signatureOrder.id;
        return await AddSignatory(input).ConfigureAwait(false);
    }

    public async Task<Signatory> AddSignatory(string signatureOrderId)
    {
        if (signatureOrderId == null) throw new ArgumentNullException(nameof(signatureOrderId));

        var input = new AddSignatoryInput();
        input.signatureOrderId = signatureOrderId;
        return await AddSignatory(input).ConfigureAwait(false);
    }

    public async Task<Signatory> AddSignatory(string signatureOrderId, AddSignatoryInput input)
    {
        if (signatureOrderId == null) throw new ArgumentNullException(nameof(signatureOrderId));
        if (input == null) throw new ArgumentNullException(nameof(input));

        input.signatureOrderId = signatureOrderId;
        return await AddSignatory(input).ConfigureAwait(false);
    }

    public async Task<List<Signatory>> AddSignatories(AddSignatoriesInput input)
    {
        var data = await SendMutation(
            AddSignatoriesMutation.Request(new { input = input }),
            () => new { addSignatories = new AddSignatoriesOutput() }
        ).ConfigureAwait(false);

        return data.addSignatories.signatories;
    }

    public async Task<List<Signatory>> AddSignatories(SignatureOrder signatureOrder, List<CreateSignatureOrderSignatoryInput> signatories)
    {
        if (signatureOrder == null) throw new ArgumentNullException(nameof(signatureOrder));
        if (signatories == null) throw new ArgumentNullException(nameof(signatories));

        var input = new AddSignatoriesInput();
        input.signatureOrderId = signatureOrder.id;
        input.signatories = signatories;
        return await AddSignatories(input).ConfigureAwait(false);
    }

    public async Task<List<Signatory>> AddSignatories(string signatureOrderId, List<CreateSignatureOrderSignatoryInput> signatories)
    {
        if (signatureOrderId == null) throw new ArgumentNullException(nameof(signatureOrderId));
        if (signatories == null) throw new ArgumentNullException(nameof(signatories));

        var input = new AddSignatoriesInput();
        input.signatureOrderId = signatureOrderId;
        input.signatories = signatories;
        return await AddSignatories(input).ConfigureAwait(false);
    }

    public async Task<Signatory> ChangeSignatory(ChangeSignatoryInput input)
    {
        var data = await SendMutation(
            ChangeSignatoryMutation.Request(new { input = input }),
            () => new { changeSignatory = new ChangeSignatoryOutput() }
        ).ConfigureAwait(false);

        return data.changeSignatory.signatory;
    }

    public async Task<Signatory> ChangeSignatory(Signatory signatory, ChangeSignatoryInput input)
    {
        if (signatory == null) throw new ArgumentNullException(nameof(signatory));
        if (input == null) throw new ArgumentNullException(nameof(input));

        input.signatoryId = signatory.id;
        return await ChangeSignatory(input).ConfigureAwait(false);
    }

    public async Task<Signatory> ChangeSignatory(string signatoryId, ChangeSignatoryInput input)
    {
        if (signatoryId == null) throw new ArgumentNullException(nameof(signatoryId));
        if (input == null) throw new ArgumentNullException(nameof(input));

        input.signatoryId = signatoryId;
        return await ChangeSignatory(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> ExtendSignatureOrder(ExtendSignatureOrderInput input)
    {
        if (input == null) throw new ArgumentNullException(nameof(input));

        var data = await SendMutation(
            ExtendSignatureOrderMutation.Request(new { input = input }),
            () => new { extendSignatureOrder = new ExtendSignatureOrderOutput() }
        ).ConfigureAwait(false);

        return data.extendSignatureOrder.signatureOrder;
    }
    public async Task<SignatureOrder> ExtendSignatureOrder(SignatureOrder signatureOrder, ExtendSignatureOrderInput input)
    {
        if (signatureOrder == null) throw new ArgumentNullException(nameof(signatureOrder));
        if (input == null) throw new ArgumentNullException(nameof(input));

        input.signatureOrderId = signatureOrder.id;
        return await ExtendSignatureOrder(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CloseSignatureOrder(CloseSignatureOrderInput input)
    {
        var data = await SendMutation(
            CloseSignatureOrderMutation.Request(new { input = input }),
            () => new { closeSignatureOrder = new CloseSignatureOrderOutput() }
        ).ConfigureAwait(false);

        return data.closeSignatureOrder.signatureOrder;
    }

    public async Task<SignatureOrder> CloseSignatureOrder(SignatureOrder signatureOrder)
    {
        if (signatureOrder == null) throw new ArgumentNullException(nameof(signatureOrder));

        var input = new CloseSignatureOrderInput();
        input.signatureOrderId = signatureOrder.id;
        return await CloseSignatureOrder(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CloseSignatureOrder(SignatureOrder signatureOrder, CloseSignatureOrderInput input)
    {
        if (signatureOrder == null) throw new ArgumentNullException(nameof(signatureOrder));
        if (input == null) throw new ArgumentNullException(nameof(input));

        input.signatureOrderId = signatureOrder.id;
        return await CloseSignatureOrder(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CloseSignatureOrder(string signatureOrderId)
    {
        if (signatureOrderId == null) throw new ArgumentNullException(nameof(signatureOrderId));

        var input = new CloseSignatureOrderInput();
        input.signatureOrderId = signatureOrderId;
        return await CloseSignatureOrder(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CloseSignatureOrder(string signatureOrderId, CloseSignatureOrderInput input)
    {
        if (signatureOrderId == null) throw new ArgumentNullException(nameof(signatureOrderId));
        if (input == null) throw new ArgumentNullException(nameof(input));

        input.signatureOrderId = signatureOrderId;
        return await CloseSignatureOrder(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CancelSignatureOrder(CancelSignatureOrderInput input)
    {
        var data = await SendMutation(
            CancelSignatureOrderMutation.Request(new { input = input }),
            () => new { cancelSignatureOrder = new CancelSignatureOrderOutput() }
        ).ConfigureAwait(false);

        return data.cancelSignatureOrder.signatureOrder;
    }

    public async Task<SignatureOrder> CancelSignatureOrder(SignatureOrder signatureOrder)
    {
        if (signatureOrder == null) throw new ArgumentNullException(nameof(signatureOrder));

        var input = new CancelSignatureOrderInput();
        input.signatureOrderId = signatureOrder.id;
        return await CancelSignatureOrder(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CancelSignatureOrder(string signatureOrderId)
    {
        if (signatureOrderId == null) throw new ArgumentNullException(nameof(signatureOrderId));

        var input = new CancelSignatureOrderInput();
        input.signatureOrderId = signatureOrderId;
        return await CancelSignatureOrder(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CleanupSignatureOrder(CleanupSignatureOrderInput input)
    {
        var data = await SendMutation(
            CleanupSignatureOrderMutation.Request(new { input = input }),
            () => new { cleanupSignatureOrder = new CleanupSignatureOrderOutput() }
        ).ConfigureAwait(false);

        return data.cleanupSignatureOrder.signatureOrder;
    }

    public async Task<SignatureOrder> CleanupSignatureOrder(SignatureOrder signatureOrder)
    {
        if (signatureOrder == null) throw new ArgumentNullException(nameof(signatureOrder));

        var input = new CleanupSignatureOrderInput();
        input.signatureOrderId = signatureOrder.id;
        return await CleanupSignatureOrder(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> CleanupSignatureOrder(string signatureOrderId)
    {
        if (signatureOrderId == null) throw new ArgumentNullException(nameof(signatureOrderId));

        var input = new CleanupSignatureOrderInput();
        input.signatureOrderId = signatureOrderId;
        return await CleanupSignatureOrder(input).ConfigureAwait(false);
    }

    public async Task<Signatory> SignActingAs(SignActingAsInput input)
    {
        var data = await SendMutation(
            SignActingAsMutation.Request(new { input = input }),
            () => new { SignActingAs = new SignActingAsOutput() }
        ).ConfigureAwait(false);

        return data.SignActingAs.signatory;
    }

    public async Task<Signatory> SignActingAs(Signatory signatory, SignActingAsInput input)
    {
        if (signatory == null) throw new ArgumentNullException(nameof(signatory));
        if (input == null) throw new ArgumentNullException(nameof(input));

        input.signatoryId = signatory.id;
        return await SignActingAs(input).ConfigureAwait(false);
    }

    public async Task<ValidateDocumentOutput> ValidateDocument(ValidateDocumentInput input)
    {
        if (input == null) throw new ArgumentNullException(nameof(input));

        var data = await SendMutation(
            ValidateDocumentMutation.Request(new { input = input }),
            () => new { ValidateDocument = new ValidateDocumentOutput() }
        ).ConfigureAwait(false);
        return data.ValidateDocument;
    }

    public async Task<Signatory> SignActingAs(string signatoryId, SignActingAsInput input)
    {
        if (signatoryId == null) throw new ArgumentNullException(nameof(signatoryId));
        if (input == null) throw new ArgumentNullException(nameof(input));

        input.signatoryId = signatoryId;
        return await SignActingAs(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> DeleteSignatory(DeleteSignatoryInput input)
    {
        var data = await SendMutation(
            DeleteSignatoryMutation.Request(new { input = input }),
            () => new { deleteSignatory = new DeleteSignatoryOutput() }
        ).ConfigureAwait(false);

        return data.deleteSignatory.signatureOrder;
    }

    public async Task<SignatureOrder> DeleteSignatory(string signatureOrderId, string signatoryId)
    {
        if (signatureOrderId == null) throw new ArgumentNullException(nameof(signatureOrderId));
        if (signatoryId == null) throw new ArgumentNullException(nameof(signatoryId));

        var input = new DeleteSignatoryInput();
        input.signatureOrderId = signatureOrderId;
        input.signatoryId = signatoryId;
        return await DeleteSignatory(input).ConfigureAwait(false);
    }

    public async Task<SignatureOrder> DeleteSignatory(Signatory signatory)
    {
        if (signatory == null) throw new ArgumentNullException(nameof(signatory));

        var input = new DeleteSignatoryInput();
        input.signatureOrderId = signatory.signatureOrder.id;
        input.signatoryId = signatory.id;
        return await DeleteSignatory(input).ConfigureAwait(false);
    }

    public async Task<BatchSignatory> CreateBatchSignatory(CreateBatchSignatoryInput input)
    {
        if (input == null) throw new ArgumentNullException(nameof(input));

        var data = await SendMutation(
            CreateBatchSignatoryMutation.Request(new { input = input }),
            () => new { createBatchSignatory = new CreateBatchSignatoryOutput() }
        ).ConfigureAwait(false);

        return data.createBatchSignatory.batchSignatory;
    }

    public async Task<SignatureOrder?> QuerySignatureOrder(string signatureOrderId, bool includeDocuments = false)
    {
        if (signatureOrderId == null) throw new ArgumentNullException(nameof(signatureOrderId));

        var request =
            includeDocuments == true ?
                SignatureOrderWithDocumentsQuery.Request(new { id = signatureOrderId }) :
                SignatureOrderQuery.Request(new { id = signatureOrderId });

        var response = await graphQLClient.SendQueryAsync<Query>(
            request
        ).ConfigureAwait(false);

        if (response.Errors?.Length > 0)
        {
            throw new GraphQLException(response.Errors[0].Message);
        }

        return response.Data.signatureOrder;
    }

    public async Task<Signatory?> QuerySignatory(string signatoryId)
    {
        if (signatoryId == null) throw new ArgumentNullException(nameof(signatoryId));

        var request = SignatoryQuery.Request(new { id = signatoryId });

        var response = await graphQLClient.SendQueryAsync<Query>(
            request
        ).ConfigureAwait(false);

        if (response.Errors?.Length > 0)
        {
            throw new GraphQLException(response.Errors[0].Message);
        }

        return response.Data.signatory;
    }

    public async Task<BatchSignatory?> QueryBatchSignatory(string batchSignatoryId)
    {
        if (batchSignatoryId == null) throw new ArgumentNullException(nameof(batchSignatoryId));

        var request = BatchSignatoryQuery.Request(new { id = batchSignatoryId });

        var response = await graphQLClient.SendQueryAsync<Query>(request)
            .ConfigureAwait(false);

        if (response.Errors?.Length > 0)
        {
            throw new GraphQLException(response.Errors[0].Message);
        }

        return response.Data.batchSignatory;
    }
}
