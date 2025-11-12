/**
 * Example Feature Types
 * 
 * Type definitions for the example feature domain.
 */

export interface ExampleItem {
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

export interface ExampleState {
  selectedItemId: string | null;
  filterStatus: 'all' | 'active' | 'inactive' | 'pending';
}
