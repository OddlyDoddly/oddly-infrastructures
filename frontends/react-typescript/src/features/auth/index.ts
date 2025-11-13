/**
 * Auth feature barrel export
 * 
 * Public API of the auth feature.
 * Other features import from here, not from internal files.
 */

// Hooks
export { useAuth } from './hooks/use-auth'

// Pages
export { LoginPage } from './pages/LoginPage'

// Types (if needed by other features)
export type { UserModel, AuthState } from './model/auth-types'

// Selectors (if needed by other features)
export {
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin,
} from './model/auth-selectors'
