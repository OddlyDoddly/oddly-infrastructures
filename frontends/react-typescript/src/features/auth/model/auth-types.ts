/**
 * Auth domain types
 * 
 * Client-side business models and domain types.
 * These are NOT DTOs - they represent client state.
 */

export interface UserModel {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface AuthState {
  user: UserModel | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}
