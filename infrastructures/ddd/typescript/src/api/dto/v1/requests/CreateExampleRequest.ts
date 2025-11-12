import { BaseRequestDto } from '../infra/BaseRequestDto';

/**
 * Request DTO for creating a new example.
 * Request DTOs:
 * - Live in /api/dto/v1/requests/
 * - Suffix with "Request"
 * - Used for HTTP request payloads
 * - Transport only - NO business logic
 * - Validate at edge (API layer)
 * 
 * Example validation decorators (if using class-validator):
 * @IsNotEmpty()
 * @IsString()
 * @MaxLength(100)
 */
export class CreateExampleRequest extends BaseRequestDto {
  /**
   * The name of the example
   * Required, max 100 characters
   */
  public Name: string;

  /**
   * The description of the example
   * Optional
   */
  public Description: string;

  constructor() {
    super();
    this.Name = '';
    this.Description = '';
  }
}
