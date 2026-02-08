using System.Linq.Expressions;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Repositories.Interfaces
{
    public interface IClientRepository : IRepository<Client>
    {
        Task<Client?> GetClientWithDetailsAsync(int id);
        Task<Client?> GetClientByIdentifierAsync(string clientIdentifier);
        Task<IEnumerable<Client>> GetActiveClientsAsync();
        Task<bool> ClientIdentifierExistsAsync(string clientIdentifier);
        Task<bool> ClientIdentifierExistsAsync(string clientIdentifier, int excludeId);
    }
}
