using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using VelvetSkinClinic.Data;
using VelvetSkinClinic.Models;
using VelvetSkinClinic.Repositories.Interfaces;

namespace VelvetSkinClinic.Repositories
{
    public class ClientRepository : Repository<Client>, IClientRepository
    {
        public ClientRepository(VelvetSkinClinicContext context) : base(context)
        {
        }

        public async Task<Client?> GetClientWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(c => c.ClientServices)
                    .ThenInclude(cs => cs.Service)
                .Include(c => c.Payments.OrderBy(p => p.PaymentNumber))
                .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);
        }

        public async Task<Client?> GetClientByIdentifierAsync(string clientIdentifier)
        {
            return await _dbSet
                .Include(c => c.ClientServices)
                    .ThenInclude(cs => cs.Service)
                .Include(c => c.Payments.OrderBy(p => p.PaymentNumber))
                .FirstOrDefaultAsync(c => c.ClientIdentifier == clientIdentifier && c.IsActive);
        }

        public async Task<IEnumerable<Client>> GetActiveClientsAsync()
        {
            return await _dbSet
                .Where(c => c.IsActive)
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<bool> ClientIdentifierExistsAsync(string clientIdentifier)
        {
            return await _dbSet.AnyAsync(c => c.ClientIdentifier == clientIdentifier);
        }

        public async Task<bool> ClientIdentifierExistsAsync(string clientIdentifier, int excludeId)
        {
            return await _dbSet.AnyAsync(c =>
                c.ClientIdentifier == clientIdentifier && c.Id != excludeId);
        }
    }
}

