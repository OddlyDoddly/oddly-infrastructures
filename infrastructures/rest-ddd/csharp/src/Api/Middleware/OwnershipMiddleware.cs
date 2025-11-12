/**
 * Ownership Middleware (MANDATORY)
 * Verifies user owns the resource before allowing access.
 */

using System;
using System.Threading.Tasks;

namespace Api.Middleware
{
    public interface IOwnershipVerifier
    {
        /**
         * Interface for verifying resource ownership.
         */

        /**
         * Verify that user owns the resource.
         * 
         * Returns true if user owns resource, false otherwise
         */
        Task<bool> VerifyOwnershipAsync(
            string p_userId,
            string p_resourceId,
            string p_resourceType
        );

        /**
         * Check if resource is publicly accessible.
         * 
         * Returns true if resource is public, false otherwise
         */
        Task<bool> IsPublicResourceAsync(
            string p_resourceId,
            string p_resourceType
        );
    }

    public class ForbiddenException : Exception
    {
        /**
         * Exception raised when user doesn't own resource.
         */

        public int StatusCode => 403;

        public ForbiddenException(string p_message = "Access denied")
            : base(p_message)
        {
        }
    }

    public class OwnershipMiddleware
    {
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

        private readonly IOwnershipVerifier _ownershipVerifier;
        private readonly string _resourceType;

        public OwnershipMiddleware(
            IOwnershipVerifier p_ownershipVerifier,
            string p_resourceType
        )
        {
            _ownershipVerifier = p_ownershipVerifier;
            _resourceType = p_resourceType;
        }

        public async Task InvokeAsync(dynamic p_context, Func<Task> p_next)
        {
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

            var userId = ExtractUserId(p_context);
            var resourceId = ExtractResourceId(p_context);

            // Skip check if no resource ID (e.g., list endpoints)
            if (string.IsNullOrEmpty(resourceId))
            {
                await p_next();
                return;
            }

            // Check if resource is public
            var isPublic = await _ownershipVerifier.IsPublicResourceAsync(
                resourceId,
                _resourceType
            );

            if (isPublic)
            {
                await p_next();
                return;
            }

            // Verify ownership
            var hasAccess = await _ownershipVerifier.VerifyOwnershipAsync(
                userId,
                resourceId,
                _resourceType
            );

            if (!hasAccess)
            {
                throw new ForbiddenException(
                    $"User {userId} does not have access to {_resourceType} {resourceId}"
                );
            }

            await p_next();
        }

        private string ExtractUserId(dynamic p_context)
        {
            /**
             * Extract user ID from authenticated request.
             * Implementation depends on auth framework.
             */
            throw new NotImplementedException("Must implement user ID extraction");
        }

        private string? ExtractResourceId(dynamic p_context)
        {
            /**
             * Extract resource ID from request path parameters.
             * Implementation depends on web framework.
             */
            throw new NotImplementedException("Must implement resource ID extraction");
        }
    }
}
