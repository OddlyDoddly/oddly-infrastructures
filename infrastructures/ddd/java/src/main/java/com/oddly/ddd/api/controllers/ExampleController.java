package com.oddly.ddd.api.controllers;

import com.oddly.ddd.api.controllers.infra.BaseController;
import com.oddly.ddd.api.dto.v1.requests.CreateExampleRequest;
import com.oddly.ddd.api.dto.v1.requests.UpdateExampleRequest;
import com.oddly.ddd.api.dto.v1.responses.ErrorResponseDto;
import com.oddly.ddd.api.dto.v1.responses.ExampleResponse;
import com.oddly.ddd.application.services.IExampleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Example controller demonstrating controller layer patterns.
 * Controllers:
 * - Live in /api/controllers/
 * - Have Controller suffix
 * - Handle HTTP only: bind, validate, authorize, map DTOs
 * - NO business logic (delegate to services)
 * - Use BaseController for common functionality
 * 
 * Middleware order (automatically applied):
 * 1. Correlation ID → 2. Logging → 3. Authentication →
 * 4. Authorization/Ownership → 5. UnitOfWork → 6. Controller →
 * 7. UnitOfWork commit/rollback → 8. Error Handling
 */
@RestController
@RequestMapping("/api/v1/examples")
@PreAuthorize("isAuthenticated()")
public class ExampleController extends BaseController {
    private final IExampleService m_exampleService;

    public ExampleController(IExampleService p_exampleService) {
        this.m_exampleService = p_exampleService;
    }

    /**
     * Creates a new example.
     * POST /api/v1/examples
     */
    @PostMapping
    public CompletableFuture<ResponseEntity<String>> createExample(
            @Valid @RequestBody CreateExampleRequest p_request) {
        
        validateRequest(p_request);
        
        String userId = getUserId();
        String correlationId = getCorrelationId();
        
        return m_exampleService.createExampleAsync(p_request, userId, correlationId)
            .thenApply(id -> 
                ResponseEntity.created(URI.create("/api/v1/examples/" + id))
                    .body(id)
            );
    }

    /**
     * Gets an example by ID.
     * GET /api/v1/examples/{id}
     */
    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<ExampleResponse>> getExample(
            @PathVariable String id) {
        
        return m_exampleService.getExampleAsync(id)
            .thenApply(ResponseEntity::ok);
    }

    /**
     * Lists examples with pagination.
     * GET /api/v1/examples?skip=0&take=10
     */
    @GetMapping
    public CompletableFuture<ResponseEntity<List<ExampleResponse>>> listExamples(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int take) {
        
        return m_exampleService.listExamplesAsync(skip, take)
            .thenApply(ResponseEntity::ok);
    }

    /**
     * Updates an example.
     * PUT /api/v1/examples/{id}
     */
    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> updateExample(
            @PathVariable String id,
            @Valid @RequestBody UpdateExampleRequest p_request) {
        
        validateRequest(p_request);
        
        String userId = getUserId();
        
        return m_exampleService.updateExampleAsync(id, p_request, userId)
            .thenApply(v -> ResponseEntity.noContent().build());
    }

    /**
     * Deletes an example.
     * DELETE /api/v1/examples/{id}
     */
    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> deleteExample(
            @PathVariable String id) {
        
        String userId = getUserId();
        
        return m_exampleService.deleteExampleAsync(id, userId)
            .thenApply(v -> ResponseEntity.noContent().build());
    }

    /**
     * Activates an example.
     * POST /api/v1/examples/{id}/activate
     */
    @PostMapping("/{id}/activate")
    public CompletableFuture<ResponseEntity<Void>> activateExample(
            @PathVariable String id) {
        
        String userId = getUserId();
        
        return m_exampleService.activateExampleAsync(id, userId)
            .thenApply(v -> ResponseEntity.noContent().build());
    }

    /**
     * Deactivates an example.
     * POST /api/v1/examples/{id}/deactivate
     */
    @PostMapping("/{id}/deactivate")
    public CompletableFuture<ResponseEntity<Void>> deactivateExample(
            @PathVariable String id) {
        
        String userId = getUserId();
        
        return m_exampleService.deactivateExampleAsync(id, userId)
            .thenApply(v -> ResponseEntity.noContent().build());
    }
}
