/**
 * Example Response DTO
 * Transport layer - HTTP response body.
 */

import { BaseResponse } from './BaseResponse';

export interface ExampleResponse extends BaseResponse {
  /**
   * Response DTO for Example.
   * 
   * Rules:
   * - Located in /api/dto/
   * - Suffix with 'Response'
   * - Transport layer only
   * - Optimized for front-end consumption
   */

  id: string;
  name: string;
  description: string;
  status: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}
