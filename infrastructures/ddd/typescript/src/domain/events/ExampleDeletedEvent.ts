import { BaseDomainEvent } from './infra/BaseDomainEvent';

/**
 * Domain event for when an example is deleted.
 * Pattern: {Object}{Action}Event
 * Topic naming: {subdomain}.deleted (e.g., "example.deleted")
 */
export class ExampleDeletedEvent extends BaseDomainEvent {
  /**
   * The ID of the deleted example
   */
  public readonly ExampleId: string;

  /**
   * The owner ID
   */
  public readonly OwnerId: string;

  constructor(p_exampleId: string, p_ownerId: string, p_correlationId: string) {
    super(p_correlationId);
    this.ExampleId = p_exampleId;
    this.OwnerId = p_ownerId;
  }
}
