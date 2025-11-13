import { AxiosInstance } from 'axios'
import { LoginResponse } from '../responses/AuthResponses'

/**
 * Login Request Function
 * 
 * Encapsulates the axios call for login.
 * Parameters compose the request body.
 */

export interface LoginRequestParams {
  email: string
  password: string
}

/**
 * Execute login request
 * 
 * @param axiosInstance - Configured axios instance
 * @param params - Login credentials
 * @returns Promise resolving to LoginResponse
 * @throws WebClientError on failure
 */
export async function executeLoginRequest(
  axiosInstance: AxiosInstance,
  params: LoginRequestParams
): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', {
    email: params.email,
    password: params.password,
  })
  
  return response.data
}
