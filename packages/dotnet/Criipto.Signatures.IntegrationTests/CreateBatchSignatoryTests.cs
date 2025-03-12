using Criipto.Signatures.Models;
using Xunit;

namespace Criipto.Signatures.IntegrationTests;

public class CreateBatchSignatoryTests
{
    private static readonly List<DocumentInput> DefaultDocuments =
    [
        new DocumentInput
        {
            pdf = new PadesDocumentInput { title = "TEST", blob = Dsl.Sample },
        },
    ];

    [Fact]
    public async Task MutationReturnsBatchSignatory()
    {
        // arrange
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");

        var signatureOrderA = await client.CreateSignatureOrder(
            new CreateSignatureOrderInput
            {
                title = ".NET BatchSignatory #1",
                expiresInDays = 1,
                documents = DefaultDocuments,
            }
        );

        var signatoryA = await client.AddSignatory(signatureOrderA);

        var signatureOrderB = await client.CreateSignatureOrder(
            new CreateSignatureOrderInput
            {
                title = ".NET BatchSignatory #2",
                expiresInDays = 1,
                documents = DefaultDocuments,
            }
        );

        var signatoryB = await client.AddSignatory(signatureOrderB);

        List<(Signatory signatory, SignatureOrder signatureOrder)> pairs =
        [
            (signatoryA, signatureOrderA),
            (signatoryB, signatureOrderB),
        ];

        // act
        var batchSignatory = await client.CreateBatchSignatory(
            new CreateBatchSignatoryInput
            {
                items =
                [
                    .. pairs.Select(p => new BatchSignatoryItemInput
                    {
                        signatoryId = p.signatory.id,
                        signatureOrderId = p.signatureOrder.id,
                    }),
                ],
            }
        );

        // assert
        Assert.Equal(pairs.Count, batchSignatory.items.Count);

        // check that the batch signatory items matches the input pairs
        Assert.All(
            batchSignatory.items,
            (item, idx) =>
            {
                var (signatory, signatureOrder) = pairs[idx];
                Assert.Multiple(() =>
                {
                    Assert.Equal(signatory.id, item.signatory.id);
                    Assert.Equal(signatureOrder.id, item.signatureOrder.id);
                });
            }
        );
    }

    [Fact]
    public async Task MutationThrowsValidationError()
    {
        // arrange
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");

        var signatureOrderA = await client.CreateSignatureOrder(
            new CreateSignatureOrderInput
            {
                title = ".NET BatchSignatory #1",
                expiresInDays = 1,
                documents = DefaultDocuments,
            }
        );

        var signatoryA = await client.AddSignatory(signatureOrderA);

        var signatureOrderB = await client.CreateSignatureOrder(
            new CreateSignatureOrderInput
            {
                title = ".NET BatchSignatory #2",
                expiresInDays = 1,
                documents = DefaultDocuments,
            }
        );

        var signatoryB = await client.AddSignatory(signatureOrderB);

        // act
        Task<BatchSignatory> createBatchSignatoryAction() =>
            client.CreateBatchSignatory(
                new CreateBatchSignatoryInput
                {
                    items =
                    [
                        new BatchSignatoryItemInput
                        {
                            signatoryId = signatoryB.id,
                            signatureOrderId = signatureOrderA.id,
                        },
                    ],
                }
            );

        // assert
        var exn = await Assert.ThrowsAsync<GraphQLException>(() => createBatchSignatoryAction());

        Assert.Equal("signatureOrder does not contain the defined signatory", exn.Message);
    }
}
