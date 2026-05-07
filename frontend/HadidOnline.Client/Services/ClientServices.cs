using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.JSInterop;
using HadidOnline.Client.Models;

namespace HadidOnline.Client.Services;

public sealed class ToastService
{
    public event Action<string, string>? OnShow;
    public void Success(string message) => OnShow?.Invoke(message, "success");
    public void Error(string message) => OnShow?.Invoke(message, "error");
    public void Info(string message) => OnShow?.Invoke(message, "info");
}

public sealed class ThemeService(IJSRuntime js)
{
    private const string Key = "hadid-theme";
    public async Task<string> InitializeAsync()
    {
        var theme = await js.InvokeAsync<string?>("hadid.get", Key) ?? "light";
        await js.InvokeVoidAsync("hadid.setTheme", theme);
        return theme;
    }
    public async Task<string> ToggleAsync(string current)
    {
        var next = current == "dark" ? "light" : "dark";
        await js.InvokeVoidAsync("hadid.set", Key, next);
        await js.InvokeVoidAsync("hadid.setTheme", next);
        return next;
    }
}

public sealed class AuthStateProvider(IJSRuntime js, HttpClient http) : AuthenticationStateProvider
{
    private const string TokenKey = "hadid-access-token";
    private const string ProfileKey = "hadid-user-profile";
    private static readonly ClaimsPrincipal Anonymous = new(new ClaimsIdentity());

    public override async Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        var token = await js.InvokeAsync<string?>("hadid.get", TokenKey);
        var profile = await js.InvokeAsync<string?>("hadid.get", ProfileKey);
        if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(profile))
            return new AuthenticationState(Anonymous);

        http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var auth = JsonSerializer.Deserialize<AuthResponse>(profile, JsonOptions.Default);
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, auth?.FullName ?? auth?.Email ?? "Hadid Admin"),
            new(ClaimTypes.Email, auth?.Email ?? string.Empty),
            new(ClaimTypes.Role, auth?.Role ?? "Admin")
        };
        claims.AddRange(auth?.Permissions.Select(p => new Claim("permission", p)) ?? []);
        return new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity(claims, "jwt")));
    }

    public async Task SetAuthenticatedAsync(AuthResponse response)
    {
        await js.InvokeVoidAsync("hadid.set", TokenKey, response.AccessToken);
        await js.InvokeVoidAsync("hadid.set", ProfileKey, JsonSerializer.Serialize(response, JsonOptions.Default));
        http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", response.AccessToken);
        NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
    }

    public async Task SignOutAsync()
    {
        await js.InvokeVoidAsync("hadid.remove", TokenKey);
        await js.InvokeVoidAsync("hadid.remove", ProfileKey);
        http.DefaultRequestHeaders.Authorization = null;
        NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(Anonymous)));
    }
}

public sealed class AuthService(HttpClient http, AuthStateProvider state)
{
    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var envelope = await http.PostAsJsonAsync("api/v1/auth/login", request, JsonOptions.Default);
        envelope.EnsureSuccessStatusCode();
        var data = await envelope.Content.ReadFromJsonAsync<ApiEnvelope<AuthResponse>>(JsonOptions.Default);
        if (data?.Data is null) throw new InvalidOperationException(data?.Message ?? "تعذر تسجيل الدخول");
        await state.SetAuthenticatedAsync(data.Data);
        return data.Data;
    }
    public Task LogoutAsync() => state.SignOutAsync();
}

public sealed class ApiClient(HttpClient http)
{
    public async Task<PagedResult<T>> GetPagedAsync<T>(string endpoint, int pageNumber = 1, int pageSize = 25, string? search = null)
    {
        var url = $"api/v1/{endpoint}?pageNumber={pageNumber}&pageSize={pageSize}" + (string.IsNullOrWhiteSpace(search) ? string.Empty : $"&search={Uri.EscapeDataString(search)}");
        var envelope = await http.GetFromJsonAsync<ApiEnvelope<PagedResult<T>>>(url, JsonOptions.Default);
        return envelope?.Data ?? new PagedResult<T>([], pageNumber, pageSize, 0);
    }

    public async Task<T?> GetAsync<T>(string endpoint, Guid id)
        => (await http.GetFromJsonAsync<ApiEnvelope<T>>($"api/v1/{endpoint}/{id}", JsonOptions.Default))?.Data;

    public async Task<T> CreateAsync<T>(string endpoint, object payload)
    {
        var response = await http.PostAsJsonAsync($"api/v1/{endpoint}", payload, JsonOptions.Default);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ApiEnvelope<T>>(JsonOptions.Default))!.Data!;
    }

    public async Task<T> UpdateAsync<T>(string endpoint, Guid id, object payload)
    {
        var response = await http.PutAsJsonAsync($"api/v1/{endpoint}/{id}", payload, JsonOptions.Default);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ApiEnvelope<T>>(JsonOptions.Default))!.Data!;
    }

    public async Task<T> UpdateStatusAsync<T>(string endpoint, Guid id, string status)
    {
        var response = await http.PatchAsJsonAsync($"api/v1/{endpoint}/{id}/status", new UpdateStatusDto(status), JsonOptions.Default);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ApiEnvelope<T>>(JsonOptions.Default))!.Data!;
    }

    public async Task DeleteAsync(string endpoint, Guid id)
    {
        var response = await http.DeleteAsync($"api/v1/{endpoint}/{id}");
        response.EnsureSuccessStatusCode();
    }
}

public sealed class DashboardService(HttpClient http)
{
    public async Task<DashboardStats> GetStatsAsync()
        => (await http.GetFromJsonAsync<ApiEnvelope<DashboardStats>>("api/v1/dashboard/stats", JsonOptions.Default))?.Data ?? new DashboardStats(0, 0, 0, 0, 0, 0, 0);
}

public static class JsonOptions
{
    public static readonly JsonSerializerOptions Default = new(JsonSerializerDefaults.Web);
}
