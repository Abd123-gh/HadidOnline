namespace HadidOnline.Blazor.Services;
public class ApiClient(HttpClient http)
{
    public async Task<T?> GetAsync<T>(string endpoint, CancellationToken ct = default) =>
        await http.GetFromJsonAsync<T>(endpoint, ct);
}
