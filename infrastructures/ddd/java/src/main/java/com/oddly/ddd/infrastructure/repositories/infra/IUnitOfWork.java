package com.oddly.ddd.infrastructure.repositories.infra;

import java.util.concurrent.CompletableFuture;

/**
 * Unit of Work pattern interface for managing database transactions.
 * Transactions are managed automatically by UnitOfWork middleware.
 * Services should NOT manually manage transactions.
 * 
 * Lifecycle:
 * 1. Middleware calls beginTransactionAsync() before controller
 * 2. Controller and service execute business logic
 * 3. Middleware calls commitAsync() on success or rollbackAsync() on error
 */
public interface IUnitOfWork {
    /**
     * Begins a new database transaction.
     * Called automatically by UnitOfWork middleware.
     */
    CompletableFuture<Void> beginTransactionAsync();

    /**
     * Commits the current transaction.
     * Called automatically by middleware on successful response (status < 400).
     */
    CompletableFuture<Void> commitAsync();

    /**
     * Rolls back the current transaction.
     * Called automatically by middleware on error (status >= 400 or exception).
     */
    CompletableFuture<Void> rollbackAsync();

    /**
     * Saves all pending changes to the database.
     * Used within a transaction to persist changes.
     */
    CompletableFuture<Void> saveChangesAsync();
}
