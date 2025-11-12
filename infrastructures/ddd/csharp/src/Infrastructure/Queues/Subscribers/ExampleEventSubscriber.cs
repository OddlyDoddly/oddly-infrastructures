using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using OddlyDdd.Domain.Events;

namespace OddlyDdd.Infrastructure.Queues.Subscribers
{
    /// <summary>
    /// Example event subscriber demonstrating how to handle domain events from other subdomains.
    /// Event subscribers:
    /// - Live in /Infrastructure/Queues/Subscribers/
    /// - Subscribe to events from other subdomains
    /// - Process events asynchronously
    /// - CRITICAL: This is how subdomains communicate (NOT via HTTP)
    /// 
    /// This would typically be in a DIFFERENT subdomain/repository that needs to react
    /// to events from the Example subdomain.
    /// </summary>
    public class ExampleEventSubscriber
    {
        private readonly ILogger<ExampleEventSubscriber> _logger;
        // In real implementation: inject services needed to handle the event

        public ExampleEventSubscriber(ILogger<ExampleEventSubscriber> p_logger)
        {
            _logger = p_logger;
        }

        /// <summary>
        /// Handles ExampleCreatedEvent from the Example subdomain.
        /// This method would be registered with the event subscriber at startup.
        /// </summary>
        public async Task HandleExampleCreatedAsync(ExampleCreatedEvent p_event)
        {
            _logger.LogInformation(
                "Processing ExampleCreatedEvent: ExampleId={ExampleId}, Name={Name}, CorrelationId={CorrelationId}",
                p_event.ExampleId,
                p_event.Name,
                p_event.CorrelationId
            );

            // Process the event
            // Examples:
            // - Update denormalized read model
            // - Send notification
            // - Trigger workflow in this subdomain
            // - Create related entities
            
            await Task.CompletedTask;
        }

        /// <summary>
        /// Handles ExampleUpdatedEvent from the Example subdomain.
        /// </summary>
        public async Task HandleExampleUpdatedAsync(ExampleUpdatedEvent p_event)
        {
            _logger.LogInformation(
                "Processing ExampleUpdatedEvent: ExampleId={ExampleId}, CorrelationId={CorrelationId}",
                p_event.ExampleId,
                p_event.CorrelationId
            );

            // Process the event
            await Task.CompletedTask;
        }

        /// <summary>
        /// Handles ExampleDeletedEvent from the Example subdomain.
        /// </summary>
        public async Task HandleExampleDeletedAsync(ExampleDeletedEvent p_event)
        {
            _logger.LogInformation(
                "Processing ExampleDeletedEvent: ExampleId={ExampleId}, CorrelationId={CorrelationId}",
                p_event.ExampleId,
                p_event.CorrelationId
            );

            // Process the event
            // Examples:
            // - Clean up related entities
            // - Update denormalized views
            // - Archive data
            
            await Task.CompletedTask;
        }

        /// <summary>
        /// Registers all event handlers with the event subscriber.
        /// This should be called at application startup.
        /// </summary>
        public async Task RegisterHandlersAsync(IEventSubscriber p_subscriber)
        {
            await p_subscriber.SubscribeAsync<ExampleCreatedEvent>(
                "example.created",
                HandleExampleCreatedAsync
            );

            await p_subscriber.SubscribeAsync<ExampleUpdatedEvent>(
                "example.updated",
                HandleExampleUpdatedAsync
            );

            await p_subscriber.SubscribeAsync<ExampleDeletedEvent>(
                "example.deleted",
                HandleExampleDeletedAsync
            );
        }
    }
}
