/**
 * Base Response DTOs
 * Standard HTTP response contracts.
 */

package com.example.restddd.api.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public abstract class BaseResponse {
    /**
     * Base response DTO for successful operations.
     */
}

class ErrorResponseData {
    private String code;
    private String message;
    private String timestamp;
    private String path;
    private String requestId;
    private Map<String, Object> details;

    public ErrorResponseData(
        String p_code,
        String p_message,
        String p_path,
        String p_requestId,
        Map<String, Object> p_details
    ) {
        this.code = p_code;
        this.message = p_message;
        this.timestamp = Instant.now().toString();
        this.path = p_path;
        this.requestId = p_requestId;
        this.details = p_details;
    }

    // Getters
    public String getCode() { return code; }
    public String getMessage() { return message; }
    public String getTimestamp() { return timestamp; }
    public String getPath() { return path; }
    public String getRequestId() { return requestId; }
    public Map<String, Object> getDetails() { return details; }
}

class ErrorResponse {
    /**
     * Standard error response contract.
     * 
     * Rules:
     * - MUST follow this structure for all errors
     * - Status code mapping handled by middleware
     * - NO internal details leaked in production
     */

    private ErrorResponseData error;

    public ErrorResponse(ErrorResponseData p_error) {
        this.error = p_error;
    }

    public ErrorResponseData getError() {
        return error;
    }
}

class PaginatedResponse<T> extends BaseResponse {
    /**
     * Base response for paginated queries.
     */

    private List<T> items;
    private int page;
    private int pageSize;
    private int totalCount;
    private int totalPages;

    public PaginatedResponse(
        List<T> p_items,
        int p_page,
        int p_pageSize,
        int p_totalCount
    ) {
        this.items = p_items;
        this.page = p_page;
        this.pageSize = p_pageSize;
        this.totalCount = p_totalCount;
        this.totalPages = (int) Math.ceil((double) p_totalCount / p_pageSize);
    }

    public boolean hasNext() {
        return page < totalPages;
    }

    public boolean hasPrevious() {
        return page > 1;
    }

    // Getters
    public List<T> getItems() { return items; }
    public int getPage() { return page; }
    public int getPageSize() { return pageSize; }
    public int getTotalCount() { return totalCount; }
    public int getTotalPages() { return totalPages; }
}
