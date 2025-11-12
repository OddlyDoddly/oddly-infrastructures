using OddlyDdd.Domain.Models;
using OddlyDdd.Infrastructure.Repositories.Infra;

namespace OddlyDdd.Infrastructure.Repositories
{
    /// <summary>
    /// Example command repository interface demonstrating CQRS command side.
    /// Command repositories:
    /// - Work with WriteEntities internally
    /// - Receive BMOs (Business Model Objects) from services
    /// - Return void or IDs
    /// - Handle mapping BMO ↔ WriteEntity internally using mapper
    /// - Used for: Create, Update, Delete operations
    /// </summary>
    public interface IExampleCommandRepository : ICommandRepository<ExampleModel, string>
    {
        // Additional command-specific methods can be added here if needed
        // Base interface provides: SaveAsync, UpdateAsync, DeleteAsync, ExistsAsync
    }
}
