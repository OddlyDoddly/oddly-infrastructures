/**
 * Ownership Middleware (MANDATORY)
 * Verifies user owns the resource before allowing access.
 */

export interface IOwnershipVerifier {
  /**
   * Interface for verifying resource ownership.
   */

  /**
   * Verify that user owns the resource.
   * 
   * Returns true if user owns resource, false otherwise
   */
  verifyOwnershipAsync(
    p_userId: string,
    p_resourceId: string,
    p_resourceType: string
  ): Promise<boolean>;

  /**
   * Check if resource is publicly accessible.
   * 
   * Returns true if resource is public, false otherwise
   */
  isPublicResourceAsync(
    p_resourceId: string,
    p_resourceType: string
  ): Promise<boolean>;
}

export class ForbiddenException extends Error {
  /**
   * Exception raised when user doesn't own resource.
   */
  public readonly statusCode: number = 403;

  constructor(p_message: string = 'Access denied') {
    super(p_message);
    this.name = 'ForbiddenException';
  }
}

/**
 * Middleware to verify resource ownership.
 * 
 * Order: After authentication, before UnitOfWork
 * 
 * Rules:
 * - Skip for public resources
 * - Verify ownership for protected resources
 * - Raise ForbiddenException if ownership check fails
 */
export class OwnershipMiddleware {
  constructor(
    private readonly _ownershipVerifier: IOwnershipVerifier,
    private readonly _resourceType: string
  ) {}

  /**
   * Verify ownership before proceeding.
   * 
   * Flow:
   * 1. Extract user ID from request (auth token)
   * 2. Extract resource ID from request path
   * 3. Check if resource is public (skip check if true)
   * 4. Verify ownership
   * 5. Raise ForbiddenException if verification fails
   * 6. Proceed to next middleware if successful
   */
  async execute(
    p_request: any,
    p_response: any,
    p_next: () => Promise<void>
  ): Promise<void> {
    const userId = this.extractUserId(p_request);
    const resourceId = this.extractResourceId(p_request);

    // Skip check if no resource ID (e.g., list endpoints)
    if (!resourceId) {
      await p_next();
      return;
    }

    // Check if resource is public
    const isPublic = await this._ownershipVerifier.isPublicResourceAsync(
      resourceId,
      this._resourceType
    );

    if (isPublic) {
      await p_next();
      return;
    }

    // Verify ownership
    const hasAccess = await this._ownershipVerifier.verifyOwnershipAsync(
      userId,
      resourceId,
      this._resourceType
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        `User ${userId} does not have access to ${this._resourceType} ${resourceId}`
      );
    }

    await p_next();
  }

  /**
   * Extract user ID from authenticated request.
   * Implementation depends on auth framework.
   */
  private extractUserId(p_request: any): string {
    // Example: return p_request.user?.id;
    // Example: return p_request.auth?.userId;
    throw new Error('Must implement user ID extraction');
  }

  /**
   * Extract resource ID from request path parameters.
   * Implementation depends on web framework.
   */
  private extractResourceId(p_request: any): string | null {
    // Example: return p_request.params?.id;
    // Example: return p_request.pathParams?.id;
    throw new Error('Must implement resource ID extraction');
  }
}

// Example implementation:
/**
 * 
 * export class ResourceOwnershipVerifier implements IOwnershipVerifier {
 *   constructor(
 *     private readonly _repository: IQueryRepository<any, string>
 *   ) {}
 * 
 *   async verifyOwnershipAsync(
 *     p_userId: string,
 *     p_resourceId: string,
 *     p_resourceType: string
 *   ): Promise<boolean> {
 *     const resource = await this._repository.findByIdAsync(p_resourceId);
 *     return resource !== null && resource.ownerId === p_userId;
 *   }
 * 
 *   async isPublicResourceAsync(
 *     p_resourceId: string,
 *     p_resourceType: string
 *   ): Promise<boolean> {
 *     const resource = await this._repository.findByIdAsync(p_resourceId);
 *     return resource !== null && resource.isPublic === true;
 *   }
 * }
 */
