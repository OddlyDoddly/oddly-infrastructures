package com.oddly.ddd.api.middleware;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Middleware for verifying resource ownership.
 * MUST be applied AFTER authentication but BEFORE UnitOfWork.
 * Checks if the authenticated user owns the resource being accessed.
 * Returns 403 Forbidden if ownership check fails.
 */
@Component
public class OwnershipMiddleware extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest p_request,
            HttpServletResponse p_response,
            FilterChain p_filterChain) throws ServletException, IOException {
        
        // Extract user ID from authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            p_filterChain.doFilter(p_request, p_response);
            return;
        }

        String userId = authentication.getName();
        String resourceId = extractResourceId(p_request);

        // Skip ownership check if no resource ID or public resource
        if (resourceId == null || isPublicResource(p_request)) {
            p_filterChain.doFilter(p_request, p_response);
            return;
        }

        // Verify ownership
        if (!verifyOwnership(userId, resourceId)) {
            p_response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            p_response.getWriter().write("{\"error\": {\"code\": \"FORBIDDEN\", \"message\": \"Access denied\"}}");
            return;
        }

        p_filterChain.doFilter(p_request, p_response);
    }

    /**
     * Extracts the resource ID from the request path.
     * Override this method to implement custom extraction logic.
     */
    protected String extractResourceId(HttpServletRequest p_request) {
        String path = p_request.getRequestURI();
        // Simple extraction: assumes resource ID is after /api/v1/{resource}/{id}
        String[] parts = path.split("/");
        if (parts.length >= 4) {
            return parts[parts.length - 1];
        }
        return null;
    }

    /**
     * Checks if the resource is public.
     * Override this method to implement custom public resource logic.
     */
    protected boolean isPublicResource(HttpServletRequest p_request) {
        // Default: GET requests are public
        return "GET".equals(p_request.getMethod());
    }

    /**
     * Verifies if the user owns the resource.
     * Override this method to implement custom ownership verification logic.
     * In a real application, this would query the database.
     */
    protected boolean verifyOwnership(String p_userId, String p_resourceId) {
        // Default implementation - should be overridden in real applications
        return true;
    }
}
