/**
 * Base Domain Event
 * Pattern: {Object}{Action}Event (e.g., UserCreatedEvent)
 * MUST be immutable.
 */

import { v4 as uuidv4 } from 'uuid';

export abstract class BaseDomainEvent {
  /**
   * Abstract base class for all domain events.
   * 
   * Rules:
   * - MUST suffix with 'Event'
   * - Pattern: {Object}{Action}Event
   * - MUST be immutable (use readonly)
   * - Location: /domain/events/
   * - Include timestamp and correlation ID
   */

  public readonly eventId: string;
  public readonly timestamp: Date;
  public readonly correlationId: string;

  constructor(p_correlationId?: string) {
    this.eventId = uuidv4();
    this.timestamp = new Date();
    this.correlationId = p_correlationId || uuidv4();
  }

  abstract toObject(): Record<string, any>;
}

// Example usage template:
/**
 * 
 * export class UserCreatedEvent extends BaseDomainEvent {
 *   constructor(
 *     public readonly userId: string,
 *     public readonly email: string,
 *     public readonly username: string,
 *     p_correlationId?: string
 *   ) {
 *     super(p_correlationId);
 *   }
 * 
 *   toObject(): Record<string, any> {
 *     return {
 *       eventId: this.eventId,
 *       timestamp: this.timestamp.toISOString(),
 *       correlationId: this.correlationId,
 *       eventType: 'UserCreatedEvent',
 *       userId: this.userId,
 *       email: this.email,
 *       username: this.username
 *     };
 *   }
 * }
 */
