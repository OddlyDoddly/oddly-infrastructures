import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for verifying resource ownership.
 * MUST be applied AFTER authentication but BEFORE UnitOfWork.
 * 
 * This middleware:
 * - Extracts user ID from authenticated request
 * - Extracts resource ID from request params
 * - Verifies user owns the resource
 * - Returns 403 Forbidden if ownership check fails
 * 
 * For public resources, skip this middleware on those routes.
 * 
 * Middleware order:
 * 1. Correlation ID → 2. Logging → 3. Authentication → 
 * 4. Authorization/Ownership (THIS) → 5. UnitOfWork → 6. Controller →
 * 7. UnitOfWork commit/rollback → 8. Error Handling
 */
export class OwnershipMiddleware {
  /**
   * Service for checking resource ownership.
   * In a real implementation, inject a service that queries database.
   */
  private readonly _ownershipChecker: (userId: string, resourceId: string) => Promise<boolean>;

  constructor(p_ownershipChecker: (userId: string, resourceId: string) => Promise<boolean>) {
    this._ownershipChecker = p_ownershipChecker;
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
    try {
      // Extract user ID from authenticated request
      const userId = (p_request as any).user?.id;
      if (!userId) {
        p_response.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Extract resource ID from params (e.g., /api/v1/example/:id)
      const resourceId = p_request.params.id;
      if (!resourceId) {
        // No resource ID in params, skip ownership check
        p_next();
        return;
      }

      // Check if resource is public (skip ownership check)
      // In a real implementation, check against a whitelist or resource metadata
      const isPublicResource = false; // Example: await this._isPublicResource(resourceId)
      if (isPublicResource) {
        p_next();
        return;
      }

      // Verify ownership
      const ownsResource = await this._ownershipChecker(userId, resourceId);
      if (!ownsResource) {
        p_response.status(403).json({ error: 'Access denied - you do not own this resource' });
        return;
      }

      p_next();
    } catch (error) {
      p_next(error);
    }
  }
}
