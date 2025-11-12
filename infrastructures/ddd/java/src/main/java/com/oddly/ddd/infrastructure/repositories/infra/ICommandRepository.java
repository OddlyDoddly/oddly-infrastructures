package com.oddly.ddd.infrastructure.repositories.infra;

import java.util.concurrent.CompletableFuture;

/**
 * Base interface for command repositories (write operations in CQRS).
 * Command repositories work with WriteEntities and receive BMOs (Business Model Objects).
 * They handle the mapping from BMO to WriteEntity internally.
 * 
 * @param <TModel> The business model object type (BMO)
 * @param <TId> The identifier type
 */
public interface ICommandRepository<TModel, TId> {
    /**
     * Saves a new entity to the database.
     * Maps BMO to WriteEntity internally.
     * 
     * @param p_model The business model to save
     * @return The identifier of the created entity
     */
    CompletableFuture<TId> saveAsync(TModel p_model);

    /**
     * Updates an existing entity in the database.
     * Maps BMO to WriteEntity internally.
     * 
     * @param p_model The business model to update
     */
    CompletableFuture<Void> updateAsync(TModel p_model);

    /**
     * Deletes an entity from the database by its identifier.
     * 
     * @param p_id The identifier of the entity to delete
     */
    CompletableFuture<Void> deleteAsync(TId p_id);

    /**
     * Checks if an entity exists by its identifier.
     * 
     * @param p_id The identifier to check
     * @return True if the entity exists, false otherwise
     */
    CompletableFuture<Boolean> existsAsync(TId p_id);
}
