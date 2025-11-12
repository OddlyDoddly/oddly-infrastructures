/**
 * Auth API Layer
 * 
 * This layer uses AuthWebClient for all HTTP communication.
 * No direct axios calls - all requests go through WebClient.
 * 
 * WebClientError exceptions propagate to hooks/UI for handling.
 */

import { authWebClient } from '@/shared/webclients'
import type {
  LoginResponse,
  RegisterResponse,
  MeResponse,
} from '@/shared/webclients'

/**
 * Re-export WebClient response types for feature use
 */
export type { LoginResponse, RegisterResponse, MeResponse }

/**
 * Auth API Service
 * 
 * Wraps AuthWebClient methods.
 * Features call these functions instead of WebClient directly.
 */
export const authApiService = {
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    return authWebClient.login({ email, password })
  },

  /**
   * Register new user
   */
  async register(email: string, password: string, name: string): Promise<RegisterResponse> {
    return authWebClient.register({ email, password, name })
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    return authWebClient.logout()
  },

  /**
   * Get current user profile
   */
  async getMe(): Promise<MeResponse> {
    return authWebClient.getMe()
  },
}
