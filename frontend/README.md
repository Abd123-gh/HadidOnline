# Hadid Online Blazor Frontend

This folder contains the Blazor WebAssembly migration of the existing React/Vite frontend. The selected architecture is **Blazor WebAssembly API-driven** because the backend is already an ASP.NET Core Web API with JWT authentication and Clean Architecture. This keeps the frontend independently deployable while preserving the current public marketing site, Arabic-first RTL UX, booking flow, and protected admin dashboard.

## Stack

- .NET 9 Blazor WebAssembly
- Custom Tailwind-compatible CSS design system
- Arabic-first RTL layout
- JWT authentication via `AuthStateProvider`
- Strongly typed DTOs matching the ASP.NET Core API contracts
- `HttpClient` API services for dashboard, CRUD, booking, auth, status updates

## Configure API URL

Edit:

```json
frontend/HadidOnline.Client/wwwroot/appsettings.json
```

Set `ApiBaseUrl` to the running ASP.NET Core Web API base URL, for example:

```json
{
  "ApiBaseUrl": "https://localhost:7001/"
}
```

## Run

```bash
cd frontend/HadidOnline.Client
dotnet restore
dotnet run
```

## Build verification

```bash
cd frontend/HadidOnline.Client
dotnet build
```

> Note: this execution environment does not include the `dotnet` SDK, so local build verification must be run on a machine with .NET 9 installed.

## Routes preserved

Public:

- `/`
- `/about`
- `/services`
- `/fleet`
- `/tours`
- `/corporate`
- `/school`
- `/booking`
- `/contact`
- `/faq`

Admin protected by JWT:

- `/admin`
- `/admin/bookings`
- `/admin/contracts`
- `/admin/clients`
- `/admin/drivers`
- `/admin/trips`
- `/admin/fleet`
- `/admin/reports`
- `/admin/invoices`
- `/admin/settings`
