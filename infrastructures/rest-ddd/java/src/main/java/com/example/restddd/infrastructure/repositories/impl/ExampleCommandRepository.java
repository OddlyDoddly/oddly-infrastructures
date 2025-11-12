/**
 * Example Command Repository Implementation
 * Handles write operations (CREATE, UPDATE, DELETE).
 */

package com.example.restddd.infrastructure.repositories.impl;

import com.example.restddd.application.mappers.ExampleMapper;
import com.example.restddd.domain.models.ExampleModel;
import com.example.restddd.infrastructure.persistence.write.ExampleWriteEntity;
import com.example.restddd.infrastructure.repositories.ICommandRepository;
import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class ExampleCommandRepository implements ICommandRepository<ExampleModel, String> {
    /**
     * Command Repository for Example entity.
     * 
     * Rules:
     * - Located in /infrastructure/repositories/impl/
     * - Suffix with 'Repository'
     * - Receives BMO, maps to WriteEntity internally
     * - Returns void or ID
     */

    private final ExampleMapper m_mapper;
    // Add database connection/context here
    // private final DatabaseContext m_dbContext;

    public ExampleCommandRepository(ExampleMapper p_mapper) {
        this.m_mapper = p_mapper;
    }

    @Override
    public CompletableFuture<String> saveAsync(ExampleModel p_model) {
        return CompletableFuture.supplyAsync(() -> {
            // Map BMO → WriteEntity
            ExampleWriteEntity entity = m_mapper.toWriteEntity(p_model);

            // Save to database
            // m_dbContext.getExamples().insertOne(entity);

            // Placeholder: generate ID
            String id = generateId();
            entity.setId(id);

            return id;
        });
    }

    @Override
    public CompletableFuture<Void> updateAsync(ExampleModel p_model) {
        return CompletableFuture.runAsync(() -> {
            // Map BMO → WriteEntity
            ExampleWriteEntity entity = m_mapper.toWriteEntity(p_model);

            // Update version for optimistic locking
            entity.incrementVersion();

            // Update in database
            // m_dbContext.getExamples().replaceOne(
            //     Filters.and(
            //         Filters.eq("_id", entity.getId()),
            //         Filters.eq("version", entity.getVersion() - 1)
            //     ),
            //     entity
            // );
        });
    }

    @Override
    public CompletableFuture<Void> deleteAsync(String p_id) {
        return CompletableFuture.runAsync(() -> {
            // Delete from database
            // m_dbContext.getExamples().deleteOne(Filters.eq("_id", p_id));
        });
    }

    @Override
    public CompletableFuture<Boolean> existsAsync(String p_id) {
        return CompletableFuture.supplyAsync(() -> {
            // Check if exists in database
            // long count = m_dbContext.getExamples().countDocuments(Filters.eq("_id", p_id));
            // return count > 0;

            // Placeholder
            return false;
        });
    }

    private String generateId() {
        return "example_" + Instant.now().toEpochMilli() + "_" + UUID.randomUUID().toString().substring(0, 8);
    }
}
