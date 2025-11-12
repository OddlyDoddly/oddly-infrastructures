/**
 * Example Read Entity - For Queries
 * Denormalized view optimized for front-end.
 * MUST suffix with 'ReadEntity'.
 */

package com.example.restddd.infrastructure.persistence.read;

public class ExampleReadEntity extends BaseReadEntity {
    /**
     * Read Entity for query operations (SELECT).
     * 
     * Rules:
     * - Located in /infrastructure/persistence/read/
     * - Suffix with 'ReadEntity'
     * - Denormalized for query performance
     * - May aggregate from multiple WriteEntities
     * - NO version tracking (read-only)
     */

    private String m_name;
    private String m_description;
    private String m_status;
    private String m_ownerId;
    private String m_ownerName;  // Denormalized from User
    private String m_createdAt;
    private String m_updatedAt;

    public ExampleReadEntity(
        String p_id,
        String p_name,
        String p_description,
        String p_status,
        String p_ownerId,
        String p_ownerName,
        String p_createdAt,
        String p_updatedAt
    ) {
        this.m_id = p_id;
        this.m_name = p_name;
        this.m_description = p_description;
        this.m_status = p_status;
        this.m_ownerId = p_ownerId;
        this.m_ownerName = p_ownerName;
        this.m_createdAt = p_createdAt;
        this.m_updatedAt = p_updatedAt;
    }

    // Getters only (read-only)
    public String getName() { return m_name; }
    public String getDescription() { return m_description; }
    public String getStatus() { return m_status; }
    public String getOwnerId() { return m_ownerId; }
    public String getOwnerName() { return m_ownerName; }
    public String getCreatedAt() { return m_createdAt; }
    public String getUpdatedAt() { return m_updatedAt; }
}
