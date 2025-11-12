import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, UserModel } from './auth-types'

/**
 * Initial auth state
 */
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

/**
 * Auth slice
 * 
 * Manages authentication state (client-side).
 * Server state (login/register) handled by RTK Query in api/.
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: UserModel; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
      
      // Persist token
      localStorage.setItem('auth_token', action.payload.token)
    },
    
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      
      // Clear persisted token
      localStorage.removeItem('auth_token')
    },
    
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

/**
 * Export actions
 */
export const {
  setCredentials,
  clearCredentials,
  setAuthLoading,
  setAuthError,
} = authSlice.actions

/**
 * Export reducer
 */
export default authSlice.reducer
