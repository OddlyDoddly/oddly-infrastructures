import { IEventSubscriber } from '../infra/IEventSubscriber';
import { ExampleCreatedEvent } from '../../../domain/events/ExampleCreatedEvent';
import { ExampleUpdatedEvent } from '../../../domain/events/ExampleUpdatedEvent';
import { ExampleDeletedEvent } from '../../../domain/events/ExampleDeletedEvent';

/**
 * Example event subscriber demonstrating how to handle domain events.
 * Event subscribers:
 * - Live in /infrastructure/queues/subscribers/
 * - Subscribe to topics to receive domain events
 * - Handle events from other subdomains
 * - Process events asynchronously
 * 
 * This subscriber would be in a DIFFERENT subdomain (different repository).
 * It demonstrates how subdomains communicate via domain events.
 * 
 * CRITICAL: Subdomain-to-subdomain communication MUST use events.
 * NO HTTP calls between subdomains.
 * 
 * Usage:
 * const subscriber = new ExampleEventSubscriber(eventBus, relatedService);
 * await subscriber.SubscribeToAllAsync();
 */
export class ExampleEventSubscriber {
  private readonly _eventSubscriber: IEventSubscriber;

  /**
   * In a real subdomain, you would inject services that need to react to events.
   * For example: IRelatedService, INotificationService, etc.
   */
  constructor(p_eventSubscriber: IEventSubscriber) {
    this._eventSubscriber = p_eventSubscriber;
  }

  /**
   * Subscribes to all example-related events.
   * Call this during application startup.
   */
  public async SubscribeToAllAsync(): Promise<void> {
    await this._eventSubscriber.SubscribeAsync<ExampleCreatedEvent>(
      'example.created',
      this.HandleExampleCreatedAsync.bind(this)
    );

    await this._eventSubscriber.SubscribeAsync<ExampleUpdatedEvent>(
      'example.updated',
      this.HandleExampleUpdatedAsync.bind(this)
    );

    await this._eventSubscriber.SubscribeAsync<ExampleDeletedEvent>(
      'example.deleted',
      this.HandleExampleDeletedAsync.bind(this)
    );
  }

  /**
   * Handles ExampleCreatedEvent.
   * This would be in a different subdomain that needs to react to example creation.
   * 
   * Example reactions:
   * - Create related entities in this subdomain
   * - Send notifications
   * - Update denormalized views
   * - Trigger workflows
   */
  private async HandleExampleCreatedAsync(p_event: ExampleCreatedEvent): Promise<void> {
    console.log('[ExampleEventSubscriber] Handling ExampleCreatedEvent:', {
      eventId: p_event.EventId,
      exampleId: p_event.ExampleId,
      name: p_event.Name,
      ownerId: p_event.OwnerId,
      correlationId: p_event.CorrelationId
    });

    // In a real implementation:
    // await this._relatedService.ProcessNewExampleAsync(p_event.ExampleId, p_event.OwnerId);
    // await this._notificationService.NotifyExampleCreatedAsync(p_event);
  }

  /**
   * Handles ExampleUpdatedEvent.
   */
  private async HandleExampleUpdatedAsync(p_event: ExampleUpdatedEvent): Promise<void> {
    console.log('[ExampleEventSubscriber] Handling ExampleUpdatedEvent:', {
      eventId: p_event.EventId,
      exampleId: p_event.ExampleId,
      name: p_event.Name,
      correlationId: p_event.CorrelationId
    });

    // In a real implementation:
    // await this._relatedService.UpdateRelatedDataAsync(p_event.ExampleId, p_event.Name);
  }

  /**
   * Handles ExampleDeletedEvent.
   */
  private async HandleExampleDeletedAsync(p_event: ExampleDeletedEvent): Promise<void> {
    console.log('[ExampleEventSubscriber] Handling ExampleDeletedEvent:', {
      eventId: p_event.EventId,
      exampleId: p_event.ExampleId,
      correlationId: p_event.CorrelationId
    });

    // In a real implementation:
    // await this._relatedService.CleanupRelatedDataAsync(p_event.ExampleId);
    // await this._notificationService.NotifyExampleDeletedAsync(p_event);
  }
}
