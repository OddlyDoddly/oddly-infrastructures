package com.oddly.ddd.domain.models.infra;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Base class for all Business Model Objects (BMOs).
 * BMOs contain business logic and invariants.
 * CRITICAL: BMOs MUST NOT have database/ORM attributes.
 * They live in /domain/models/ and have Model or BMO suffix.
 * Separation from persistence layer is MANDATORY.
 */
public abstract class BaseModel {
    protected String m_id;
    protected LocalDateTime m_createdAt;
    protected LocalDateTime m_updatedAt;

    protected BaseModel() {
        this.m_id = UUID.randomUUID().toString();
        this.m_createdAt = LocalDateTime.now();
        this.m_updatedAt = LocalDateTime.now();
    }

    protected BaseModel(String p_id) {
        this.m_id = p_id;
        this.m_createdAt = LocalDateTime.now();
        this.m_updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return m_id;
    }

    protected void setId(String p_id) {
        this.m_id = p_id;
    }

    public LocalDateTime getCreatedAt() {
        return m_createdAt;
    }

    protected void setCreatedAt(LocalDateTime p_createdAt) {
        this.m_createdAt = p_createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return m_updatedAt;
    }

    protected void setUpdatedAt(LocalDateTime p_updatedAt) {
        this.m_updatedAt = p_updatedAt;
    }

    /**
     * Updates the updatedAt timestamp to current time.
     * Should be called when the model is modified.
     */
    protected void touch() {
        this.m_updatedAt = LocalDateTime.now();
    }

    /**
     * Validates the business invariants of the model.
     * Override this method to add specific validation logic.
     * @throws IllegalStateException if validation fails
     */
    public void validate() {
        if (m_id == null || m_id.isBlank()) {
            throw new IllegalStateException("Model ID cannot be empty");
        }
    }
}
