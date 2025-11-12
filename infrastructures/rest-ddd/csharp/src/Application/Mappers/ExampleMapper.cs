/**
 * Example Mapper
 * MANDATORY for all transformations between layers.
 */

using Api.Dto;
using Domain.Models;
using Infrastructure.Persistence.Read;
using Infrastructure.Persistence.Write;
using System;

namespace Application.Mappers
{
    public class ExampleMapper : IMapper<
        CreateExampleRequest,
        ExampleModel,
        ExampleWriteEntity,
        ExampleReadEntity,
        ExampleResponse
    >
    {
        /**
         * Mapper for Example entity.
         * 
         * Rules:
         * - Located in /Application/Mappers/
         * - Handles all transformations: DTO ↔ BMO ↔ Entity
         * - MANDATORY for all layer transitions
         */

        public ExampleModel ToModelFromRequest(CreateExampleRequest p_dto)
        {
            return new ExampleModel(
                p_dto.Name,
                p_dto.Description,
                ExampleStatus.Pending,
                p_dto.OwnerId
            );
        }

        public ExampleWriteEntity ToWriteEntity(ExampleModel p_model)
        {
            return new ExampleWriteEntity(
                p_model.Name,
                p_model.Description,
                p_model.Status.ToString(),
                p_model.OwnerId
            )
            {
                Id = p_model.Id
            };
        }

        public ExampleModel ToModelFromWriteEntity(ExampleWriteEntity p_entity)
        {
            return new ExampleModel(
                p_entity.Name,
                p_entity.Description,
                Enum.Parse<ExampleStatus>(p_entity.Status),
                p_entity.OwnerId,
                p_entity.Id
            );
        }

        public ExampleResponse ToResponseFromReadEntity(ExampleReadEntity p_entity)
        {
            return new ExampleResponse
            {
                Id = p_entity.Id!,
                Name = p_entity.Name,
                Description = p_entity.Description,
                Status = p_entity.Status,
                OwnerId = p_entity.OwnerId,
                OwnerName = p_entity.OwnerName,
                CreatedAt = p_entity.CreatedAt,
                UpdatedAt = p_entity.UpdatedAt
            };
        }

        public ExampleResponse ToResponseFromModel(ExampleModel p_model)
        {
            return new ExampleResponse
            {
                Id = p_model.Id!,
                Name = p_model.Name,
                Description = p_model.Description,
                Status = p_model.Status.ToString(),
                OwnerId = p_model.OwnerId,
                OwnerName = string.Empty,  // Not available in model
                CreatedAt = DateTime.UtcNow.ToString("o"),
                UpdatedAt = DateTime.UtcNow.ToString("o")
            };
        }
    }
}
