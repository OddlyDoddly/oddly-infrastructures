import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const ExamplePage = lazy(() => import('./pages/ExamplePage'));

/**
 * Example Feature Routes
 * 
 * Route definitions for the example feature.
 * Uses lazy loading for code splitting.
 */
export const exampleRoutes: RouteObject[] = [
  {
    path: '/example',
    element: <ExamplePage />,
  },
];
