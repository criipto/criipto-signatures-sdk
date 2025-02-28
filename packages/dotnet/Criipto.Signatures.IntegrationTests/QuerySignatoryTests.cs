using Xunit;
using Criipto.Signatures.Models;

namespace Criipto.Signatures.IntegrationTests;

public class QuerySignatoryTests
{

    [Fact]
    public async Task QueryReturnsSignatory()
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
        var signatory = await client.AddSignatory(signatureOrder);

        // Act
        var actual = await client.QuerySignatory(
            signatory.id
        );

        // Assert
        Assert.NotNull(actual?.id);
        Assert.Equal(signatory.id, actual!.id);
        Assert.Equal(SignatoryStatus.OPEN, signatory.status);
        Assert.Equal(SignatureOrderStatus.OPEN, signatory.signatureOrder.status);
    }

    [Fact]
    public async Task QueryReturnsNullForUnknownSignatory()
    {
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");
        var actual = await client.QuerySignatory(
            "asd"
        );

        Assert.Null(actual);
    }
}
