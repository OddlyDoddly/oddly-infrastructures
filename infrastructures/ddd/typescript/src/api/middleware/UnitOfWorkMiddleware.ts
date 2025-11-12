import { Request, Response, NextFunction } from 'express';
import { IUnitOfWork } from '../../infrastructure/repositories/infra/IUnitOfWork';

/**
 * Middleware for managing database transactions using Unit of Work pattern.
 * MUST be applied AFTER authentication/authorization but BEFORE controller execution.
 * 
 * Automatically:
 * - Begins transaction before controller execution
 * - Commits on success (status < 400)
 * - Rolls back on error (status >= 400 or exception)
 * 
 * Services should NOT manually manage transactions.
 * 
 * Middleware order:
 * 1. Correlation ID → 2. Logging → 3. Authentication → 
 * 4. Authorization/Ownership → 5. UnitOfWork (THIS) → 6. Controller →
 * 7. UnitOfWork commit/rollback (THIS) → 8. Error Handling
 */
export class UnitOfWorkMiddleware {
  private readonly _unitOfWork: IUnitOfWork;

  constructor(p_unitOfWork: IUnitOfWork) {
    this._unitOfWork = p_unitOfWork;
  }

  /**
   * Middleware handler function.
   * Use with Express: app.use((req, res, next) => middleware.Handle(req, res, next))
   */
  public async Handle(
    p_request: Request,
    p_response: Response,
    p_next: NextFunction
  ): Promise<void> {
    // Only apply UnitOfWork for mutating operations
    const method = p_request.method;
    const isMutating = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';

    if (!isMutating) {
      p_next();
      return;
    }

    try {
      // Begin transaction
      await this._unitOfWork.BeginTransactionAsync();

      // Store original end function
      const originalEnd = p_response.end;

      // Intercept response end to commit/rollback based on status
      const self = this;
      p_response.end = function (...args: any[]): any {
        // Restore original end function
        p_response.end = originalEnd;

        // Commit or rollback based on status code
        const statusCode = p_response.statusCode;
        if (statusCode < 400) {
          // Success - commit transaction
          self._unitOfWork
            .CommitAsync()
            .then(() => {
              (p_response.end as any).apply(p_response, args);
            })
            .catch((error: Error) => {
              console.error('[UnitOfWork] Commit failed:', error);
              p_response.status(500).json({ error: 'Transaction commit failed' });
            });
        } else {
          // Error - rollback transaction
          self._unitOfWork
            .RollbackAsync()
            .then(() => {
              (p_response.end as any).apply(p_response, args);
            })
            .catch((error: Error) => {
              console.error('[UnitOfWork] Rollback failed:', error);
              (p_response.end as any).apply(p_response, args);
            });
        }

        return p_response;
      };

      // Call next middleware
      p_next();
    } catch (error) {
      // Rollback on any exception
      try {
        await this._unitOfWork.RollbackAsync();
      } catch (rollbackError) {
        console.error('[UnitOfWork] Rollback failed:', rollbackError);
      }
      p_next(error);
    }
  }
}
