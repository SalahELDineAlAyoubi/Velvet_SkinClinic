using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using VelvetSkinClinic.Data;
using VelvetSkinClinic.Models;
using VelvetSkinClinic.Repositories.Interfaces;

namespace VelvetSkinClinic.Repositories
{
    public class PaymentRepository : Repository<Payment>, IPaymentRepository
    {
        public PaymentRepository(VelvetSkinClinicContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Payment>> GetClientPaymentsAsync(int clientId)
        {
            return await _dbSet
                .Where(p => p.ClientId == clientId)
                .OrderBy(p => p.PaymentNumber)
                .ToListAsync();
        }

        public async Task<Payment?> GetClientPaymentAsync(int clientId, int paymentNumber)
        {
            return await _dbSet
                .FirstOrDefaultAsync(p => p.ClientId == clientId && p.PaymentNumber == paymentNumber);
        }

        public async Task<int> GetNextPaymentNumberAsync(int clientId)
        {
            var maxPaymentNumber = await _dbSet
                .Where(p => p.ClientId == clientId)
                .MaxAsync(p => (int?)p.PaymentNumber);

            return (maxPaymentNumber ?? 0) + 1;
        }
    }
}