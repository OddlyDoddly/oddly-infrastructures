/**
 * Interface for subscribing to domain events from a message queue.
 * Event subscribers:
 * - Subscribe to topics to receive domain events
 * - Handle events from other subdomains
 * - Process events asynchronously
 * 
 * Subscribers live in /infrastructure/queues/subscribers/
 * Each subscriber handles events from a specific topic.
 */
export interface IEventSubscriber {
  /**
   * Subscribes to a topic and handles events with the provided handler.
   * @param p_topic The topic to subscribe to
   * @param p_handler The handler function to process events
   */
  SubscribeAsync<TEvent>(
    p_topic: string,
    p_handler: (p_event: TEvent) => Promise<void>
  ): Promise<void>;
}
