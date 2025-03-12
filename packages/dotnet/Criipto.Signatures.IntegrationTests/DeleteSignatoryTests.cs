using Criipto.Signatures.Models;
using Xunit;

namespace Criipto.Signatures.IntegrationTests;

public class DeleteSignatoryTests
{
    [Fact]
    public async Task MutationDeletesSignatory()
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

        var signatory = await client.AddSignatory(signatureOrder);

        // Act
        var actual = await client.DeleteSignatory(signatory);

        // Assert
        Assert.Empty(actual.signatories);
    }
}
