/**
 * Base Read Entity - For Queries (SELECT)
 * Pre-rendered views optimized for front-end.
 * Denormalized for query performance.
 */

package com.example.restddd.infrastructure.persistence.read;

public abstract class BaseReadEntity {
    /**
     * Abstract base class for all Read Entities (Query side).
     * 
     * Rules:
     * - MUST be in /infrastructure/persistence/read/
     * - MUST suffix with 'ReadEntity'
     * - Pre-rendered views optimized for queries
     * - Denormalized data (may aggregate from multiple WriteEntities)
     * - NO version tracking needed (read-only)
     */

    protected String m_id;

    public String getId() {
        return m_id;
    }

    public void setId(String p_id) {
        this.m_id = p_id;
    }
}
