import { BaseWriteEntity } from './infra/BaseWriteEntity';

/**
 * Example Write Entity demonstrating command side of CQRS.
 * This class:
 * - Lives in /infrastructure/persistence/write/
 * - Has WriteEntity suffix
 * - Used for business logic execution (commands)
 * - Contains all fields needed for business operations
 * - CAN have database/ORM attributes (e.g., decorators, annotations)
 * - Mapped from/to BMO by repository using mapper
 * 
 * Example ORM attributes (if using TypeORM):
 * @Entity('examples')
 * @Index(['ownerId'])
 * 
 * Example MongoDB attributes (if using Mongoose):
 * @Schema({ collection: 'examples', timestamps: true })
 */
export class ExampleWriteEntity extends BaseWriteEntity {
  /**
   * Example name field
   * MongoDB: @Prop({ required: true })
   * TypeORM: @Column({ type: 'varchar', length: 100 })
   */
  public Name: string;

  /**
   * Example description field
   * MongoDB: @Prop()
   * TypeORM: @Column({ type: 'text', nullable: true })
   */
  public Description: string;

  /**
   * Owner user ID
   * MongoDB: @Prop({ required: true, index: true })
   * TypeORM: @Column({ type: 'varchar' })
   */
  public OwnerId: string;

  /**
   * Active status
   * MongoDB: @Prop({ default: true })
   * TypeORM: @Column({ type: 'boolean', default: true })
   */
  public IsActive: boolean;

  constructor() {
    super();
    this.Name = '';
    this.Description = '';
    this.OwnerId = '';
    this.IsActive = true;
  }
}
