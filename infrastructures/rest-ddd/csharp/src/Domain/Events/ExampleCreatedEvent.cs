/**
 * Example Created Event
 * Domain event following {Object}{Action}Event pattern.
 */

using System.Collections.Generic;

namespace Domain.Events
{
    public class ExampleCreatedEvent : BaseDomainEvent
    {
        /**
         * Domain event fired when Example is created.
         * 
         * Rules:
         * - Located in /Domain/Events/
         * - Pattern: {Object}{Action}Event
         * - Suffix with 'Event'
         * - MUST be immutable (use init-only properties)
         */

        public string ExampleId { get; init; }
        public string Name { get; init; }
        public string OwnerId { get; init; }

        public ExampleCreatedEvent(
            string p_exampleId,
            string p_name,
            string p_ownerId,
            string? p_correlationId = null
        ) : base(p_correlationId)
        {
            ExampleId = p_exampleId;
            Name = p_name;
            OwnerId = p_ownerId;
        }

        public override Dictionary<string, object> ToDictionary()
        {
            return new Dictionary<string, object>
            {
                { "eventId", EventId },
                { "timestamp", Timestamp.ToString("o") },
                { "correlationId", CorrelationId },
                { "eventType", "ExampleCreatedEvent" },
                { "exampleId", ExampleId },
                { "name", Name },
                { "ownerId", OwnerId }
            };
        }
    }
}
