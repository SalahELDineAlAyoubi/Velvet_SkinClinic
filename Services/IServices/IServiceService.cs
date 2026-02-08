using System.Linq.Expressions;
using VelvetSkinClinic.helpersModels.DTOs;
 using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Services.IServices
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceDto>> GetAllServicesAsync();
        Task<IEnumerable<ServiceDto>> SearchServicesAsync(string searchTerm);
        Task<ServiceDto> GetServiceByIdAsync(int id);
        Task<ServiceDto> CreateServiceAsync(CreateServiceRM createDto);
        Task<ServiceDto> UpdateServiceAsync(int id, UpdateServiceRM updateDto);
        Task<bool> DeleteServiceAsync(int id);
    }
}
