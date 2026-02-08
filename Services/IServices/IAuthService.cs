using System.Linq.Expressions;
using VelvetSkinClinic.helpersModels.DTOs;
 using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Services.IServices
{
    public interface IAuthService
    {
        Task<LoginDto> LoginAsync(LoginRM login);
        Task<TokenResponseDto> RefreshTokenAsync(string refreshToken);
        Task<bool> RevokeTokenAsync(string refreshToken);
    }
}
