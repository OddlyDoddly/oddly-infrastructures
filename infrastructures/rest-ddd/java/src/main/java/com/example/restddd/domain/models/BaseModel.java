/**
 * Base Model (BMO) - Business Model Object
 * Pure business logic with NO database attributes.
 * All domain models MUST extend this base class.
 */

package com.example.restddd.domain.models;

import java.util.Map;

public abstract class BaseModel {
    /**
     * Abstract base class for all Business Model Objects (BMOs).
     * 
     * Rules:
     * - NO database/persistence attributes
     * - Contains business logic and invariants
     * - Validates business rules
     * - Member fields prefixed with m_ or _
     */

    /**
     * Validate business invariants.
     * Throws exception if invalid.
     */
    public abstract void validate();

    /**
     * Convert model to map representation.
     * Used by mappers for transformation.
     */
    public abstract Map<String, Object> toMap();
}
