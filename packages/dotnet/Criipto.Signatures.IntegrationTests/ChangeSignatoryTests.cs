using Xunit;
using Criipto.Signatures.Models;

namespace Criipto.Signatures.IntegrationTests;

public class ChangeSignatoryTests
{

    [Fact]
    public async Task MutationChangesEvidenceProviders()
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
                ],
                evidenceProviders = [
                          new EvidenceProviderInput() {
                            enabledByDefault = false,
                            drawable = new DrawableEvidenceProviderInput() {
                                requireName = true
                            }
                        }
                ]
            }
        );

        var signatory = await client.AddSignatory(
            signatureOrder
        );

        var soDrawable =
            signatureOrder!.evidenceProviders
                .Where(e => e is DrawableSignatureEvidenceProvider)
                .First();

        // Act
        var actual = await client.ChangeSignatory(
            signatory,
            new ChangeSignatoryInput()
            {
                evidenceProviders = [
                          new SignatoryEvidenceProviderInput() {
                            id = soDrawable.id
                        }
                ]
            }
        );

        // Assert
        Assert.NotNull(signatory?.id);
        Assert.NotNull(signatory?.href);

        var drawable =
            actual!.evidenceProviders
                .Where(e => e is DrawableSignatureEvidenceProvider)
                .First();
        Assert.NotNull(drawable);
    }
}
