import { describe, it, expect, beforeEach } from 'vitest'
import authReducer, {
  setCredentials,
  clearCredentials,
  setAuthLoading,
  setAuthError,
} from '../model/auth-slice'
import type { AuthState } from '../model/auth-types'

describe('authSlice', () => {
  let initialState: AuthState

  beforeEach(() => {
    initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  })

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(
      expect.objectContaining({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    )
  })

  it('should handle setCredentials', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
      createdAt: '2024-01-01T00:00:00Z',
    }
    const token = 'test-token-123'

    const actual = authReducer(initialState, setCredentials({ user, token }))

    expect(actual.user).toEqual(user)
    expect(actual.token).toBe(token)
    expect(actual.isAuthenticated).toBe(true)
    expect(actual.error).toBeNull()
  })

  it('should handle clearCredentials', () => {
    const stateWithUser: AuthState = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: '2024-01-01T00:00:00Z',
      },
      token: 'test-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }

    const actual = authReducer(stateWithUser, clearCredentials())

    expect(actual.user).toBeNull()
    expect(actual.token).toBeNull()
    expect(actual.isAuthenticated).toBe(false)
    expect(actual.error).toBeNull()
  })

  it('should handle setAuthLoading', () => {
    const actual = authReducer(initialState, setAuthLoading(true))
    expect(actual.isLoading).toBe(true)

    const actual2 = authReducer(actual, setAuthLoading(false))
    expect(actual2.isLoading).toBe(false)
  })

  it('should handle setAuthError', () => {
    const errorMessage = 'Authentication failed'
    const actual = authReducer(initialState, setAuthError(errorMessage))
    expect(actual.error).toBe(errorMessage)

    const actual2 = authReducer(actual, setAuthError(null))
    expect(actual2.error).toBeNull()
  })
})
