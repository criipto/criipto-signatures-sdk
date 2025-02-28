using Xunit;
using Criipto.Signatures.Models;

namespace Criipto.Signatures.IntegrationTests;

public class CreateSignatureOrderTests
{
    private static readonly List<DocumentInput> DefaultDocuments = [
          new DocumentInput {
            pdf =
                new PadesDocumentInput
                {
                    title = "TEST",
                    blob = Dsl.Sample
                }
        }
      ];

    [Fact]
    public async Task MutationThrowsAuthorizationError()
    {
        using var client = new CriiptoSignaturesClient("invalid", "invalid");
        var exn = await Assert.ThrowsAsync<GraphQLException>(() =>
            client.CreateSignatureOrder(
                new CreateSignatureOrderInput()
                {
                    title = "Title",
                    documents = []
                }
            )
        );
        Assert.Equal("Unauthorized access", exn.Message);
    }

    [Fact]
    public async Task MutationThrowsValidationError()
    {
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");
        var exn = await Assert.ThrowsAsync<GraphQLException>(() =>
            client.CreateSignatureOrder(
                new CreateSignatureOrderInput()
                {
                    title = "Title",
                    documents =
                    [
                              new DocumentInput {
                                pdf =
                                    new PadesDocumentInput
                                    {
                                        title = "TEST",
                                        blob = []
                                    }
                            }
                    ]
                }
            )
        );
        Assert.Equal("Document TEST does not appear to be a PDF", exn.Message);
    }

    [Fact]
    public async Task MutationReturnsSignatureOrder()
    {
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");
        var signatureOrder = await client.CreateSignatureOrder(
            new CreateSignatureOrderInput()
            {
                title = "Title",
                expiresInDays = 1,
                documents = DefaultDocuments
            }
        );

        Assert.NotNull(signatureOrder?.id);
    }

    [Fact]
    public async Task MutationSupportsDrawable()
    {
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");
        var signatureOrder = await client.CreateSignatureOrder(
            new CreateSignatureOrderInput()
            {
                title = "Title",
                expiresInDays = 1,
                documents = DefaultDocuments,
                disableVerifyEvidenceProvider = true,
                evidenceProviders = [
                          new EvidenceProviderInput() {
                            enabledByDefault = true,
                            drawable = new DrawableEvidenceProviderInput() {
                                requireName = true
                            }
                        }
                ]
            }
        );

        Assert.NotNull(signatureOrder?.id);

        var drawable =
            signatureOrder!.evidenceProviders
                .Where(e => e is DrawableSignatureEvidenceProvider)
                .First();
        Assert.NotNull(signatureOrder?.id);
    }

    [Fact]
    public async Task MutationSupportsComposite()
    {
        using var client = new CriiptoSignaturesClient(Dsl.CLIENT_ID, Dsl.CLIENT_SECRET, "test");
        var signatureOrder = await client.CreateSignatureOrder(
            new CreateSignatureOrderInput()
            {
                title = "Title",
                expiresInDays = 1,
                documents = DefaultDocuments,
                disableVerifyEvidenceProvider = true,
                evidenceProviders = [
                          new EvidenceProviderInput() {
                            enabledByDefault = true,
                            allOf = new AllOfEvidenceProviderInput() {
                                providers = [
                                    new SingleEvidenceProviderInput() {
                                        criiptoVerify = new CriiptoVerifyProviderInput() {
                                            alwaysRedirect = true
                                        }
                                    },
                                    new SingleEvidenceProviderInput() {
                                        drawable = new DrawableEvidenceProviderInput() {
                                            requireName = false
                                        }
                                    }
                                ]
                            }
                        }
                ]
            }
        );

        Assert.NotNull(signatureOrder?.id);

        var drawable =
            signatureOrder!.evidenceProviders
                .Where(e => e is AllOfSignatureEvidenceProvider)
                .First();
        Assert.NotNull(signatureOrder?.id);
        Assert.Equal(SignatureOrderStatus.OPEN, signatureOrder?.status);
    }
}
