using System.Collections.Generic;
using System.Threading.Tasks;
using OddlyDdd.Api.Dto.V1.Requests;
using OddlyDdd.Api.Dto.V1.Responses;

namespace OddlyDdd.Application.Services
{
    /// <summary>
    /// Example service interface demonstrating service layer patterns.
    /// Service interfaces:
    /// - Live in /Application/Services/
    /// - Start with I prefix
    /// - Implementations go in /Application/Services/Impl/
    /// - Orchestrate use-cases, transactions, and policies
    /// - Call repositories and domain services
    /// - NO business logic (delegate to domain models)
    /// </summary>
    public interface IExampleService
    {
        /// <summary>
        /// Creates a new example.
        /// Transaction managed by UnitOfWork middleware.
        /// </summary>
        Task<string> CreateExampleAsync(CreateExampleRequest p_request, string p_userId, string p_correlationId);

        /// <summary>
        /// Updates an existing example.
        /// Transaction managed by UnitOfWork middleware.
        /// </summary>
        Task UpdateExampleAsync(string p_id, UpdateExampleRequest p_request, string p_userId);

        /// <summary>
        /// Deletes an example.
        /// Transaction managed by UnitOfWork middleware.
        /// </summary>
        Task DeleteExampleAsync(string p_id, string p_userId);

        /// <summary>
        /// Gets an example by ID.
        /// Uses read entity for optimized query.
        /// </summary>
        Task<ExampleResponse> GetExampleAsync(string p_id);

        /// <summary>
        /// Lists all examples with pagination.
        /// Uses read entities for optimized queries.
        /// </summary>
        Task<IReadOnlyList<ExampleResponse>> ListExamplesAsync(int p_skip, int p_take);

        /// <summary>
        /// Activates an example.
        /// </summary>
        Task ActivateExampleAsync(string p_id, string p_userId);

        /// <summary>
        /// Deactivates an example.
        /// </summary>
        Task DeactivateExampleAsync(string p_id, string p_userId);
    }
}
