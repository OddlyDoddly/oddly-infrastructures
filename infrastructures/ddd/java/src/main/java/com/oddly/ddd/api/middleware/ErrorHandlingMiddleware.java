package com.oddly.ddd.api.middleware;

import com.oddly.ddd.api.dto.v1.responses.ErrorResponseDto;
import com.oddly.ddd.application.errors.infra.ServiceException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Middleware for handling exceptions and converting them to standardized error responses.
 * MUST be the last middleware in the chain.
 * Catches all exceptions and converts them to ErrorResponseDto.
 */
@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class ErrorHandlingMiddleware extends OncePerRequestFilter {
    private final ObjectMapper m_objectMapper;

    public ErrorHandlingMiddleware(ObjectMapper p_objectMapper) {
        this.m_objectMapper = p_objectMapper;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest p_request,
            HttpServletResponse p_response,
            FilterChain p_filterChain) throws ServletException, IOException {
        
        try {
            p_filterChain.doFilter(p_request, p_response);
        } catch (ServiceException e) {
            handleServiceException(e, p_request, p_response);
        } catch (Exception e) {
            handleGenericException(e, p_request, p_response);
        }
    }

    /**
     * Handles service exceptions and converts them to error responses.
     */
    private void handleServiceException(
            ServiceException p_exception,
            HttpServletRequest p_request,
            HttpServletResponse p_response) throws IOException {
        
        int statusCode = mapErrorCodeToHttpStatus(p_exception.getGenericErrorCode());
        
        ErrorResponseDto errorResponse = new ErrorResponseDto();
        errorResponse.setCode(p_exception.getGenericErrorCode().name());
        errorResponse.setMessage(p_exception.getMessage());
        errorResponse.setPath(p_request.getRequestURI());
        errorResponse.setRequestId(p_request.getHeader("X-Correlation-Id"));

        p_response.setStatus(statusCode);
        p_response.setContentType("application/json");
        p_response.getWriter().write(m_objectMapper.writeValueAsString(errorResponse));
    }

    /**
     * Handles generic exceptions.
     */
    private void handleGenericException(
            Exception p_exception,
            HttpServletRequest p_request,
            HttpServletResponse p_response) throws IOException {
        
        ErrorResponseDto errorResponse = new ErrorResponseDto();
        errorResponse.setCode("INTERNAL_ERROR");
        errorResponse.setMessage("An unexpected error occurred");
        errorResponse.setPath(p_request.getRequestURI());
        errorResponse.setRequestId(p_request.getHeader("X-Correlation-Id"));

        p_response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        p_response.setContentType("application/json");
        p_response.getWriter().write(m_objectMapper.writeValueAsString(errorResponse));
    }

    /**
     * Maps error codes to HTTP status codes.
     */
    private int mapErrorCodeToHttpStatus(Enum<?> p_errorCode) {
        String code = p_errorCode.name();
        
        if (code.contains("NOT_FOUND")) {
            return HttpServletResponse.SC_NOT_FOUND;
        } else if (code.contains("CONFLICT")) {
            return HttpServletResponse.SC_CONFLICT;
        } else if (code.contains("VALIDATION") || code.contains("INVALID")) {
            return HttpServletResponse.SC_BAD_REQUEST;
        } else if (code.contains("UNAUTHORIZED")) {
            return HttpServletResponse.SC_UNAUTHORIZED;
        } else if (code.contains("FORBIDDEN")) {
            return HttpServletResponse.SC_FORBIDDEN;
        }
        
        return HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
    }
}
