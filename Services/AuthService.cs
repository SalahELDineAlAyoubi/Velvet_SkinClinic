using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;
using VelvetSkinClinic.helpersModels.DTOs;
using VelvetSkinClinic.helpersModels.Enums;
using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Models;
using VelvetSkinClinic.Repositories.UnitOfWork;
using VelvetSkinClinic.Services.IServices;

namespace VelvetSkinClinic.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordService _passwordService;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _config    ;

        public AuthService(IUnitOfWork unitOfWork, ITokenService tokenService, IConfiguration config , IPasswordService passwordService)
        {
            _unitOfWork = unitOfWork;
            _passwordService = passwordService;
            _tokenService = tokenService;
            _config = config;
        }

        public async Task<LoginDto> LoginAsync(LoginRM login )
        {
            // Find user
            var user = await _unitOfWork.UsersRepository
                .FirstOrDefaultAsync(u => u.LoginCustom == login.LoginCustom);

            if (user == null)
                throw new UnauthorizedAccessException("Invalid login or password");

            // Check if active
            if (!user.IsActif)
                throw new UnauthorizedAccessException("Account is disabled");

            // Verify password
            if (!_passwordService.VerifyPasswordHash(login.Password, user.PasswordHash, user.PasswordSalt))
                throw new UnauthorizedAccessException("Invalid login or password");

            // Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // Save refresh token
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = _tokenService.GetRefreshTokenExpiryTime();
            user.LastLoginDate = DateTime.Now;

            _unitOfWork.UsersRepository.Update(user);
            await _unitOfWork.CompleteAsync();

            return new LoginDto
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                LoginCustom = user.LoginCustom,
                UserRole = (UserRoleEnum)user.UserRole,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                TokenExpiration = DateTime.UtcNow.AddMinutes(15)
            };
        }


        public async Task<TokenResponseDto> RefreshTokenAsync(string refreshToken)
        {
            var user = await _unitOfWork.UsersRepository .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null) throw new UnauthorizedAccessException("Invalid refresh token");

            if (user.RefreshTokenExpiryTime <= DateTime.UtcNow) throw new UnauthorizedAccessException("Refresh token expired");

            if (!user.IsActif) throw new UnauthorizedAccessException("Account is disabled");

            var newAccessToken = _tokenService.GenerateAccessToken(user);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = _tokenService.GetRefreshTokenExpiryTime();

            _unitOfWork.UsersRepository.Update(user);
            await _unitOfWork.CompleteAsync();

            return new TokenResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(15)
            };
        }
        public async Task<bool> RevokeTokenAsync(string refreshToken)
        {
            var user = await _unitOfWork.UsersRepository
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null)
                return false;

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;

            _unitOfWork.UsersRepository.Update(user);
            await _unitOfWork.CompleteAsync();

            return true;
        }
    }
}
