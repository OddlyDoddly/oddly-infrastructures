import { IExampleCommandRepository } from '../IExampleCommandRepository';
import { ExampleModel } from '../../../domain/models/ExampleModel';
import { ExampleMapper } from '../../../application/mappers/ExampleMapper';

/**
 * Example command repository implementation demonstrating write operations.
 * Repository implementations:
 * - Live in /infrastructure/repositories/impl/
 * - Implement repository interface from parent directory
 * - Work with WriteEntities internally
 * - Use mapper for BMO ↔ WriteEntity transformations
 * - Return void or IDs to services (NOT entities)
 * 
 * This is a demonstration implementation.
 * In a real application, you would inject your database context/client
 * and use it to persist data (e.g., MongoDB, PostgreSQL, etc.)
 */
export class ExampleCommandRepository implements IExampleCommandRepository {
  private readonly _mapper: ExampleMapper;
  // In a real implementation, inject database context here:
  // constructor(private readonly _dbContext: DatabaseContext, ...)

  constructor() {
    this._mapper = new ExampleMapper();
  }

  /**
   * Saves a new example to the database.
   * Maps BMO → WriteEntity internally.
   */
  public async SaveAsync(p_model: ExampleModel): Promise<string> {
    // Map BMO to WriteEntity
    const entity = this._mapper.ToWriteEntity(p_model);

    // In a real implementation, persist to database:
    // await this._dbContext.Examples.insertOne(entity);
    
    console.log('[ExampleCommandRepository] SaveAsync - Entity:', entity);
    
    return entity.Id;
  }

  /**
   * Updates an existing example in the database.
   * Maps BMO → WriteEntity internally.
   */
  public async UpdateAsync(p_model: ExampleModel): Promise<void> {
    // Map BMO to WriteEntity
    const entity = this._mapper.ToWriteEntity(p_model);

    // In a real implementation, update in database:
    // await this._dbContext.Examples.updateOne(
    //   { Id: entity.Id },
    //   { $set: entity }
    // );
    
    console.log('[ExampleCommandRepository] UpdateAsync - Entity:', entity);
  }

  /**
   * Deletes an example from the database by its identifier.
   */
  public async DeleteAsync(p_id: string): Promise<void> {
    // In a real implementation, delete from database:
    // await this._dbContext.Examples.deleteOne({ Id: p_id });
    
    console.log('[ExampleCommandRepository] DeleteAsync - ID:', p_id);
  }

  /**
   * Checks if an example exists by its identifier.
   */
  public async ExistsAsync(p_id: string): Promise<boolean> {
    // In a real implementation, check database:
    // const count = await this._dbContext.Examples.countDocuments({ Id: p_id });
    // return count > 0;
    
    console.log('[ExampleCommandRepository] ExistsAsync - ID:', p_id);
    return true; // Demonstration only
  }

  /**
   * Loads an example by its identifier for business logic execution.
   * Maps WriteEntity → BMO internally.
   */
  public async FindByIdAsync(p_id: string): Promise<ExampleModel | null> {
    // In a real implementation, load from database:
    // const entity = await this._dbContext.Examples.findOne({ Id: p_id });
    // if (!entity) return null;
    // return this._mapper.ToModelFromWriteEntity(entity);
    
    console.log('[ExampleCommandRepository] FindByIdAsync - ID:', p_id);
    return null; // Demonstration only
  }

  /**
   * Checks if an example with the given name exists.
   */
  public async ExistsByNameAsync(p_name: string): Promise<boolean> {
    // In a real implementation, check database:
    // const count = await this._dbContext.Examples.countDocuments({ Name: p_name });
    // return count > 0;
    
    console.log('[ExampleCommandRepository] ExistsByNameAsync - Name:', p_name);
    return false; // Demonstration only
  }
}
