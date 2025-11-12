/**
 * Ownership Middleware (MANDATORY)
 * Verifies user owns the resource before allowing access.
 */

package com.example.restddd.api.middleware;

import java.util.concurrent.CompletableFuture;

public interface IOwnershipVerifier {
    /**
     * Interface for verifying resource ownership.
     */

    /**
     * Verify that user owns the resource.
     * 
     * Returns true if user owns resource, false otherwise
     */
    CompletableFuture<Boolean> verifyOwnershipAsync(
        String p_userId,
        String p_resourceId,
        String p_resourceType
    );

    /**
     * Check if resource is publicly accessible.
     * 
     * Returns true if resource is public, false otherwise
     */
    CompletableFuture<Boolean> isPublicResourceAsync(
        String p_resourceId,
        String p_resourceType
    );
}

class ForbiddenException extends RuntimeException {
    /**
     * Exception raised when user doesn't own resource.
     */

    private final int m_statusCode = 403;

    public ForbiddenException(String p_message) {
        super(p_message);
    }

    public int getStatusCode() {
        return m_statusCode;
    }
}

/**
 * Spring Boot Interceptor for Ownership verification.
 * 
 * Order: After authentication, before UnitOfWork
 * 
 * Rules:
 * - Skip for public resources
 * - Verify ownership for protected resources
 * - Raise ForbiddenException if ownership check fails
 * 
 * Note: In Spring Boot, implement HandlerInterceptor or use @Aspect
 */
