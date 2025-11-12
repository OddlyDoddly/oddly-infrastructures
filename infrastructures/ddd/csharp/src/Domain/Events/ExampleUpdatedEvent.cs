namespace OddlyDdd.Domain.Events
{
    /// <summary>
    /// Domain event for when an example is updated.
    /// </summary>
    public class ExampleUpdatedEvent : BaseDomainEvent
    {
        public string ExampleId { get; init; }
        public string Name { get; init; }
        public string Description { get; init; }

        public ExampleUpdatedEvent(
            string p_exampleId,
            string p_name,
            string p_description,
            string p_correlationId
        ) : base(p_correlationId)
        {
            ExampleId = p_exampleId;
            Name = p_name;
            Description = p_description;
        }
    }
}
