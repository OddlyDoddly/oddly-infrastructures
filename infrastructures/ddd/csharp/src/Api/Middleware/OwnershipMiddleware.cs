using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace OddlyDdd.Api.Middleware
{
    /// <summary>
    /// Middleware for verifying resource ownership.
    /// MUST be applied AFTER authentication but BEFORE controller execution.
    /// Ensures users can only access resources they own, unless the resource is public.
    /// </summary>
    public class OwnershipMiddleware
    {
        private readonly RequestDelegate _next;

        public OwnershipMiddleware(RequestDelegate p_next)
        {
            _next = p_next;
        }

        public async Task InvokeAsync(HttpContext p_context, IOwnershipVerifier p_ownershipVerifier)
        {
            // Skip ownership check for certain paths (health checks, public endpoints)
            if (ShouldSkipOwnershipCheck(p_context))
            {
                await _next(p_context);
                return;
            }

            var userId = p_context.User?.Identity?.Name;
            if (string.IsNullOrEmpty(userId))
            {
                p_context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            // Extract resource ID from route (assuming it's in the path)
            var routeData = p_context.GetRouteData();
            if (routeData?.Values.TryGetValue("id", out var resourceIdObj) == true)
            {
                var resourceId = resourceIdObj?.ToString();
                if (!string.IsNullOrEmpty(resourceId))
                {
                    // Check if resource is public
                    if (await p_ownershipVerifier.IsPublicResourceAsync(resourceId))
                    {
                        await _next(p_context);
                        return;
                    }

                    // Verify ownership
                    if (!await p_ownershipVerifier.VerifyOwnershipAsync(userId, resourceId))
                    {
                        p_context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        p_context.Response.ContentType = "application/json";
                        var errorResponse = JsonSerializer.Serialize(new
                        {
                            error = new
                            {
                                code = "Forbidden",
                                message = "Access denied. You do not own this resource.",
                                timestamp = DateTime.UtcNow.ToString("o"),
                                path = p_context.Request.Path.ToString()
                            }
                        });
                        await p_context.Response.WriteAsync(errorResponse);
                        return;
                    }
                }
            }

            await _next(p_context);
        }

        private bool ShouldSkipOwnershipCheck(HttpContext p_context)
        {
            var path = p_context.Request.Path.Value?.ToLower() ?? string.Empty;
            
            // Skip for health checks, public endpoints, etc.
            return path.Contains("/health") || 
                   path.Contains("/public") ||
                   p_context.Request.Method == "GET" && path.Contains("/list");
        }
    }

    /// <summary>
    /// Interface for verifying resource ownership.
    /// Implementation should check the database to verify ownership.
    /// </summary>
    public interface IOwnershipVerifier
    {
        Task<bool> IsPublicResourceAsync(string p_resourceId);
        Task<bool> VerifyOwnershipAsync(string p_userId, string p_resourceId);
    }
}
