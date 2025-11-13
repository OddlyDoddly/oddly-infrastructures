# Oddly React Frontend Infrastructure v1.0.0

A pragmatic, scalable frontend infrastructure template inspired by Domain-Driven Design (DDD) and clean architecture principles. Optimized for small, composable components and feature-oriented organization.

## 🎯 Overview

This template provides a production-ready React application structure that emphasizes:

- **Feature-first architecture** ("slice by feature") with thin cross-cutting layers
- **Small, pure UI components** with logic in hooks, selectors, and RTK Query
- **Single source of truth** via Redux Toolkit for client state and RTK Query for server cache
- **Design tokens** via CSS variables with Tailwind consuming tokens for consistent theming
- **Colocation** of tests, types, hooks, and assets next to the features they serve
- **Strict TypeScript** + ESLint + Prettier + comprehensive testing

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Concepts](#key-concepts)
- [Development Workflow](#development-workflow)
- [Testing Strategy](#testing-strategy)
- [Styling System](#styling-system)
- [Best Practices](#best-practices)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
# Type check + build
npm run build

# Preview production build
npm run preview
```

## 🛠 Tech Stack

### Core
- **React 18.3+** - UI library
- **TypeScript 5.3+** - Type safety
- **Vite 5+** - Build tool and dev server

### State Management
- **Redux Toolkit 2.2+** - Client state management
- **RTK Query** - Server state/cache management
- **React Redux 9+** - React bindings for Redux

### Routing
- **React Router 6.22+** - Client-side routing

### Styling
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **tailwindcss-animate** - Animation utilities
- **class-variance-authority** - Variant-based component APIs
- **clsx** - Conditional class names

### Forms & Validation
- **react-hook-form 7.50+** - Form state management
- **zod 3.22+** - Schema validation
- **@hookform/resolvers** - zod integration

### Testing
- **Vitest 1.3+** - Test runner
- **Testing Library** - Component testing
- **@vitest/ui** - Test UI
- **@vitest/coverage-v8** - Coverage reporting

### Code Quality
- **ESLint 8+** - Linting
- **Prettier 3+** - Code formatting
- **TypeScript** - Type checking

## 📁 Project Structure

```
src/
├── app/                    # Application core
│   ├── store.ts           # Redux store configuration
│   ├── providers/         # AppProviders (Redux, Router)
│   ├── routes/            # Route configuration
│   ├── hooks/             # App-level hooks (typed dispatch/selector)
│   └── types/             # App-level types
│
├── shared/                # Shared/reusable code
│   ├── ui/                # UI primitives (organized by family)
│   │   ├── buttons/       # Button, IconButton
│   │   ├── inputs/        # Input, Select, Checkbox
│   │   ├── forms/         # Form, FormField
│   │   ├── cards/         # Card components
│   │   ├── overlays/      # Dialog, Drawer, Tooltip
│   │   ├── layout/        # Container, Stack, Grid
│   │   └── feedback/      # Spinner, Toast, Alert
│   ├── hooks/             # Generic reusable hooks
│   ├── lib/               # Utility functions (cn, formatters)
│   ├── api/               # Base API configuration (RTK Query)
│   ├── constants/         # App constants
│   └── icons/             # Icon components
│
├── features/              # Feature modules (domain-driven)
│   └── auth/              # Example: Authentication feature
│       ├── index.ts       # Feature public API
│       ├── model/         # State management
│       │   ├── auth-slice.ts      # Redux slice
│       │   ├── auth-selectors.ts  # State selectors
│       │   └── auth-types.ts      # Domain types
│       ├── api/           # Server communication
│       │   └── auth-api.ts        # RTK Query endpoints
│       ├── ui/            # Feature UI components
│       │   └── LoginForm.tsx
│       ├── pages/         # Route-bound containers
│       │   └── LoginPage.tsx
│       ├── hooks/         # Feature-specific hooks
│       │   └── use-auth.ts
│       └── tests/         # Feature tests
│           └── auth-slice.test.ts
│
├── styles/                # Global styles and design tokens
│   ├── globals.css        # Tailwind directives + resets
│   ├── tokens.css         # CSS variables (design tokens)
│   └── themes.css         # Theme overrides (light/dark/brand)
│
├── App.tsx                # Root component
├── main.tsx               # Entry point
└── vite-env.d.ts          # Vite type declarations

public/                    # Static assets
tests/                     # Test configuration and utilities
  └── setup.ts             # Test setup
```

## 🔑 Key Concepts

### Feature-First Organization

Each feature is self-contained with its own:
- **model/** - Redux slice, selectors, types (client state)
- **api/** - RTK Query endpoints (server state)
- **ui/** - Presentational components
- **pages/** - Route-bound containers
- **hooks/** - Feature-specific hooks
- **tests/** - Unit and integration tests

Features expose a public API via `index.ts` and keep internals private.

### State Management Layers

**Client State (Redux Toolkit)**
- Transient UI state that needs to be shared
- User preferences, UI mode, filters
- Lives in feature `model/` directories

**Server State (RTK Query)**
- Data fetched from APIs
- Cached, invalidated, and refetched automatically
- Lives in feature `api/` directories

**Local Component State**
- Transient UI (hover, focus, form input)
- Use React `useState` when state doesn't need sharing

### UI Component Hierarchy

**Primitives** (`shared/ui/`)
- Lowest-level building blocks
- Policy-free, highly reusable
- Accept variants via CVA
- Examples: Button, Input, Card

**Feature UI** (`features/*/ui/`)
- Feature-specific compositions
- May have business logic connections
- Examples: LoginForm, UserProfile

**Pages** (`features/*/pages/`)
- Route-bound containers
- Orchestrate data fetching and UI assembly
- Examples: LoginPage, DashboardPage

### Design Token System

All design tokens defined as CSS variables in `styles/tokens.css`:
- Colors (HSL format for Tailwind opacity modifiers)
- Typography (sizes, line heights)
- Spacing scale
- Border radii
- Shadows
- Animation durations
- Z-index scale

Tailwind config consumes these tokens for consistent theming.

Theme switching via `[data-theme]` attribute on `<html>`.

## 🔄 Development Workflow

### Creating a New Feature

```bash
# Create feature directory structure
mkdir -p src/features/photos/{model,api,ui,pages,hooks,tests}

# Create necessary files
touch src/features/photos/index.ts
touch src/features/photos/model/photos-slice.ts
touch src/features/photos/model/photos-selectors.ts
touch src/features/photos/model/photos-types.ts
touch src/features/photos/api/photos-api.ts
```

### Adding a New UI Component

```bash
# Create component in appropriate family
touch src/shared/ui/buttons/IconButton.tsx

# Export from family index
# Add to src/shared/ui/buttons/index.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

## 🧪 Testing Strategy

### Unit Tests
- Redux slices and selectors
- Pure utility functions
- Business logic in hooks
- **Location**: Co-located with tested code

### Component Tests
- UI primitives in `shared/ui/`
- Feature UI components
- User interactions
- **Tool**: Testing Library

### Integration Tests
- Feature flows (login → dashboard)
- API integration with mocked handlers
- Multi-component interactions

### Test Structure

```typescript
// Example: auth-slice.test.ts
import { describe, it, expect } from 'vitest'
import authReducer, { setCredentials } from '../model/auth-slice'

describe('authSlice', () => {
  it('should handle setCredentials', () => {
    const actual = authReducer(initialState, setCredentials(payload))
    expect(actual.isAuthenticated).toBe(true)
  })
})
```

## 🎨 Styling System

### Using Tailwind with Tokens

```tsx
// Component uses Tailwind classes
// Tailwind consumes CSS variables from tokens.css
<button className="bg-primary text-primary-foreground rounded-md">
  Click me
</button>
```

### Creating Variant-Based Components

```tsx
import { cva } from 'class-variance-authority'
import { cn } from '@/shared/lib/cn'

const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      intent: {
        primary: 'bg-primary text-primary-foreground',
        ghost: 'bg-transparent hover:bg-accent',
      },
      size: {
        sm: 'h-8 px-3',
        lg: 'h-10 px-5',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
)

export function Button({ intent, size, className, ...props }) {
  return (
    <button 
      className={cn(buttonVariants({ intent, size }), className)}
      {...props} 
    />
  )
}
```

### Theme Switching

```typescript
// Toggle theme
document.documentElement.setAttribute('data-theme', 'dark')

// Available themes: light (default), dark, emerald, purple
// Define new themes in styles/themes.css
```

## ✅ Best Practices

### State Management
- Use **RTK Query** for server data, not Redux slices
- Keep Redux slices minimal - only shared client state
- Prefer local component state when possible
- Create memoized selectors for derived data

### Component Design
- Keep components small and focused
- Extract logic to hooks
- Use composition over complex props
- Make primitives policy-free

### TypeScript
- Enable strict mode (already configured)
- Define explicit types, avoid `any`
- Use type inference where clear
- Co-locate types with features

### Performance
- Use React.memo sparingly - profile first
- Implement list virtualization for large lists
- Code-split routes with lazy loading
- Leverage RTK Query caching

### Code Organization
- Follow the feature-first structure
- Keep shared code truly generic
- Co-locate related files
- Use barrel exports (`index.ts`) for clean imports

### Naming Conventions
- **Files**: `kebab-case.tsx`
- **Components**: `PascalCase`
- **Hooks**: `useCamelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types**: `PascalCase`

## 📚 Additional Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [React Documentation](https://react.dev)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Testing Library Documentation](https://testing-library.com)

## 📝 License

This template is provided as-is for use in your projects.

---

**Version**: 1.0.0  
**Last Updated**: 2024
