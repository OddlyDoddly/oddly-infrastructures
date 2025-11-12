import { BaseDomainEvent } from './infra/BaseDomainEvent';

/**
 * Domain event for when an example is created.
 * Domain events MUST:
 * - Suffix with "Event"
 * - Follow pattern: {Object}{Action}Event
 * - Be immutable (readonly properties)
 * - Live in /domain/events/
 * - Include eventId, timestamp, and correlationId (from base)
 * 
 * Used for:
 * - Asynchronous subdomain-to-subdomain communication
 * - ONLY way to communicate between subdomains (NO HTTP calls)
 * 
 * Topic naming: {subdomain}.created (e.g., "example.created")
 */
export class ExampleCreatedEvent extends BaseDomainEvent {
  /**
   * The ID of the created example
   */
  public readonly ExampleId: string;

  /**
   * The name of the created example
   */
  public readonly Name: string;

  /**
   * The owner ID of the created example
   */
  public readonly OwnerId: string;

  constructor(p_exampleId: string, p_name: string, p_ownerId: string, p_correlationId: string) {
    super(p_correlationId);
    this.ExampleId = p_exampleId;
    this.Name = p_name;
    this.OwnerId = p_ownerId;
  }
}
