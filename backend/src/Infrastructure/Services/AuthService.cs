using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using HadidOnline.Application.DTOs;
using HadidOnline.Application.Interfaces;
using HadidOnline.Domain.Entities;
using HadidOnline.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HadidOnline.Infrastructure.Services;

public class AuthService(HadidDbContext dbContext, IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await dbContext.Users.Include(x => x.Role).ThenInclude(r => r!.Permissions).FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) throw new UnauthorizedAccessException("Invalid email or password.");
        return await IssueTokensAsync(user, cancellationToken);
    }

    public async Task<AuthResponseDto> RefreshAsync(RefreshRequestDto request, CancellationToken cancellationToken = default)
    {
        var tokenHash = Hash(request.RefreshToken);
        var refresh = await dbContext.RefreshTokens.Include(x => x.User).ThenInclude(x => x!.Role).ThenInclude(r => r!.Permissions)
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash && x.RevokedAt == null && x.ExpiresAt > DateTimeOffset.UtcNow, cancellationToken)
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");
        refresh.RevokedAt = DateTimeOffset.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return await IssueTokensAsync(refresh.User!, cancellationToken);
    }

    private async Task<AuthResponseDto> IssueTokensAsync(User user, CancellationToken cancellationToken)
    {
        var key = configuration["Jwt:SigningKey"] ?? "CHANGE_ME_TO_A_64_CHARACTER_PRODUCTION_SECRET_FOR_HADID_ONLINE";
        var credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);
        var role = user.Role?.Name ?? "Driver";
        var permissions = user.Role?.Permissions.Select(x => x.Key).ToArray() ?? [];
        var claims = new List<Claim> { new(JwtRegisteredClaimNames.Sub, user.Id.ToString()), new(ClaimTypes.Email, user.Email), new(ClaimTypes.Name, user.FullName), new(ClaimTypes.Role, role) };
        claims.AddRange(permissions.Select(p => new Claim("permission", p)));
        var jwt = new JwtSecurityToken(configuration["Jwt:Issuer"], configuration["Jwt:Audience"], claims, expires: DateTime.UtcNow.AddMinutes(int.Parse(configuration["Jwt:AccessTokenMinutes"] ?? "30")), signingCredentials: credentials);
        var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        dbContext.RefreshTokens.Add(new RefreshToken { UserId = user.Id, TokenHash = Hash(refreshToken), ExpiresAt = DateTimeOffset.UtcNow.AddDays(14) });
        await dbContext.SaveChangesAsync(cancellationToken);
        return new AuthResponseDto(accessToken, refreshToken, user.Email, user.FullName, role, permissions);
    }

    private static string Hash(string value) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value)));
}
