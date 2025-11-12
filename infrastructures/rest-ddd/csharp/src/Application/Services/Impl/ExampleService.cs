/**
 * Example Service Implementation
 * Orchestrates Example use-cases.
 */

using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Errors;
using Application.Mappers;
using Domain.Events;
using Domain.Models;
using Infrastructure.Persistence.Read;
using Infrastructure.Queues;
using Infrastructure.Repositories;

namespace Application.Services.Impl
{
    public class ExampleService : IExampleService
    {
        /**
         * Service implementation for Example operations.
         * 
         * Rules:
         * - Located in /Application/Services/Impl/
         * - Suffix with 'Service'
         * - Orchestrates use-cases
         * - Calls repositories and domain services
         * - NO business logic (belongs in domain models)
         * - Transaction managed by UnitOfWork middleware
         */

        private readonly ICommandRepository<ExampleModel, string> _commandRepository;
        private readonly IQueryRepository<ExampleReadEntity, string> _queryRepository;
        private readonly IEventPublisher _eventPublisher;
        private readonly ExampleMapper _mapper;

        public ExampleService(
            ICommandRepository<ExampleModel, string> p_commandRepository,
            IQueryRepository<ExampleReadEntity, string> p_queryRepository,
            IEventPublisher p_eventPublisher,
            ExampleMapper p_mapper
        )
        {
            _commandRepository = p_commandRepository;
            _queryRepository = p_queryRepository;
            _eventPublisher = p_eventPublisher;
            _mapper = p_mapper;
        }

        public async Task<string> CreateAsync(ExampleModel p_model)
        {
            // Validate business rules
            p_model.Validate();

            // Save to database
            var exampleId = await _commandRepository.SaveAsync(p_model);

            // Publish domain event
            await _eventPublisher.PublishAsync(
                new ExampleCreatedEvent(exampleId, p_model.Name, p_model.OwnerId),
                "example.created"
            );

            return exampleId;
        }

        public async Task UpdateAsync(string p_id, ExampleModel p_model)
        {
            // Check if exists
            var exists = await _commandRepository.ExistsAsync(p_id);
            if (!exists)
            {
                throw new ExampleServiceException(
                    ExampleErrorCode.NotFound,
                    new Dictionary<string, object> { { "id", p_id } }
                );
            }

            // Validate business rules
            p_model.Validate();

            // Update in database
            await _commandRepository.UpdateAsync(p_model);
        }

        public async Task DeleteAsync(string p_id)
        {
            // Check if exists
            var exists = await _commandRepository.ExistsAsync(p_id);
            if (!exists)
            {
                throw new ExampleServiceException(
                    ExampleErrorCode.NotFound,
                    new Dictionary<string, object> { { "id", p_id } }
                );
            }

            // Delete from database
            await _commandRepository.DeleteAsync(p_id);
        }

        public async Task<ExampleReadEntity?> GetByIdAsync(string p_id)
        {
            // Query read entity
            var entity = await _queryRepository.FindByIdAsync(p_id);

            if (entity == null)
            {
                throw new ExampleServiceException(
                    ExampleErrorCode.NotFound,
                    new Dictionary<string, object> { { "id", p_id } }
                );
            }

            return entity;
        }

        public async Task<List<ExampleReadEntity>> ListAsync(int p_page, int p_pageSize)
        {
            // Query read entities with pagination
            return await _queryRepository.ListByFilterAsync(
                new Dictionary<string, object>(),
                p_page,
                p_pageSize
            );
        }

        public async Task ActivateAsync(string p_id)
        {
            // Get entity
            var entity = await _queryRepository.FindByIdAsync(p_id);
            if (entity == null)
            {
                throw new ExampleServiceException(
                    ExampleErrorCode.NotFound,
                    new Dictionary<string, object> { { "id", p_id } }
                );
            }

            // Would need to get WriteEntity to convert to model
            // This is placeholder logic
            throw new System.NotImplementedException("Need to fetch write entity");
        }

        public async Task DeactivateAsync(string p_id)
        {
            // Get entity
            var entity = await _queryRepository.FindByIdAsync(p_id);
            if (entity == null)
            {
                throw new ExampleServiceException(
                    ExampleErrorCode.NotFound,
                    new Dictionary<string, object> { { "id", p_id } }
                );
            }

            // Would need to get WriteEntity to convert to model
            // This is placeholder logic
            throw new System.NotImplementedException("Need to fetch write entity");
        }
    }
}
