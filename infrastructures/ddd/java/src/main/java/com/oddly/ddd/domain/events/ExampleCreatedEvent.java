package com.oddly.ddd.domain.events;

import com.oddly.ddd.domain.events.infra.BaseDomainEvent;

/**
 * Domain event for when an example is created.
 * Domain events:
 * - Have Event suffix
 * - Follow pattern: {Object}{Action}Event
 * - Are immutable (all fields final)
 * - Live in /domain/events/
 */
public class ExampleCreatedEvent extends BaseDomainEvent {
    private final String m_exampleId;
    private final String m_name;
    private final String m_ownerId;

    public ExampleCreatedEvent(String p_exampleId, String p_name, String p_ownerId, String p_correlationId) {
        super(p_correlationId);
        this.m_exampleId = p_exampleId;
        this.m_name = p_name;
        this.m_ownerId = p_ownerId;
    }

    @Override
    public String getEventType() {
        return "example.created";
    }

    public String getExampleId() {
        return m_exampleId;
    }

    public String getName() {
        return m_name;
    }

    public String getOwnerId() {
        return m_ownerId;
    }
}
