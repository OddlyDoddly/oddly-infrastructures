import axios from 'axios';
import { ExampleItemResponse } from '../responses/ExampleItemResponse';

/**
 * Get Example Items Request
 * 
 * Fetches a list of example items from the API.
 * This is the ONLY place where Axios calls should be made for this operation.
 * 
 * @param baseUrl - Base URL of the API
 * @param authToken - Optional authentication token
 * @returns Promise resolving to array of ExampleItemResponse
 */
export async function getExampleItemsRequest(
  baseUrl: string,
  authToken: string | null
): Promise<ExampleItemResponse[]> {
  const response = await axios.get<ExampleItemResponse[]>(`${baseUrl}/items`, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    timeout: 10000,
  });
  
  return response.data;
}
