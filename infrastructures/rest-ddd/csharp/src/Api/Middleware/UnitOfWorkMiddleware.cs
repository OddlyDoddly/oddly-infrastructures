/**
 * UnitOfWork Middleware (MANDATORY)
 * Handles ALL transactions automatically.
 */

using System;
using System.Threading.Tasks;

namespace Api.Middleware
{
    public interface IUnitOfWork
    {
        /**
         * UnitOfWork interface for transaction management.
         * 
         * Rules:
         * - Middleware handles ALL transactions
         * - NO manual transaction management in services
         * - Auto-commit on success (status < 400)
         * - Auto-rollback on failure (status >= 400 or exception)
         */

        /**
         * Begin a new transaction.
         */
        Task BeginTransactionAsync();

        /**
         * Commit the current transaction.
         */
        Task CommitAsync();

        /**
         * Rollback the current transaction.
         */
        Task RollbackAsync();

        /**
         * Save changes without committing (for batching).
         */
        Task SaveChangesAsync();
    }

    public class UnitOfWorkMiddleware
    {
        /**
         * Middleware to automatically manage transactions.
         * 
         * Order: After authentication/authorization, before controller
         */

        private readonly IUnitOfWork _unitOfWork;

        public UnitOfWorkMiddleware(IUnitOfWork p_unitOfWork)
        {
            _unitOfWork = p_unitOfWork;
        }

        public async Task InvokeAsync(dynamic p_context, Func<Task> p_next)
        {
            /**
             * Execute request within transaction boundary.
             * 
             * Flow:
             * 1. Begin transaction
             * 2. Execute request
             * 3. Commit if successful (status < 400)
             * 4. Rollback if error (status >= 400 or exception)
             */

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                // Execute the request
                await p_next();

                // Check response status
                var statusCode = p_context.Response.StatusCode;

                if (statusCode < 400)
                {
                    await _unitOfWork.CommitAsync();
                }
                else
                {
                    await _unitOfWork.RollbackAsync();
                }
            }
            catch (Exception)
            {
                // Rollback on any exception
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}
