/**
 * UnitOfWork Middleware (MANDATORY)
 * Handles ALL transactions automatically.
 */

export interface IUnitOfWork {
  /**
   * UnitOfWork interface for transaction management.
   * 
   * Rules:
   * - Middleware handles ALL transactions
   * - NO manual transaction management in services
   * - Auto-commit on success (status < 400)
   * - Auto-rollback on failure (status >= 400 or exception)
   */

  /**
   * Begin a new transaction.
   */
  beginTransaction(): Promise<void>;

  /**
   * Commit the current transaction.
   */
  commit(): Promise<void>;

  /**
   * Rollback the current transaction.
   */
  rollback(): Promise<void>;

  /**
   * Save changes without committing (for batching).
   */
  saveChanges(): Promise<void>;
}

/**
 * Middleware to automatically manage transactions.
 * 
 * Order: After authentication/authorization, before controller
 */
export class UnitOfWorkMiddleware {
  constructor(private readonly _unitOfWork: IUnitOfWork) {}

  /**
   * Execute request within transaction boundary.
   * 
   * Flow:
   * 1. Begin transaction
   * 2. Execute request
   * 3. Commit if successful (status < 400)
   * 4. Rollback if error (status >= 400 or exception)
   */
  async execute(
    p_request: any,
    p_response: any,
    p_next: () => Promise<void>
  ): Promise<void> {
    try {
      await this._unitOfWork.beginTransaction();

      // Execute the request
      await p_next();

      // Check response status
      const statusCode = p_response.statusCode || 200;

      if (statusCode < 400) {
        await this._unitOfWork.commit();
      } else {
        await this._unitOfWork.rollback();
      }
    } catch (error) {
      // Rollback on any exception
      await this._unitOfWork.rollback();
      throw error;
    }
  }
}

// Example implementation for MongoDB:
/**
 * 
 * import { MongoClient, ClientSession } from 'mongodb';
 * 
 * export class MongoUnitOfWork implements IUnitOfWork {
 *   private _session: ClientSession | null = null;
 * 
 *   constructor(private readonly _client: MongoClient) {}
 * 
 *   async beginTransaction(): Promise<void> {
 *     this._session = this._client.startSession();
 *     this._session.startTransaction();
 *   }
 * 
 *   async commit(): Promise<void> {
 *     if (this._session) {
 *       await this._session.commitTransaction();
 *       await this._session.endSession();
 *       this._session = null;
 *     }
 *   }
 * 
 *   async rollback(): Promise<void> {
 *     if (this._session) {
 *       await this._session.abortTransaction();
 *       await this._session.endSession();
 *       this._session = null;
 *     }
 *   }
 * 
 *   async saveChanges(): Promise<void> {
 *     // For MongoDB, changes are auto-saved within transaction
 *   }
 * 
 *   getSession(): ClientSession | null {
 *     return this._session;
 *   }
 * }
 */
