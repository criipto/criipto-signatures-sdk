using Criipto.Signatures.Models;
using Xunit;

namespace Criipto.Signatures.IntegrationTests;

public class ChangeSignatureOrderTests
{
    [Fact]
    public async Task MutationChangesMaxSignatories()
    {
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");

        // arrange
        var signatureOrder = await client.CreateSignatureOrder(
            new CreateSignatureOrderInput
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
                maxSignatories = 10,
            }
        );

        var newMaxSignatories = 20;

        // act
        var changedSignatureOrder = await client.ChangeSignatureOrder(
            new ChangeSignatureOrderInput
            {
                signatureOrderId = signatureOrder.id,
                maxSignatories = newMaxSignatories,
            }
        );

        // assert
        Assert.Equal(newMaxSignatories, changedSignatureOrder.maxSignatories);
    }
}
