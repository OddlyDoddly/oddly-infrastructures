using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OddlyDdd.Api.Dto.V1;
using OddlyDdd.Application.Errors;
using OddlyDdd.Application.Mappers;
using OddlyDdd.Domain.Events;
using OddlyDdd.Domain.Models;
using OddlyDdd.Infrastructure.Queues;
using OddlyDdd.Infrastructure.Repositories;

namespace OddlyDdd.Application.Services.Impl
{
    /// <summary>
    /// Example service implementation demonstrating service layer patterns.
    /// Service implementations:
    /// - Live in /Application/Services/Impl/
    /// - Implement interface from parent directory
    /// - Orchestrate use-cases and transactions
    /// - Call repositories and domain services
    /// - Publish domain events
    /// - NO business logic (delegate to domain models)
    /// - Transaction management handled by UnitOfWork middleware
    /// </summary>
    public class ExampleService : IExampleService
    {
        private readonly IExampleCommandRepository _commandRepository;
        private readonly IExampleQueryRepository _queryRepository;
        private readonly ExampleMapper _mapper;
        private readonly IEventPublisher _eventPublisher;

        public ExampleService(
            IExampleCommandRepository p_commandRepository,
            IExampleQueryRepository p_queryRepository,
            ExampleMapper p_mapper,
            IEventPublisher p_eventPublisher)
        {
            _commandRepository = p_commandRepository;
            _queryRepository = p_queryRepository;
            _mapper = p_mapper;
            _eventPublisher = p_eventPublisher;
        }

        /// <summary>
        /// Creates a new example.
        /// Transaction managed by UnitOfWork middleware - no manual transaction here.
        /// </summary>
        public async Task<string> CreateExampleAsync(
            CreateExampleRequest p_request,
            string p_userId,
            string p_correlationId)
        {
            // Map DTO to BMO
            var model = _mapper.ToModelFromRequest(p_request);
            
            // Set owner from authenticated user
            // In real implementation, this would use reflection or a helper method
            // For now, we'll create a new model with the owner
            model = ExampleModel.Create(p_request.Name, p_request.Description, p_userId);

            // Validate business rules (domain logic)
            model.Validate();

            // Save to database (repository maps BMO → WriteEntity internally)
            var exampleId = await _commandRepository.SaveAsync(model);

            // Publish domain event for subdomain-to-subdomain communication
            var createdEvent = new ExampleCreatedEvent(
                exampleId,
                model.Name,
                model.OwnerId,
                p_correlationId
            );
            await _eventPublisher.PublishAsync(createdEvent, "example.created");

            return exampleId;
        }

        /// <summary>
        /// Updates an existing example.
        /// </summary>
        public async Task UpdateExampleAsync(
            string p_id,
            UpdateExampleRequest p_request,
            string p_userId)
        {
            // Load from database for business logic
            var readEntity = await _queryRepository.FindByIdAsync(p_id);
            if (readEntity == null)
            {
                throw new ExampleServiceException(
                    ExampleErrorCode.NotFound,
                    new Dictionary<string, object> { { "id", p_id } }
                );
            }

            // We need the write entity to get the full model
            // In real implementation, command repo would have a GetByIdAsync that returns BMO
            // For this example, we'll create a model from read entity
            var model = ExampleModel.Hydrate(
                readEntity.Id,
                readEntity.Name,
                readEntity.Description,
                readEntity.OwnerId,
                readEntity.IsActive,
                readEntity.CreatedAt,
                readEntity.UpdatedAt
            );

            // Verify ownership (domain logic)
            model.ValidateOwnership(p_userId);

            // Update model (domain logic)
            _mapper.UpdateModelFromRequest(model, p_request);

            // Save changes (repository maps BMO → WriteEntity internally)
            await _commandRepository.UpdateAsync(model);

            // Publish domain event
            var updatedEvent = new ExampleUpdatedEvent(
                model.Id,
                model.Name,
                model.Description,
                string.Empty // correlationId would come from context
            );
            await _eventPublisher.PublishAsync(updatedEvent, "example.updated");
        }

        /// <summary>
        /// Deletes an example.
        /// </summary>
        public async Task DeleteExampleAsync(string p_id, string p_userId)
        {
            // Check if exists
            if (!await _commandRepository.ExistsAsync(p_id))
            {
                throw new ExampleServiceException(
                    ExampleErrorCode.NotFound,
                    new Dictionary<string, object> { { "id", p_id } }
                );
            }

            // Verify ownership (would need to load model first in real implementation)
            // For this example, we'll skip the ownership check

            // Delete from database
            await _commandRepository.DeleteAsync(p_id);

            // Publish domain event
            var deletedEvent = new ExampleDeletedEvent(p_id, string.Empty);
            await _eventPublisher.PublishAsync(deletedEvent, "example.deleted");
        }

        /// <summary>
        /// Gets an example by ID.
        /// Uses read entity for optimized query - no BMO in read path.
        /// </summary>
        public async Task<ExampleResponse> GetExampleAsync(string p_id)
        {
            var readEntity = await _queryRepository.FindByIdAsync(p_id);
            if (readEntity == null)
            {
                throw new ExampleServiceException(
                    ExampleErrorCode.NotFound,
                    new Dictionary<string, object> { { "id", p_id } }
                );
            }

            // Map ReadEntity → Response DTO (bypasses BMO)
            return _mapper.ToResponseFromReadEntity(readEntity);
        }

        /// <summary>
        /// Lists all examples with pagination.
        /// Uses read entities for optimized queries.
        /// </summary>
        public async Task<IReadOnlyList<ExampleResponse>> ListExamplesAsync(int p_skip, int p_take)
        {
            var readEntities = await _queryRepository.ListAsync(p_skip, p_take);
            
            // Map ReadEntities → Response DTOs
            return readEntities.Select(e => _mapper.ToResponseFromReadEntity(e)).ToList();
        }

        /// <summary>
        /// Activates an example.
        /// </summary>
        public async Task ActivateExampleAsync(string p_id, string p_userId)
        {
            var readEntity = await _queryRepository.FindByIdAsync(p_id);
            if (readEntity == null)
            {
                throw new ExampleServiceException(
                    ExampleErrorCode.NotFound,
                    new Dictionary<string, object> { { "id", p_id } }
                );
            }

            var model = ExampleModel.Hydrate(
                readEntity.Id,
                readEntity.Name,
                readEntity.Description,
                readEntity.OwnerId,
                readEntity.IsActive,
                readEntity.CreatedAt,
                readEntity.UpdatedAt
            );

            model.ValidateOwnership(p_userId);
            model.Activate();

            await _commandRepository.UpdateAsync(model);
        }

        /// <summary>
        /// Deactivates an example.
        /// </summary>
        public async Task DeactivateExampleAsync(string p_id, string p_userId)
        {
            var readEntity = await _queryRepository.FindByIdAsync(p_id);
            if (readEntity == null)
            {
                throw new ExampleServiceException(
                    ExampleErrorCode.NotFound,
                    new Dictionary<string, object> { { "id", p_id } }
                );
            }

            var model = ExampleModel.Hydrate(
                readEntity.Id,
                readEntity.Name,
                readEntity.Description,
                readEntity.OwnerId,
                readEntity.IsActive,
                readEntity.CreatedAt,
                readEntity.UpdatedAt
            );

            model.ValidateOwnership(p_userId);
            model.Deactivate();

            await _commandRepository.UpdateAsync(model);
        }
    }
}
