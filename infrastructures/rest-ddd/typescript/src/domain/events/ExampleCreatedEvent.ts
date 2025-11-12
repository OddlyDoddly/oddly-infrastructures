/**
 * Example Created Event
 * Domain event following {Object}{Action}Event pattern.
 */

import { BaseDomainEvent } from './BaseDomainEvent';

export class ExampleCreatedEvent extends BaseDomainEvent {
  /**
   * Domain event fired when Example is created.
   * 
   * Rules:
   * - Located in /domain/events/
   * - Pattern: {Object}{Action}Event
   * - Suffix with 'Event'
   * - MUST be immutable (readonly)
   */

  constructor(
    public readonly exampleId: string,
    public readonly name: string,
    public readonly ownerId: string,
    p_correlationId?: string
  ) {
    super(p_correlationId);
  }

  toObject(): Record<string, any> {
    return {
      eventId: this.eventId,
      timestamp: this.timestamp.toISOString(),
      correlationId: this.correlationId,
      eventType: 'ExampleCreatedEvent',
      exampleId: this.exampleId,
      name: this.name,
      ownerId: this.ownerId
    };
  }
}
