import { AxiosInstance } from 'axios'

/**
 * Logout Request Function
 * 
 * Encapsulates the axios call for logout.
 */

/**
 * Execute logout request
 * 
 * @param axiosInstance - Configured axios instance
 * @returns Promise resolving to void
 * @throws WebClientError on failure
 */
export async function executeLogoutRequest(axiosInstance: AxiosInstance): Promise<void> {
  await axiosInstance.post('/auth/logout')
}
