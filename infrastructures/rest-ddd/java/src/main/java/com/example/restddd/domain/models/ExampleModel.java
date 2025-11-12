/**
 * Example Model (BMO) - Business Model Object
 * NO database attributes - pure business logic only.
 */

package com.example.restddd.domain.models;

import java.util.HashMap;
import java.util.Map;

public class ExampleModel extends BaseModel {
    /**
     * Example domain model demonstrating DDD principles.
     * 
     * Rules:
     * - Member fields prefixed with m_
     * - NO database/ORM attributes
     * - Contains business logic and validation
     * - Located in /domain/models/
     */

    private String m_id;
    private String m_name;
    private String m_description;
    private ExampleStatus m_status;
    private String m_ownerId;

    public ExampleModel(
        String p_name,
        String p_description,
        ExampleStatus p_status,
        String p_ownerId,
        String p_id
    ) {
        this.m_id = p_id;
        this.m_name = p_name;
        this.m_description = p_description;
        this.m_status = p_status;
        this.m_ownerId = p_ownerId;
    }

    // Getters
    public String getId() { return m_id; }
    public String getName() { return m_name; }
    public String getDescription() { return m_description; }
    public ExampleStatus getStatus() { return m_status; }
    public String getOwnerId() { return m_ownerId; }

    // Business logic methods
    @Override
    public void validate() {
        if (m_name == null || m_name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }

        if (m_name.length() < 3) {
            throw new IllegalArgumentException("Name must be at least 3 characters");
        }

        if (m_name.length() > 100) {
            throw new IllegalArgumentException("Name must not exceed 100 characters");
        }

        if (m_ownerId == null || m_ownerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Owner ID is required");
        }
    }

    public void activate() {
        if (m_status == ExampleStatus.ACTIVE) {
            throw new IllegalStateException("Example is already active");
        }
        m_status = ExampleStatus.ACTIVE;
    }

    public void deactivate() {
        if (m_status == ExampleStatus.INACTIVE) {
            throw new IllegalStateException("Example is already inactive");
        }
        m_status = ExampleStatus.INACTIVE;
    }

    public void updateDescription(String p_description) {
        if (p_description.length() > 500) {
            throw new IllegalArgumentException("Description must not exceed 500 characters");
        }
        m_description = p_description;
    }

    @Override
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", m_id);
        map.put("name", m_name);
        map.put("description", m_description);
        map.put("status", m_status.name());
        map.put("ownerId", m_ownerId);
        return map;
    }
}

enum ExampleStatus {
    ACTIVE,
    INACTIVE,
    PENDING
}
