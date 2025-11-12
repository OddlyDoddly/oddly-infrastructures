package com.oddly.ddd.infrastructure.persistence.read.infra;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import java.time.LocalDateTime;

/**
 * Base class for all read entities (query side in CQRS).
 * Read entities:
 * - Live in /infrastructure/persistence/read/
 * - Have ReadEntity suffix
 * - Used for queries (read operations)
 * - Pre-rendered views optimized for front-end
 * - Denormalized for query performance
 * - May aggregate data from multiple WriteEntities
 * - Have ORM/database annotations
 */
@MappedSuperclass
public abstract class BaseReadEntity {
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    protected String m_id;

    @Column(name = "created_at", nullable = false, updatable = false)
    protected LocalDateTime m_createdAt;

    @Column(name = "updated_at", nullable = false)
    protected LocalDateTime m_updatedAt;

    protected BaseReadEntity() {
    }

    public String getId() {
        return m_id;
    }

    public void setId(String p_id) {
        this.m_id = p_id;
    }

    public LocalDateTime getCreatedAt() {
        return m_createdAt;
    }

    public void setCreatedAt(LocalDateTime p_createdAt) {
        this.m_createdAt = p_createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return m_updatedAt;
    }

    public void setUpdatedAt(LocalDateTime p_updatedAt) {
        this.m_updatedAt = p_updatedAt;
    }
}
