/**
 * Base Mapper Interface
 * ALL transformations MUST use explicit mappers.
 */

package com.example.restddd.application.mappers;

public interface IMapper<TDto, TModel, TWriteEntity, TReadEntity, TResponse> {
    /**
     * Interface for mapping between layers.
     * 
     * Rules:
     * - MANDATORY for all transformations
     * - DTO ↔ BMO ↔ Entity conversions
     * - Located in /application/mappers/
     */

    /**
     * Map Request DTO → BMO (Business Model Object).
     * Used by controllers when receiving requests.
     */
    TModel toModelFromRequest(TDto p_dto);

    /**
     * Map BMO → WriteEntity.
     * Used by command repositories internally.
     */
    TWriteEntity toWriteEntity(TModel p_model);

    /**
     * Map WriteEntity → BMO.
     * Used by command repositories internally.
     */
    TModel toModelFromWriteEntity(TWriteEntity p_entity);

    /**
     * Map ReadEntity → Response DTO.
     * Used by query operations.
     */
    TResponse toResponseFromReadEntity(TReadEntity p_entity);

    /**
     * Map BMO → Response DTO.
     * Used after command operations.
     */
    TResponse toResponseFromModel(TModel p_model);
}
