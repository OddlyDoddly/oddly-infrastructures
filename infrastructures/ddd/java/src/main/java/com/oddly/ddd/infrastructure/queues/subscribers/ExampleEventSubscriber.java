package com.oddly.ddd.infrastructure.queues.subscribers;

import com.oddly.ddd.domain.events.ExampleCreatedEvent;
import com.oddly.ddd.infrastructure.queues.infra.IEventSubscriber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;
import java.util.function.Function;

/**
 * Event subscriber for Example domain events.
 * Event subscribers:
 * - Live in /infrastructure/queues/subscribers/
 * - Handle events from other subdomains
 * - Process events asynchronously
 * - Subscribe to specific topics
 */
@Component
public class ExampleEventSubscriber implements IEventSubscriber<ExampleCreatedEvent> {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExampleEventSubscriber.class);

    @Override
    public CompletableFuture<Void> subscribeAsync(
            String p_topic,
            Function<ExampleCreatedEvent, CompletableFuture<Void>> p_handler) {
        
        return CompletableFuture.runAsync(() -> {
            // In a real implementation, this would subscribe to a message queue
            LOGGER.info("Subscribed to topic: {}", p_topic);
        });
    }

    @Override
    public CompletableFuture<Void> handleAsync(ExampleCreatedEvent p_event) {
        return CompletableFuture.runAsync(() -> {
            // Handle the event - implement business logic here
            LOGGER.info("Handling ExampleCreatedEvent: {} (ID: {})", 
                p_event.getName(), 
                p_event.getExampleId()
            );
            
            // Example: Update read model, send notification, etc.
            // This is where cross-subdomain communication is handled
        });
    }
}
