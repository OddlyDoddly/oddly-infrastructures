/**
 * Base Mapper Interface
 * ALL transformations MUST use explicit mappers.
 */

export interface IMapper<TDto, TModel, TWriteEntity, TReadEntity, TResponse> {
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
  toModelFromRequest(p_dto: TDto): TModel;

  /**
   * Map BMO → WriteEntity.
   * Used by command repositories internally.
   */
  toWriteEntity(p_model: TModel): TWriteEntity;

  /**
   * Map WriteEntity → BMO.
   * Used by command repositories internally.
   */
  toModelFromWriteEntity(p_entity: TWriteEntity): TModel;

  /**
   * Map ReadEntity → Response DTO.
   * Used by query operations.
   */
  toResponseFromReadEntity(p_entity: TReadEntity): TResponse;

  /**
   * Map BMO → Response DTO.
   * Used after command operations.
   */
  toResponseFromModel(p_model: TModel): TResponse;
}
