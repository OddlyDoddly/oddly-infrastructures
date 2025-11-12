package com.oddly.ddd.api.controllers.infra;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Base class for all controllers.
 * Controllers:
 * - Live in /api/controllers/
 * - Have Controller suffix
 * - Handle HTTP only: bind, validate, authorize, map DTOs
 * - NO business logic (delegate to services)
 * 
 * Middleware order (automatically applied):
 * 1. Correlation ID → 2. Logging → 3. Authentication →
 * 4. Authorization/Ownership → 5. UnitOfWork → 6. Controller →
 * 7. UnitOfWork commit/rollback → 8. Error Handling
 */
public abstract class BaseController {
    /**
     * Gets the current user ID from the security context.
     * 
     * @return The user ID
     */
    protected String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() != null) {
            return authentication.getName();
        }
        return "anonymous";
    }

    /**
     * Gets the correlation ID from the current request.
     * 
     * @return The correlation ID
     */
    protected String getCorrelationId() {
        HttpServletRequest request = getCurrentRequest();
        if (request != null) {
            String correlationId = request.getHeader("X-Correlation-Id");
            if (correlationId != null && !correlationId.isBlank()) {
                return correlationId;
            }
        }
        return java.util.UUID.randomUUID().toString();
    }

    /**
     * Gets the current HTTP request.
     * 
     * @return The current HTTP request
     */
    protected HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attributes = 
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            return attributes.getRequest();
        }
        return null;
    }

    /**
     * Validates the request.
     * Override this method to add custom validation logic.
     * 
     * @param p_request The request to validate
     */
    protected void validateRequest(Object p_request) {
        // Default implementation - can be overridden
    }
}
