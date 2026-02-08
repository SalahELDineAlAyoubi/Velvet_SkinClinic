using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using VelvetSkinClinic.Data;
using VelvetSkinClinic.Models;
using VelvetSkinClinic.Repositories.Interfaces;

namespace VelvetSkinClinic.Repositories
{
    public class ServiceRepository : Repository<Service>, IServiceRepository
    {
        public ServiceRepository(VelvetSkinClinicContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Service>> GetActiveServicesAsync()
        {
            return await _dbSet
                .Where(s => s.IsActive)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Service>> SearchServicesAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetActiveServicesAsync();

            searchTerm = searchTerm.ToLower();

            return await _dbSet
                .Where(s => s.IsActive &&
                       (s.Name.ToLower().Contains(searchTerm) ||
                        (s.Description != null && s.Description.ToLower().Contains(searchTerm))))
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<bool> ServiceExistsAsync(string name)
        {
            return await _dbSet.AnyAsync(s => s.Name.ToLower() == name.ToLower());
        }

        public async Task<bool> ServiceExistsAsync(string name, int excludeId)
        {
            return await _dbSet.AnyAsync(s =>
                s.Name.ToLower() == name.ToLower() && s.Id != excludeId);
        }
    }
}
