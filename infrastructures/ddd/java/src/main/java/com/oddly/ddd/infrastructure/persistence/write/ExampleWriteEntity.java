package com.oddly.ddd.infrastructure.persistence.write;

import com.oddly.ddd.infrastructure.persistence.write.infra.BaseWriteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * Write entity for Example (command side in CQRS).
 * Write entities:
 * - Live in /infrastructure/persistence/write/
 * - Have WriteEntity suffix
 * - Used for commands (create, update, delete)
 * - Contain all fields needed for business operations
 * - Have ORM/database annotations
 */
@Entity
@Table(name = "examples")
public class ExampleWriteEntity extends BaseWriteEntity {
    @Column(name = "name", nullable = false, length = 100)
    private String m_name;

    @Column(name = "description", length = 500)
    private String m_description;

    @Column(name = "category", length = 50)
    private String m_category;

    @Column(name = "is_active", nullable = false)
    private boolean m_isActive;

    @Column(name = "owner_id", nullable = false)
    private String m_ownerId;

    public ExampleWriteEntity() {
        super();
        this.m_isActive = true;
    }

    public String getName() {
        return m_name;
    }

    public void setName(String p_name) {
        this.m_name = p_name;
    }

    public String getDescription() {
        return m_description;
    }

    public void setDescription(String p_description) {
        this.m_description = p_description;
    }

    public String getCategory() {
        return m_category;
    }

    public void setCategory(String p_category) {
        this.m_category = p_category;
    }

    public boolean isActive() {
        return m_isActive;
    }

    public void setActive(boolean p_active) {
        m_isActive = p_active;
    }

    public String getOwnerId() {
        return m_ownerId;
    }

    public void setOwnerId(String p_ownerId) {
        this.m_ownerId = p_ownerId;
    }
}
