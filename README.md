# Hadid Online

Hadid Online is an Arabic-first premium transportation platform. The React/Vite frontend is preserved and now reads from an ASP.NET Core enterprise API instead of the previous Supabase-backed mock data path.

## Architecture

- `src/` — existing React + TypeScript + Vite + Tailwind + shadcn/ui frontend.
- `src/lib/api.ts` — typed HTTP API integration layer and lightweight query adapter used by the existing pages.
- `backend/src/Domain` — entities, enums, repository contracts, soft-delete base model.
- `backend/src/Application` — DTOs, service interfaces, service layer, AutoMapper profile, FluentValidation validators, response envelopes.
- `backend/src/Infrastructure` — EF Core SQL Server `HadidDbContext`, repositories, JWT/refresh token auth service, DI.
- `backend/src/API` — ASP.NET Core 9 Web API, controllers, Swagger, CORS, Serilog, global exception middleware.
- `backend/database/001_initial_schema.sql` — SQL Server schema/bootstrap script for controlled database deployments.

## API resources

The backend exposes versioned endpoints under `/api/v1` for:

- Auth and refresh tokens: `/auth`
- Bookings: `/bookings`
- Contracts: `/contracts`
- Fleet vehicles: `/fleet/vehicles`
- Trips: `/trips`
- Routes: `/routes`
- Drivers: `/drivers`
- Customers: `/customers`
- Invoices: `/invoices`
- Reports: `/reports/summary`
- Dashboard statistics: `/dashboard/stats`
- Notifications: `/notifications`
- Settings: `/settings`

## Prerequisites

- Node.js 20+
- .NET SDK 9
- SQL Server 2022+ or Azure SQL

## Frontend setup

```bash
npm install
cp .env.example .env.local # if present, or create it manually
npm run dev
```

Set the API base URL when it differs from the default:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Backend setup

```bash
cd backend
dotnet restore HadidOnline.sln
dotnet ef database update --project src/Infrastructure --startup-project src/API
dotnet run --project src/API
```

Swagger is available at `https://localhost:<port>/swagger` in Development.

Default seeded administrator:

- Email: `admin@hadid.online`
- Password: replace the seeded hash before production use and rotate `Jwt:SigningKey`.

## Production notes

- Replace `Jwt:SigningKey` with a strong secret from a vault.
- Configure `ConnectionStrings:DefaultConnection` for SQL Server/Azure SQL.
- Restrict `Cors:AllowedOrigins` to production frontend origins.
- Run EF migrations or `backend/database/001_initial_schema.sql` as part of deployment.
- Keep Serilog file logs on persistent storage or forward logs to a centralized sink.
