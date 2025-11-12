/**
 * Example Command Repository Implementation
 * Handles write operations (CREATE, UPDATE, DELETE).
 */

using System;
using System.Threading.Tasks;
using Application.Mappers;
using Domain.Models;
using Infrastructure.Persistence.Write;

namespace Infrastructure.Repositories.Impl
{
    public class ExampleCommandRepository : ICommandRepository<ExampleModel, string>
    {
        /**
         * Command Repository for Example entity.
         * 
         * Rules:
         * - Located in /Infrastructure/Repositories/Impl/
         * - Suffix with 'Repository'
         * - Receives BMO, maps to WriteEntity internally
         * - Returns void or ID
         */

        private readonly ExampleMapper _mapper;
        // Add database connection/context here
        // private readonly DatabaseContext _dbContext;

        public ExampleCommandRepository(ExampleMapper p_mapper)
        {
            _mapper = p_mapper;
        }

        public async Task<string> SaveAsync(ExampleModel p_model)
        {
            // Map BMO → WriteEntity
            var entity = _mapper.ToWriteEntity(p_model);

            // Save to database
            // await _dbContext.Examples.InsertOneAsync(entity);

            // Placeholder: generate ID
            entity.Id = GenerateId();

            return entity.Id;
        }

        public async Task UpdateAsync(ExampleModel p_model)
        {
            // Map BMO → WriteEntity
            var entity = _mapper.ToWriteEntity(p_model);

            // Update version for optimistic locking
            entity.IncrementVersion();

            // Update in database
            // var filter = Builders<ExampleWriteEntity>.Filter.And(
            //     Builders<ExampleWriteEntity>.Filter.Eq(e => e.Id, entity.Id),
            //     Builders<ExampleWriteEntity>.Filter.Eq(e => e.Version, entity.Version - 1)
            // );
            // await _dbContext.Examples.ReplaceOneAsync(filter, entity);

            await Task.CompletedTask;
        }

        public async Task DeleteAsync(string p_id)
        {
            // Delete from database
            // await _dbContext.Examples.DeleteOneAsync(e => e.Id == p_id);

            await Task.CompletedTask;
        }

        public async Task<bool> ExistsAsync(string p_id)
        {
            // Check if exists in database
            // var count = await _dbContext.Examples.CountDocumentsAsync(e => e.Id == p_id);
            // return count > 0;

            // Placeholder
            await Task.CompletedTask;
            return false;
        }

        private string GenerateId()
        {
            return $"example_{DateTime.UtcNow.Ticks}_{Guid.NewGuid().ToString("N").Substring(0, 8)}";
        }
    }
}
