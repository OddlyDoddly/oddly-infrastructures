import { BaseEntity } from '../../infra/BaseEntity';

/**
 * Base class for all Read Entities (query side of CQRS).
 * This class:
 * - Lives in /infrastructure/persistence/read/infra/
 * - Used for query operations (read-only data retrieval)
 * - Denormalized for query performance
 * - CAN have database/ORM attributes
 * - MAY aggregate from multiple WriteEntities
 * 
 * ReadEntities:
 * - Suffix with "ReadEntity"
 * - Live in /infrastructure/persistence/read/
 * - Pre-rendered views optimized for front-end
 * - Returned directly to service (no BMO in read path for performance)
 */
export abstract class BaseReadEntity extends BaseEntity {
  constructor() {
    super();
  }
}
