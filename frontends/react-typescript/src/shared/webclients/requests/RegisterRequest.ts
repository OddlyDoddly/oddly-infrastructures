import { AxiosInstance } from 'axios'
import { RegisterResponse } from '../responses/AuthResponses'

/**
 * Register Request Function
 * 
 * Encapsulates the axios call for user registration.
 * Parameters compose the request body.
 */

export interface RegisterRequestParams {
  email: string
  password: string
  name: string
}

/**
 * Execute register request
 * 
 * @param axiosInstance - Configured axios instance
 * @param params - Registration data
 * @returns Promise resolving to RegisterResponse
 * @throws WebClientError on failure
 */
export async function executeRegisterRequest(
  axiosInstance: AxiosInstance,
  params: RegisterRequestParams
): Promise<RegisterResponse> {
  const response = await axiosInstance.post<RegisterResponse>('/auth/register', {
    email: params.email,
    password: params.password,
    name: params.name,
  })
  
  return response.data
}
