package com.oddly.ddd.infrastructure.repositories.impl;

import com.oddly.ddd.infrastructure.persistence.read.ExampleReadEntity;
import com.oddly.ddd.infrastructure.repositories.IExampleQueryRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

/**
 * Query repository implementation for Example domain.
 * Repository implementations:
 * - Live in /infrastructure/repositories/impl/
 * - Have Repository suffix
 * - Work with ReadEntities
 * - Return ReadEntity directly (no BMO conversion)
 */
@Repository
public class ExampleQueryRepository implements IExampleQueryRepository {
    @PersistenceContext
    private EntityManager m_entityManager;

    @Override
    public CompletableFuture<Optional<ExampleReadEntity>> findByIdAsync(String p_id) {
        return CompletableFuture.supplyAsync(() -> {
            ExampleReadEntity entity = m_entityManager.find(ExampleReadEntity.class, p_id);
            return Optional.ofNullable(entity);
        });
    }

    @Override
    public CompletableFuture<List<ExampleReadEntity>> listAsync(int p_skip, int p_take) {
        return CompletableFuture.supplyAsync(() -> 
            m_entityManager.createQuery(
                "SELECT e FROM ExampleReadEntity e ORDER BY e.m_createdAt DESC", ExampleReadEntity.class)
                .setFirstResult(p_skip)
                .setMaxResults(p_take)
                .getResultList()
        );
    }

    @Override
    public CompletableFuture<Long> countAsync() {
        return CompletableFuture.supplyAsync(() ->
            m_entityManager.createQuery(
                "SELECT COUNT(e) FROM ExampleReadEntity e", Long.class)
                .getSingleResult()
        );
    }

    @Override
    public CompletableFuture<List<ExampleReadEntity>> findByCategoryAsync(String p_category) {
        return CompletableFuture.supplyAsync(() ->
            m_entityManager.createQuery(
                "SELECT e FROM ExampleReadEntity e WHERE e.m_category = :category", ExampleReadEntity.class)
                .setParameter("category", p_category)
                .getResultList()
        );
    }

    @Override
    public CompletableFuture<List<ExampleReadEntity>> findActiveAsync() {
        return CompletableFuture.supplyAsync(() ->
            m_entityManager.createQuery(
                "SELECT e FROM ExampleReadEntity e WHERE e.m_isActive = true", ExampleReadEntity.class)
                .getResultList()
        );
    }
}
