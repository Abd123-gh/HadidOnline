using HadidOnline.Application.DTOs;

namespace HadidOnline.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
    Task<AuthResponseDto> RefreshAsync(RefreshRequestDto request, CancellationToken cancellationToken = default);
}
