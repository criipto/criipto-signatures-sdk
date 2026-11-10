namespace Criipto.Signatures.UnitTests;

public class CriiptoSignaturesClientTests
{
    [Fact]
    public void IsDisposable()
    {
        using (var client = new CriiptoSignaturesClient("invalid", "invalid")) { }
    }

    [Fact]
    public void ImplementsInterface()
    {
        using var client = new CriiptoSignaturesClient("invalid", "invalid");
        Assert.IsAssignableFrom<ICriiptoSignaturesClient>(client);
    }

    [Fact]
    public void SendsSdkNameAndVersion()
    {
        using var httpClient = new HttpClient();
        using var client = new CriiptoSignaturesClient("invalid", "invalid", httpClient);

        var version = typeof(CriiptoSignaturesClient).Assembly.GetName().Version!.ToString(3);
        Assert.Equal(
            [$"criipto-signatures-dotnet@{version}"],
            httpClient.DefaultRequestHeaders.GetValues("Criipto-Sdk")
        );
    }
}
