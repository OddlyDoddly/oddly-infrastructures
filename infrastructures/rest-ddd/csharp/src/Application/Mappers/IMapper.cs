/**
 * Base Mapper Interface
 * ALL transformations MUST use explicit mappers.
 */

namespace Application.Mappers
{
    public interface IMapper<TDto, TModel, TWriteEntity, TReadEntity, TResponse>
    {
        /**
         * Interface for mapping between layers.
         * 
         * Rules:
         * - MANDATORY for all transformations
         * - DTO ↔ BMO ↔ Entity conversions
         * - Located in /Application/Mappers/
         */

        /**
         * Map Request DTO → BMO (Business Model Object).
         * Used by controllers when receiving requests.
         */
        TModel ToModelFromRequest(TDto p_dto);

        /**
         * Map BMO → WriteEntity.
         * Used by command repositories internally.
         */
        TWriteEntity ToWriteEntity(TModel p_model);

        /**
         * Map WriteEntity → BMO.
         * Used by command repositories internally.
         */
        TModel ToModelFromWriteEntity(TWriteEntity p_entity);

        /**
         * Map ReadEntity → Response DTO.
         * Used by query operations.
         */
        TResponse ToResponseFromReadEntity(TReadEntity p_entity);

        /**
         * Map BMO → Response DTO.
         * Used after command operations.
         */
        TResponse ToResponseFromModel(TModel p_model);
    }
}
