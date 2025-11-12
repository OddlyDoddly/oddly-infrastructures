import { BaseReadEntity } from './infra/BaseReadEntity';

/**
 * Example Read Entity demonstrating query side of CQRS.
 * This class:
 * - Lives in /infrastructure/persistence/read/
 * - Has ReadEntity suffix
 * - Used for query operations (read-only data retrieval)
 * - Denormalized for query performance
 * - CAN have database/ORM attributes
 * - MAY aggregate from multiple WriteEntities
 * - Returned directly to service (no BMO mapping for performance)
 * 
 * ReadEntities are optimized for front-end consumption:
 * - Pre-calculated display values
 * - Joined data from related entities
 * - Formatted for specific UI needs
 * 
 * Example collection name:
 * MongoDB: 'examples_view' or 'examples_read'
 * SQL: 'vw_examples' (materialized view)
 */
export class ExampleReadEntity extends BaseReadEntity {
  /**
   * Example name
   */
  public Name: string;

  /**
   * Example description
   */
  public Description: string;

  /**
   * Owner user ID
   */
  public OwnerId: string;

  /**
   * Owner name (denormalized from user entity)
   * Pre-joined for query performance
   */
  public OwnerName: string;

  /**
   * Active status
   */
  public IsActive: boolean;

  /**
   * Display name (computed field)
   * Pre-calculated for front-end
   */
  public DisplayName: string;

  /**
   * Status text (computed field)
   * Pre-formatted for UI display
   */
  public StatusText: string;

  constructor() {
    super();
    this.Name = '';
    this.Description = '';
    this.OwnerId = '';
    this.OwnerName = '';
    this.IsActive = true;
    this.DisplayName = '';
    this.StatusText = '';
  }
}
