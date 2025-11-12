/**
 * Base Domain Event
 * Pattern: {Object}{Action}Event (e.g., UserCreatedEvent)
 * MUST be immutable.
 */

using System;
using System.Collections.Generic;

namespace Domain.Events
{
    public abstract class BaseDomainEvent
    {
        /**
         * Abstract base class for all domain events.
         * 
         * Rules:
         * - MUST suffix with 'Event'
         * - Pattern: {Object}{Action}Event
         * - MUST be immutable (use readonly or init-only properties)
         * - Location: /Domain/Events/
         * - Include timestamp and correlation ID
         */

        public string EventId { get; init; }
        public DateTime Timestamp { get; init; }
        public string CorrelationId { get; init; }

        protected BaseDomainEvent(string? p_correlationId = null)
        {
            EventId = Guid.NewGuid().ToString();
            Timestamp = DateTime.UtcNow;
            CorrelationId = p_correlationId ?? Guid.NewGuid().ToString();
        }

        public abstract Dictionary<string, object> ToDictionary();
    }
}
