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
