/**
 * Command Repository Interface (Write Operations)
 * Works with WriteEntity, receives BMO, returns void/ID.
 */

package com.example.restddd.infrastructure.repositories;

import java.util.concurrent.CompletableFuture;

public interface ICommandRepository<TModel, TId> {
    /**
     * Interface for Command Repository (CQRS Write side).
     * 
     * Rules:
     * - Receives BMO (Business Model Object)
     * - Maps BMO → WriteEntity internally
     * - Returns void or ID
     * - Handles CREATE, UPDATE, DELETE operations
     */

    /**
     * Save a new entity.
     * Maps BMO → WriteEntity internally.
     * Returns the generated ID.
     */
    CompletableFuture<TId> saveAsync(TModel p_model);

    /**
     * Update an existing entity.
     * Maps BMO → WriteEntity internally.
     */
    CompletableFuture<Void> updateAsync(TModel p_model);

    /**
     * Delete an entity by ID.
     */
    CompletableFuture<Void> deleteAsync(TId p_id);

    /**
     * Check if entity exists by ID.
     */
    CompletableFuture<Boolean> existsAsync(TId p_id);
}
