using System.Linq.Expressions;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Repositories.Interfaces
{
    public interface IServiceRepository : IRepository<Service>
    {
        Task<IEnumerable<Service>> GetActiveServicesAsync();
        Task<IEnumerable<Service>> SearchServicesAsync(string searchTerm);
        Task<bool> ServiceExistsAsync(string name);
        Task<bool> ServiceExistsAsync(string name, int excludeId);
    }
}
