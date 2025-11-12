import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Middleware for tracking requests across services using correlation IDs.
 * MUST be applied FIRST in the middleware pipeline.
 * 
 * This middleware:
 * - Extracts correlation ID from incoming request headers
 * - Generates a new one if not present
 * - Adds it to request headers for downstream use
 * - Adds it to response headers for client tracking
 * 
 * Header name: x-correlation-id
 * 
 * Middleware order:
 * 1. Correlation ID (THIS) → 2. Logging → 3. Authentication → 
 * 4. Authorization/Ownership → 5. UnitOfWork → 6. Controller →
 * 7. UnitOfWork commit/rollback → 8. Error Handling
 */
export class CorrelationIdMiddleware {
  /**
   * Middleware handler function.
   * Use with Express: app.use((req, res, next) => CorrelationIdMiddleware.Handle(req, res, next))
   */
  public static Handle(p_request: Request, p_response: Response, p_next: NextFunction): void {
    // Extract correlation ID from header or generate new one
    let correlationId = p_request.headers['x-correlation-id'] as string;
    
    if (!correlationId) {
      correlationId = randomUUID();
    }

    // Add correlation ID to request headers for downstream use
    p_request.headers['x-correlation-id'] = correlationId;

    // Add correlation ID to response headers for client tracking
    p_response.setHeader('x-correlation-id', correlationId);

    p_next();
  }
}
