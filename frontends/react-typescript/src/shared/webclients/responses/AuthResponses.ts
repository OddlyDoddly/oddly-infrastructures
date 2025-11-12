/**
 * Auth API Response Interfaces
 * 
 * Data-only interfaces that map directly from JSON responses.
 * No logic, just type definitions.
 */

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
    createdAt: string
  }
  token: string
}

export interface RegisterResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
    createdAt: string
  }
  token: string
}

export interface MeResponse {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

export interface RefreshTokenResponse {
  token: string
  expiresAt: string
}
