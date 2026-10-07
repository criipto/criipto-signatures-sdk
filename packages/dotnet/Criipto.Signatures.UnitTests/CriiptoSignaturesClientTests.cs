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
}
