package com.oddly.ddd.infrastructure.repositories.infra;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

/**
 * Base interface for query repositories (read operations in CQRS).
 * Query repositories work with ReadEntities.
 * Returns ReadEntity directly to service (no BMO in read path).
 * 
 * @param <TReadEntity> The read entity type
 * @param <TId> The identifier type
 */
public interface IQueryRepository<TReadEntity, TId> {
    /**
     * Finds an entity by its identifier.
     * 
     * @param p_id The identifier to search for
     * @return Optional containing the entity if found, empty otherwise
     */
    CompletableFuture<Optional<TReadEntity>> findByIdAsync(TId p_id);

    /**
     * Lists all entities with pagination.
     * 
     * @param p_skip Number of records to skip
     * @param p_take Number of records to take
     * @return List of entities
     */
    CompletableFuture<List<TReadEntity>> listAsync(int p_skip, int p_take);

    /**
     * Counts the total number of entities.
     * 
     * @return Total count
     */
    CompletableFuture<Long> countAsync();
}
