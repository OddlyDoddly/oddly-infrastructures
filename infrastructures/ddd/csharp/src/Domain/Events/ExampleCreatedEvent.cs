namespace OddlyDdd.Domain.Events
{
    /// <summary>
    /// Domain event for when an example is created.
    /// Domain events MUST:
    /// - Suffix with "Event"
    /// - Follow pattern: {Object}{Action}Event
    /// - Be immutable (init-only properties)
    /// - Live in /Domain/Events/
    /// - Include eventId, timestamp, and correlationId (from base)
    /// 
    /// Used for:
    /// - Asynchronous subdomain-to-subdomain communication
    /// - ONLY way to communicate between subdomains (NO HTTP calls)
    /// 
    /// Topic naming: {subdomain}.created (e.g., "example.created")
    /// </summary>
    public class ExampleCreatedEvent : BaseDomainEvent
    {
        /// <summary>
        /// The ID of the created example
        /// </summary>
        public string ExampleId { get; init; }

        /// <summary>
        /// The name of the created example
        /// </summary>
        public string Name { get; init; }

        /// <summary>
        /// The owner ID of the created example
        /// </summary>
        public string OwnerId { get; init; }

        public ExampleCreatedEvent(
            string p_exampleId,
            string p_name,
            string p_ownerId,
            string p_correlationId
        ) : base(p_correlationId)
        {
            ExampleId = p_exampleId;
            Name = p_name;
            OwnerId = p_ownerId;
        }
    }
}
