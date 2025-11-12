import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { router } from './app/routes';
import { Spinner } from './shared/ui/feedback';

/**
 * App Component
 * 
 * Root application component that sets up providers and routing.
 */
function App() {
  return (
    <AppProviders>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Spinner size="lg" label="Loading..." />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  );
}

export default App;
