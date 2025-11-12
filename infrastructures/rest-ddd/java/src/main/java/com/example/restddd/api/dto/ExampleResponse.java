/**
 * Example Response DTO
 * Transport layer - HTTP response body.
 */

package com.example.restddd.api.dto;

public class ExampleResponse extends BaseResponse {
    /**
     * Response DTO for Example.
     * 
     * Rules:
     * - Located in /api/dto/
     * - Suffix with 'Response'
     * - Transport layer only
     * - Optimized for front-end consumption
     */

    private String id;
    private String name;
    private String description;
    private String status;
    private String ownerId;
    private String ownerName;
    private String createdAt;
    private String updatedAt;

    // Constructor
    public ExampleResponse(
        String p_id,
        String p_name,
        String p_description,
        String p_status,
        String p_ownerId,
        String p_ownerName,
        String p_createdAt,
        String p_updatedAt
    ) {
        this.id = p_id;
        this.name = p_name;
        this.description = p_description;
        this.status = p_status;
        this.ownerId = p_ownerId;
        this.ownerName = p_ownerName;
        this.createdAt = p_createdAt;
        this.updatedAt = p_updatedAt;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public String getOwnerId() { return ownerId; }
    public String getOwnerName() { return ownerName; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }
}
