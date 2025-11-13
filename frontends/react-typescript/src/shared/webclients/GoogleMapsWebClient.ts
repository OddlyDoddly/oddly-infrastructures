import { AxiosInstance } from 'axios'
import { createAxiosInstance } from './config/axios-config'
import {
  executeGeocodeRequest,
  GeocodeRequestParams,
} from './requests/GeocodeRequest'
import { GeocodeResponse } from './responses/GoogleMapsResponses'

/**
 * GoogleMapsWebClient
 * 
 * Web client for Google Maps API calls.
 * Example of external service integration.
 * 
 * Rules:
 * - Only references request functions (does not define axios calls)
 * - All axios calls are in separate Request files
 * - WebClientError exceptions propagate to UI
 * - Uses separate axios instance with Google Maps base URL
 * 
 * @example
 * const googleMapsClient = new GoogleMapsWebClient()
 * 
 * try {
 *   const response = await googleMapsClient.geocode({
 *     address: '1600 Amphitheatre Parkway, Mountain View, CA',
 *     apiKey: 'your-api-key'
 *   })
 *   console.log('Coordinates:', response.results[0].geometry.location)
 * } catch (error) {
 *   if (error instanceof WebClientError) {
 *     showError(error.getUserMessage())
 *   }
 * }
 */
export class GoogleMapsWebClient {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string = 'https://maps.googleapis.com') {
    this.axiosInstance = createAxiosInstance(baseURL)
  }

  /**
   * Geocode address to coordinates
   * 
   * @param params - Address and API key
   * @returns Promise resolving to GeocodeResponse
   * @throws WebClientError on failure
   */
  public async geocode(params: GeocodeRequestParams): Promise<GeocodeResponse> {
    return executeGeocodeRequest(this.axiosInstance, params)
  }
}

/**
 * Default GoogleMapsWebClient instance
 * Configure API key via environment variable
 */
export const googleMapsWebClient = new GoogleMapsWebClient()
