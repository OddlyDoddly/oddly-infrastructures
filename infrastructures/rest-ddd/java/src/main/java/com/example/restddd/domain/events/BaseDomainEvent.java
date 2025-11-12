/**
 * Base Domain Event
 * Pattern: {Object}{Action}Event (e.g., UserCreatedEvent)
 * MUST be immutable.
 */

package com.example.restddd.domain.events;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public abstract class BaseDomainEvent {
    /**
     * Abstract base class for all domain events.
     * 
     * Rules:
     * - MUST suffix with 'Event'
     * - Pattern: {Object}{Action}Event
     * - MUST be immutable (use final fields)
     * - Location: /domain/events/
     * - Include timestamp and correlation ID
     */

    protected final String m_eventId;
    protected final Instant m_timestamp;
    protected final String m_correlationId;

    protected BaseDomainEvent(String p_correlationId) {
        this.m_eventId = UUID.randomUUID().toString();
        this.m_timestamp = Instant.now();
        this.m_correlationId = p_correlationId != null
            ? p_correlationId
            : UUID.randomUUID().toString();
    }

    public String getEventId() {
        return m_eventId;
    }

    public Instant getTimestamp() {
        return m_timestamp;
    }

    public String getCorrelationId() {
        return m_correlationId;
    }

    public abstract Map<String, Object> toMap();
}
