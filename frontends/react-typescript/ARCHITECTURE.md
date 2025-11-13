# Frontend Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Project Structure](#project-structure)
4. [State Management](#state-management)
5. [UI Component Architecture](#ui-component-architecture)
6. [Feature Module Pattern](#feature-module-pattern)
7. [Design Token System](#design-token-system)
8. [Data Flow](#data-flow)
9. [Testing Strategy](#testing-strategy)
10. [Performance Considerations](#performance-considerations)
11. [Naming Conventions](#naming-conventions)
12. [Common Patterns](#common-patterns)

---

## Overview

This frontend architecture is inspired by Domain-Driven Design (DDD) principles adapted for client-side applications. It emphasizes:

- **Feature-first organization** over technical layers
- **Explicit data transformations** at boundaries
- **Clear separation** between client state and server cache
- **Colocation** of related code
- **Type safety** throughout

### Philosophy

> "Code that changes together, lives together."

We organize by feature (vertical slices) rather than by technical concern (horizontal layers). Each feature is a mini-application with its own state, API, UI, and tests.

---

## Architecture Principles

### 1. Feature-First Organization

**Problem**: Traditional layered architectures scatter related code across many directories.

**Solution**: Group by feature. Each feature contains everything it needs:

```
features/auth/
  ├── model/      # State (what)
  ├── api/        # Server communication (where)
  ├── ui/         # Components (how)
  ├── pages/      # Containers (orchestration)
  ├── hooks/      # Feature logic (behavior)
  └── tests/      # Verification
```

**Benefits**:
- Easy to find related code
- Easy to delete features
- Clear feature boundaries
- Enables team ownership

### 2. Separation of Concerns

**Client State vs Server State**

| Aspect | Client State (Redux) | Server State (RTK Query) |
|--------|---------------------|--------------------------|
| Purpose | Shared UI state | Cached server data |
| Examples | Theme, filters, UI mode | User data, posts, photos |
| Management | Redux Toolkit slices | RTK Query endpoints |
| Invalidation | Manual | Automatic via tags |
| Persistence | localStorage if needed | Cache (automatic) |

**Rule**: If it comes from an API, use RTK Query. If it's local UI state that needs sharing, use Redux.

### 3. Unidirectional Data Flow

```
User Interaction
    ↓
UI Component
    ↓
Hook/Dispatch
    ↓
Redux Store / RTK Query
    ↓
Selector
    ↓
UI Component (re-render)
```

**Never**:
- Mutate state directly
- Skip the store for shared state
- Mix concerns (UI logic in components)

### 4. Explicit Boundaries

**Three boundaries in the app**:

1. **API Boundary**: DTOs ↔ Domain models (mappers in hooks/api)
2. **Component Boundary**: Props ↔ Internal state (clear interfaces)
3. **Feature Boundary**: Public API via index.ts (information hiding)

### 5. Colocation

> "Things that change together should live together."

Place code near where it's used:
- Tests next to tested code
- Types next to implementation
- Styles via Tailwind (co-located)
- Assets next to components using them

---

## Project Structure

### Directory Layout

```
src/
├── app/                    # Application core (singleton)
│   ├── store.ts           # Redux store setup
│   ├── providers/         # Context providers
│   ├── routes/            # Route configuration
│   ├── hooks/             # Typed Redux hooks
│   └── types/             # Global types
│
├── shared/                # Truly reusable code
│   ├── ui/                # Policy-free UI primitives
│   ├── hooks/             # Generic hooks
│   ├── lib/               # Utilities
│   ├── api/               # Base API config
│   ├── constants/         # App constants
│   └── icons/             # Icons
│
├── features/              # Feature modules
│   └── {feature}/
│       ├── index.ts       # Public API
│       ├── model/         # Redux slice + selectors + types
│       ├── api/           # RTK Query endpoints
│       ├── ui/            # Feature components
│       ├── pages/         # Route containers
│       ├── hooks/         # Feature hooks
│       └── tests/         # Feature tests
│
├── styles/                # Global styles
│   ├── globals.css        # Tailwind + resets
│   ├── tokens.css         # Design tokens
│   └── themes.css         # Theme overrides
│
├── App.tsx                # Root component
└── main.tsx               # Entry point
```

### Directory Rules

**app/**
- Application-wide configuration
- Single instance code
- No feature-specific logic

**shared/**
- Code used by 2+ features
- No feature imports
- Truly generic

**features/**
- Domain logic
- Self-contained
- Explicit public API

**styles/**
- Design tokens
- Global resets
- Theme definitions

---

## State Management

### Redux Toolkit Slices (Client State)

**Purpose**: Manage shared client-side state

**Structure**:
```typescript
// features/auth/model/auth-slice.ts
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})
```

**When to use**:
- UI state shared across components
- User preferences
- Filters, sort options
- UI mode (sidebar open/closed)

**When NOT to use**:
- Server data (use RTK Query)
- Local component state (use useState)
- Derived data (use selectors)

### RTK Query (Server Cache)

**Purpose**: Fetch, cache, and sync server data

**Structure**:
```typescript
// features/auth/api/auth-api.ts
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query<UserResponse, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery } = authApi
```

**Benefits**:
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication
- Cache invalidation via tags

**Tag-based invalidation**:
```typescript
// When user logs in, invalidate Auth tag
invalidatesTags: ['Auth']

// All queries providing Auth tag refetch
providesTags: ['Auth']
```

### Selectors

**Purpose**: Derive data from state, memoize computations

**Structure**:
```typescript
// features/auth/model/auth-selectors.ts
export const selectUser = (state: RootState) => state.auth.user

export const selectIsAuthenticated = (state: RootState) => 
  state.auth.isAuthenticated

// Derived selector
export const selectIsAdmin = (state: RootState) => 
  state.auth.user?.role === 'admin'
```

**Rules**:
- Selectors are the UI's only view into state
- Keep selectors pure (no side effects)
- Use `createSelector` from Reselect for complex derivations
- Name: `select{Thing}`

---

## UI Component Architecture

### Component Hierarchy

```
┌─────────────────────────────────────┐
│  Pages (Route-bound containers)    │
│  - Fetch data                       │
│  - Orchestrate UI                   │
│  - Handle navigation                │
├─────────────────────────────────────┤
│  Feature UI (Domain components)     │
│  - Business logic connections       │
│  - Feature-specific styling         │
│  - Composition of primitives        │
├─────────────────────────────────────┤
│  Primitives (Reusable building blocks)│
│  - Policy-free                      │
│  - Highly configurable              │
│  - Shared across features           │
└─────────────────────────────────────┘
```

### Primitives (shared/ui/)

**Characteristics**:
- No business logic
- No API calls
- No Redux connections
- Configurable via props
- Styled with Tailwind + tokens

**Organization by family**:
```
shared/ui/
  ├── buttons/        # Button, IconButton
  ├── inputs/         # Input, Select, Checkbox, Radio
  ├── forms/          # Form, FormField (layout only)
  ├── cards/          # Card, CardHeader, CardContent
  ├── overlays/       # Dialog, Drawer, Tooltip
  ├── layout/         # Container, Stack, Grid
  └── feedback/       # Spinner, Toast, Alert
```

**Example primitive**:
```typescript
// shared/ui/buttons/Button.tsx
const buttonVariants = cva('base classes', {
  variants: {
    intent: { primary: '...', ghost: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
})

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ intent, size, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ intent, size }), className)}
      {...props}
    />
  )
)
```

### Feature UI (features/*/ui/)

**Characteristics**:
- Feature-specific
- May connect to hooks/state
- Compose primitives
- Implement business styling

**Example**:
```typescript
// features/auth/ui/LoginForm.tsx
export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} error={!!errors.email} />
      <Input {...register('password')} type="password" />
      <Button type="submit" disabled={isLoading}>
        Login
      </Button>
    </form>
  )
}
```

### Pages (features/*/pages/)

**Characteristics**:
- Route-bound
- Orchestrate data fetching
- Assemble UI components
- Handle navigation

**Example**:
```typescript
// features/auth/pages/LoginPage.tsx
export function LoginPage() {
  const navigate = useNavigate()
  
  const handleSuccess = () => {
    navigate('/dashboard')
  }
  
  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </Container>
  )
}
```

---

## Feature Module Pattern

### Anatomy of a Feature

```
features/auth/
├── index.ts              # Public API (exports)
├── model/                # State management
│   ├── auth-slice.ts     # Redux slice (actions + reducers)
│   ├── auth-selectors.ts # State selectors
│   └── auth-types.ts     # Domain types
├── api/                  # Server communication
│   └── auth-api.ts       # RTK Query endpoints + DTOs
├── ui/                   # UI components
│   ├── LoginForm.tsx
│   └── UserMenu.tsx
├── pages/                # Route containers
│   └── LoginPage.tsx
├── hooks/                # Feature hooks
│   └── use-auth.ts       # Orchestration hook
└── tests/                # Tests
    └── auth-slice.test.ts
```

### Public API (index.ts)

**Purpose**: Define what other features can import

```typescript
// features/auth/index.ts
// Hooks (main interface)
export { useAuth } from './hooks/use-auth'

// Pages (for routing)
export { LoginPage } from './pages/LoginPage'

// Types (if needed by other features)
export type { UserModel } from './model/auth-types'

// Selectors (if needed by other features)
export { selectUser, selectIsAuthenticated } from './model/auth-selectors'

// DO NOT export internal implementation details:
// - Slice actions (use hooks instead)
// - API mutations (use hooks instead)
// - Internal UI components
```

**Rule**: Other features import from `@/features/auth`, never from internal files.

### Feature Hook Pattern

**Purpose**: Provide clean API to UI, hide implementation

```typescript
// features/auth/hooks/use-auth.ts
export function useAuth() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const [loginMutation] = useLoginMutation()
  
  const login = useCallback(async (credentials) => {
    const response = await loginMutation(credentials).unwrap()
    dispatch(setCredentials({ user: response.user, token: response.token }))
    return { success: true }
  }, [loginMutation, dispatch])
  
  return { user, login, logout, isAuthenticated }
}
```

**Benefits**:
- Single import for feature functionality
- Hides Redux/RTK Query complexity
- Easy to test
- Clear contract

---

## Design Token System

### Token Architecture

**Three-layer system**:

1. **tokens.css** - Base design tokens (CSS variables)
2. **themes.css** - Theme-specific overrides
3. **tailwind.config.ts** - Maps tokens to Tailwind

### Token Definition (tokens.css)

```css
:root {
  /* Colors (HSL for Tailwind opacity support) */
  --color-bg: 0 0% 100%;
  --color-fg: 222 47% 11%;
  --color-primary: 222 90% 56%;
  --color-primary-foreground: 0 0% 100%;
  
  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-modal: 1100;
  --z-tooltip: 1200;
}
```

### Theme Overrides (themes.css)

```css
[data-theme='dark'] {
  --color-bg: 222 47% 7%;
  --color-fg: 210 40% 98%;
  --color-primary: 222 90% 66%;
  /* ... other overrides */
}

[data-theme='brand-emerald'] {
  --color-primary: 160 84% 39%;
  --color-accent: 160 84% 39%;
}
```

### Tailwind Integration

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--color-bg) / <alpha-value>)',
        fg: 'hsl(var(--color-fg) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
          foreground: 'hsl(var(--color-primary-foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
      },
    },
  },
}
```

### Usage in Components

```tsx
// Automatic via Tailwind classes
<button className="bg-primary text-primary-foreground rounded-md">
  Click me
</button>

// With opacity modifier (HSL advantage)
<div className="bg-primary/20">Subtle background</div>

// Theme switching
<html data-theme="dark">
```

**Benefits**:
- Runtime theme switching (no rebuild)
- Consistent design language
- Easy white-labeling
- Type-safe via Tailwind

---

## Data Flow

### Complete Flow Example: Login

```
1. User clicks login button
   ↓
2. LoginForm calls handleSubmit
   ↓
3. useAuth hook receives credentials
   ↓
4. Hook calls loginMutation (RTK Query)
   ↓
5. API request to /auth/login
   ↓
6. Server responds with { user, token }
   ↓
7. Hook dispatches setCredentials(user, token)
   ↓
8. Redux state updates
   ↓
9. Selector (selectUser) returns new value
   ↓
10. Component re-renders with user data
    ↓
11. Navigate to dashboard
```

### Data Transformation Points

**API → Domain Model**:
```typescript
// In feature hook
const response = await loginMutation(credentials).unwrap()

// Map DTO to domain model
dispatch(setCredentials({
  user: {
    id: response.user.id,
    email: response.user.email,
    name: response.user.name,
    role: response.user.role as 'user' | 'admin',
    createdAt: response.user.createdAt,
  },
  token: response.token,
}))
```

**Domain Model → View Model**:
```typescript
// In component
const { user } = useAuth()

// Use directly or derive
const displayName = user?.name || 'Guest'
const isAdmin = user?.role === 'admin'
```

---

## Testing Strategy

### Test Pyramid

```
        ╱╲
       ╱  ╲     E2E (few)
      ╱────╲    Integration (some)
     ╱      ╲   Unit (many)
    ╱────────╲
```

### Unit Tests

**What**: Pure functions, Redux slices, selectors, utilities

**Example**:
```typescript
// features/auth/tests/auth-slice.test.ts
describe('authSlice', () => {
  it('should handle setCredentials', () => {
    const actual = authReducer(initialState, setCredentials(payload))
    expect(actual.isAuthenticated).toBe(true)
    expect(actual.user).toEqual(payload.user)
  })
})
```

### Component Tests

**What**: UI components, user interactions

**Example**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react'

describe('LoginForm', () => {
  it('should validate email format', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid' } })
    fireEvent.blur(emailInput)
    
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
  })
})
```

### Integration Tests

**What**: Feature flows, RTK Query integration

**Example**:
```typescript
import { renderWithProviders } from '@/tests/utils'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ user: mockUser, token: mockToken }))
  })
)

describe('Login flow', () => {
  it('should login and redirect', async () => {
    const { user } = renderWithProviders(<LoginPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument()
  })
})
```

### Test Organization

```
src/features/auth/
├── model/
│   └── auth-slice.ts
├── ui/
│   └── LoginForm.tsx
└── tests/
    ├── auth-slice.test.ts       # Unit
    ├── LoginForm.test.tsx       # Component
    └── login-flow.test.tsx      # Integration
```

---

## Performance Considerations

### Code Splitting

```typescript
// Lazy load pages
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))

// Use Suspense
<Suspense fallback={<Spinner />}>
  <DashboardPage />
</Suspense>
```

### Selector Optimization

```typescript
// Bad: Returns new object every call
const selectUserData = (state) => ({
  name: state.auth.user?.name,
  email: state.auth.user?.email,
})

// Good: Use createSelector for memoization
const selectUserData = createSelector(
  [(state) => state.auth.user],
  (user) => ({
    name: user?.name,
    email: user?.email,
  })
)
```

### List Rendering

```typescript
// For large lists, use react-window or react-virtuoso
import { FixedSizeList } from 'react-window'

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  )
}
```

### RTK Query Optimization

```typescript
// Polling for real-time updates
useGetPhotosQuery(undefined, {
  pollingInterval: 30000, // 30 seconds
})

// Skip query conditionally
useGetUserQuery(userId, {
  skip: !userId,
})

// Cache configuration
export const photosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPhotos: builder.query({
      query: () => '/photos',
      keepUnusedDataFor: 60, // Cache for 60 seconds
    }),
  }),
})
```

---

## Naming Conventions

### Files
- **Components**: `PascalCase.tsx` (e.g., `LoginForm.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-auth.ts`)
- **Slices**: `{feature}-slice.ts` (e.g., `auth-slice.ts`)
- **Selectors**: `{feature}-selectors.ts`
- **Types**: `{feature}-types.ts`
- **API**: `{feature}-api.ts`
- **Tests**: `{name}.test.ts(x)`

### Exports
- **Components**: Named export matching file (e.g., `export function LoginForm`)
- **Hooks**: Named export with `use` prefix (e.g., `export function useAuth`)
- **Types**: Named export (e.g., `export interface UserModel`)
- **Constants**: Named export, UPPER_SNAKE_CASE

### Functions
- **Components**: PascalCase (e.g., `function Button()`)
- **Hooks**: camelCase with `use` prefix (e.g., `function useAuth()`)
- **Utilities**: camelCase (e.g., `function formatDate()`)
- **Event handlers**: `handle{Event}` (e.g., `handleClick`)
- **Callbacks**: `on{Event}` prop (e.g., `onSuccess`)

### Variables
- **React state**: `[thing, setThing]`
- **Boolean**: `is{Thing}`, `has{Thing}`, `should{Thing}`
- **Arrays**: Plural (e.g., `users`, `photos`)
- **Objects**: Singular (e.g., `user`, `photo`)

---

## Common Patterns

### Protected Routes

```typescript
// Create ProtectedRoute wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Use in routes
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

### Form with Validation

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  
  const onSubmit = (data: FormData) => {
    // Handle submission
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} error={!!errors.email} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  )
}
```

### Optimistic Updates

```typescript
const [updatePhoto] = useUpdatePhotoMutation()

const handleUpdate = async (id: string, data: PhotoData) => {
  // Optimistic update
  const previousData = queryClient.getQueryData(['photos', id])
  queryClient.setQueryData(['photos', id], { ...previousData, ...data })
  
  try {
    await updatePhoto({ id, data }).unwrap()
  } catch (error) {
    // Rollback on error
    queryClient.setQueryData(['photos', id], previousData)
  }
}
```

### Infinite Scroll

```typescript
const InfinitePhotoList = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useGetPhotosQuery({ page })
  
  const loadMore = () => setPage((p) => p + 1)
  
  return (
    <>
      {data?.photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
      <Button onClick={loadMore} disabled={isFetching}>
        {isFetching ? 'Loading...' : 'Load More'}
      </Button>
    </>
  )
}
```

---

## Conclusion

This architecture provides:

✅ **Scalability** - Easy to add features without touching existing code  
✅ **Maintainability** - Clear structure, easy to find and modify code  
✅ **Type Safety** - Strict TypeScript throughout  
✅ **Performance** - Optimized rendering, caching, code splitting  
✅ **Testability** - Clear boundaries, pure functions, mocked dependencies  
✅ **Developer Experience** - Consistent patterns, helpful tooling

Remember: These are guidelines, not laws. Adapt them to your team's needs while maintaining the core principles.
