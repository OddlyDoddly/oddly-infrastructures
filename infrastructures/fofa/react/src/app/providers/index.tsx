import { ReduxProvider } from './ReduxProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * App Providers
 * 
 * Combines all application providers in the correct order.
 * Add additional providers (theme, auth, etc.) here as needed.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
