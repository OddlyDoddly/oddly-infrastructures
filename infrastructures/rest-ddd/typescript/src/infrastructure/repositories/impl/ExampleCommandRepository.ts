/**
 * Example Command Repository Implementation
 * Handles write operations (CREATE, UPDATE, DELETE).
 */

import { ICommandRepository } from '../ICommandRepository';
import { ExampleModel } from '../../../domain/models/ExampleModel';
import { ExampleWriteEntity } from '../../persistence/write/ExampleWriteEntity';
import { ExampleMapper } from '../../../application/mappers/ExampleMapper';

export class ExampleCommandRepository implements ICommandRepository<ExampleModel, string> {
  /**
   * Command Repository for Example entity.
   * 
   * Rules:
   * - Located in /infrastructure/repositories/impl/
   * - Suffix with 'Repository'
   * - Receives BMO, maps to WriteEntity internally
   * - Returns void or ID
   */

  constructor(
    private readonly _mapper: ExampleMapper
    // Add database connection/context here
    // private readonly _dbContext: DatabaseContext
  ) {}

  async saveAsync(p_model: ExampleModel): Promise<string> {
    // Map BMO → WriteEntity
    const entity = this._mapper.toWriteEntity(p_model);

    // Save to database
    // const savedEntity = await this._dbContext.examples.insertOne(entity);
    // entity.id = savedEntity.insertedId.toString();

    // Placeholder: generate ID
    entity.id = this.generateId();

    return entity.id;
  }

  async updateAsync(p_model: ExampleModel): Promise<void> {
    // Map BMO → WriteEntity
    const entity = this._mapper.toWriteEntity(p_model);

    // Update version for optimistic locking
    entity.incrementVersion();

    // Update in database
    // await this._dbContext.examples.updateOne(
    //   { _id: entity.id, version: entity.version - 1 },
    //   { $set: entity }
    // );
  }

  async deleteAsync(p_id: string): Promise<void> {
    // Delete from database
    // await this._dbContext.examples.deleteOne({ _id: p_id });
  }

  async existsAsync(p_id: string): Promise<boolean> {
    // Check if exists in database
    // const count = await this._dbContext.examples.countDocuments({ _id: p_id });
    // return count > 0;

    // Placeholder
    return false;
  }

  private generateId(): string {
    return `example_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
