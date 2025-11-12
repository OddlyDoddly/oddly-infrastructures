using System;
using System.Threading.Tasks;
using OddlyDdd.Application.Mappers;
using OddlyDdd.Domain.Models;
using OddlyDdd.Infrastructure.Persistence.Write;

namespace OddlyDdd.Infrastructure.Repositories.Impl
{
    /// <summary>
    /// Example command repository implementation demonstrating CQRS command side patterns.
    /// Repository implementations:
    /// - Live in /Infrastructure/Repositories/Impl/
    /// - Implement interface from parent directory
    /// - Map BMO ↔ WriteEntity internally using mapper
    /// - Handle database operations
    /// - NO business logic (that belongs in domain models)
    /// 
    /// Note: This is a template. Actual implementation would use a real database
    /// (Entity Framework, MongoDB.Driver, Dapper, etc.)
    /// </summary>
    public class ExampleCommandRepository : IExampleCommandRepository
    {
        private readonly ExampleMapper _mapper;
        // In real implementation: private readonly DbContext _dbContext;
        // Or: private readonly IMongoCollection<ExampleWriteEntity> _collection;

        public ExampleCommandRepository(ExampleMapper p_mapper)
        {
            _mapper = p_mapper;
        }

        /// <summary>
        /// Saves a new example to the database.
        /// Maps BMO → WriteEntity internally.
        /// </summary>
        public async Task<string> SaveAsync(ExampleModel p_model)
        {
            // Map BMO to WriteEntity
            var entity = _mapper.ToWriteEntity(p_model);

            // Save to database
            // Example with EF Core: await _dbContext.Examples.AddAsync(entity);
            // Example with MongoDB: await _collection.InsertOneAsync(entity);
            
            // Simulate async operation
            await Task.CompletedTask;

            return entity.Id;
        }

        /// <summary>
        /// Updates an existing example in the database.
        /// Maps BMO → WriteEntity internally.
        /// </summary>
        public async Task UpdateAsync(ExampleModel p_model)
        {
            // Map BMO to WriteEntity
            var entity = _mapper.ToWriteEntity(p_model);

            // Update in database
            // Example with EF Core: _dbContext.Examples.Update(entity);
            // Example with MongoDB: await _collection.ReplaceOneAsync(x => x.Id == entity.Id, entity);
            
            // Simulate async operation
            await Task.CompletedTask;
        }

        /// <summary>
        /// Deletes an example from the database.
        /// </summary>
        public async Task DeleteAsync(string p_id)
        {
            // Delete from database
            // Example with EF Core: _dbContext.Examples.Remove(entity);
            // Example with MongoDB: await _collection.DeleteOneAsync(x => x.Id == p_id);
            
            // Simulate async operation
            await Task.CompletedTask;
        }

        /// <summary>
        /// Checks if an example exists.
        /// </summary>
        public async Task<bool> ExistsAsync(string p_id)
        {
            // Check existence in database
            // Example with EF Core: return await _dbContext.Examples.AnyAsync(x => x.Id == p_id);
            // Example with MongoDB: return await _collection.CountDocumentsAsync(x => x.Id == p_id) > 0;
            
            // Simulate async operation
            await Task.CompletedTask;
            return false;
        }
    }
}
