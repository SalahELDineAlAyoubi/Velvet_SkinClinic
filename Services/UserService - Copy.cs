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
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordService _passwordService;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _config    ;

        public UserService(IUnitOfWork unitOfWork, ITokenService tokenService, IConfiguration config , IPasswordService passwordService)
        {
            _unitOfWork = unitOfWork;
            _passwordService = passwordService;
            _tokenService = tokenService;
            _config = config;
        }

 
    public async Task<UserDto> CreateUserAsync(CreateUserRM createUserDto)
        {
            // Check if login already exists
            if (await _unitOfWork.UsersRepository.ExistsAsync(u => u.LoginCustom == createUserDto.LoginCustom))
            {
                throw new Exception("Login already exists");
            }

            // Create password hash and salt
            _passwordService.CreatePasswordHash(
                createUserDto.Password,
                out string passwordHash,
                out string passwordSalt
            );

            // Create user entity
            var user = new User
            {
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                DateOfBirth = createUserDto.DateOfBirth,
                LoginCustom = createUserDto.LoginCustom,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                UserRole = createUserDto.UserRole,
                MobileNumber = createUserDto.MobileNumber,
                IsActif = true,
                EntryDate = DateTime.Now
            };

            // Add to database
            await _unitOfWork.UsersRepository.AddAsync(user);
            await _unitOfWork.CompleteAsync();

            // Return DTO
            return MapToDto(user);
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _unitOfWork.UsersRepository.GetByIdAsync(id);
            return user != null ? MapToDto(user) : null;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _unitOfWork.UsersRepository.GetAllAsync();
            return users.Select(MapToDto);
        }

        public async Task<bool> LoginExistsAsync(string loginCustom)
        {
            return await _unitOfWork.UsersRepository.ExistsAsync(u => u.LoginCustom == loginCustom);
        }

        private UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth,
                LoginCustom = user.LoginCustom,
                UserRole = user.UserRole,
                LastLoginDate = user.LastLoginDate,
                IsActif = user.IsActif,
                MobileNumber = user.MobileNumber ??"",
                EntryDate = user.EntryDate
            };
        }
    }
}
