/**
 * Query Repository Interface (Read Operations)
 * Returns ReadEntity directly to service (no BMO in read path).
 */

package com.example.restddd.infrastructure.repositories;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public interface IQueryRepository<TReadEntity, TId> {
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
    CompletableFuture<TReadEntity> findByIdAsync(TId p_id);

    /**
     * List entities by filter criteria with pagination.
     * Returns list of ReadEntity.
     */
    CompletableFuture<List<TReadEntity>> listByFilterAsync(
        Map<String, Object> p_filter,
        int p_page,
        int p_pageSize
    );

    /**
     * Count entities matching filter criteria.
     */
    CompletableFuture<Integer> countByFilterAsync(Map<String, Object> p_filter);
}
