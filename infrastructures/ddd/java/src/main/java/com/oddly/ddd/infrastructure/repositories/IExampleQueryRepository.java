package com.oddly.ddd.infrastructure.repositories;

import com.oddly.ddd.infrastructure.persistence.read.ExampleReadEntity;
import com.oddly.ddd.infrastructure.repositories.infra.IQueryRepository;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Query repository interface for Example domain.
 * Query repositories:
 * - Live in /infrastructure/repositories/
 * - Have IQueryRepository suffix
 * - Implementations go in /infrastructure/repositories/impl/
 * - Work with ReadEntities
 * - Return ReadEntity directly to service (no BMO in read path)
 */
public interface IExampleQueryRepository extends IQueryRepository<ExampleReadEntity, String> {
    /**
     * Finds examples by category.
     * 
     * @param p_category The category to filter by
     * @return List of examples in the category
     */
    CompletableFuture<List<ExampleReadEntity>> findByCategoryAsync(String p_category);

    /**
     * Finds active examples.
     * 
     * @return List of active examples
     */
    CompletableFuture<List<ExampleReadEntity>> findActiveAsync();
}
