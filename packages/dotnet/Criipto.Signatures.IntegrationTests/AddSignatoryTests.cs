using Criipto.Signatures.Models;
using Xunit;

namespace Criipto.Signatures.IntegrationTests;

public class AddSignatoryTests
{
    [Fact]
    public async Task MutationReturnsSignatory()
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
                    new DocumentInput()
                    {
                        pdf = new PadesDocumentInput { title = "TEST", blob = Dsl.Sample },
                    },
                ],
            }
        );

        // Act
        var signatory = await client.AddSignatory(signatureOrder);

        // Assert
        Assert.NotNull(signatory?.id);
        Assert.NotNull(signatory?.href);
    }
}
