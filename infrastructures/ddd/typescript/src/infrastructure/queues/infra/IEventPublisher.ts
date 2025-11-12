/**
 * Interface for publishing domain events to a message queue.
 * Event publishers:
 * - Publish domain events to topics
 * - Used for subdomain-to-subdomain communication
 * - ONLY way to communicate between subdomains (NO HTTP calls)
 * 
 * Topic naming convention: {subdomain}.{action}
 * Examples: "example.created", "example.updated", "example.deleted"
 */
export interface IEventPublisher {
  /**
   * Publishes a domain event to the specified topic.
   * @param p_event The event to publish
   * @param p_topic The topic to publish to
   */
  PublishAsync<TEvent>(p_event: TEvent, p_topic: string): Promise<void>;
}
