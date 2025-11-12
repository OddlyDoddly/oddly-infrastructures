package com.oddly.ddd.api.dto.v1.infra;

/**
 * Base class for all request DTOs.
 * Request DTOs:
 * - Live in /api/dto/v1/requests/
 * - Have Request suffix
 * - Handle HTTP transport only
 * - NO business logic
 * - Include validation annotations
 */
public abstract class BaseRequestDto {
    private String m_requestId;

    public String getRequestId() {
        return m_requestId;
    }

    public void setRequestId(String p_requestId) {
        this.m_requestId = p_requestId;
    }
}
