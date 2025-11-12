/**
 * Base class for all persistence entities.
 * This class:
 * - Lives in /infrastructure/persistence/infra/
 * - Contains common database fields
 * - CAN have database/ORM attributes
 * - Is extended by BaseWriteEntity and BaseReadEntity
 * 
 * Entities are persistence models that:
 * - Map to database tables/collections
 * - Have ORM/database attributes
 * - Are separate from business models (BMOs)
 * - Are transformed via mappers
 */
export abstract class BaseEntity {
  public Id: string;
  public CreatedAt: Date;
  public UpdatedAt: Date;

  constructor() {
    this.Id = '';
    this.CreatedAt = new Date();
    this.UpdatedAt = new Date();
  }
}
