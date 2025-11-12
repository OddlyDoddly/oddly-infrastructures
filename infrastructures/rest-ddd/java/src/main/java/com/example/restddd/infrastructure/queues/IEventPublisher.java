/**
 * Event Publisher Interface
 * Abstraction for publishing domain events to message queue.
 */

package com.example.restddd.infrastructure.queues;

import com.example.restddd.domain.events.BaseDomainEvent;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IEventPublisher {
    /**
     * Interface for publishing domain events.
     * 
     * Rules:
     * - Abstraction over message queue (RabbitMQ, Kafka, AWS SQS, etc.)
     * - Used for subdomain-to-subdomain communication
     * - Topic naming: {subdomain}.{action} (e.g., user.created)
     */

    /**
     * Publish event to specified topic.
     */
    <TEvent extends BaseDomainEvent> CompletableFuture<Void> publishAsync(
        TEvent p_event,
        String p_topic
    );

    /**
     * Publish multiple events to specified topic.
     */
    <TEvent extends BaseDomainEvent> CompletableFuture<Void> publishBatchAsync(
        List<TEvent> p_events,
        String p_topic
    );
}
