using System.Threading.Tasks;

namespace OddlyDdd.Infrastructure.Queues.Infra
{
    /// <summary>
    /// Interface for publishing domain events to a message queue.
    /// Used for asynchronous communication between subdomains.
    /// CRITICAL: Domain events via queue are the ONLY way to communicate between subdomains.
    /// HTTP calls between subdomains are FORBIDDEN.
    /// </summary>
    public interface IEventPublisher
    {
        /// <summary>
        /// Publishes a domain event to the specified topic.
        /// Topic naming convention: {subdomain}.{action}
        /// Examples: "example.created", "example.updated", "example.deleted"
        /// </summary>
        /// <typeparam name="TEvent">The event type</typeparam>
        /// <param name="p_event">The event to publish</param>
        /// <param name="p_topic">The topic to publish to</param>
        Task PublishAsync<TEvent>(TEvent p_event, string p_topic);
    }
}
