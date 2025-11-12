import { createBrowserRouter, Navigate } from 'react-router-dom';
import { exampleRoutes } from '@/features/example';

/**
 * Application Routes
 * 
 * Centralized route configuration.
 * Features export their routes which are composed here.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/example" replace />,
  },
  ...exampleRoutes,
  {
    path: '*',
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="mt-2 text-muted-foreground">Page not found</p>
        </div>
      </div>
    ),
  },
]);
