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
    public class ServiceService : IServiceService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ServiceService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<ServiceDto>> GetAllServicesAsync()
        {
            var services = await _unitOfWork.ServicesRepository.GetActiveServicesAsync();
            return services.Select(MapToDto);
        }

        public async Task<IEnumerable<ServiceDto>> SearchServicesAsync(string searchTerm)
        {
            var services = await _unitOfWork.ServicesRepository.SearchServicesAsync(searchTerm);
            return services.Select(MapToDto);
        }

        public async Task<ServiceDto> GetServiceByIdAsync(int id)
        {
            var service = await _unitOfWork.ServicesRepository.GetByIdAsync(id);

            if (service == null || !service.IsActive)
                throw new KeyNotFoundException("الخدمة غير موجودة");

            return MapToDto(service);
        }

        public async Task<ServiceDto> CreateServiceAsync(CreateServiceRM createDto)
        {
            // Check if service name already exists
            if (await _unitOfWork.ServicesRepository.ServiceExistsAsync(createDto.Name))
                throw new InvalidOperationException("اسم الخدمة موجود مسبقاً");

            var service = new Service
            {
                Name = createDto.Name.Trim(),
                Description = createDto.Description?.Trim(),
                Price = createDto.Price,
                SessionsNumber = createDto.SessionsNumber,
                IsActive = true,
                CreatedDate = DateTime.Now
            };

            await _unitOfWork.ServicesRepository.AddAsync(service);
            await _unitOfWork.CompleteAsync();

            return MapToDto(service);
        }

        public async Task<ServiceDto> UpdateServiceAsync(int id, UpdateServiceRM updateDto)
        {
            var service = await _unitOfWork.ServicesRepository.GetByIdAsync(id);

            if (service == null || !service.IsActive)
                throw new KeyNotFoundException("الخدمة غير موجودة");

            // Check if new name conflicts with existing service
            if (await _unitOfWork.ServicesRepository.ServiceExistsAsync(updateDto.Name, id))
                throw new InvalidOperationException("اسم الخدمة موجود مسبقاً");

            service.Name = updateDto.Name.Trim();
            service.Description = updateDto.Description?.Trim();
            service.Price = updateDto.Price;
            service.SessionsNumber = updateDto.SessionsNumber;
            service.UpdatedDate = DateTime.Now;

            _unitOfWork.ServicesRepository.Update(service);
            await _unitOfWork.CompleteAsync();

            return MapToDto(service);
        }

        public async Task<bool> DeleteServiceAsync(int id)
        {
            var service = await _unitOfWork.ServicesRepository.GetByIdAsync(id);

            if (service == null)
                return false;

             service.IsActive = false;
            service.UpdatedDate = DateTime.Now;

            _unitOfWork.ServicesRepository.Update(service);
            await _unitOfWork.CompleteAsync();

            return true;
        }

        private ServiceDto MapToDto(Service service)
        {
            return new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price,
                SessionsNumber = service.SessionsNumber
            };
        }
    }
}