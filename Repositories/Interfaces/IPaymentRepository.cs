using System.Linq.Expressions;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Repositories.Interfaces
{
    public interface IPaymentRepository : IRepository<Payment>
    {
        Task<IEnumerable<Payment>> GetClientPaymentsAsync(int clientId);
        Task<Payment?> GetClientPaymentAsync(int clientId, int paymentNumber);
        Task<int> GetNextPaymentNumberAsync(int clientId);
        Task<IEnumerable<Payment>> GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate); 
        Task<IEnumerable<Payment>> GetPaymentsByMonthAsync(int year, int month);  
        Task<IEnumerable<Payment>> GetAllPaymentsWithClientsAsync();   
    }
}
