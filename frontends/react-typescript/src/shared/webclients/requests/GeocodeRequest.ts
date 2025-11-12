import { AxiosInstance } from 'axios'
import { GeocodeResponse } from '../responses/GoogleMapsResponses'

/**
 * Geocode Request Function
 * 
 * Encapsulates the axios call for Google Maps Geocoding API.
 * Parameters compose the request query string.
 */

export interface GeocodeRequestParams {
  address: string
  apiKey: string
}

/**
 * Execute geocode request
 * 
 * @param axiosInstance - Configured axios instance
 * @param params - Address and API key
 * @returns Promise resolving to GeocodeResponse
 * @throws WebClientError on failure
 */
export async function executeGeocodeRequest(
  axiosInstance: AxiosInstance,
  params: GeocodeRequestParams
): Promise<GeocodeResponse> {
  const response = await axiosInstance.get<GeocodeResponse>('/maps/api/geocode/json', {
    params: {
      address: params.address,
      key: params.apiKey,
    },
  })
  
  return response.data
}
