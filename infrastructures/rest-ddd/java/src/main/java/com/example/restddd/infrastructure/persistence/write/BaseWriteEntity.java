/**
 * Base Write Entity - For Commands (CREATE, UPDATE, DELETE)
 * Used when business logic executes against data.
 * Contains all fields needed for business operations.
 */

package com.example.restddd.infrastructure.persistence.write;

import java.time.Instant;

public abstract class BaseWriteEntity {
    /**
     * Abstract base class for all Write Entities (Command side).
     * 
     * Rules:
     * - MUST be in /infrastructure/persistence/write/
     * - MUST suffix with 'WriteEntity'
     * - Contains ORM/database attributes
     * - Used for commands that modify data
     * - Contains version for optimistic locking
     */

    protected String m_id;
    protected Integer m_version;
    protected Instant m_createdAt;
    protected Instant m_updatedAt;

    protected BaseWriteEntity() {
        this.m_version = 1;
        this.m_createdAt = Instant.now();
        this.m_updatedAt = Instant.now();
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

    public Instant getCreatedAt() {
        return m_createdAt;
    }

    public Instant getUpdatedAt() {
        return m_updatedAt;
    }

    public void setUpdatedAt(Instant p_updatedAt) {
        this.m_updatedAt = p_updatedAt;
    }

    /**
     * Increment version for optimistic locking.
     */
    public void incrementVersion() {
        this.m_version++;
        this.m_updatedAt = Instant.now();
    }
}
