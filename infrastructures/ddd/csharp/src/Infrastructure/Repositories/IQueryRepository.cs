using System.Collections.Generic;
using System.Threading.Tasks;

namespace OddlyDdd.Infrastructure.Repositories
{
    /// <summary>
    /// Base interface for query repositories (read operations in CQRS).
    /// Query repositories return ReadEntities directly to the service layer.
    /// No BMO mapping in the read path - ReadEntities are optimized views for queries.
    /// </summary>
    /// <typeparam name="TReadEntity">The read entity type</typeparam>
    /// <typeparam name="TId">The identifier type</typeparam>
    public interface IQueryRepository<TReadEntity, TId>
    {
        /// <summary>
        /// Finds a read entity by its identifier.
        /// </summary>
        /// <param name="p_id">The identifier to search for</param>
        /// <returns>The read entity if found, null otherwise</returns>
        Task<TReadEntity?> FindByIdAsync(TId p_id);

        /// <summary>
        /// Lists all read entities.
        /// </summary>
        /// <returns>A collection of read entities</returns>
        Task<IReadOnlyList<TReadEntity>> ListAllAsync();

        /// <summary>
        /// Lists read entities with pagination.
        /// </summary>
        /// <param name="p_skip">Number of items to skip</param>
        /// <param name="p_take">Number of items to take</param>
        /// <returns>A collection of read entities</returns>
        Task<IReadOnlyList<TReadEntity>> ListAsync(int p_skip, int p_take);

        /// <summary>
        /// Counts all read entities.
        /// </summary>
        /// <returns>The total count of entities</returns>
        Task<long> CountAsync();
    }
}
