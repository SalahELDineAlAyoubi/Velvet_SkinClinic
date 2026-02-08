using System.Linq.Expressions;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Services.IServices
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        int? ValidateToken(string token);
        DateTime GetRefreshTokenExpiryTime();
    }
}
