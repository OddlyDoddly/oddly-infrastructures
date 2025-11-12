package com.oddly.ddd.application.services.impl;

import com.oddly.ddd.api.dto.v1.requests.CreateExampleRequest;
import com.oddly.ddd.api.dto.v1.requests.UpdateExampleRequest;
import com.oddly.ddd.api.dto.v1.responses.ExampleResponse;
import com.oddly.ddd.application.errors.ExampleServiceException;
import com.oddly.ddd.application.errors.ExampleServiceException.ExampleErrorCode;
import com.oddly.ddd.application.mappers.ExampleMapper;
import com.oddly.ddd.application.services.IExampleService;
import com.oddly.ddd.domain.events.ExampleCreatedEvent;
import com.oddly.ddd.domain.events.ExampleDeletedEvent;
import com.oddly.ddd.domain.events.ExampleUpdatedEvent;
import com.oddly.ddd.domain.models.ExampleModel;
import com.oddly.ddd.infrastructure.persistence.read.ExampleReadEntity;
import com.oddly.ddd.infrastructure.queues.infra.IEventPublisher;
import com.oddly.ddd.infrastructure.repositories.IExampleCommandRepository;
import com.oddly.ddd.infrastructure.repositories.IExampleQueryRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Service implementation for Example domain.
 * Service implementations:
 * - Live in /application/services/impl/
 * - Have Service suffix
 * - Orchestrate use-cases
 * - Call repositories and publish domain events
 * - NO business logic (delegate to domain models)
 */
@Service
public class ExampleService implements IExampleService {
    private final IExampleCommandRepository m_commandRepository;
    private final IExampleQueryRepository m_queryRepository;
    private final ExampleMapper m_mapper;
    private final IEventPublisher m_eventPublisher;

    public ExampleService(
            IExampleCommandRepository p_commandRepository,
            IExampleQueryRepository p_queryRepository,
            ExampleMapper p_mapper,
            IEventPublisher p_eventPublisher) {
        this.m_commandRepository = p_commandRepository;
        this.m_queryRepository = p_queryRepository;
        this.m_mapper = p_mapper;
        this.m_eventPublisher = p_eventPublisher;
    }

    @Override
    public CompletableFuture<String> createExampleAsync(
            CreateExampleRequest p_request,
            String p_userId,
            String p_correlationId) {
        
        return CompletableFuture.supplyAsync(() -> {
            // Create domain model
            ExampleModel model = m_mapper.toModelFromRequest(p_request);
            // Set owner (not in mapper to avoid security issues)
            ExampleModel modelWithOwner = new ExampleModel(
                model.getName(),
                model.getDescription(),
                model.getCategory(),
                p_userId
            );
            
            // Validate business rules
            modelWithOwner.validate();
            
            return modelWithOwner;
        })
        .thenCompose(model -> 
            // Save to database
            m_commandRepository.saveAsync(model)
                .thenApply(id -> {
                    // Publish domain event
                    ExampleCreatedEvent event = new ExampleCreatedEvent(
                        id,
                        model.getName(),
                        p_userId,
                        p_correlationId
                    );
                    m_eventPublisher.publishAsync(event, "example.created");
                    return id;
                })
        );
    }

    @Override
    public CompletableFuture<Void> updateExampleAsync(
            String p_id,
            UpdateExampleRequest p_request,
            String p_userId) {
        
        return m_queryRepository.findByIdAsync(p_id)
            .thenCompose(optionalEntity -> {
                if (optionalEntity.isEmpty()) {
                    Map<String, Object> details = new HashMap<>();
                    details.put("id", p_id);
                    throw new ExampleServiceException(ExampleErrorCode.NOT_FOUND, details);
                }
                
                ExampleReadEntity entity = optionalEntity.get();
                
                // Load as write entity for modification
                // In real app, fetch from command repository
                ExampleModel model = new ExampleModel(
                    entity.getId(),
                    entity.getName(),
                    entity.getDescription(),
                    entity.getCategory(),
                    entity.isActive(),
                    entity.getOwnerId()
                );
                
                // Update using business logic
                model.update(
                    p_request.getName(),
                    p_request.getDescription(),
                    p_request.getCategory(),
                    p_userId
                );
                
                return m_commandRepository.updateAsync(model)
                    .thenRun(() -> {
                        // Publish domain event
                        ExampleUpdatedEvent event = new ExampleUpdatedEvent(
                            p_id,
                            model.getName(),
                            p_userId,
                            "correlation-id" // Should come from context
                        );
                        m_eventPublisher.publishAsync(event, "example.updated");
                    });
            });
    }

    @Override
    public CompletableFuture<Void> deleteExampleAsync(String p_id, String p_userId) {
        return m_commandRepository.existsAsync(p_id)
            .thenCompose(exists -> {
                if (!exists) {
                    Map<String, Object> details = new HashMap<>();
                    details.put("id", p_id);
                    throw new ExampleServiceException(ExampleErrorCode.NOT_FOUND, details);
                }
                
                return m_commandRepository.deleteAsync(p_id)
                    .thenRun(() -> {
                        // Publish domain event
                        ExampleDeletedEvent event = new ExampleDeletedEvent(
                            p_id,
                            p_userId,
                            "correlation-id" // Should come from context
                        );
                        m_eventPublisher.publishAsync(event, "example.deleted");
                    });
            });
    }

    @Override
    public CompletableFuture<ExampleResponse> getExampleAsync(String p_id) {
        return m_queryRepository.findByIdAsync(p_id)
            .thenApply(optionalEntity -> {
                if (optionalEntity.isEmpty()) {
                    Map<String, Object> details = new HashMap<>();
                    details.put("id", p_id);
                    throw new ExampleServiceException(ExampleErrorCode.NOT_FOUND, details);
                }
                
                return m_mapper.toResponseFromReadEntity(optionalEntity.get());
            });
    }

    @Override
    public CompletableFuture<List<ExampleResponse>> listExamplesAsync(int p_skip, int p_take) {
        return m_queryRepository.listAsync(p_skip, p_take)
            .thenApply(entities -> 
                entities.stream()
                    .map(m_mapper::toResponseFromReadEntity)
                    .collect(Collectors.toList())
            );
    }

    @Override
    public CompletableFuture<Void> activateExampleAsync(String p_id, String p_userId) {
        return m_queryRepository.findByIdAsync(p_id)
            .thenCompose(optionalEntity -> {
                if (optionalEntity.isEmpty()) {
                    Map<String, Object> details = new HashMap<>();
                    details.put("id", p_id);
                    throw new ExampleServiceException(ExampleErrorCode.NOT_FOUND, details);
                }
                
                ExampleReadEntity entity = optionalEntity.get();
                ExampleModel model = new ExampleModel(
                    entity.getId(),
                    entity.getName(),
                    entity.getDescription(),
                    entity.getCategory(),
                    entity.isActive(),
                    entity.getOwnerId()
                );
                
                model.activate(p_userId);
                
                return m_commandRepository.updateAsync(model);
            });
    }

    @Override
    public CompletableFuture<Void> deactivateExampleAsync(String p_id, String p_userId) {
        return m_queryRepository.findByIdAsync(p_id)
            .thenCompose(optionalEntity -> {
                if (optionalEntity.isEmpty()) {
                    Map<String, Object> details = new HashMap<>();
                    details.put("id", p_id);
                    throw new ExampleServiceException(ExampleErrorCode.NOT_FOUND, details);
                }
                
                ExampleReadEntity entity = optionalEntity.get();
                ExampleModel model = new ExampleModel(
                    entity.getId(),
                    entity.getName(),
                    entity.getDescription(),
                    entity.getCategory(),
                    entity.isActive(),
                    entity.getOwnerId()
                );
                
                model.deactivate(p_userId);
                
                return m_commandRepository.updateAsync(model);
            });
    }
}
