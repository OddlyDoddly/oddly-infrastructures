package com.oddly.ddd.infrastructure.persistence.read;

import com.oddly.ddd.infrastructure.persistence.read.infra.BaseReadEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * Read entity for Example (query side in CQRS).
 * Read entities:
 * - Live in /infrastructure/persistence/read/
 * - Have ReadEntity suffix
 * - Used for queries (read operations)
 * - Pre-rendered views optimized for front-end
 * - Denormalized for query performance
 * - May aggregate data from multiple WriteEntities
 */
@Entity
@Table(name = "examples_view")
public class ExampleReadEntity extends BaseReadEntity {
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

    // Computed/denormalized fields for query optimization
    @Column(name = "owner_name", length = 100)
    private String m_ownerName;

    @Column(name = "example_count")
    private Integer m_exampleCount;

    public ExampleReadEntity() {
        super();
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

    public String getOwnerName() {
        return m_ownerName;
    }

    public void setOwnerName(String p_ownerName) {
        this.m_ownerName = p_ownerName;
    }

    public Integer getExampleCount() {
        return m_exampleCount;
    }

    public void setExampleCount(Integer p_exampleCount) {
        this.m_exampleCount = p_exampleCount;
    }
}
