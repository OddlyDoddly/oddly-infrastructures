/**
 * Create Example Request DTO
 * Transport layer - HTTP request body.
 */

export interface CreateExampleRequest {
  /**
   * Request DTO for creating an Example.
   * 
   * Rules:
   * - Located in /api/dto/
   * - Suffix with 'Request'
   * - Transport layer only
   * - NO business logic
   */

  name: string;
  description: string;
  ownerId: string;
}

export interface UpdateExampleRequest {
  /**
   * Request DTO for updating an Example.
   */

  name?: string;
  description?: string;
  status?: string;
}
