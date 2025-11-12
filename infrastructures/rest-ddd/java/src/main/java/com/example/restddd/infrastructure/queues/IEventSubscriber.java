/**
 * Event Subscriber Interface
 * Abstraction for subscribing to domain events from message queue.
 */

package com.example.restddd.infrastructure.queues;

import com.example.restddd.domain.events.BaseDomainEvent;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;

public interface IEventSubscriber {
    /**
     * Interface for subscribing to domain events.
     * 
     * Rules:
     * - Abstraction over message queue (RabbitMQ, Kafka, AWS SQS, etc.)
     * - Used for receiving events from other subdomains
     * - Handler processes events asynchronously
     */

    /**
     * Subscribe to events on specified topic.
     */
    <TEvent extends BaseDomainEvent> CompletableFuture<Void> subscribeAsync(
        String p_topic,
        Consumer<TEvent> p_handler
    );

    /**
     * Unsubscribe from topic.
     */
    CompletableFuture<Void> unsubscribeAsync(String p_topic);
}
