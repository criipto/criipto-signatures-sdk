using Xunit;
using Criipto.Signatures.Models;

namespace Criipto.Signatures.IntegrationTests;

public class AddSignatoriesTests
{

    [Fact]
    public async Task MutationReturnsSignatories()
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
        var signatories = await client.AddSignatories(
            signatureOrder,
            [
                      new CreateSignatureOrderSignatoryInput() {
                        role = "Chairman"
                    },
                    new CreateSignatureOrderSignatoryInput() {
                        role = "Director"
                    }
            ]
        );

        // Assert
        Assert.Equal(2, signatories.Count);
    }
}
