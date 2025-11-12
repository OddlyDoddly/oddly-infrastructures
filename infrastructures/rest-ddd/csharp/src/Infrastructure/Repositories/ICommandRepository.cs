/**
 * Command Repository Interface (Write Operations)
 * Works with WriteEntity, receives BMO, returns void/ID.
 */

using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public interface ICommandRepository<TModel, TId>
    {
        /**
         * Interface for Command Repository (CQRS Write side).
         * 
         * Rules:
         * - Receives BMO (Business Model Object)
         * - Maps BMO → WriteEntity internally
         * - Returns void or ID
         * - Handles CREATE, UPDATE, DELETE operations
         */

        /**
         * Save a new entity.
         * Maps BMO → WriteEntity internally.
         * Returns the generated ID.
         */
        Task<TId> SaveAsync(TModel p_model);

        /**
         * Update an existing entity.
         * Maps BMO → WriteEntity internally.
         */
        Task UpdateAsync(TModel p_model);

        /**
         * Delete an entity by ID.
         */
        Task DeleteAsync(TId p_id);

        /**
         * Check if entity exists by ID.
         */
        Task<bool> ExistsAsync(TId p_id);
    }
}
