import { BaseEntity } from '../../infra/BaseEntity';

/**
 * Base class for all Write Entities (command side of CQRS).
 * This class:
 * - Lives in /infrastructure/persistence/write/infra/
 * - Used for business logic execution (commands: create, update, delete)
 * - Contains all fields needed for business operations
 * - CAN have database/ORM attributes
 * - Includes Version for optimistic concurrency
 * 
 * WriteEntities:
 * - Suffix with "WriteEntity"
 * - Live in /infrastructure/persistence/write/
 * - Used when business logic executes against data
 * - Mapped from/to BMO by repository using mapper
 */
export abstract class BaseWriteEntity extends BaseEntity {
  public Version?: number;

  constructor() {
    super();
    this.Version = 1;
  }
}
