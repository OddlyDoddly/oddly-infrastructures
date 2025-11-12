package com.oddly.ddd.domain.events;

import com.oddly.ddd.domain.events.infra.BaseDomainEvent;

/**
 * Domain event for when an example is deleted.
 * Domain events:
 * - Have Event suffix
 * - Follow pattern: {Object}{Action}Event
 * - Are immutable (all fields final)
 * - Live in /domain/events/
 */
public class ExampleDeletedEvent extends BaseDomainEvent {
    private final String m_exampleId;
    private final String m_ownerId;

    public ExampleDeletedEvent(String p_exampleId, String p_ownerId, String p_correlationId) {
        super(p_correlationId);
        this.m_exampleId = p_exampleId;
        this.m_ownerId = p_ownerId;
    }

    @Override
    public String getEventType() {
        return "example.deleted";
    }

    public String getExampleId() {
        return m_exampleId;
    }

    public String getOwnerId() {
        return m_ownerId;
    }
}
