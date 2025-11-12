import { Provider } from 'react-redux';
import { store } from '../store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * Redux Provider
 * 
 * Wraps the application with Redux store provider.
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
