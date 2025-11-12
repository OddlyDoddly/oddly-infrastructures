import { Request } from 'express';

/**
 * Base class for all controllers.
 * Controllers:
 * - Live in /api/controllers/
 * - Suffix with "Controller"
 * - Handle HTTP only: bind, validate, authorize, map DTOs
 * - NO business logic (delegate to services)
 * - Are concrete implementations (no /impl/ subdirectory)
 * 
 * Middleware order (automatically applied):
 * 1. Correlation ID → 2. Logging → 3. Authentication → 
 * 4. Authorization/Ownership → 5. UnitOfWork → 6. Controller →
 * 7. UnitOfWork commit/rollback → 8. Error Handling
 */
export abstract class BaseController {
  /**
   * Extracts the user ID from the authenticated request.
   * Assumes authentication middleware has set user context.
   */
  protected GetUserId(p_request: Request): string {
    // In a real implementation, extract from authenticated user context
    // Example: return (p_request as any).user?.id || '';
    return (p_request as any).user?.id || '';
  }

  /**
   * Extracts the correlation ID from the request headers.
   * Set by CorrelationIdMiddleware.
   */
  protected GetCorrelationId(p_request: Request): string {
    return p_request.headers['x-correlation-id'] as string || '';
  }

  /**
   * Validates the request body.
   * Controllers should perform edge validation.
   */
  protected ValidateRequest(p_request: any): void {
    if (!p_request) {
      throw new Error('Request body cannot be null');
    }
  }
}
