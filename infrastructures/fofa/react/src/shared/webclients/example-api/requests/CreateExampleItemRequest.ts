import axios from 'axios';
import { ExampleItemResponse } from '../responses/ExampleItemResponse';

export interface CreateExampleItemPayload {
  title: string;
  description: string;
}

/**
 * Create Example Item Request
 * 
 * Creates a new example item via the API.
 * This is the ONLY place where Axios calls should be made for this operation.
 * 
 * @param baseUrl - Base URL of the API
 * @param authToken - Optional authentication token
 * @param payload - Item data to create
 * @returns Promise resolving to the created ExampleItemResponse
 */
export async function createExampleItemRequest(
  baseUrl: string,
  authToken: string | null,
  payload: CreateExampleItemPayload
): Promise<ExampleItemResponse> {
  const response = await axios.post<ExampleItemResponse>(`${baseUrl}/items`, payload, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    timeout: 10000,
  });
  
  return response.data;
}
