/**
 * Base class for all response DTOs.
 * Response DTOs:
 * - Live in /api/dto/v1/responses/
 * - Suffix with "Response"
 * - Used for HTTP response payloads
 * - Transport only - NO business logic
 * 
 * All response DTOs should extend this class to include common properties.
 */
export abstract class BaseResponseDto {
  public RequestId?: string;
  public Timestamp?: Date;

  constructor() {
    this.Timestamp = new Date();
  }
}
