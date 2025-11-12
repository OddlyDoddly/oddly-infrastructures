import { baseApi } from '@/shared/api/base-api'
import type { UserModel, LoginCredentials, RegisterData } from '../model/auth-types'

/**
 * Auth API DTOs (transport layer)
 * 
 * These match backend response contracts.
 * Mappers transform to/from domain models.
 */
export interface LoginRequest {
  email: string
  password: string
}

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

export interface RegisterRequest {
  email: string
  password: string
  name: string
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

/**
 * Auth API endpoints
 * 
 * Extends baseApi with auth-specific endpoints.
 * Returns DTOs that features map to domain models.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    register: builder.mutation<RegisterResponse, RegisterData>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    
    getMe: builder.query<MeResponse, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
})

/**
 * Export generated hooks
 */
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi
