import { BaseRequestDto } from '../infra/BaseRequestDto';

/**
 * Request DTO for updating an existing example.
 * Request DTOs:
 * - Live in /api/dto/v1/requests/
 * - Suffix with "Request"
 * - Used for HTTP request payloads
 * - Transport only - NO business logic
 * - Validate at edge (API layer)
 */
export class UpdateExampleRequest extends BaseRequestDto {
  /**
   * The updated name of the example
   * Required, max 100 characters
   */
  public Name: string;

  /**
   * The updated description of the example
   * Optional
   */
  public Description: string;

  constructor() {
    super();
    this.Name = '';
    this.Description = '';
  }
}
