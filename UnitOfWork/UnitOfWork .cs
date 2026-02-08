using Microsoft.EntityFrameworkCore.Storage;
using System.Linq.Expressions;
using VelvetSkinClinic.Data;
using VelvetSkinClinic.Models;
using VelvetSkinClinic.Repositories.Interfaces;

namespace VelvetSkinClinic.Repositories.UnitOfWork
{
    public class UnitOfWork(VelvetSkinClinicContext context) : IUnitOfWork
    {
        private readonly VelvetSkinClinicContext _context = context;
        private IDbContextTransaction _transaction;

        private IRepository<User> _users;
        private IServiceRepository _services;
        private IClientRepository _clients;  
        private IPaymentRepository _payments;
        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }
        public IRepository<User> UsersRepository
        {
            get
            {
                _users ??= new Repository<User>(_context);
                return _users;
            }
        }
        public IServiceRepository ServicesRepository
        {
            get
            {
                _services ??= new ServiceRepository(_context);
                return _services;
            }
        }
 
        public IClientRepository ClientsRepository
        {
            get
            {
                _clients ??= new ClientRepository(_context);
                return _clients;
            }
        }

        public IPaymentRepository PaymentsRepository
        {
            get
            {
                _payments ??= new PaymentRepository(_context);
                return _payments;
            }
        }
        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                await _transaction.CommitAsync();
            }
            catch
            {
                await RollbackTransactionAsync();
                throw;
            }
            finally
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
