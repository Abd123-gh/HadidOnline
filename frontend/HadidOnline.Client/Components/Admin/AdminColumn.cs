namespace HadidOnline.Client.Components.Admin;
public sealed record AdminColumn<T>(string Header, Func<T, string> Value);
