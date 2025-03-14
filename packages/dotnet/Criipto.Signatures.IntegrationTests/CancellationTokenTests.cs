using Criipto.Signatures.Models;
using Xunit;

namespace Criipto.Signatures.IntegrationTests;

public class CancellationTokenTests
{
    private static readonly List<DocumentInput> DefaultDocuments =
    [
        new DocumentInput
        {
            pdf = new PadesDocumentInput { title = "TEST", blob = Dsl.Sample },
        },
    ];

    [Fact]
    public async Task ThrowsOnCancellationRequested()
    {
        // arrange
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");

        using var cts = new CancellationTokenSource(TimeSpan.Zero);

        // act
        Task action() =>
            client.CreateSignatureOrder(
                new CreateSignatureOrderInput()
                {
                    title = "Title",
                    expiresInDays = 1,
                    documents = DefaultDocuments,
                },
                cts.Token
            );

        // assert
        Assert.True(cts.IsCancellationRequested);

        await Assert.ThrowsAnyAsync<OperationCanceledException>(action);
    }
}
