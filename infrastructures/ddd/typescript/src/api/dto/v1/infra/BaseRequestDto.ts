/**
 * Base class for all request DTOs.
 * Request DTOs:
 * - Live in /api/dto/v1/requests/
 * - Suffix with "Request"
 * - Used for HTTP request payloads
 * - Transport only - NO business logic
 * - Validate at edge (API layer)
 * 
 * All request DTOs should extend this class to include common properties.
 */
export abstract class BaseRequestDto {
  // Add common request properties here if needed
  // For example: clientId, requestTimestamp, etc.
}
