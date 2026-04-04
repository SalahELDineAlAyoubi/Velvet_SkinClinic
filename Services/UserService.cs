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

        public async Task ChangePasswordAsync(ChangePasswordRM request)
        {
            var user = await _unitOfWork.UsersRepository.FirstOrDefaultAsync(u => u.LoginCustom == request.Login);
            if (user == null)
                throw new Exception("User not found.");

            _passwordService.CreatePasswordHash(request.NewPassword, out string newHash, out string newSalt);
            user.PasswordHash = newHash;
            user.PasswordSalt = newSalt;

            _unitOfWork.UsersRepository.Update(user);
            await _unitOfWork.CompleteAsync();
        }
        //public async Task<UserDto> CreateUserAppAsync(CreateUserAppRM model)
        //{
        //    // Check if login already exists
        //    var existing = await _unitOfWork.UsersRepository
        //        .FirstOrDefaultAsync(u => u.LoginCustom == model.LoginCustom);
        //    if (existing != null)
        //        throw new InvalidOperationException("Login already exists");

        //    // Generate password hash and salt
        //    _passwordService.CreatePasswordHash(model.Password, out string passwordHash, out string passwordSalt);

        //    var user = new User
        //    {
        //        FirstName = model.FirstName,
        //        LastName = model.LastName,
        //        LoginCustom = model.LoginCustom,
        //        PasswordHash = passwordHash,
        //        PasswordSalt = passwordSalt,
        //        UserRole = (int)model.UserRole,
        //        IsActif = true,
        //        EntryDate = DateTime.Now
        //    };

        //    await _unitOfWork.UsersRepository.AddAsync(user);
        //    await _unitOfWork.CompleteAsync();

        //    return new UserDto
        //    {
        //        Id=user.Id,
        //        FirstName = user.FirstName,
        //        LastName = user.LastName,
        //        LoginCustom = user.LoginCustom,
        //        UserRole = user.UserRole,
        //        IsActif = user.IsActif,
        //        EntryDate = user.EntryDate
        //    };
        //}

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
