package com.oddly.ddd.application.errors.infra;

import java.util.Map;

/**
 * Base class for all service-level exceptions.
 * All service exceptions MUST inherit from this class.
 * Pattern: Create {Object}ServiceException extends ServiceException&lt;{Object}ErrorCode&gt;
 * Location: MUST be in /application/errors/ directory
 */
public abstract class ServiceException extends RuntimeException {
    /**
     * Gets the generic error code as an Enum
     */
    public abstract Enum<?> getGenericErrorCode();

    /**
     * Gets the type of the error code enum
     */
    public abstract Class<? extends Enum<?>> getErrorCodeType();

    protected ServiceException(String p_message) {
        super(p_message);
    }

    protected ServiceException(String p_message, Throwable p_cause) {
        super(p_message, p_cause);
    }
}

/**
 * Generic base class for typed service exceptions.
 * 
 * @param <TErrorCode> The enum type representing error codes
 */
abstract class TypedServiceException<TErrorCode extends Enum<TErrorCode>> extends ServiceException {
    private final TErrorCode m_errorCode;
    private final Map<String, Object> m_details;

    protected TypedServiceException(
            TErrorCode p_code,
            Map<String, String> p_messageTemplates,
            Map<String, Object> p_details) {
        super(formatMessage(p_code, p_messageTemplates, p_details));
        this.m_errorCode = p_code;
        this.m_details = p_details;
    }

    protected TypedServiceException(
            TErrorCode p_code,
            Map<String, String> p_messageTemplates,
            Map<String, Object> p_details,
            Throwable p_cause) {
        super(formatMessage(p_code, p_messageTemplates, p_details), p_cause);
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

    public TErrorCode getErrorCode() {
        return m_errorCode;
    }

    public Map<String, Object> getDetails() {
        return m_details;
    }

    /**
     * Formats the exception message using the template and details
     */
    protected static <T extends Enum<T>> String formatMessage(
            T p_code,
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
