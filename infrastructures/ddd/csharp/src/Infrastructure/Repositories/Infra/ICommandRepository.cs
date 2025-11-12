using System.Threading.Tasks;

namespace OddlyDdd.Infrastructure.Repositories.Infra
{
    /// <summary>
    /// Base interface for command repositories (write operations in CQRS).
    /// Command repositories work with WriteEntities and receive BMOs (Business Model Objects).
    /// They handle the mapping from BMO to WriteEntity internally.
    /// </summary>
    /// <typeparam name="TModel">The business model object type (BMO)</typeparam>
    /// <typeparam name="TId">The identifier type</typeparam>
    public interface ICommandRepository<TModel, TId>
    {
        /// <summary>
        /// Saves a new entity to the database.
        /// Maps BMO to WriteEntity internally.
        /// </summary>
        /// <param name="p_model">The business model to save</param>
        /// <returns>The identifier of the created entity</returns>
        Task<TId> SaveAsync(TModel p_model);

        /// <summary>
        /// Updates an existing entity in the database.
        /// Maps BMO to WriteEntity internally.
        /// </summary>
        /// <param name="p_model">The business model to update</param>
        Task UpdateAsync(TModel p_model);

        /// <summary>
        /// Deletes an entity from the database by its identifier.
        /// </summary>
        /// <param name="p_id">The identifier of the entity to delete</param>
        Task DeleteAsync(TId p_id);

        /// <summary>
        /// Checks if an entity exists by its identifier.
        /// </summary>
        /// <param name="p_id">The identifier to check</param>
        /// <returns>True if the entity exists, false otherwise</returns>
        Task<bool> ExistsAsync(TId p_id);
    }
}
