/**
 * WebClients Public API
 * 
 * Export all web clients and related types.
 * Application code imports from this file.
 */

// Web Clients
export { AuthWebClient, authWebClient } from './AuthWebClient'
export { GoogleMapsWebClient, googleMapsWebClient } from './GoogleMapsWebClient'

// Error handling
export { WebClientError, WebClientErrorCode } from './errors/WebClientError'
export type { WebClientErrorDetails } from './errors/WebClientError'

// Response types (for type safety in application code)
export type {
  LoginResponse,
  RegisterResponse,
  MeResponse,
  RefreshTokenResponse,
} from './responses/AuthResponses'

export type {
  GeocodeResponse,
  GeocodeResult,
  PlaceDetails,
  PlaceDetailsResponse,
} from './responses/GoogleMapsResponses'

// Request parameter types (for function calls)
export type { LoginRequestParams } from './requests/LoginRequest'
export type { RegisterRequestParams } from './requests/RegisterRequest'
export type { GeocodeRequestParams } from './requests/GeocodeRequest'
