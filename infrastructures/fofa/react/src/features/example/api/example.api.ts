import { baseApi } from '@/shared/api/baseApi';
import { exampleApiClient } from '@/shared/webclients/example-api/ExampleApiWebClient';
import type { ExampleItemResponse } from '@/shared/webclients/example-api/responses/ExampleItemResponse';
import type { CreateExampleItemPayload } from '@/shared/webclients/example-api/requests/CreateExampleItemRequest';

/**
 * Example API
 * 
 * RTK Query endpoints for the example feature.
 * All HTTP calls MUST go through the WebClient, not directly via fetch or axios.
 */
export const exampleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExampleItems: builder.query<ExampleItemResponse[], void>({
      queryFn: async () => {
        try {
          const data = await exampleApiClient.getExampleItems();
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      },
      providesTags: ['ExampleItems'],
    }),
    
    createExampleItem: builder.mutation<ExampleItemResponse, CreateExampleItemPayload>({
      queryFn: async (payload) => {
        try {
          const data = await exampleApiClient.createExampleItem(payload);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      },
      invalidatesTags: ['ExampleItems'],
    }),
  }),
});

export const { useGetExampleItemsQuery, useCreateExampleItemMutation } = exampleApi;
