namespace OddlyDdd.Domain.Events
{
    /// <summary>
    /// Domain event for when an example is deleted.
    /// </summary>
    public class ExampleDeletedEvent : BaseDomainEvent
    {
        public string ExampleId { get; init; }

        public ExampleDeletedEvent(
            string p_exampleId,
            string p_correlationId
        ) : base(p_correlationId)
        {
            ExampleId = p_exampleId;
        }
    }
}
