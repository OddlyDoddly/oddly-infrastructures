import { randomUUID } from 'crypto';

/**
 * Base class for all domain events.
 * Domain events:
 * - Live in /domain/events/
 * - Suffix with "Event"
 * - Follow pattern: {Object}{Action}Event
 * - Are immutable (readonly properties)
 * - Include eventId, timestamp, and correlationId
 * - Used for subdomain-to-subdomain communication ONLY
 * 
 * Domain events are the ONLY way to communicate between subdomains.
 * NO HTTP calls between subdomains.
 */
export abstract class BaseDomainEvent {
  /**
   * Unique identifier for this event
   */
  public readonly EventId: string;

  /**
   * Timestamp when the event was created
   */
  public readonly Timestamp: Date;

  /**
   * Correlation ID for tracking requests across services
   */
  public readonly CorrelationId: string;

  protected constructor(p_correlationId: string) {
    this.EventId = randomUUID();
    this.Timestamp = new Date();
    this.CorrelationId = p_correlationId;
  }
}
