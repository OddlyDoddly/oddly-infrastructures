package com.oddly.ddd.application.errors;

import com.oddly.ddd.application.errors.infra.ServiceException;

import java.util.HashMap;
import java.util.Map;

/**
 * Service exception for Example domain.
 * Service exceptions:
 * - Live in /application/errors/
 * - Have ServiceException suffix
 * - Define error codes as enum
 * - Follow pattern: {Object}ServiceException extends ServiceException
 */
public class ExampleServiceException extends ServiceException {
    /**
     * Error codes for Example service.
     * Error codes MUST be enum (NOT strings).
     */
    public enum ExampleErrorCode {
        NOT_FOUND,
        VALIDATION_FAILED,
        CONFLICT,
        UNAUTHORIZED,
        FORBIDDEN
    }

    private final ExampleErrorCode m_errorCode;
    private final Map<String, Object> m_details;

    private static final Map<String, String> MESSAGE_TEMPLATES = new HashMap<>();
    
    static {
        MESSAGE_TEMPLATES.put("NOT_FOUND", "Example '{id}' not found");
        MESSAGE_TEMPLATES.put("VALIDATION_FAILED", "Validation failed: {reason}");
        MESSAGE_TEMPLATES.put("CONFLICT", "Example with name '{name}' already exists");
        MESSAGE_TEMPLATES.put("UNAUTHORIZED", "User is not authenticated");
        MESSAGE_TEMPLATES.put("FORBIDDEN", "User does not have permission to access this example");
    }

    public ExampleServiceException(ExampleErrorCode p_code, Map<String, Object> p_details) {
        super(formatMessage(p_code, MESSAGE_TEMPLATES, p_details));
        this.m_errorCode = p_code;
        this.m_details = p_details;
    }

    public ExampleServiceException(ExampleErrorCode p_code, Map<String, Object> p_details, Throwable p_cause) {
        super(formatMessage(p_code, MESSAGE_TEMPLATES, p_details), p_cause);
        this.m_errorCode = p_code;
        this.m_details = p_details;
    }

    @Override
    public Enum<?> getGenericErrorCode() {
        return m_errorCode;
    }

    @Override
    @SuppressWarnings("unchecked")
    public Class<? extends Enum<?>> getErrorCodeType() {
        return (Class<? extends Enum<?>>) m_errorCode.getClass();
    }

    public ExampleErrorCode getErrorCode() {
        return m_errorCode;
    }

    public Map<String, Object> getDetails() {
        return m_details;
    }

    /**
     * Helper method to format message using template and details.
     */
    private static String formatMessage(
            ExampleErrorCode p_code,
            Map<String, String> p_messageTemplates,
            Map<String, Object> p_details) {
        String codeString = p_code.name();
        String template = p_messageTemplates.getOrDefault(codeString, "Error occurred: " + codeString);

        if (p_details == null || p_details.isEmpty()) {
            return template;
        }

        String message = template;
        for (Map.Entry<String, Object> entry : p_details.entrySet()) {
            String placeholder = "{" + entry.getKey() + "}";
            String value = entry.getValue() != null ? entry.getValue().toString() : "null";
            message = message.replace(placeholder, value);
        }

        return message;
    }
}
