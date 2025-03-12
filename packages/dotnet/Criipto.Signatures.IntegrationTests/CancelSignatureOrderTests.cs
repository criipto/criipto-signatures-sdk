using Criipto.Signatures.Models;
using Xunit;

namespace Criipto.Signatures.IntegrationTests;

public class CancelSignatureOrderTests
{
    [Fact]
    public async Task MutationReturnsSignatureOrder()
    {
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");
        // Arrange
        var signatureOrder = await client.CreateSignatureOrder(
            new CreateSignatureOrderInput()
            {
                title = "Title",
                expiresInDays = 1,
                documents =
                [
                    new DocumentInput
                    {
                        pdf = new PadesDocumentInput { title = "TEST", blob = Dsl.Sample },
                    },
                ],
            }
        );

        // Act
        var actual = await client.CancelSignatureOrder(signatureOrder);

        // Assert
        Assert.NotNull(actual?.id);
        Assert.Equal(SignatureOrderStatus.CANCELLED, actual?.status);
    }
}
