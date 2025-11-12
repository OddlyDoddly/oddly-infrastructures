package com.oddly.ddd.api.middleware;

import com.oddly.ddd.infrastructure.repositories.infra.IUnitOfWork;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

/**
 * Middleware for managing database transactions using Unit of Work pattern.
 * MUST be applied AFTER authentication/authorization but BEFORE controller execution.
 * Automatically commits on success (status < 400) or rolls back on error (status >= 400).
 * Services should NOT manually manage transactions.
 */
@Component
public class UnitOfWorkMiddleware extends OncePerRequestFilter {
    private final IUnitOfWork m_unitOfWork;

    public UnitOfWorkMiddleware(IUnitOfWork p_unitOfWork) {
        this.m_unitOfWork = p_unitOfWork;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest p_request,
            HttpServletResponse p_response,
            FilterChain p_filterChain) throws ServletException, IOException {
        
        // Only apply UnitOfWork for mutating operations
        String method = p_request.getMethod();
        boolean isMutating = "POST".equals(method) || "PUT".equals(method) 
                          || "PATCH".equals(method) || "DELETE".equals(method);

        if (!isMutating) {
            p_filterChain.doFilter(p_request, p_response);
            return;
        }

        try {
            m_unitOfWork.beginTransactionAsync().get();
            
            p_filterChain.doFilter(p_request, p_response);

            // Commit if response is successful
            if (p_response.getStatus() < 400) {
                m_unitOfWork.commitAsync().get();
            } else {
                m_unitOfWork.rollbackAsync().get();
            }
        } catch (ExecutionException | InterruptedException e) {
            // Rollback on any exception
            try {
                m_unitOfWork.rollbackAsync().get();
            } catch (ExecutionException | InterruptedException ex) {
                throw new ServletException("Failed to rollback transaction", ex);
            }
            throw new ServletException("Transaction failed", e);
        }
    }
}
