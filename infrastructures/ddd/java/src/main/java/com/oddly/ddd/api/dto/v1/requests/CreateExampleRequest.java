package com.oddly.ddd.api.dto.v1.requests;

import com.oddly.ddd.api.dto.v1.infra.BaseRequestDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating a new example.
 * Request DTOs:
 * - Live in /api/dto/v1/requests/
 * - Have Request suffix
 * - Include validation annotations
 */
public class CreateExampleRequest extends BaseRequestDto {
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String m_name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String m_description;

    private String m_category;

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
}
