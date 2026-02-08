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

        // ✅ Get payments by date range
        public async Task<IEnumerable<Payment>> GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Include(p => p.Client)
                .Where(p => p.PaymentDate >= DateOnly.FromDateTime(startDate) && p.PaymentDate <= DateOnly.FromDateTime(endDate))
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }

        // ✅ Get payments by specific month
        public async Task<IEnumerable<Payment>> GetPaymentsByMonthAsync(int year, int month)
        {
            return await _dbSet
                .Include(p => p.Client)
                .Where(p => p.PaymentDate.Year == year && p.PaymentDate.Month == month)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }

        // ✅ Get all payments with client details
        public async Task<IEnumerable<Payment>> GetAllPaymentsWithClientsAsync()
        {
            return await _dbSet
                .Include(p => p.Client)
                .Where(p => p.Client.IsActive)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }
    }
}