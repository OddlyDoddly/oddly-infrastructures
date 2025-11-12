# Frontend Infrastructure Templates

This directory contains frontend infrastructure templates implementing Domain-Driven Design (DDD) principles adapted for client-side applications.

## Purpose

These templates serve as:
1. **Starting Points** - Copy to new projects for consistent structure
2. **Reference Implementations** - Learn how frontend DDD patterns work
3. **AI Training Data** - Help AI agents understand expected frontend structure
4. **Pattern Libraries** - See how architectural patterns connect in React applications

## Available Templates

### ✅ React + Redux + Tailwind (v1.0.0)
**Status**: Complete

**Location**: `./oddly-react-frontend-v1.0.0/`

**Features**:
- Feature-first architecture (slice by feature)
- Redux Toolkit + RTK Query for state management
- Design token system with CSS variables
- Tailwind CSS for styling
- TypeScript strict mode
- Comprehensive testing setup (Vitest + Testing Library)
- Complete auth feature example
- Extensive documentation (README + ARCHITECTURE)

**Technologies**:
- React 18.3+
- TypeScript 5.3+
- Redux Toolkit 2.2+ / RTK Query
- React Router 6.22+
- Tailwind CSS 3.4+
- Vite 5+
- Vitest 1.3+

[📖 View React Documentation](./oddly-react-frontend-v1.0.0/README.md)

### ⏳ Vue + Pinia + Tailwind
**Status**: Pending

**Planned Features**:
- Composition API with TypeScript
- Pinia for state management
- Similar feature-first structure
- Design token system
- Vue Router

### ⏳ Angular + NgRx + Tailwind
**Status**: Pending

**Planned Features**:
- Standalone components
- NgRx for state management
- Similar feature-first structure
- Design token system
- Angular Router

## Shared Frontend Patterns

All frontend templates implement these core patterns:

### 1. Feature-First Organization
```
features/
  auth/
    ├── model/      # State management (client state)
    ├── api/        # Server communication (server cache)
    ├── ui/         # Feature components
    ├── pages/      # Route containers
    ├── hooks/      # Feature logic
    └── tests/      # Feature tests
```

### 2. State Management Layers
- **Client State**: Shared UI state (filters, preferences, UI mode)
- **Server Cache**: Data from APIs (users, posts, photos)
- **Local State**: Transient UI (hover, focus, form input)

### 3. UI Component Hierarchy
```
┌─────────────────────────────────────┐
│  Pages (Route containers)           │ ← Orchestrate data + navigation
├─────────────────────────────────────┤
│  Feature UI (Domain components)     │ ← Business logic connections
├─────────────────────────────────────┤
│  Primitives (Reusable components)   │ ← Policy-free building blocks
└─────────────────────────────────────┘
```

### 4. Design Token System
All templates use CSS variables for design tokens:
- Colors (semantic naming)
- Typography (sizes, line heights)
- Spacing scale
- Border radii
- Shadows
- Animation durations
- Z-index scale

**Benefits**:
- Runtime theme switching
- Consistent design language
- Easy white-labeling
- Framework-agnostic

### 5. Data Flow Pattern
```
User Interaction
    ↓
UI Component
    ↓
Hook/Service
    ↓
State Management
    ↓
Selector/Computed
    ↓
UI Component (re-render)
```

## Directory Structure Pattern

All frontend templates follow this structure:

```
template/
├── README.md                    # Quick start guide
├── ARCHITECTURE.md              # Detailed architecture docs
├── src/
│   ├── app/                    # Application core
│   │   ├── store               # State management setup
│   │   ├── providers/          # Context providers
│   │   ├── routes/             # Route configuration
│   │   └── hooks/              # App-level hooks
│   ├── shared/                 # Reusable code
│   │   ├── ui/                # UI primitives (by family)
│   │   ├── hooks/             # Generic hooks
│   │   ├── lib/               # Utilities
│   │   ├── api/               # Base API config
│   │   └── constants/         # App constants
│   ├── features/              # Feature modules
│   │   └── {feature}/
│   │       ├── model/        # State (what)
│   │       ├── api/          # Server (where)
│   │       ├── ui/           # Components (how)
│   │       ├── pages/        # Containers
│   │       ├── hooks/        # Logic
│   │       └── tests/        # Tests
│   └── styles/               # Global styles
│       ├── globals           # Framework styles + resets
│       ├── tokens            # Design tokens
│       └── themes            # Theme overrides
└── tests/                    # Test configuration
```

## Naming Conventions

### Files
- **Components**: `PascalCase.tsx` (e.g., `LoginForm.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-auth.ts`)
- **State files**: `{feature}-slice.ts`, `{feature}-store.ts`
- **API files**: `{feature}-api.ts`
- **Tests**: `{name}.test.ts(x)`

### Exports
- **Components**: Named export matching file
- **Hooks**: Named export with `use` prefix
- **Types**: Named export (e.g., `export interface UserModel`)

### Functions
- **Components**: PascalCase
- **Hooks**: camelCase with `use` prefix
- **Utilities**: camelCase
- **Event handlers**: `handle{Event}`

## Key Principles

### 1. Feature-First Organization
> "Code that changes together, lives together."

Group by feature (vertical slices) rather than technical concern (horizontal layers).

### 2. Separation of Concerns
Each layer has clear responsibility:
- **Pages**: Route-bound, orchestrate data
- **Feature UI**: Business logic connections
- **Primitives**: Policy-free, reusable
- **State**: Client state vs server cache

### 3. Explicit Boundaries
- **API Boundary**: DTOs ↔ Domain models
- **Component Boundary**: Props ↔ Internal state
- **Feature Boundary**: Public API via index file

### 4. Colocation
Place code near where it's used:
- Tests next to tested code
- Types next to implementation
- Styles via framework (co-located)

### 5. Type Safety
- Strict TypeScript throughout
- Typed state management
- Schema validation for forms
- Type-safe routing

## Testing Strategy

All templates include:

### Unit Tests
- State management logic
- Pure utility functions
- Business logic in hooks
- Location: Co-located with code

### Component Tests
- UI primitives
- Feature components
- User interactions
- Tool: Testing Library

### Integration Tests
- Feature flows
- API integration (mocked)
- Multi-component interactions

## Performance Patterns

All templates implement:

1. **Code Splitting**: Lazy-loaded routes
2. **Memoization**: Computed values, derived state
3. **Virtualization**: Large lists (when needed)
4. **Caching**: Server data caching
5. **Optimistic Updates**: Better UX

## Getting Started

### For New Projects

1. **Choose your framework**: Select the appropriate template
2. **Read the README**: Understand the quick start
3. **Read ARCHITECTURE.md**: Understand detailed patterns
4. **Copy the template**: Clone to your project
5. **Install dependencies**: Run package manager install
6. **Configure environment**: Set API base URL, etc.
7. **Start developing**: Follow example feature patterns

### Example Workflow

```bash
# Copy template
cp -r oddly-react-frontend-v1.0.0 ~/my-new-project

# Navigate and install
cd ~/my-new-project
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development
npm run dev
```

## Example Implementations

Each template includes complete example implementations:

- ✅ **Auth Feature** - Login, logout, authentication
- ✅ **State Management** - Redux slice with selectors
- ✅ **API Integration** - RTK Query endpoints
- ✅ **Feature Hook** - Orchestration pattern
- ✅ **UI Components** - Forms, pages, layouts
- ✅ **Primitives** - Buttons, inputs, cards
- ✅ **Design Tokens** - CSS variables system
- ✅ **Theme Switching** - Light/dark themes
- ✅ **Testing** - Unit tests for state

## Communication Patterns

### Frontend ↔ Backend
- **REST API** for CRUD operations
- **WebSockets** for real-time updates (optional)
- **GraphQL** as alternative (if using)

### Frontend State Layers
- **Client State**: UI mode, preferences
- **Server Cache**: API data (automatic)
- **Local State**: Component-specific

### Cross-Feature Communication
- **Events**: Custom events for loose coupling
- **Shared State**: Via state management
- **URL State**: Query params, route state

## Production Checklist

Before deploying:

- [ ] Configure production API endpoint
- [ ] Enable production build optimizations
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics
- [ ] Implement proper authentication flow
- [ ] Add loading states and error boundaries
- [ ] Test responsive design
- [ ] Verify accessibility (WCAG compliance)
- [ ] Optimize bundle size
- [ ] Set up CDN for static assets
- [ ] Configure CSP headers
- [ ] Enable HTTPS only
- [ ] Add meta tags for SEO
- [ ] Test cross-browser compatibility
- [ ] Set up monitoring/observability

## Best Practices

### State Management
- Use server cache for API data
- Keep client state minimal
- Prefer local state when possible
- Create derived state via selectors

### Component Design
- Keep components small and focused
- Extract logic to hooks
- Use composition over props
- Make primitives policy-free

### Performance
- Profile before optimizing
- Use framework devtools
- Implement code splitting
- Virtualize large lists

### Code Organization
- Follow feature-first structure
- Keep shared code truly generic
- Co-locate related files
- Use barrel exports for clean imports

## Contributing

When adding new frontend templates:

1. Follow the same structure pattern
2. Implement all core patterns
3. Include complete example feature
4. Write comprehensive documentation
5. Add README and ARCHITECTURE docs
6. Ensure it builds successfully
7. Update this overview README

## Support

For questions about:
- **Architecture**: Read ARCHITECTURE.md in each template
- **Usage**: Read README.md in each template
- **Patterns**: Review the example implementations
- **Standards**: Check the agent instructions

## Comparison with Backend Templates

### Similarities
- Feature-first organization
- Clear separation of concerns
- Explicit boundaries and mappings
- Type safety throughout
- Comprehensive testing

### Differences
- **State**: Client state vs server cache (not database)
- **Communication**: HTTP client (not HTTP server)
- **Rendering**: Component tree (not request/response)
- **Deployment**: Static hosting (not application server)

## License

These templates are provided as-is for use in your projects.

---

**Current Status**: React template complete. Vue and Angular templates pending.
