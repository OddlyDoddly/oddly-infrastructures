/**
 * Service Exception Base Classes
 * ALL service exceptions MUST follow this pattern.
 * Location: /application/errors/ (NOT /services/)
 */

package com.example.restddd.application.errors;

import java.util.HashMap;
import java.util.Map;

public abstract class ServiceException extends RuntimeException {
    /**
     * Abstract base class for all service exceptions.
     * 
     * Rules:
     * - Pattern: {Object}ServiceException
     * - Define: {Object}ErrorCode enum (NOT strings)
     * - Location: /application/errors/
     */

    protected final Enum<?> m_errorCode;
    protected final Map<String, Object> m_details;

    protected ServiceException(
        Enum<?> p_errorCode,
        Map<String, String> p_messageTemplates,
        Map<String, Object> p_details
    ) {
        super(formatMessage(p_errorCode, p_messageTemplates, p_details));
        this.m_errorCode = p_errorCode;
        this.m_details = p_details != null ? p_details : new HashMap<>();
    }

    public Enum<?> getErrorCode() {
        return m_errorCode;
    }

    public Map<String, Object> getDetails() {
        return m_details;
    }

    private static String formatMessage(
        Enum<?> p_code,
        Map<String, String> p_templates,
        Map<String, Object> p_details
    ) {
        String template = p_templates.getOrDefault(
            p_code.name(),
            "Error: " + p_code.name()
        );

        if (p_details != null) {
            for (Map.Entry<String, Object> entry : p_details.entrySet()) {
                template = template.replace(
                    "{" + entry.getKey() + "}",
                    String.valueOf(entry.getValue())
                );
            }
        }

        return template;
    }
}
