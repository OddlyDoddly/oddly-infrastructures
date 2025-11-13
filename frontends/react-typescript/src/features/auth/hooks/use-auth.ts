import { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setCredentials, clearCredentials } from '../model/auth-slice'
import { selectAuth, selectUser, selectIsAuthenticated } from '../model/auth-selectors'
import { authApiService } from '../api/auth-api'
import type { LoginCredentials } from '../model/auth-types'
import { WebClientError, WebClientErrorCode } from '@/shared/webclients'

/**
 * useAuth hook
 * 
 * Feature-level hook that orchestrates:
 * - Redux state access via selectors
 * - AuthWebClient API calls via authApiService
 * - Action dispatching
 * - WebClientError handling
 * 
 * Provides clean API for auth operations to UI components.
 * 
 * @example
 * const { login, logout, user, isAuthenticated } = useAuth()
 * 
 * try {
 *   await login({ email, password })
 * } catch (error) {
 *   if (error instanceof WebClientError) {
 *     showError(error.getUserMessage())
 *   }
 * }
 */
export function useAuth() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  
  const [isLoading, setIsLoading] = useState(false)
  
  /**
   * Login user
   * 
   * @throws WebClientError on failure
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true)
      try {
        const response = await authApiService.login(credentials.email, credentials.password)
        
        // Map DTO to domain model and update state
        dispatch(setCredentials({
          user: {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            role: response.user.role as 'user' | 'admin',
            createdAt: response.user.createdAt,
          },
          token: response.token,
        }))
        
        return { success: true }
      } catch (error) {
        // WebClientError is thrown by request functions
        // Re-throw for UI to handle
        if (error instanceof WebClientError) {
          console.error('Login failed:', error.toJSON())
        }
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch]
  )
  
  /**
   * Logout user
   * 
   * @throws WebClientError on failure (but clears local state anyway)
   */
  const logout = useCallback(
    async () => {
      try {
        await authApiService.logout()
        dispatch(clearCredentials())
        return { success: true }
      } catch (error) {
        // Clear local state even if server request fails
        dispatch(clearCredentials())
        console.error('Logout error:', error)
        return { success: true } // Still successful locally
      }
    },
    [dispatch]
  )
  
  return {
    // State
    user,
    isAuthenticated,
    isLoading: auth.isLoading || isLoading,
    error: auth.error,
    
    // Actions
    login,
    logout,
  }
}
