/**
 * Example Created Event
 * Domain event following {Object}{Action}Event pattern.
 */

package com.example.restddd.domain.events;

import java.util.HashMap;
import java.util.Map;

public class ExampleCreatedEvent extends BaseDomainEvent {
    /**
     * Domain event fired when Example is created.
     * 
     * Rules:
     * - Located in /domain/events/
     * - Pattern: {Object}{Action}Event
     * - Suffix with 'Event'
     * - MUST be immutable (use final fields)
     */

    private final String m_exampleId;
    private final String m_name;
    private final String m_ownerId;

    public ExampleCreatedEvent(
        String p_exampleId,
        String p_name,
        String p_ownerId,
        String p_correlationId
    ) {
        super(p_correlationId);
        this.m_exampleId = p_exampleId;
        this.m_name = p_name;
        this.m_ownerId = p_ownerId;
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

    @Override
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("eventId", getEventId());
        map.put("timestamp", getTimestamp().toString());
        map.put("correlationId", getCorrelationId());
        map.put("eventType", "ExampleCreatedEvent");
        map.put("exampleId", m_exampleId);
        map.put("name", m_name);
        map.put("ownerId", m_ownerId);
        return map;
    }
}
