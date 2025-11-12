using OddlyDdd.Api.Dto.V1;
using OddlyDdd.Application.Mappers.Infra;
using OddlyDdd.Domain.Models;
using OddlyDdd.Infrastructure.Persistence.Read;
using OddlyDdd.Infrastructure.Persistence.Write;

namespace OddlyDdd.Application.Mappers
{
    /// <summary>
    /// Example mapper demonstrating all required transformation patterns.
    /// Mappers:
    /// - Live in /Application/Mappers/
    /// - Have Mapper suffix
    /// - MANDATORY for all transformations between DTOs, BMOs, and Entities
    /// - Handle mapping logic explicitly (no AutoMapper magic)
    /// </summary>
    public class ExampleMapper : IMapper<CreateExampleRequest, ExampleResponse, ExampleModel, ExampleWriteEntity, ExampleReadEntity>
    {
        /// <summary>
        /// Maps CreateExampleRequest → ExampleModel (Request DTO to BMO)
        /// Used when receiving create commands from API layer
        /// </summary>
        public ExampleModel ToModelFromRequest(CreateExampleRequest p_dto)
        {
            // Note: OwnerId would typically come from authenticated user context
            // This is just for demonstration - controller should pass ownerId
            return ExampleModel.Create(
                p_dto.Name,
                p_dto.Description,
                string.Empty // OwnerId set by controller
            );
        }

        /// <summary>
        /// Maps ExampleModel → ExampleWriteEntity (BMO to Persistence)
        /// Used when persisting data to database (command side)
        /// </summary>
        public ExampleWriteEntity ToWriteEntity(ExampleModel p_model)
        {
            return new ExampleWriteEntity
            {
                Id = p_model.Id,
                Name = p_model.Name,
                Description = p_model.Description,
                OwnerId = p_model.OwnerId,
                IsActive = p_model.IsActive,
                CreatedAt = p_model.CreatedAt,
                UpdatedAt = p_model.UpdatedAt
            };
        }

        /// <summary>
        /// Maps ExampleWriteEntity → ExampleModel (Persistence to BMO)
        /// Used when loading data from database for business logic
        /// </summary>
        public ExampleModel ToModelFromWriteEntity(ExampleWriteEntity p_entity)
        {
            return ExampleModel.Hydrate(
                p_entity.Id,
                p_entity.Name,
                p_entity.Description,
                p_entity.OwnerId,
                p_entity.IsActive,
                p_entity.CreatedAt,
                p_entity.UpdatedAt
            );
        }

        /// <summary>
        /// Maps ExampleReadEntity → ExampleResponse (Query Result to Response DTO)
        /// Used for query operations - bypasses BMO in read path for performance
        /// </summary>
        public ExampleResponse ToResponseFromReadEntity(ExampleReadEntity p_entity)
        {
            return new ExampleResponse
            {
                Id = p_entity.Id,
                Name = p_entity.Name,
                Description = p_entity.Description,
                OwnerId = p_entity.OwnerId,
                OwnerName = p_entity.OwnerName,
                IsActive = p_entity.IsActive,
                DisplayName = p_entity.DisplayName,
                StatusText = p_entity.StatusText,
                CreatedAt = p_entity.CreatedAt,
                UpdatedAt = p_entity.UpdatedAt
            };
        }

        /// <summary>
        /// Maps ExampleModel → ExampleResponse (BMO to Response DTO)
        /// Used when returning data from command operations
        /// </summary>
        public ExampleResponse ToResponseFromModel(ExampleModel p_model)
        {
            return new ExampleResponse
            {
                Id = p_model.Id,
                Name = p_model.Name,
                Description = p_model.Description,
                OwnerId = p_model.OwnerId,
                OwnerName = string.Empty, // Not available in BMO, would need to be looked up
                IsActive = p_model.IsActive,
                DisplayName = p_model.Name, // Computed from model
                StatusText = p_model.IsActive ? "Active" : "Inactive",
                CreatedAt = p_model.CreatedAt,
                UpdatedAt = p_model.UpdatedAt
            };
        }

        /// <summary>
        /// Maps UpdateExampleRequest → updates to ExampleModel
        /// Used when receiving update commands from API layer
        /// </summary>
        public void UpdateModelFromRequest(ExampleModel p_model, UpdateExampleRequest p_request)
        {
            p_model.UpdateDetails(p_request.Name, p_request.Description);
        }
    }
}
