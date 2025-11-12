/**
 * Example Service Interface
 * Defines contract for Example use-cases.
 */

package com.example.restddd.application.services;

import com.example.restddd.domain.models.ExampleModel;
import com.example.restddd.infrastructure.persistence.read.ExampleReadEntity;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IExampleService {
    /**
     * Service interface for Example operations.
     * 
     * Rules:
     * - Located in /application/services/
     * - Prefix with 'I' for interface
     * - Implementation in /application/services/impl/
     * - Orchestrates use-cases
     * - NO business logic (belongs in domain)
     */

    /**
     * Create a new Example.
     */
    CompletableFuture<String> createAsync(ExampleModel p_model);

    /**
     * Update an existing Example.
     */
    CompletableFuture<Void> updateAsync(String p_id, ExampleModel p_model);

    /**
     * Delete an Example.
     */
    CompletableFuture<Void> deleteAsync(String p_id);

    /**
     * Get Example by ID.
     */
    CompletableFuture<ExampleReadEntity> getByIdAsync(String p_id);

    /**
     * List Examples with pagination.
     */
    CompletableFuture<List<ExampleReadEntity>> listAsync(int p_page, int p_pageSize);

    /**
     * Activate an Example.
     */
    CompletableFuture<Void> activateAsync(String p_id);

    /**
     * Deactivate an Example.
     */
    CompletableFuture<Void> deactivateAsync(String p_id);
}
