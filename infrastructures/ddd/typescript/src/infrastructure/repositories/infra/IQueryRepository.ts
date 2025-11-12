/**
 * Base interface for query repositories (read operations in CQRS).
 * Query repositories:
 * - Return ReadEntities directly to services
 * - No BMO mapping in read path for performance
 * - Optimized for query operations
 * - Work with denormalized read models
 * 
 * @template TReadEntity The read entity type
 * @template TId The identifier type
 */
export interface IQueryRepository<TReadEntity, TId> {
  /**
   * Finds an entity by its identifier.
   * Returns ReadEntity directly (no BMO mapping).
   * @param p_id The identifier to find
   * @returns The read entity or null if not found
   */
  FindByIdAsync(p_id: TId): Promise<TReadEntity | null>;

  /**
   * Lists entities with pagination.
   * Returns ReadEntities directly (no BMO mapping).
   * @param p_skip Number of records to skip
   * @param p_take Number of records to take
   * @returns Array of read entities
   */
  ListAsync(p_skip: number, p_take: number): Promise<TReadEntity[]>;

  /**
   * Counts total number of entities.
   * @returns The total count
   */
  CountAsync(): Promise<number>;
}
