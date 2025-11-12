/**
 * Example Feature Barrel Export
 * 
 * Public API for the example feature.
 * Only export what other features need to use.
 */

export { exampleRoutes } from './routes';
export { useGetExampleItemsQuery, useCreateExampleItemMutation } from './api/example.api';
export type { ExampleItem } from './model/example.types';
