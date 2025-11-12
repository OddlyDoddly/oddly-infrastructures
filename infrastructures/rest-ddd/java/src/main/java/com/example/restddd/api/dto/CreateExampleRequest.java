/**
 * Create Example Request DTO
 * Transport layer - HTTP request body.
 */

package com.example.restddd.api.dto;

public class CreateExampleRequest {
    /**
     * Request DTO for creating an Example.
     * 
     * Rules:
     * - Located in /api/dto/
     * - Suffix with 'Request'
     * - Transport layer only
     * - NO business logic
     */

    private String name;
    private String description;
    private String ownerId;

    // Constructors
    public CreateExampleRequest() {}

    public CreateExampleRequest(String p_name, String p_description, String p_ownerId) {
        this.name = p_name;
        this.description = p_description;
        this.ownerId = p_ownerId;
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String p_name) { this.name = p_name; }

    public String getDescription() { return description; }
    public void setDescription(String p_description) { this.description = p_description; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String p_ownerId) { this.ownerId = p_ownerId; }
}

class UpdateExampleRequest {
    /**
     * Request DTO for updating an Example.
     */

    private String name;
    private String description;
    private String status;

    // Constructors
    public UpdateExampleRequest() {}

    // Getters and setters
    public String getName() { return name; }
    public void setName(String p_name) { this.name = p_name; }

    public String getDescription() { return description; }
    public void setDescription(String p_description) { this.description = p_description; }

    public String getStatus() { return status; }
    public void setStatus(String p_status) { this.status = p_status; }
}
