using System.Text;
using HadidOnline.Application.Interfaces;
using HadidOnline.Domain.Interfaces;
using HadidOnline.Infrastructure.Data;
using HadidOnline.Infrastructure.Repositories;
using HadidOnline.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace HadidOnline.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<HadidDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
        services.AddScoped<IAuthService, AuthService>();
        var key = configuration["Jwt:SigningKey"] ?? "CHANGE_ME_TO_A_64_CHARACTER_PRODUCTION_SECRET_FOR_HADID_ONLINE";
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
            };
        });
        services.AddAuthorization(options =>
        {
            foreach (var role in new[] { "SuperAdmin", "Sales", "Dispatcher", "Driver" }) options.AddPolicy(role, p => p.RequireRole(role, "SuperAdmin"));
        });
        return services;
    }
}
