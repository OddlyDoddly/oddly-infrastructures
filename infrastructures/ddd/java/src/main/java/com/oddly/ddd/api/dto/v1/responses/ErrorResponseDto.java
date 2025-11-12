package com.oddly.ddd.api.dto.v1.responses;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard error response DTO.
 * All error responses MUST follow this contract.
 */
public class ErrorResponseDto {
    private ErrorDetails m_error;

    public ErrorResponseDto() {
        this.m_error = new ErrorDetails();
    }

    public ErrorDetails getError() {
        return m_error;
    }

    public void setError(ErrorDetails p_error) {
        this.m_error = p_error;
    }

    // Convenience methods for setting error details
    public void setCode(String p_code) {
        this.m_error.setCode(p_code);
    }

    public void setMessage(String p_message) {
        this.m_error.setMessage(p_message);
    }

    public void setDetails(Map<String, Object> p_details) {
        this.m_error.setDetails(p_details);
    }

    public void setPath(String p_path) {
        this.m_error.setPath(p_path);
    }

    public void setRequestId(String p_requestId) {
        this.m_error.setRequestId(p_requestId);
    }

    public static class ErrorDetails {
        private String m_code;
        private String m_message;
        private Map<String, Object> m_details;
        private LocalDateTime m_timestamp;
        private String m_path;
        private String m_requestId;

        public ErrorDetails() {
            this.m_timestamp = LocalDateTime.now();
        }

        public String getCode() {
            return m_code;
        }

        public void setCode(String p_code) {
            this.m_code = p_code;
        }

        public String getMessage() {
            return m_message;
        }

        public void setMessage(String p_message) {
            this.m_message = p_message;
        }

        public Map<String, Object> getDetails() {
            return m_details;
        }

        public void setDetails(Map<String, Object> p_details) {
            this.m_details = p_details;
        }

        public LocalDateTime getTimestamp() {
            return m_timestamp;
        }

        public void setTimestamp(LocalDateTime p_timestamp) {
            this.m_timestamp = p_timestamp;
        }

        public String getPath() {
            return m_path;
        }

        public void setPath(String p_path) {
            this.m_path = p_path;
        }

        public String getRequestId() {
            return m_requestId;
        }

        public void setRequestId(String p_requestId) {
            this.m_requestId = p_requestId;
        }
    }
}
