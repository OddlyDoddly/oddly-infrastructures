using System;

namespace OddlyDdd.Domain.Events
{
    /// <summary>
    /// Base class for all domain events.
    /// Domain events MUST:
    /// - Suffix with "Event"
    /// - Follow pattern: {Object}{Action}Event (e.g., ExampleCreatedEvent)
    /// - Be immutable (use readonly fields or init-only properties)
    /// - Live in /Domain/Events/
    /// - Include timestamp and correlationId
    /// </summary>
    public abstract class BaseDomainEvent
    {
        /// <summary>
        /// Unique identifier for this event instance
        /// </summary>
        public string EventId { get; init; }

        /// <summary>
        /// Timestamp when the event occurred
        /// </summary>
        public DateTime Timestamp { get; init; }

        /// <summary>
        /// Correlation ID for tracking requests across services
        /// </summary>
        public string CorrelationId { get; init; }

        protected BaseDomainEvent(string p_correlationId)
        {
            EventId = Guid.NewGuid().ToString();
            Timestamp = DateTime.UtcNow;
            CorrelationId = p_correlationId;
        }
    }
}
