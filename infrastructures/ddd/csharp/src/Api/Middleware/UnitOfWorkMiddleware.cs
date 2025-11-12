using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OddlyDdd.Infrastructure.Repositories.Infra;

namespace OddlyDdd.Api.Middleware
{
    /// <summary>
    /// Middleware for managing database transactions using Unit of Work pattern.
    /// MUST be applied AFTER authentication/authorization but BEFORE controller execution.
    /// Automatically commits on success (status &lt; 400) or rolls back on error (status &gt;= 400).
    /// Services should NOT manually manage transactions.
    /// </summary>
    public class UnitOfWorkMiddleware
    {
        private readonly RequestDelegate _next;

        public UnitOfWorkMiddleware(RequestDelegate p_next)
        {
            _next = p_next;
        }

        public async Task InvokeAsync(HttpContext p_context, IUnitOfWork p_unitOfWork)
        {
            // Only apply UnitOfWork for mutating operations
            var method = p_context.Request.Method;
            var isMutating = method == "POST" || method == "PUT" || method == "PATCH" || method == "DELETE";

            if (!isMutating)
            {
                await _next(p_context);
                return;
            }

            try
            {
                await p_unitOfWork.BeginTransactionAsync();
                
                await _next(p_context);

                // Commit if response is successful
                if (p_context.Response.StatusCode < 400)
                {
                    await p_unitOfWork.CommitAsync();
                }
                else
                {
                    await p_unitOfWork.RollbackAsync();
                }
            }
            catch (Exception)
            {
                // Rollback on any exception
                await p_unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}
