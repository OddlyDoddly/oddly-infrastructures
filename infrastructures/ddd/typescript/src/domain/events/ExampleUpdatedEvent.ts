import { BaseDomainEvent } from './infra/BaseDomainEvent';

/**
 * Domain event for when an example is updated.
 * Pattern: {Object}{Action}Event
 * Topic naming: {subdomain}.updated (e.g., "example.updated")
 */
export class ExampleUpdatedEvent extends BaseDomainEvent {
  /**
   * The ID of the updated example
   */
  public readonly ExampleId: string;

  /**
   * The updated name
   */
  public readonly Name: string;

  /**
   * The owner ID
   */
  public readonly OwnerId: string;

  constructor(p_exampleId: string, p_name: string, p_ownerId: string, p_correlationId: string) {
    super(p_correlationId);
    this.ExampleId = p_exampleId;
    this.Name = p_name;
    this.OwnerId = p_ownerId;
  }
}
