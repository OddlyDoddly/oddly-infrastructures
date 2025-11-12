/**
 * Event Subscriber Interface
 * Abstraction for subscribing to domain events from message queue.
 */

using System;
using System.Threading.Tasks;
using Domain.Events;

namespace Infrastructure.Queues
{
    public interface IEventSubscriber
    {
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
        Task SubscribeAsync<TEvent>(
            string p_topic,
            Func<TEvent, Task> p_handler
        ) where TEvent : BaseDomainEvent;

        /**
         * Unsubscribe from topic.
         */
        Task UnsubscribeAsync(string p_topic);
    }
}
