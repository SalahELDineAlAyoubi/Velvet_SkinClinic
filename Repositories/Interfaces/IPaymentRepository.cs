using System.Linq.Expressions;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Repositories.Interfaces
{
    public interface IPaymentRepository : IRepository<Payment>
    {
        Task<IEnumerable<Payment>> GetClientPaymentsAsync(int clientId);
        Task<Payment?> GetClientPaymentAsync(int clientId, int paymentNumber);
        Task<int> GetNextPaymentNumberAsync(int clientId);
    }
}
