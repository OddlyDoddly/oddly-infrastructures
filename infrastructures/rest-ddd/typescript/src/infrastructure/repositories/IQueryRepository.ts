/**
 * Query Repository Interface (Read Operations)
 * Returns ReadEntity directly to service (no BMO in read path).
 */

export interface IQueryRepository<TReadEntity, TId> {
  /**
   * Interface for Query Repository (CQRS Read side).
   * 
   * Rules:
   * - Returns ReadEntity directly (no BMO mapping)
   * - Optimized for query performance
   * - Handles SELECT operations only
   * - Uses denormalized ReadEntity views
   */

  /**
   * Find entity by ID.
   * Returns ReadEntity or null.
   */
  findByIdAsync(p_id: TId): Promise<TReadEntity | null>;

  /**
   * List entities by filter criteria with pagination.
   * Returns list of ReadEntity.
   */
  listByFilterAsync(
    p_filter: Record<string, any>,
    p_page?: number,
    p_pageSize?: number
  ): Promise<TReadEntity[]>;

  /**
   * Count entities matching filter criteria.
   */
  countByFilterAsync(p_filter: Record<string, any>): Promise<number>;
}
