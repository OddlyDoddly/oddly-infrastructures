package com.oddly.ddd.application.services;

import com.oddly.ddd.api.dto.v1.requests.CreateExampleRequest;
import com.oddly.ddd.api.dto.v1.requests.UpdateExampleRequest;
import com.oddly.ddd.api.dto.v1.responses.ExampleResponse;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Service interface for Example domain.
 * Service interfaces:
 * - Live in /application/services/
 * - Start with I prefix
 * - Implementations go in /application/services/impl/
 * - Orchestrate use-cases, transactions, and policies
 * - Call repositories and domain services
 * - NO business logic (delegate to domain models)
 */
public interface IExampleService {
    /**
     * Creates a new example.
     * Transaction managed by UnitOfWork middleware.
     */
    CompletableFuture<String> createExampleAsync(
        CreateExampleRequest p_request, 
        String p_userId, 
        String p_correlationId
    );

    /**
     * Updates an existing example.
     * Transaction managed by UnitOfWork middleware.
     */
    CompletableFuture<Void> updateExampleAsync(
        String p_id, 
        UpdateExampleRequest p_request, 
        String p_userId
    );

    /**
     * Deletes an example.
     * Transaction managed by UnitOfWork middleware.
     */
    CompletableFuture<Void> deleteExampleAsync(String p_id, String p_userId);

    /**
     * Gets an example by ID.
     * Uses read entity for optimized query.
     */
    CompletableFuture<ExampleResponse> getExampleAsync(String p_id);

    /**
     * Lists all examples with pagination.
     * Uses read entities for optimized queries.
     */
    CompletableFuture<List<ExampleResponse>> listExamplesAsync(int p_skip, int p_take);

    /**
     * Activates an example.
     */
    CompletableFuture<Void> activateExampleAsync(String p_id, String p_userId);

    /**
     * Deactivates an example.
     */
    CompletableFuture<Void> deactivateExampleAsync(String p_id, String p_userId);
}
