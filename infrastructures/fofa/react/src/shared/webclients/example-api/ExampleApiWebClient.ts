import { getExampleItemsRequest } from './requests/GetExampleItemsRequest';
import {
  createExampleItemRequest,
  type CreateExampleItemPayload,
} from './requests/CreateExampleItemRequest';
import type { ExampleItemResponse } from './responses/ExampleItemResponse';
import { ExampleApiError } from './ExampleApiError';

/**
 * Example API WebClient
 * 
 * Handles all HTTP communication with the Example API service.
 * This class MUST NOT contain Axios calls - all HTTP requests are delegated to Request functions.
 * 
 * @example
 * ```typescript
 * const client = new ExampleApiWebClient('https://api.example.com');
 * client.setAuthToken('bearer-token');
 * const items = await client.getExampleItems();
 * ```
 */
export class ExampleApiWebClient {
  private authToken: string | null = null;

  constructor(private baseUrl: string) {}

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * Get all example items
   * 
   * @returns Promise resolving to array of example items
   * @throws ExampleApiError if the request fails
   */
  async getExampleItems(): Promise<ExampleItemResponse[]> {
    try {
      return await getExampleItemsRequest(this.baseUrl, this.authToken);
    } catch (error) {
      throw new ExampleApiError('Failed to fetch example items', error);
    }
  }

  /**
   * Create a new example item
   * 
   * @param payload - Item data to create
   * @returns Promise resolving to the created item
   * @throws ExampleApiError if the request fails
   */
  async createExampleItem(payload: CreateExampleItemPayload): Promise<ExampleItemResponse> {
    try {
      return await createExampleItemRequest(this.baseUrl, this.authToken, payload);
    } catch (error) {
      throw new ExampleApiError('Failed to create example item', error);
    }
  }
}

/**
 * Singleton instance of ExampleApiWebClient
 * 
 * Configure the base URL via environment variables.
 * In a real application, use import.meta.env.VITE_EXAMPLE_API_URL
 */
export const exampleApiClient = new ExampleApiWebClient(
  import.meta.env.VITE_EXAMPLE_API_URL || 'https://api.example.com'
);
