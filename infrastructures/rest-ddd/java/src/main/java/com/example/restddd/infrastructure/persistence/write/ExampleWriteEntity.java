/**
 * Example Write Entity - For Commands
 * Contains ORM/database attributes.
 * MUST suffix with 'WriteEntity'.
 */

package com.example.restddd.infrastructure.persistence.write;

public class ExampleWriteEntity extends BaseWriteEntity {
    /**
     * Write Entity for command operations (CREATE, UPDATE, DELETE).
     * 
     * Rules:
     * - Located in /infrastructure/persistence/write/
     * - Suffix with 'WriteEntity'
     * - Contains database/ORM attributes
     * - Used for business operations
     */

    private String m_name;
    private String m_description;
    private String m_status;
    private String m_ownerId;

    public ExampleWriteEntity(
        String p_name,
        String p_description,
        String p_status,
        String p_ownerId
    ) {
        super();
        this.m_name = p_name;
        this.m_description = p_description;
        this.m_status = p_status;
        this.m_ownerId = p_ownerId;
    }

    // Getters and setters
    public String getName() { return m_name; }
    public void setName(String p_name) { this.m_name = p_name; }

    public String getDescription() { return m_description; }
    public void setDescription(String p_description) { this.m_description = p_description; }

    public String getStatus() { return m_status; }
    public void setStatus(String p_status) { this.m_status = p_status; }

    public String getOwnerId() { return m_ownerId; }
    public void setOwnerId(String p_ownerId) { this.m_ownerId = p_ownerId; }
}
