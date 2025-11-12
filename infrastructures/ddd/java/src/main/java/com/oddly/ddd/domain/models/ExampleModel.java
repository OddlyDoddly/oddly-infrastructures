package com.oddly.ddd.domain.models;

import com.oddly.ddd.domain.models.infra.BaseModel;

/**
 * Business Model Object (BMO) for Example domain.
 * BMOs:
 * - Live in /domain/models/
 * - Have Model or BMO suffix
 * - Contain business logic and invariants
 * - MUST NOT have database/ORM attributes
 * - Pure domain logic only
 */
public class ExampleModel extends BaseModel {
    private String m_name;
    private String m_description;
    private String m_category;
    private boolean m_isActive;
    private String m_ownerId;

    public ExampleModel(String p_name, String p_description, String p_category, String p_ownerId) {
        super();
        this.m_name = p_name;
        this.m_description = p_description;
        this.m_category = p_category;
        this.m_isActive = true;
        this.m_ownerId = p_ownerId;
    }

    public ExampleModel(String p_id, String p_name, String p_description, 
                        String p_category, boolean p_isActive, String p_ownerId) {
        super(p_id);
        this.m_name = p_name;
        this.m_description = p_description;
        this.m_category = p_category;
        this.m_isActive = p_isActive;
        this.m_ownerId = p_ownerId;
    }

    // Business logic methods

    /**
     * Activates the example.
     * Business rule: Only the owner can activate.
     */
    public void activate(String p_userId) {
        validateOwnership(p_userId);
        this.m_isActive = true;
        touch();
    }

    /**
     * Deactivates the example.
     * Business rule: Only the owner can deactivate.
     */
    public void deactivate(String p_userId) {
        validateOwnership(p_userId);
        this.m_isActive = false;
        touch();
    }

    /**
     * Updates the example details.
     * Business rule: Only the owner can update.
     */
    public void update(String p_name, String p_description, String p_category, String p_userId) {
        validateOwnership(p_userId);
        
        if (p_name != null && !p_name.isBlank()) {
            this.m_name = p_name;
        }
        if (p_description != null) {
            this.m_description = p_description;
        }
        if (p_category != null) {
            this.m_category = p_category;
        }
        
        touch();
    }

    /**
     * Validates that the user owns this example.
     */
    private void validateOwnership(String p_userId) {
        if (!this.m_ownerId.equals(p_userId)) {
            throw new IllegalStateException("User does not own this example");
        }
    }

    @Override
    public void validate() {
        super.validate();
        
        if (m_name == null || m_name.isBlank()) {
            throw new IllegalStateException("Example name cannot be empty");
        }
        if (m_name.length() < 3 || m_name.length() > 100) {
            throw new IllegalStateException("Example name must be between 3 and 100 characters");
        }
        if (m_ownerId == null || m_ownerId.isBlank()) {
            throw new IllegalStateException("Example must have an owner");
        }
    }

    // Getters
    public String getName() {
        return m_name;
    }

    public String getDescription() {
        return m_description;
    }

    public String getCategory() {
        return m_category;
    }

    public boolean isActive() {
        return m_isActive;
    }

    public String getOwnerId() {
        return m_ownerId;
    }
}
