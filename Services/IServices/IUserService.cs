using System.Linq.Expressions;
using VelvetSkinClinic.helpersModels.DTOs;
 using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Services.IServices
{
    public interface IUserService
    {
        Task<UserDto> CreateUserAsync(CreateUserRM createUserDto);
        Task<UserDto> GetUserByIdAsync(int id);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<bool> LoginExistsAsync(string loginCustom);
        Task<LoginDto> LoginAsync(LoginRM login);

    }
}
