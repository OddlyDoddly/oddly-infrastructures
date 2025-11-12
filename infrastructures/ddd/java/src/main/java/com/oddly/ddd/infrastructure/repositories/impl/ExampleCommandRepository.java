package com.oddly.ddd.infrastructure.repositories.impl;

import com.oddly.ddd.application.mappers.ExampleMapper;
import com.oddly.ddd.domain.models.ExampleModel;
import com.oddly.ddd.infrastructure.persistence.write.ExampleWriteEntity;
import com.oddly.ddd.infrastructure.repositories.IExampleCommandRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.concurrent.CompletableFuture;

/**
 * Command repository implementation for Example domain.
 * Repository implementations:
 * - Live in /infrastructure/repositories/impl/
 * - Have Repository suffix
 * - Map BMO ↔ WriteEntity internally
 * - Return void or ID from commands
 */
@Repository
public class ExampleCommandRepository implements IExampleCommandRepository {
    @PersistenceContext
    private EntityManager m_entityManager;

    private final ExampleMapper m_mapper;

    public ExampleCommandRepository(ExampleMapper p_mapper) {
        this.m_mapper = p_mapper;
    }

    @Override
    public CompletableFuture<String> saveAsync(ExampleModel p_model) {
        return CompletableFuture.supplyAsync(() -> {
            p_model.validate();
            ExampleWriteEntity entity = m_mapper.toWriteEntity(p_model);
            m_entityManager.persist(entity);
            return entity.getId();
        });
    }

    @Override
    public CompletableFuture<Void> updateAsync(ExampleModel p_model) {
        return CompletableFuture.runAsync(() -> {
            p_model.validate();
            ExampleWriteEntity entity = m_mapper.toWriteEntity(p_model);
            m_entityManager.merge(entity);
        });
    }

    @Override
    public CompletableFuture<Void> deleteAsync(String p_id) {
        return CompletableFuture.runAsync(() -> {
            ExampleWriteEntity entity = m_entityManager.find(ExampleWriteEntity.class, p_id);
            if (entity != null) {
                m_entityManager.remove(entity);
            }
        });
    }

    @Override
    public CompletableFuture<Boolean> existsAsync(String p_id) {
        return CompletableFuture.supplyAsync(() -> {
            Long count = m_entityManager.createQuery(
                "SELECT COUNT(e) FROM ExampleWriteEntity e WHERE e.m_id = :id", Long.class)
                .setParameter("id", p_id)
                .getSingleResult();
            return count > 0;
        });
    }
}
