package com.oddly.ddd.infrastructure.persistence.write.infra;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import java.time.LocalDateTime;

/**
 * Base class for all write entities (command side in CQRS).
 * Write entities:
 * - Live in /infrastructure/persistence/write/
 * - Have WriteEntity suffix
 * - Used for commands (create, update, delete)
 * - Contain all fields needed for business operations
 * - Have ORM/database annotations
 * - Include optimistic locking (version)
 */
@MappedSuperclass
public abstract class BaseWriteEntity {
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    protected String m_id;

    @Version
    @Column(name = "version")
    protected Integer m_version;

    @Column(name = "created_at", nullable = false, updatable = false)
    protected LocalDateTime m_createdAt;

    @Column(name = "updated_at", nullable = false)
    protected LocalDateTime m_updatedAt;

    protected BaseWriteEntity() {
        this.m_createdAt = LocalDateTime.now();
        this.m_updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return m_id;
    }

    public void setId(String p_id) {
        this.m_id = p_id;
    }

    public Integer getVersion() {
        return m_version;
    }

    public void setVersion(Integer p_version) {
        this.m_version = p_version;
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
