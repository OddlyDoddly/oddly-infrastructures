import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setCredentials, clearCredentials } from '../model/auth-slice'
import { selectAuth, selectUser, selectIsAuthenticated } from '../model/auth-selectors'
import { useLoginMutation, useLogoutMutation } from '../api/auth-api'
import type { LoginCredentials } from '../model/auth-types'

/**
 * useAuth hook
 * 
 * Feature-level hook that orchestrates:
 * - Redux state access via selectors
 * - RTK Query mutations
 * - Action dispatching
 * 
 * Provides clean API for auth operations to UI components.
 * 
 * @example
 * const { login, logout, user, isAuthenticated } = useAuth()
 */
export function useAuth() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()
  
  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const response = await loginMutation(credentials).unwrap()
        
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
        console.error('Login failed:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Login failed' 
        }
      }
    },
    [loginMutation, dispatch]
  )
  
  /**
   * Logout user
   */
  const logout = useCallback(
    async () => {
      try {
        await logoutMutation().unwrap()
        dispatch(clearCredentials())
        return { success: true }
      } catch (error) {
        // Clear local state even if server request fails
        dispatch(clearCredentials())
        console.error('Logout error:', error)
        return { success: true } // Still successful locally
      }
    },
    [logoutMutation, dispatch]
  )
  
  return {
    // State
    user,
    isAuthenticated,
    isLoading: auth.isLoading || isLoggingIn,
    error: auth.error,
    
    // Actions
    login,
    logout,
  }
}
