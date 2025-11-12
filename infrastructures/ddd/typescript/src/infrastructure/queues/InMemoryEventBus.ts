import { IEventPublisher } from './infra/IEventPublisher';
import { IEventSubscriber } from './infra/IEventSubscriber';

/**
 * In-memory event bus implementation for demonstration purposes.
 * Queue implementations:
 * - Live in /infrastructure/queues/
 * - Are concrete implementations (no /impl/ subdirectory)
 * - Implement IEventPublisher and IEventSubscriber
 * 
 * In production, replace this with:
 * - RabbitMQ
 * - Azure Service Bus
 * - AWS SQS/SNS
 * - Google Cloud Pub/Sub
 * - Apache Kafka
 * 
 * This implementation stores handlers in memory and invokes them immediately.
 * Real implementations would:
 * - Serialize events to queue
 * - Handle retries and dead-letter queues
 * - Provide durability guarantees
 * - Support distributed systems
 */
export class InMemoryEventBus implements IEventPublisher, IEventSubscriber {
  private readonly _handlers: Map<string, Array<(event: any) => Promise<void>>>;

  constructor() {
    this._handlers = new Map();
  }

  /**
   * Publishes a domain event to the specified topic.
   * In this in-memory implementation, immediately invokes all subscribed handlers.
   * In production, would send to message queue.
   */
  public async PublishAsync<TEvent>(p_event: TEvent, p_topic: string): Promise<void> {
    console.log(`[InMemoryEventBus] Publishing event to topic '${p_topic}':`, p_event);

    const handlers = this._handlers.get(p_topic) || [];
    
    // Invoke all handlers for this topic
    for (const handler of handlers) {
      try {
        await handler(p_event);
      } catch (error) {
        console.error(`[InMemoryEventBus] Handler failed for topic '${p_topic}':`, error);
        // In production, implement retry logic and dead-letter queue
      }
    }
  }

  /**
   * Subscribes to a topic and handles events with the provided handler.
   * In this in-memory implementation, stores handler in memory.
   * In production, would subscribe to message queue.
   */
  public async SubscribeAsync<TEvent>(
    p_topic: string,
    p_handler: (p_event: TEvent) => Promise<void>
  ): Promise<void> {
    console.log(`[InMemoryEventBus] Subscribing to topic '${p_topic}'`);

    if (!this._handlers.has(p_topic)) {
      this._handlers.set(p_topic, []);
    }

    this._handlers.get(p_topic)!.push(p_handler);
  }

  /**
   * Unsubscribes all handlers for a topic.
   * Useful for testing and cleanup.
   */
  public UnsubscribeAll(p_topic: string): void {
    console.log(`[InMemoryEventBus] Unsubscribing all handlers from topic '${p_topic}'`);
    this._handlers.delete(p_topic);
  }

  /**
   * Gets the number of subscribers for a topic.
   * Useful for testing and diagnostics.
   */
  public GetSubscriberCount(p_topic: string): number {
    return (this._handlers.get(p_topic) || []).length;
  }
}
