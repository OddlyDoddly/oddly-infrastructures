/**
 * Example Item Response
 * 
 * Response type for example items from the API.
 * This is a data-only interface - NO methods allowed.
 */
export interface ExampleItemResponse {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  metadata?: {
    views: number;
    likes: number;
  };
}
