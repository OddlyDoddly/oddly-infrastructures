/**
 * Query Repository Interface (Read Operations)
 * Returns ReadEntity directly to service (no BMO in read path).
 */

using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public interface IQueryRepository<TReadEntity, TId>
    {
        /**
         * Interface for Query Repository (CQRS Read side).
         * 
         * Rules:
         * - Returns ReadEntity directly (no BMO mapping)
         * - Optimized for query performance
         * - Handles SELECT operations only
         * - Uses denormalized ReadEntity views
         */

        /**
         * Find entity by ID.
         * Returns ReadEntity or null.
         */
        Task<TReadEntity?> FindByIdAsync(TId p_id);

        /**
         * List entities by filter criteria with pagination.
         * Returns list of ReadEntity.
         */
        Task<List<TReadEntity>> ListByFilterAsync(
            Dictionary<string, object> p_filter,
            int p_page = 1,
            int p_pageSize = 50
        );

        /**
         * Count entities matching filter criteria.
         */
        Task<int> CountByFilterAsync(Dictionary<string, object> p_filter);
    }
}
