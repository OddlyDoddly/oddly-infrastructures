import { AxiosInstance } from 'axios'
import { MeResponse } from '../responses/AuthResponses'

/**
 * Get Me Request Function
 * 
 * Encapsulates the axios call to get current user profile.
 */

/**
 * Execute get me request
 * 
 * @param axiosInstance - Configured axios instance
 * @returns Promise resolving to MeResponse
 * @throws WebClientError on failure
 */
export async function executeGetMeRequest(axiosInstance: AxiosInstance): Promise<MeResponse> {
  const response = await axiosInstance.get<MeResponse>('/auth/me')
  return response.data
}
