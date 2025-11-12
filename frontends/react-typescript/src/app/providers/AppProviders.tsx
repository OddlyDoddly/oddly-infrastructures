import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../store'

export interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * AppProviders
 * 
 * Wraps app with all necessary providers:
 * - Redux store provider
 * - React Router
 * - Theme provider (optional, can add later)
 * 
 * @example
 * <AppProviders>
 *   <App />
 * </AppProviders>
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
}
