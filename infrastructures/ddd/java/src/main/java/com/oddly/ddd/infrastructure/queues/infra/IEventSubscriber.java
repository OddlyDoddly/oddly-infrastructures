package com.oddly.ddd.infrastructure.queues.infra;

import java.util.concurrent.CompletableFuture;
import java.util.function.Function;

/**
 * Interface for subscribing to domain events from a message queue.
 * Event subscribers:
 * - Live in /infrastructure/queues/subscribers/
 * - Handle events from other subdomains
 * - Process events asynchronously
 * 
 * @param <TEvent> The event type to subscribe to
 */
public interface IEventSubscriber<TEvent> {
    /**
     * Subscribes to events on the specified topic.
     * 
     * @param p_topic The topic to subscribe to
     * @param p_handler The handler function to process events
     */
    CompletableFuture<Void> subscribeAsync(
        String p_topic,
        Function<TEvent, CompletableFuture<Void>> p_handler
    );

    /**
     * Handles an event.
     * Implement this method to process the event.
     * 
     * @param p_event The event to handle
     */
    CompletableFuture<Void> handleAsync(TEvent p_event);
}
