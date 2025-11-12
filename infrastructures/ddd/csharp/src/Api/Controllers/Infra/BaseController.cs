using Microsoft.AspNetCore.Mvc;

namespace OddlyDdd.Api.Controllers.Infra
{
    /// <summary>
    /// Base controller for all API controllers.
    /// Controllers handle HTTP only: bind, validate, authorize, map DTOs.
    /// NO business logic in controllers - delegate to services.
    /// MUST apply middleware in this order:
    /// 1. Correlation ID
    /// 2. Logging
    /// 3. Authentication
    /// 4. Authorization/Ownership
    /// 5. UnitOfWork
    /// 6. Controller
    /// 7. UnitOfWork commit/rollback
    /// 8. Error Handling
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public abstract class BaseController : ControllerBase
    {
        /// <summary>
        /// Gets the user ID from the authenticated user context
        /// </summary>
        protected string GetUserId()
        {
            // This would typically extract from claims/auth context
            // Implementation depends on authentication system
            return User?.Identity?.Name ?? string.Empty;
        }

        /// <summary>
        /// Gets the correlation ID from the request context
        /// </summary>
        protected string GetCorrelationId()
        {
            // This would typically be set by CorrelationIdMiddleware
            if (HttpContext.Items.TryGetValue("CorrelationId", out var correlationId))
            {
                return correlationId?.ToString() ?? string.Empty;
            }
            return string.Empty;
        }
    }
}
