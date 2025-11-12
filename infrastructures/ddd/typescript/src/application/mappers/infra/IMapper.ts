/**
 * Base interface for all mappers.
 * Mappers:
 * - Live in /application/mappers/
 * - Suffix with "Mapper"
 * - MANDATORY for all transformations between DTOs, BMOs, and Entities
 * - Handle mapping logic explicitly (no AutoMapper magic)
 * - Are concrete implementations (no /impl/ subdirectory)
 * 
 * Mappers transform between:
 * - Request DTOs → BMOs
 * - BMOs → WriteEntities
 * - WriteEntities → BMOs
 * - ReadEntities → Response DTOs
 * - BMOs → Response DTOs
 * 
 * @template TRequestDto The request DTO type
 * @template TResponseDto The response DTO type
 * @template TModel The business model object (BMO) type
 * @template TWriteEntity The write entity type
 * @template TReadEntity The read entity type
 */
export interface IMapper<TRequestDto, TResponseDto, TModel, TWriteEntity, TReadEntity> {
  /**
   * Maps Request DTO → BMO
   * Used when receiving create/update commands from API layer
   */
  ToModelFromRequest(p_dto: TRequestDto): TModel;

  /**
   * Maps BMO → WriteEntity
   * Used when persisting data to database (command side)
   */
  ToWriteEntity(p_model: TModel): TWriteEntity;

  /**
   * Maps WriteEntity → BMO
   * Used when loading data from database for business logic
   */
  ToModelFromWriteEntity(p_entity: TWriteEntity): TModel;

  /**
   * Maps ReadEntity → Response DTO
   * Used for query operations - bypasses BMO in read path for performance
   */
  ToResponseFromReadEntity(p_entity: TReadEntity): TResponseDto;

  /**
   * Maps BMO → Response DTO
   * Used when returning data from command operations
   */
  ToResponseFromModel(p_model: TModel): TResponseDto;
}
