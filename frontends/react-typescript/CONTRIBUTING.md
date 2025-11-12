# Contributing to Projects Using This Template

This guide helps you understand how to work with codebases built using this frontend infrastructure template.

## Quick Reference

### Adding a New Feature

```bash
# 1. Create feature directory structure
mkdir -p src/features/photos/{model,api,ui,pages,hooks,tests}

# 2. Create index file for public API
touch src/features/photos/index.ts

# 3. Create state management files
touch src/features/photos/model/photos-slice.ts
touch src/features/photos/model/photos-selectors.ts
touch src/features/photos/model/photos-types.ts

# 4. Create API integration
touch src/features/photos/api/photos-api.ts

# 5. Create feature hook
touch src/features/photos/hooks/use-photos.ts

# 6. Create UI components
touch src/features/photos/ui/PhotoCard.tsx
touch src/features/photos/ui/PhotoGrid.tsx

# 7. Create page
touch src/features/photos/pages/PhotosPage.tsx

# 8. Create tests
touch src/features/photos/tests/photos-slice.test.ts
```

### Adding a New UI Primitive

```bash
# 1. Choose the appropriate family
# buttons, inputs, forms, cards, overlays, layout, feedback, menus

# 2. Create component in family directory
touch src/shared/ui/buttons/IconButton.tsx

# 3. Export from family index
# Edit src/shared/ui/buttons/index.ts to add:
# export { IconButton, type IconButtonProps } from './IconButton'
```

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Make Changes

Follow the feature-first organization:
- Feature code goes in `src/features/{feature}/`
- Shared UI goes in `src/shared/ui/`
- Utilities go in `src/shared/lib/`

### 3. Test Your Changes

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage
npm run test:coverage
```

### 4. Lint and Format

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### 5. Build

```bash
npm run build
```

## Code Style Guidelines

### TypeScript

**Use strict types**:
```typescript
// ✅ Good
interface User {
  id: string
  email: string
  name: string
}

// ❌ Bad
interface User {
  id: any
  email: string
}
```

**Prefer type inference**:
```typescript
// ✅ Good
const user = { id: '1', name: 'John' }

// ❌ Bad (over-specified)
const user: { id: string; name: string } = { id: '1', name: 'John' }
```

### Components

**Small, focused components**:
```typescript
// ✅ Good
function UserAvatar({ src, alt }: UserAvatarProps) {
  return <img src={src} alt={alt} className="rounded-full w-10 h-10" />
}

// ❌ Bad (too many responsibilities)
function UserProfile({ user }) {
  // 200 lines of mixed concerns
}
```

**Use composition**:
```typescript
// ✅ Good
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Bad (prop drilling)
<Card title="Title" content="Content" showHeader showFooter />
```

### Hooks

**Extract complex logic to hooks**:
```typescript
// ✅ Good
function usePhotoUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const upload = useCallback(async (file: File) => {
    setIsUploading(true)
    try {
      // Upload logic
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }, [])
  
  return { upload, isUploading, error }
}

// ❌ Bad (logic in component)
function PhotoUploader() {
  // All upload logic inline in component
}
```

### State Management

**Use RTK Query for server data**:
```typescript
// ✅ Good
const { data, isLoading } = useGetPhotosQuery()

// ❌ Bad (manual fetching in Redux)
const dispatch = useDispatch()
useEffect(() => {
  dispatch(fetchPhotos())
}, [])
```

**Keep Redux slices minimal**:
```typescript
// ✅ Good - Only shared client state
const uiSlice = createSlice({
  name: 'ui',
  initialState: { theme: 'light', sidebarOpen: true },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
  },
})

// ❌ Bad - Server data in Redux
const photosSlice = createSlice({
  name: 'photos',
  initialState: { photos: [], loading: false },
  // Use RTK Query instead!
})
```

### Styling

**Use design tokens**:
```typescript
// ✅ Good - Uses tokens via Tailwind
<button className="bg-primary text-primary-foreground rounded-md">
  Click me
</button>

// ❌ Bad - Hardcoded values
<button className="bg-blue-600 text-white rounded">
  Click me
</button>
```

**Use CVA for variants**:
```typescript
// ✅ Good
const buttonVariants = cva('base-classes', {
  variants: {
    intent: { primary: '...', ghost: '...' },
    size: { sm: '...', md: '...' },
  },
})

// ❌ Bad - Inline conditions
<button className={primary ? 'bg-blue' : 'bg-gray'}>
```

## Feature Development Pattern

### 1. Define Types (model/{feature}-types.ts)

```typescript
export interface Photo {
  id: string
  url: string
  title: string
  userId: string
}

export interface PhotosState {
  selectedPhotoId: string | null
  viewMode: 'grid' | 'list'
}
```

### 2. Create Redux Slice (model/{feature}-slice.ts)

```typescript
export const photosSlice = createSlice({
  name: 'photos',
  initialState: {
    selectedPhotoId: null,
    viewMode: 'grid',
  },
  reducers: {
    selectPhoto: (state, action) => {
      state.selectedPhotoId = action.payload
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload
    },
  },
})
```

### 3. Create Selectors (model/{feature}-selectors.ts)

```typescript
export const selectSelectedPhotoId = (state: RootState) => 
  state.photos.selectedPhotoId

export const selectViewMode = (state: RootState) => 
  state.photos.viewMode
```

### 4. Create API Endpoints (api/{feature}-api.ts)

```typescript
export const photosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPhotos: builder.query<Photo[], void>({
      query: () => '/photos',
      providesTags: ['Photo'],
    }),
    createPhoto: builder.mutation<Photo, CreatePhotoRequest>({
      query: (data) => ({
        url: '/photos',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Photo'],
    }),
  }),
})

export const { useGetPhotosQuery, useCreatePhotoMutation } = photosApi
```

### 5. Create Feature Hook (hooks/use-{feature}.ts)

```typescript
export function usePhotos() {
  const dispatch = useAppDispatch()
  const selectedPhotoId = useAppSelector(selectSelectedPhotoId)
  const { data: photos, isLoading } = useGetPhotosQuery()
  const [createPhoto] = useCreatePhotoMutation()
  
  const selectPhoto = useCallback((id: string) => {
    dispatch(photosSlice.actions.selectPhoto(id))
  }, [dispatch])
  
  const create = useCallback(async (data: CreatePhotoRequest) => {
    return createPhoto(data).unwrap()
  }, [createPhoto])
  
  return { photos, isLoading, selectedPhotoId, selectPhoto, create }
}
```

### 6. Create UI Components (ui/)

```typescript
export function PhotoCard({ photo }: PhotoCardProps) {
  const { selectPhoto } = usePhotos()
  
  return (
    <Card onClick={() => selectPhoto(photo.id)}>
      <img src={photo.url} alt={photo.title} />
      <CardContent>
        <h3>{photo.title}</h3>
      </CardContent>
    </Card>
  )
}
```

### 7. Create Page (pages/{Feature}Page.tsx)

```typescript
export function PhotosPage() {
  const { photos, isLoading } = usePhotos()
  
  if (isLoading) return <Spinner />
  
  return (
    <Container>
      <h1>Photos</h1>
      <div className="grid grid-cols-3 gap-4">
        {photos?.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </Container>
  )
}
```

### 8. Export Public API (index.ts)

```typescript
// Public API
export { usePhotos } from './hooks/use-photos'
export { PhotosPage } from './pages/PhotosPage'
export type { Photo } from './model/photos-types'

// Keep internal - do NOT export:
// - Slice actions (use hooks)
// - API mutations (use hooks)
// - Internal UI components
```

### 9. Add to Routes

```typescript
// src/app/routes/index.tsx
import { PhotosPage } from '@/features/photos'

<Route path="/photos" element={<PhotosPage />} />
```

### 10. Write Tests (tests/)

```typescript
describe('photosSlice', () => {
  it('should select photo', () => {
    const actual = photosReducer(
      initialState,
      selectPhoto('photo-1')
    )
    expect(actual.selectedPhotoId).toBe('photo-1')
  })
})
```

## Testing Guidelines

### Unit Tests

Test pure functions, slices, selectors:

```typescript
import { describe, it, expect } from 'vitest'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const result = formatDate(new Date('2024-01-01'))
    expect(result).toBe('Jan 1, 2024')
  })
})
```

### Component Tests

Test user interactions:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'

describe('LoginForm', () => {
  it('should show validation error', async () => {
    render(<LoginForm />)
    
    const button = screen.getByRole('button', { name: /login/i })
    fireEvent.click(button)
    
    expect(await screen.findByText(/required/i)).toBeInTheDocument()
  })
})
```

## Common Pitfalls

### ❌ Don't mix client state and server cache

```typescript
// ❌ Bad
const photosSlice = createSlice({
  initialState: { photos: [] }, // Server data in Redux
})

// ✅ Good
const photosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPhotos: builder.query<Photo[], void>({ // Server data in RTK Query
      query: () => '/photos',
    }),
  }),
})
```

### ❌ Don't bypass feature hooks

```typescript
// ❌ Bad - Direct Redux usage in component
function MyComponent() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  
  const login = () => {
    dispatch(setCredentials(...))
  }
}

// ✅ Good - Use feature hook
function MyComponent() {
  const { user, login } = useAuth()
}
```

### ❌ Don't create new objects in selectors

```typescript
// ❌ Bad - New object every call
const selectUserData = (state) => ({
  name: state.user.name,
  email: state.user.email,
})

// ✅ Good - Use createSelector
const selectUserData = createSelector(
  [(state) => state.user],
  (user) => ({ name: user.name, email: user.email })
)
```

### ❌ Don't put business logic in components

```typescript
// ❌ Bad
function PhotoUploader() {
  const handleUpload = async (file) => {
    // 50 lines of upload logic
  }
}

// ✅ Good
function usePhotoUpload() {
  // 50 lines of upload logic
  return { upload, isUploading, error }
}

function PhotoUploader() {
  const { upload, isUploading } = usePhotoUpload()
}
```

## Getting Help

### Documentation
1. **README.md** - Quick start and overview
2. **ARCHITECTURE.md** - Detailed patterns and examples
3. **This file** - Contributing guidelines

### Example Code
- Look at the `features/auth/` directory
- See how components, hooks, and state work together
- Follow the same patterns

### Code Review Checklist
- [ ] TypeScript types are explicit
- [ ] Tests are included
- [ ] Code is linted and formatted
- [ ] Feature follows established patterns
- [ ] Documentation is updated
- [ ] No business logic in components
- [ ] Server data uses RTK Query
- [ ] Primitives remain policy-free

## Questions?

If you're unsure about:
- **Structure**: Check `features/auth/` example
- **Patterns**: Read ARCHITECTURE.md
- **Conventions**: Follow existing code style
- **Testing**: Look at existing tests

Remember: Consistency is more important than perfection. Follow the established patterns even if you'd prefer a different approach.
