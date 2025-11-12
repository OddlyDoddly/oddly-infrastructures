using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace OddlyDdd.Api.Middleware
{
    /// <summary>
    /// Middleware for managing correlation IDs across requests.
    /// MUST be applied FIRST in the middleware pipeline.
    /// Extracts or generates a correlation ID for tracking requests across services.
    /// </summary>
    public class CorrelationIdMiddleware
    {
        private readonly RequestDelegate _next;
        private const string CorrelationIdHeader = "X-Correlation-Id";

        public CorrelationIdMiddleware(RequestDelegate p_next)
        {
            _next = p_next;
        }

        public async Task InvokeAsync(HttpContext p_context)
        {
            string correlationId;

            // Try to get correlation ID from header
            if (p_context.Request.Headers.TryGetValue(CorrelationIdHeader, out var headerValue))
            {
                correlationId = headerValue.ToString();
            }
            else
            {
                // Generate new correlation ID if not provided
                correlationId = Guid.NewGuid().ToString();
            }

            // Store in context for later retrieval
            p_context.Items["CorrelationId"] = correlationId;

            // Add to response headers
            p_context.Response.Headers[CorrelationIdHeader] = correlationId;

            await _next(p_context);
        }
    }
}
