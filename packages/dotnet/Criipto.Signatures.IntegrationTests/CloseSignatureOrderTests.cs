using Xunit;
using Criipto.Signatures.Models;

namespace Criipto.Signatures.IntegrationTests;

public class CloseSignatureOrderTests
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
                documents = [
                          new DocumentInput {
                            pdf =
                                new PadesDocumentInput
                                {
                                    title = "TEST",
                                    blob = Dsl.Sample
                                }
                        }
                ]
            }
        );

        // Act
        var actual = await client.CloseSignatureOrder(
            signatureOrder
        );

        // Assert
        Assert.NotNull(actual?.id);
        Assert.NotNull(actual?.documents[0].blob);
    }
}
