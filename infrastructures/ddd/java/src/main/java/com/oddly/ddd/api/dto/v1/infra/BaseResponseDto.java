package com.oddly.ddd.api.dto.v1.infra;

import java.time.LocalDateTime;

/**
 * Base class for all response DTOs.
 * Response DTOs:
 * - Live in /api/dto/v1/responses/
 * - Have Response suffix
 * - Handle HTTP transport only
 * - NO business logic
 */
public abstract class BaseResponseDto {
    private String m_requestId;
    private LocalDateTime m_timestamp;

    protected BaseResponseDto() {
        this.m_timestamp = LocalDateTime.now();
    }

    public String getRequestId() {
        return m_requestId;
    }

    public void setRequestId(String p_requestId) {
        this.m_requestId = p_requestId;
    }

    public LocalDateTime getTimestamp() {
        return m_timestamp;
    }

    public void setTimestamp(LocalDateTime p_timestamp) {
        this.m_timestamp = p_timestamp;
    }
}
