using System;
using System.Threading.Tasks;

namespace OddlyDdd.Infrastructure.Repositories
{
    /// <summary>
    /// Unit of Work pattern for managing transactions.
    /// The UnitOfWork middleware handles ALL transaction management.
    /// Services should NOT manually manage transactions.
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        /// <summary>
        /// Begins a new transaction.
        /// Called by UnitOfWork middleware at the start of a request.
        /// </summary>
        Task BeginTransactionAsync();

        /// <summary>
        /// Commits the current transaction.
        /// Called by UnitOfWork middleware when the response status code is &lt; 400.
        /// </summary>
        Task CommitAsync();

        /// <summary>
        /// Rolls back the current transaction.
        /// Called by UnitOfWork middleware when an error occurs or status code is &gt;= 400.
        /// </summary>
        Task RollbackAsync();

        /// <summary>
        /// Saves changes to the database within the current transaction.
        /// </summary>
        Task SaveChangesAsync();
    }
}
