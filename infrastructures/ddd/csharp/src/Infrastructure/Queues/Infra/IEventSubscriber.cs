using System;
using System.Threading.Tasks;

namespace OddlyDdd.Infrastructure.Queues.Infra
{
    /// <summary>
    /// Interface for subscribing to domain events from a message queue.
    /// Used for asynchronous communication between subdomains.
    /// Each subdomain subscribes to events from other subdomains it needs to react to.
    /// </summary>
    public interface IEventSubscriber
    {
        /// <summary>
        /// Subscribes to events on the specified topic with the provided handler.
        /// Topic naming convention: {subdomain}.{action}
        /// Examples: "example.created", "example.updated", "example.deleted"
        /// </summary>
        /// <typeparam name="TEvent">The event type</typeparam>
        /// <param name="p_topic">The topic to subscribe to</param>
        /// <param name="p_handler">The handler function to process events</param>
        Task SubscribeAsync<TEvent>(string p_topic, Func<TEvent, Task> p_handler);
    }
}
