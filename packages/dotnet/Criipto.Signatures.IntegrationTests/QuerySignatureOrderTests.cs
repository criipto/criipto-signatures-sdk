using Xunit;
using Criipto.Signatures.Models;

namespace Criipto.Signatures.IntegrationTests;

public class QuerySignatureOrderTests
{

    [Fact]
    public async Task QueryReturnsSignatureOrder()
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
        var actual = await client.QuerySignatureOrder(
            signatureOrder.id
        );

        // Assert
        Assert.NotNull(actual?.id);
        Assert.Equal(signatureOrder.id, actual!.id);
    }

    [Fact]
    public async Task QueryReturnsNullForUnknownSignatureOrder()
    {
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");
        var actual = await client.QuerySignatureOrder(
            "asd"
        );

        Assert.Null(actual);
    }
}
