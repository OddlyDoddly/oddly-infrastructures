/**
 * Example Service Interface
 * Defines contract for Example use-cases.
 */

using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Models;
using Infrastructure.Persistence.Read;

namespace Application.Services
{
    public interface IExampleService
    {
        /**
         * Service interface for Example operations.
         * 
         * Rules:
         * - Located in /Application/Services/
         * - Prefix with 'I' for interface
         * - Implementation in /Application/Services/Impl/
         * - Orchestrates use-cases
         * - NO business logic (belongs in domain)
         */

        /**
         * Create a new Example.
         */
        Task<string> CreateAsync(ExampleModel p_model);

        /**
         * Update an existing Example.
         */
        Task UpdateAsync(string p_id, ExampleModel p_model);

        /**
         * Delete an Example.
         */
        Task DeleteAsync(string p_id);

        /**
         * Get Example by ID.
         */
        Task<ExampleReadEntity?> GetByIdAsync(string p_id);

        /**
         * List Examples with pagination.
         */
        Task<List<ExampleReadEntity>> ListAsync(int p_page, int p_pageSize);

        /**
         * Activate an Example.
         */
        Task ActivateAsync(string p_id);

        /**
         * Deactivate an Example.
         */
        Task DeactivateAsync(string p_id);
    }
}
