package com.oddly.ddd.infrastructure.queues.infra;

import java.util.concurrent.CompletableFuture;

/**
 * Interface for publishing domain events to a message queue.
 * Event publishers:
 * - Live in /infrastructure/queues/infra/
 * - Used for asynchronous communication between subdomains
 * - MUST be used for ALL subdomain-to-subdomain communication
 * - MUST NOT use HTTP calls between subdomains
 * 
 * Topic naming: {subdomain}.{action}
 * Example: example.created, example.updated
 */
public interface IEventPublisher {
    /**
     * Publishes an event to the specified topic.
     * 
     * @param <TEvent> The event type
     * @param p_event The event to publish
     * @param p_topic The topic to publish to
     */
    <TEvent> CompletableFuture<Void> publishAsync(TEvent p_event, String p_topic);
}
