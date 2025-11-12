using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OddlyDdd.Infrastructure.Queues.Impl
{
    /// <summary>
    /// In-memory implementation of event bus for demonstration purposes.
    /// In production, replace with actual message queue (RabbitMQ, Azure Service Bus, AWS SQS, etc.)
    /// 
    /// This implementation:
    /// - Lives in /Infrastructure/Queues/Impl/
    /// - Implements IEventPublisher and IEventSubscriber
    /// - Provides simple pub/sub mechanism
    /// - NOT suitable for production (no persistence, no retry, no scaling)
    /// </summary>
    public class InMemoryEventBus : IEventPublisher, IEventSubscriber
    {
        private readonly ConcurrentDictionary<string, List<Func<object, Task>>> _subscribers = new();

        /// <summary>
        /// Publishes an event to all subscribers of the topic.
        /// Topic naming: {subdomain}.{action} (e.g., "example.created")
        /// </summary>
        public async Task PublishAsync<TEvent>(TEvent p_event, string p_topic)
        {
            if (!_subscribers.TryGetValue(p_topic, out var handlers))
            {
                return; // No subscribers for this topic
            }

            var tasks = new List<Task>();
            foreach (var handler in handlers)
            {
                tasks.Add(handler(p_event!));
            }

            await Task.WhenAll(tasks);
        }

        /// <summary>
        /// Subscribes to events on the specified topic.
        /// Topic naming: {subdomain}.{action} (e.g., "example.created")
        /// </summary>
        public Task SubscribeAsync<TEvent>(string p_topic, Func<TEvent, Task> p_handler)
        {
            _subscribers.AddOrUpdate(
                p_topic,
                new List<Func<object, Task>> { obj => p_handler((TEvent)obj) },
                (key, existing) =>
                {
                    existing.Add(obj => p_handler((TEvent)obj));
                    return existing;
                }
            );

            return Task.CompletedTask;
        }
    }
}
