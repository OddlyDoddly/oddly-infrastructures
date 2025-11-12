package com.oddly.ddd.infrastructure.queues;

import com.oddly.ddd.infrastructure.queues.infra.IEventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * In-memory implementation of event bus for demonstration.
 * Queue implementations:
 * - Live in /infrastructure/queues/
 * - Implementations in root (NO /impl/ - no autowiring contracts)
 * - For production, replace with RabbitMQ, Kafka, etc.
 */
@Component
public class InMemoryEventBus implements IEventPublisher {
    private static final Logger LOGGER = LoggerFactory.getLogger(InMemoryEventBus.class);

    @Override
    public <TEvent> CompletableFuture<Void> publishAsync(TEvent p_event, String p_topic) {
        return CompletableFuture.runAsync(() -> {
            // In a real implementation, this would publish to a message queue
            LOGGER.info("Publishing event to topic '{}': {}", p_topic, p_event.getClass().getSimpleName());
            // For demonstration, just log the event
        });
    }
}
