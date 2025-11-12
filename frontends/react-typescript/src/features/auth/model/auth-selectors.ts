import type { RootState } from '@/app/store'

/**
 * Auth selectors
 * 
 * UI's only view into auth state.
 * Keep selectors simple; complex derivations go here.
 */

export const selectAuth = (state: RootState) => state.auth

export const selectUser = (state: RootState) => state.auth.user

export const selectIsAuthenticated = (state: RootState) => 
  state.auth.isAuthenticated

export const selectAuthToken = (state: RootState) => state.auth.token

export const selectAuthLoading = (state: RootState) => state.auth.isLoading

export const selectAuthError = (state: RootState) => state.auth.error

/**
 * Derived selector example
 */
export const selectIsAdmin = (state: RootState) => 
  state.auth.user?.role === 'admin'
