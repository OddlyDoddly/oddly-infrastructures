namespace OddlyDdd.Application.Mappers
{
    /// <summary>
    /// Base interface for mappers that transform between different object types.
    /// ALL transformations between DTOs, BMOs, and Entities MUST use explicit mappers.
    /// Mappers are MANDATORY for the following transformations:
    /// - DTO → BMO (Request to Business Model)
    /// - BMO → WriteEntity (Business Model to Persistence)
    /// - WriteEntity → BMO (Persistence to Business Model)
    /// - ReadEntity → Response DTO (Query Result to Response)
    /// - BMO → Response DTO (Business Model to Response)
    /// </summary>
    /// <typeparam name="TRequestDto">The request DTO type</typeparam>
    /// <typeparam name="TResponseDto">The response DTO type</typeparam>
    /// <typeparam name="TModel">The business model (BMO) type</typeparam>
    /// <typeparam name="TWriteEntity">The write entity type</typeparam>
    /// <typeparam name="TReadEntity">The read entity type</typeparam>
    public interface IMapper<TRequestDto, TResponseDto, TModel, TWriteEntity, TReadEntity>
    {
        /// <summary>
        /// Maps a request DTO to a business model.
        /// Used when receiving data from the API layer.
        /// </summary>
        TModel ToModelFromRequest(TRequestDto p_dto);

        /// <summary>
        /// Maps a business model to a write entity.
        /// Used when persisting data to the database (command side).
        /// </summary>
        TWriteEntity ToWriteEntity(TModel p_model);

        /// <summary>
        /// Maps a write entity to a business model.
        /// Used when loading data from the database for business logic.
        /// </summary>
        TModel ToModelFromWriteEntity(TWriteEntity p_entity);

        /// <summary>
        /// Maps a read entity to a response DTO.
        /// Used for query operations - bypasses BMO in read path for performance.
        /// </summary>
        TResponseDto ToResponseFromReadEntity(TReadEntity p_entity);

        /// <summary>
        /// Maps a business model to a response DTO.
        /// Used when returning data from command operations.
        /// </summary>
        TResponseDto ToResponseFromModel(TModel p_model);
    }
}
