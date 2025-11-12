import { BaseResponseDto } from '../infra/BaseResponseDto';

/**
 * Response DTO for example data.
 * Response DTOs:
 * - Live in /api/dto/v1/responses/
 * - Suffix with "Response"
 * - Used for HTTP response payloads
 * - Transport only - NO business logic
 * 
 * This DTO is mapped from:
 * - ExampleReadEntity (for query operations)
 * - ExampleModel (for command operations)
 */
export class ExampleResponse extends BaseResponseDto {
  /**
   * The example ID
   */
  public Id: string;

  /**
   * The example name
   */
  public Name: string;

  /**
   * The example description
   */
  public Description: string;

  /**
   * The owner user ID
   */
  public OwnerId: string;

  /**
   * The owner name (from read entity only)
   */
  public OwnerName: string;

  /**
   * Active status
   */
  public IsActive: boolean;

  /**
   * Display name (computed)
   */
  public DisplayName: string;

  /**
   * Status text (computed)
   */
  public StatusText: string;

  /**
   * Creation timestamp
   */
  public CreatedAt: Date;

  /**
   * Last update timestamp
   */
  public UpdatedAt: Date;

  constructor() {
    super();
    this.Id = '';
    this.Name = '';
    this.Description = '';
    this.OwnerId = '';
    this.OwnerName = '';
    this.IsActive = true;
    this.DisplayName = '';
    this.StatusText = '';
    this.CreatedAt = new Date();
    this.UpdatedAt = new Date();
  }
}
