/**
 * Unit of Work interface for managing database transactions.
 * UnitOfWork:
 * - Manages database transaction lifecycle
 * - Applied automatically by UnitOfWorkMiddleware
 * - Services should NEVER manually manage transactions
 * - Commits on success (status < 400)
 * - Rolls back on error (status >= 400 or exception)
 * 
 * Middleware order (automatically applied):
 * 1. Correlation ID → 2. Logging → 3. Authentication → 
 * 4. Authorization/Ownership → 5. UnitOfWork → 6. Controller →
 * 7. UnitOfWork commit/rollback → 8. Error Handling
 */
export interface IUnitOfWork {
  /**
   * Begins a new database transaction.
   * Called automatically by middleware.
   */
  BeginTransactionAsync(): Promise<void>;

  /**
   * Commits the current transaction.
   * Called automatically by middleware on success.
   */
  CommitAsync(): Promise<void>;

  /**
   * Rolls back the current transaction.
   * Called automatically by middleware on error.
   */
  RollbackAsync(): Promise<void>;

  /**
   * Saves all changes to the database within the current transaction.
   * Optional - depends on ORM implementation.
   */
  SaveChangesAsync(): Promise<void>;
}
