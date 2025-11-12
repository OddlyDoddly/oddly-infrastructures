import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base API
 * 
 * Base RTK Query API definition that all feature APIs extend.
 * Uses fakeBaseQuery because we handle HTTP calls via WebClient classes.
 * 
 * Features should use `baseApi.injectEndpoints()` to add their endpoints.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['ExampleItems'],
  endpoints: () => ({}),
});
