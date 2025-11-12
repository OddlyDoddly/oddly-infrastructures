package com.oddly.ddd.domain.events.infra;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Base class for all domain events.
 * Domain events MUST:
 * - Have Event suffix
 * - Follow pattern: {Object}{Action}Event (e.g., ExampleCreatedEvent)
 * - Be immutable (all fields final)
 * - Include timestamp and correlationId
 * - Live in /domain/events/
 */
public abstract class BaseDomainEvent {
    private final String m_eventId;
    private final LocalDateTime m_timestamp;
    private final String m_correlationId;

    protected BaseDomainEvent(String p_correlationId) {
        this.m_eventId = UUID.randomUUID().toString();
        this.m_timestamp = LocalDateTime.now();
        this.m_correlationId = p_correlationId;
    }

    public String getEventId() {
        return m_eventId;
    }

    public LocalDateTime getTimestamp() {
        return m_timestamp;
    }

    public String getCorrelationId() {
        return m_correlationId;
    }

    /**
     * Gets the event type name.
     * Used for routing and logging.
     */
    public abstract String getEventType();
}
