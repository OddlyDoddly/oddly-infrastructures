/**
 * Event Publisher Interface
 * Abstraction for publishing domain events to message queue.
 */

using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Events;

namespace Infrastructure.Queues
{
    public interface IEventPublisher
    {
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
        Task PublishAsync<TEvent>(TEvent p_event, string p_topic)
            where TEvent : BaseDomainEvent;

        /**
         * Publish multiple events to specified topic.
         */
        Task PublishBatchAsync<TEvent>(List<TEvent> p_events, string p_topic)
            where TEvent : BaseDomainEvent;
    }
}
