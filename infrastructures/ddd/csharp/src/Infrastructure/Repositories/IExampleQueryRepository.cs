using System.Collections.Generic;
using System.Threading.Tasks;
using OddlyDdd.Infrastructure.Persistence.Read;

namespace OddlyDdd.Infrastructure.Repositories
{
    /// <summary>
    /// Example query repository interface demonstrating CQRS query side.
    /// Query repositories:
    /// - Return ReadEntities directly to service
    /// - NO BMO mapping in read path (for performance)
    /// - Optimized for query patterns
    /// - Used for: Get, List, Search operations
    /// </summary>
    public interface IExampleQueryRepository : IQueryRepository<ExampleReadEntity, string>
    {
        /// <summary>
        /// Finds examples by owner ID.
        /// Example of a custom query method.
        /// </summary>
        Task<IReadOnlyList<ExampleReadEntity>> FindByOwnerIdAsync(string p_ownerId);

        /// <summary>
        /// Finds active examples only.
        /// Example of a custom query method.
        /// </summary>
        Task<IReadOnlyList<ExampleReadEntity>> FindActiveExamplesAsync(int p_skip, int p_take);
    }
}
