/**
 * Example Service Exception
 * Follows ServiceException pattern with error codes.
 */

package com.example.restddd.application.errors;

import java.util.HashMap;
import java.util.Map;

public enum ExampleErrorCode {
    NOT_FOUND,
    VALIDATION_FAILED,
    CONFLICT,
    FORBIDDEN
}

class ExampleServiceException extends ServiceException {
    /**
     * Service exception for Example operations.
     * 
     * Rules:
     * - Located in /application/errors/
     * - Pattern: {Object}ServiceException
     * - Define error codes as enum
     * - Define message templates
     */

    private static final Map<String, String> MESSAGE_TEMPLATES = new HashMap<>();

    static {
        MESSAGE_TEMPLATES.put("NOT_FOUND", "Example '{id}' not found");
        MESSAGE_TEMPLATES.put("VALIDATION_FAILED", "Validation failed: {reason}");
        MESSAGE_TEMPLATES.put("CONFLICT", "Example '{id}' already exists");
        MESSAGE_TEMPLATES.put("FORBIDDEN", "Access to Example '{id}' is forbidden");
    }

    public ExampleServiceException(
        ExampleErrorCode p_errorCode,
        Map<String, Object> p_details
    ) {
        super(p_errorCode, MESSAGE_TEMPLATES, p_details);
    }

    /**
     * Map error code to HTTP status code.
     */
    public static int toHttpStatus(ExampleErrorCode p_errorCode) {
        switch (p_errorCode) {
            case NOT_FOUND:
                return 404;
            case VALIDATION_FAILED:
                return 400;
            case CONFLICT:
                return 409;
            case FORBIDDEN:
                return 403;
            default:
                return 500;
        }
    }
}
