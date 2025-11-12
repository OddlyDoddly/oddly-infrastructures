/**
 * UnitOfWork Middleware (MANDATORY)
 * Handles ALL transactions automatically.
 */

package com.example.restddd.api.middleware;

import java.util.concurrent.CompletableFuture;

public interface IUnitOfWork {
    /**
     * UnitOfWork interface for transaction management.
     * 
     * Rules:
     * - Middleware handles ALL transactions
     * - NO manual transaction management in services
     * - Auto-commit on success (status < 400)
     * - Auto-rollback on failure (status >= 400 or exception)
     */

    /**
     * Begin a new transaction.
     */
    CompletableFuture<Void> beginTransactionAsync();

    /**
     * Commit the current transaction.
     */
    CompletableFuture<Void> commitAsync();

    /**
     * Rollback the current transaction.
     */
    CompletableFuture<Void> rollbackAsync();

    /**
     * Save changes without committing (for batching).
     */
    CompletableFuture<Void> saveChangesAsync();
}

/**
 * Spring Boot Interceptor for UnitOfWork.
 * 
 * Order: After authentication/authorization, before controller
 * 
 * Note: In Spring Boot, implement HandlerInterceptor or use @Aspect
 */
