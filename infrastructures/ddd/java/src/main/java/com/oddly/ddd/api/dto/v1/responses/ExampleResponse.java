package com.oddly.ddd.api.dto.v1.responses;

import com.oddly.ddd.api.dto.v1.infra.BaseResponseDto;

/**
 * Response DTO for example data.
 * Response DTOs:
 * - Live in /api/dto/v1/responses/
 * - Have Response suffix
 */
public class ExampleResponse extends BaseResponseDto {
    private String m_id;
    private String m_name;
    private String m_description;
    private String m_category;
    private boolean m_isActive;
    private String m_ownerId;

    public String getId() {
        return m_id;
    }

    public void setId(String p_id) {
        this.m_id = p_id;
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
}
