# FOFA React Architecture

**Detailed Architecture Documentation**

This document provides in-depth explanation of the architectural patterns, design decisions, and implementation details for the FOFA (Front-end Opinionated Feature-first Architecture) React infrastructure.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Architecture Layers](#architecture-layers)
3. [WebClient Pattern](#webclient-pattern)
4. [State Management](#state-management)
5. [Feature Structure](#feature-structure)
6. [UI Component Architecture](#ui-component-architecture)
7. [Design System](#design-system)
8. [Data Flow](#data-flow)
9. [Testing Strategy](#testing-strategy)
10. [Performance Considerations](#performance-considerations)

---

## Core Principles

### 1. Feature-First Organization

**Problem:** Traditional layer-first organization (components/, services/, utils/) scatters related code across directories, making features hard to understand and maintain.

**Solution:** Organize by feature slices where each feature contains all its layers:

```
features/
  user-management/
    model/          # State
    api/            # Data fetching
    ui/             # Components
    pages/          # Routes
    hooks/          # Logic
    tests/          # Tests
```

**Benefits:**
- Related code stays together
- Features are independently maintainable
- Easy to add/remove features
- Clear boundaries and dependencies

### 2. Separation of Concerns

**Three distinct component types:**

1. **Pages** - Route containers that orchestrate
2. **Feature UI** - Presentational components with props
3. **Shared Primitives** - Policy-free building blocks

**Rules:**
- Pages fetch data and manage state
- Feature UI receives props, no side effects
- Primitives have no business logic

### 3. Single Source of Truth

**State Management Strategy:**

- **Local State (useState)** - Transient UI (modal open, hover)
- **Redux Slices** - Cross-component client data
- **RTK Query** - Server data with caching

**Never duplicate data across these layers.**

### 4. Explicit Data Flow

All transformations are explicit:
- WebClient handles HTTP
- RTK Query caches responses
- Redux stores client state
- Selectors expose state to UI
- Props flow down, events flow up

---

## Architecture Layers

### Layer Diagram

```
┌─────────────────────────────────────────┐
│           Pages (Route Layer)            │
│  - Orchestrate data and state           │
│  - Use RTK Query hooks                  │
│  - Dispatch Redux actions               │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│       Feature UI (Presentation)          │
│  - Accept props                          │
│  - Emit events via callbacks            │
│  - Compose from primitives              │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│    Shared Primitives (UI Building       │
│                Blocks)                   │
│  - Policy-free components               │
│  - Design system elements               │
│  - No business logic                    │
└─────────────────────────────────────────┘

         Data Sources
         
┌─────────────────┐    ┌──────────────────┐
│   RTK Query     │    │  Redux Slices    │
│ (Server Cache)  │    │ (Client State)   │
└────────┬────────┘    └────────┬─────────┘
         │                      │
         └──────────┬───────────┘
                    │
         ┌──────────┴───────────┐
         │     WebClients        │
         │  (HTTP Boundary)      │
         └──────────┬────────────┘
                    │
         ┌──────────┴───────────┐
         │  Request Functions    │
         │    (Axios Calls)      │
         └───────────────────────┘
```

---

## WebClient Pattern

### The Pattern Explained

**Goal:** Centralize all HTTP communication with clear abstraction layers.

**Structure:**
```
shared/webclients/{service}/
  {Service}WebClient.ts      # Public API, handles auth
  {Service}Error.ts          # Custom error class
  requests/
    {Action}Request.ts       # Axios calls ONLY here
  responses/
    {Action}Response.ts      # Data-only interfaces
```

### Why This Pattern?

**Problems with direct HTTP in components:**
- ❌ Scattered HTTP logic
- ❌ Duplicate error handling
- ❌ Hard to mock for testing
- ❌ Difficult to change APIs
- ❌ Auth tokens everywhere

**Benefits of WebClient pattern:**
- ✅ Single place for API changes
- ✅ Consistent error handling
- ✅ Easy to mock (swap WebClient)
- ✅ Auth handled centrally
- ✅ Type-safe requests/responses
- ✅ Clear dependency graph

### Implementation Details

#### 1. WebClient Class

**Responsibilities:**
- Maintain base URL
- Handle authentication token
- Provide public methods
- Catch and wrap errors
- NO Axios calls (delegates to Request functions)

```typescript
export class ExampleApiWebClient {
  private authToken: string | null = null;

  constructor(private baseUrl: string) {}

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  async getItems(): Promise<ItemResponse[]> {
    try {
      return await getItemsRequest(this.baseUrl, this.authToken);
    } catch (error) {
      throw new ExampleApiError('Failed to fetch items', error);
    }
  }
}
```

**Key Points:**
- Singleton instance exported
- Token management at class level
- Delegates to Request functions
- Wraps errors in custom error class

#### 2. Request Functions

**Responsibilities:**
- Make Axios HTTP calls
- Configure headers, timeout
- Return typed response
- ONLY place for Axios

```typescript
export async function getItemsRequest(
  baseUrl: string,
  authToken: string | null
): Promise<ItemResponse[]> {
  const response = await axios.get<ItemResponse[]>(
    `${baseUrl}/items`,
    {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      timeout: 10000,
    }
  );
  return response.data;
}
```

**Key Points:**
- Pure functions (no side effects)
- Explicit parameters
- Typed responses
- Axios configuration here

#### 3. Response Interfaces

**Responsibilities:**
- Define API response shape
- Data-only (NO methods)
- JSON-serializable

```typescript
export interface ItemResponse {
  id: string;
  title: string;
  createdAt: string;
}
```

**Key Points:**
- Interfaces, not classes
- No logic
- Match API contract

#### 4. Error Classes

**Responsibilities:**
- Custom error types per service
- Preserve original error
- Capture status codes

```typescript
export class ExampleApiError extends BaseWebClientError {
  constructor(message: string, originalError?: unknown, statusCode?: number) {
    super(message, originalError, statusCode);
    this.name = 'ExampleApiError';
  }
}
```

### Integration with RTK Query

RTK Query endpoints use WebClient methods:

```typescript
export const itemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<ItemResponse[], void>({
      queryFn: async () => {
        try {
          const data = await exampleApiClient.getItems();
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
            },
          };
        }
      },
      providesTags: ['Items'],
    }),
  }),
});
```

**Flow:**
```
Component → useGetItemsQuery() → RTK Query
  → exampleApiClient.getItems()
  → getItemsRequest()
  → axios.get()
```

---

## State Management

### State Layers

#### 1. Local State (useState, useReducer)

**Use for:**
- Transient UI state
- Form inputs before submission
- Modal open/closed
- Hover states
- Temporary selections

**Example:**
```typescript
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
    </Modal>
  );
}
```

#### 2. Redux Slices (Client State)

**Use for:**
- Cross-component state
- App-wide settings
- User preferences
- UI state that persists across routes
- Non-server data

**Structure:**
```typescript
// Slice
const mySlice = createSlice({
  name: 'myFeature',
  initialState: { selectedId: null },
  reducers: {
    select: (state, action) => {
      state.selectedId = action.payload;
    },
  },
});

// Selectors (ONLY way to access state)
export const selectSelectedId = (state: RootState) => 
  state.myFeature.selectedId;

// Usage
const selectedId = useAppSelector(selectSelectedId);
dispatch(select('id-123'));
```

**Key Points:**
- Use `createSlice` for Redux logic
- Export selectors, NOT direct state access
- Keep slices focused on single domain
- Use `createEntityAdapter` for lists

#### 3. RTK Query (Server Cache)

**Use for:**
- ALL server data
- API responses
- Automatic caching
- Refetching on invalidation
- Loading/error states

**Structure:**
```typescript
export const itemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      queryFn: async () => {
        const data = await apiClient.getItems();
        return { data };
      },
      providesTags: ['Items'],
    }),
    createItem: builder.mutation<Item, CreateItemDto>({
      queryFn: async (dto) => {
        const data = await apiClient.createItem(dto);
        return { data };
      },
      invalidatesTags: ['Items'],
    }),
  }),
});

// Usage
const { data, isLoading, error, refetch } = useGetItemsQuery();
const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
```

**Key Points:**
- `query` for GET operations
- `mutation` for POST/PUT/DELETE
- Tags for cache invalidation
- Automatic refetching
- Built-in loading/error states

### When to Use What?

| State Type | Local | Redux Slice | RTK Query |
|------------|-------|-------------|-----------|
| Modal open | ✅ | ❌ | ❌ |
| Form input | ✅ | ❌ | ❌ |
| Selected item ID | ❌ | ✅ | ❌ |
| User preferences | ❌ | ✅ | ❌ |
| API data | ❌ | ❌ | ✅ |
| Loading state (API) | ❌ | ❌ | ✅ |

---

## Feature Structure

### Anatomy of a Feature

```
features/my-feature/
├── index.ts                 # Public API exports
├── routes.tsx              # Route definitions
├── model/                  # State management
│   ├── my-feature.slice.ts       # Redux slice
│   ├── my-feature.selectors.ts   # State selectors
│   └── my-feature.types.ts       # Type definitions
├── api/                    # Server communication
│   └── my-feature.api.ts         # RTK Query endpoints
├── ui/                     # Presentational components
│   ├── MyFeatureCard.tsx
│   └── MyFeatureList.tsx
├── pages/                  # Route pages
│   └── MyFeaturePage.tsx
├── hooks/                  # Custom hooks
│   └── useMyFeature.ts
└── tests/                  # Tests
    ├── my-feature.slice.test.ts
    └── MyFeaturePage.test.tsx
```

### File Responsibilities

#### index.ts (Public API)

**Purpose:** Define what other features can use

```typescript
// ONLY export what needs to be public
export { myFeatureRoutes } from './routes';
export { useGetItemsQuery } from './api/my-feature.api';
export type { MyFeatureItem } from './model/my-feature.types';
```

#### routes.tsx

**Purpose:** Define feature routes with lazy loading

```typescript
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const MyFeaturePage = lazy(() => import('./pages/MyFeaturePage'));

export const myFeatureRoutes: RouteObject[] = [
  {
    path: '/my-feature',
    element: <MyFeaturePage />,
  },
];
```

#### model/ (State Layer)

**Types:**
```typescript
export interface MyItem {
  id: string;
  name: string;
}

export interface MyFeatureState {
  selectedId: string | null;
  filter: 'all' | 'active';
}
```

**Slice:**
```typescript
export const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState: { selectedId: null, filter: 'all' },
  reducers: {
    selectItem: (state, action) => {
      state.selectedId = action.payload;
    },
  },
});
```

**Selectors:**
```typescript
export const selectSelectedId = (state: RootState) => 
  state.myFeature.selectedId;
export const selectFilter = (state: RootState) => 
  state.myFeature.filter;
```

#### api/ (Data Layer)

```typescript
export const myFeatureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      queryFn: async () => {
        const data = await myApiClient.getItems();
        return { data };
      },
      providesTags: ['MyItems'],
    }),
  }),
});

export const { useGetItemsQuery } = myFeatureApi;
```

#### ui/ (Presentation Layer)

**Pure components that accept props:**

```typescript
interface MyItemCardProps {
  item: MyItem;
  onSelect: (id: string) => void;
}

export function MyItemCard({ item, onSelect }: MyItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => onSelect(item.id)}>Select</Button>
      </CardContent>
    </Card>
  );
}
```

#### pages/ (Orchestration Layer)

**Coordinates data, state, and UI:**

```typescript
export default function MyFeaturePage() {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetItemsQuery();
  const selectedId = useAppSelector(selectSelectedId);
  
  const handleSelect = (id: string) => {
    dispatch(selectItem(id));
  };
  
  return (
    <Container>
      {isLoading && <Spinner />}
      {data && <MyItemList items={data} onSelect={handleSelect} />}
    </Container>
  );
}
```

---

## UI Component Architecture

### Component Hierarchy

```
Pages (Smart)
  ↓
Feature UI (Presentational)
  ↓
Shared Primitives (Policy-Free)
```

### Shared Primitives

**Location:** `shared/ui/`

**Rules:**
- NO feature-specific logic
- Accept props for customization
- Use design tokens
- Implement variants with CVA
- Keep under 150 lines

**Example:**
```typescript
const buttonVariants = cva('base-classes', {
  variants: {
    intent: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
    },
    size: {
      sm: 'h-8 px-3',
      md: 'h-9 px-4',
    },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
});

export const Button = ({ intent, size, ...props }) => (
  <button className={cn(buttonVariants({ intent, size }))} {...props} />
);
```

### Feature UI Components

**Rules:**
- Accept all data via props
- Emit events via callbacks
- No side effects (no API calls, no state management)
- Compose from primitives
- Keep focused on single responsibility

### Pages

**Rules:**
- Orchestrate data fetching
- Manage feature state
- Handle routing
- Compose UI components
- Connect to Redux/RTK Query

---

## Design System

### Design Tokens

**All design values as CSS variables:**

```css
:root {
  /* Colors (HSL format) */
  --color-primary: 222 90% 56%;
  --color-bg: 0 0% 100%;
  
  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
}

[data-theme="dark"] {
  --color-bg: 222 47% 7%;
  --color-fg: 210 40% 98%;
}
```

### Tailwind Integration

**Consume tokens in Tailwind config:**

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--color-primary))',
        bg: 'hsl(var(--color-bg))',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
      },
    },
  },
};
```

**Usage:**
```tsx
<div className="bg-primary text-primary-foreground rounded-md" />
```

### Why This Approach?

- ✅ Theme switching without JavaScript
- ✅ Single source of truth
- ✅ Runtime customization
- ✅ Consistent values across codebase
- ✅ Easy to maintain

---

## Data Flow

### Complete Flow Example

```
User Action (Button Click)
  ↓
Event Handler (in Page)
  ↓
Dispatch Action / Call Mutation
  ↓
RTK Query Mutation
  ↓
WebClient Method
  ↓
Request Function (Axios)
  ↓
HTTP Request
  ↓
API Response
  ↓
Response Type
  ↓
RTK Query Cache Update
  ↓
Cache Invalidation
  ↓
Automatic Refetch
  ↓
Component Re-render
```

### Read Flow (Query)

```
Component Mount
  ↓
useGetItemsQuery()
  ↓
RTK Query checks cache
  ↓
If stale: Call queryFn
  ↓
WebClient.getItems()
  ↓
getItemsRequest()
  ↓
axios.get()
  ↓
Response
  ↓
Cache Update
  ↓
Component receives data
```

### Write Flow (Mutation)

```
User submits form
  ↓
createItem(data)
  ↓
RTK Query mutation
  ↓
WebClient.createItem()
  ↓
createItemRequest()
  ↓
axios.post()
  ↓
Response
  ↓
Invalidate 'Items' tag
  ↓
Auto-refetch queries with 'Items' tag
  ↓
UI updates with new data
```

---

## Testing Strategy

### Test Pyramid

```
        E2E Tests (Few)
       /              \
  Integration Tests (Some)
 /                          \
Unit Tests (Many)
```

### Unit Tests

**What to test:**
- Redux slices (reducers, actions)
- Selectors
- Utility functions
- Custom hooks (with renderHook)

**Example:**
```typescript
describe('myFeatureSlice', () => {
  it('should handle selectItem', () => {
    const state = myFeatureReducer(undefined, selectItem('id-123'));
    expect(state.selectedId).toBe('id-123');
  });
});
```

### Component Tests

**What to test:**
- UI primitives render correctly
- Props are applied
- Events are emitted
- Conditional rendering

**Example:**
```typescript
describe('Button', () => {
  it('renders with correct intent', () => {
    render(<Button intent="primary">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');
  });
  
  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Integration Tests

**What to test:**
- Page components with mocked API
- Feature workflows
- State + UI integration

**Example:**
```typescript
describe('MyFeaturePage', () => {
  it('displays items when loaded', async () => {
    const mockData = [{ id: '1', name: 'Item 1' }];
    server.use(
      http.get('/api/items', () => HttpResponse.json(mockData))
    );
    
    render(<MyFeaturePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });
});
```

---

## Performance Considerations

### Code Splitting

**Route-based splitting:**
```typescript
const MyFeaturePage = lazy(() => import('./pages/MyFeaturePage'));
```

**Benefits:**
- Smaller initial bundle
- Faster first load
- Load features on demand

### Memoization

**Use when:**
- Expensive calculations
- Stable references needed
- Prevent unnecessary renders

```typescript
const memoizedValue = useMemo(() => 
  expensiveCalculation(data), 
  [data]
);

const memoizedCallback = useCallback(() => {
  doSomething(data);
}, [data]);
```

### RTK Query Caching

**Automatic caching:**
- Queries cached by endpoint + params
- Configurable cache times
- Automatic refetching
- Tag-based invalidation

```typescript
endpoints: {
  getItems: builder.query({
    // Cached for 60 seconds
    keepUnusedDataFor: 60,
    providesTags: ['Items'],
  }),
}
```

### Bundle Optimization

**Vite automatically:**
- Tree shakes unused code
- Minifies production builds
- Splits vendor bundles
- Optimizes assets

---

## Summary

The FOFA React architecture provides:

✅ **Clear Separation** - Features, state, UI, and data layers
✅ **Type Safety** - Strict TypeScript throughout
✅ **Scalability** - Feature-first organization grows easily
✅ **Maintainability** - Explicit patterns and conventions
✅ **Performance** - Code splitting, caching, optimization
✅ **Testability** - Clear boundaries, easy mocking
✅ **Developer Experience** - Consistent patterns, good tooling

**Key Takeaways:**

1. ALL HTTP through WebClient → Request pattern
2. Feature-first organization
3. Three state layers: Local, Redux, RTK Query
4. Pages orchestrate, UI presents, primitives build
5. Design tokens for consistency
6. Test slices, critical UI, and integrations

---

For implementation examples, see the `example` feature in `src/features/example/`.
