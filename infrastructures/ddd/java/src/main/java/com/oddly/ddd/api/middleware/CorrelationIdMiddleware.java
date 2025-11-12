package com.oddly.ddd.api.middleware;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Middleware for managing correlation IDs across requests.
 * MUST be the first middleware in the chain.
 * Generates a correlation ID if not present in the request.
 * Adds the correlation ID to the response headers and MDC for logging.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationIdMiddleware extends OncePerRequestFilter {
    private static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    private static final String CORRELATION_ID_MDC_KEY = "correlationId";

    @Override
    protected void doFilterInternal(
            HttpServletRequest p_request,
            HttpServletResponse p_response,
            FilterChain p_filterChain) throws ServletException, IOException {
        
        try {
            // Get or generate correlation ID
            String correlationId = p_request.getHeader(CORRELATION_ID_HEADER);
            if (correlationId == null || correlationId.isBlank()) {
                correlationId = UUID.randomUUID().toString();
            }

            // Add to MDC for logging
            MDC.put(CORRELATION_ID_MDC_KEY, correlationId);

            // Add to response headers
            p_response.setHeader(CORRELATION_ID_HEADER, correlationId);

            p_filterChain.doFilter(p_request, p_response);
        } finally {
            // Clean up MDC
            MDC.remove(CORRELATION_ID_MDC_KEY);
        }
    }
}
