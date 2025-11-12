import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api/base-api'
import authReducer from '@/features/auth/model/auth-slice'

/**
 * Redux store configuration
 * 
 * Combines:
 * - RTK Query API slice for server cache
 * - Feature slices for client state
 */
export const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [baseApi.reducerPath]: baseApi.reducer,
    
    // Feature slices
    auth: authReducer,
  },
  
  // Add RTK Query middleware for caching, invalidation, polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  
  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV,
})

/**
 * Infer types from the store itself
 */
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
