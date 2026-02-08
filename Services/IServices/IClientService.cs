using System.Linq.Expressions;
using VelvetSkinClinic.helpersModels.DTOs;
using VelvetSkinClinic.helpersModels.RMs;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Services.IServices
{
    public interface IClientService
    {
        Task<ClientDto> GetClientByIdAsync(int id);
        Task<ClientDto> GetClientByIdentifierAsync(string clientIdentifier);
        Task<IEnumerable<ClientDto>> GetAllClientsAsync();
        Task<ClientDto> CreateClientAsync(CreateClientRM createDto);
        Task<ClientDto> UpdateClientAsync(int id, UpdateClientRM updateDto);
        Task<ClientDto> UpdateClientTotalRequiredAsync(int id, UpdateClientTotalRequiredRM updateDto);
        Task<bool> DeleteClientAsync(int id);
        Task<ClientDto> AddServiceToClientAsync(int clientId, int serviceId);
        Task<ClientDto> RemoveServiceFromClientAsync(int clientId, int serviceId);
        Task<PaymentDto> AddPaymentAsync(int clientId, CreatePaymentRM createDto);
        Task<PaymentDto> UpdatePaymentAsync(int clientId, int paymentNumber, UpdatePaymentRM updateDto);
        Task<bool> DeletePaymentAsync(int clientId, int paymentNumber);
        Task<IEnumerable<ClientListDto>> GetAllClientsListAsync(); 
        Task<IEnumerable<ClientListDto>> SearchClientsAsync(string searchTerm);   
        Task<ClientDto> CreateClientMinimalAsync(CreateClientMinimalRM  createDto);
        Task<IEnumerable<BirthdayNotificationDto>> GetUpcomingBirthdaysAsync(int days = 10);

    }
}
