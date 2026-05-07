using HadidOnline.Application.Common;
using HadidOnline.Application.DTOs;
using HadidOnline.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HadidOnline.API.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<ApiEnvelope<AuthResponseDto>>> Login(LoginRequestDto request, CancellationToken cancellationToken) => Ok(ApiEnvelope<AuthResponseDto>.Ok(await authService.LoginAsync(request, cancellationToken)));

    [HttpPost("refresh")]
    public async Task<ActionResult<ApiEnvelope<AuthResponseDto>>> Refresh(RefreshRequestDto request, CancellationToken cancellationToken) => Ok(ApiEnvelope<AuthResponseDto>.Ok(await authService.RefreshAsync(request, cancellationToken)));
}
