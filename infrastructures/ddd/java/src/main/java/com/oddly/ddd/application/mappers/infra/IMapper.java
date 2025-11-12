package com.oddly.ddd.application.mappers.infra;

/**
 * Base interface for all mappers.
 * Mappers handle transformations between different object types:
 * - DTO ↔ BMO (Business Model Object)
 * - BMO ↔ WriteEntity
 * - ReadEntity → Response DTO
 * 
 * Mappers:
 * - Live in /application/mappers/
 * - Have Mapper suffix
 * - Implementations are in root (NO /impl/ subdirectory - no autowiring contracts)
 * - ALL transformations MUST use explicit mappers
 * 
 * @param <TRequest> The request DTO type
 * @param <TResponse> The response DTO type
 * @param <TModel> The business model object type (BMO)
 * @param <TWriteEntity> The write entity type
 * @param <TReadEntity> The read entity type
 */
public interface IMapper<TRequest, TResponse, TModel, TWriteEntity, TReadEntity> {
    /**
     * Converts a request DTO to a business model.
     * Used when receiving data from the API layer.
     * 
     * @param p_request The request DTO
     * @return The business model
     */
    TModel toModelFromRequest(TRequest p_request);

    /**
     * Converts a business model to a write entity.
     * Used by command repositories when persisting data.
     * 
     * @param p_model The business model
     * @return The write entity
     */
    TWriteEntity toWriteEntity(TModel p_model);

    /**
     * Converts a write entity to a business model.
     * Used by command repositories when reading data for commands.
     * 
     * @param p_entity The write entity
     * @return The business model
     */
    TModel toModelFromWriteEntity(TWriteEntity p_entity);

    /**
     * Converts a read entity to a response DTO.
     * Used by query repositories when returning data to the API layer.
     * Read entities are already optimized for queries, so no BMO conversion.
     * 
     * @param p_entity The read entity
     * @return The response DTO
     */
    TResponse toResponseFromReadEntity(TReadEntity p_entity);

    /**
     * Converts a business model to a response DTO.
     * Used when returning data from command operations.
     * 
     * @param p_model The business model
     * @return The response DTO
     */
    TResponse toResponseFromModel(TModel p_model);
}
