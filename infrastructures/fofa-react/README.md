# FOFA React Infrastructure

**Front-end Opinionated Feature-first Architecture (FOFA) for React Applications**

This infrastructure provides a complete, production-ready template for building scalable React applications using feature-first architecture, strict TypeScript, Redux Toolkit, and Tailwind CSS.

## 🎯 Purpose

This template serves as:
1. **Starting Point** - Copy to new projects for consistent structure
2. **Reference Implementation** - Learn how FOFA patterns work
3. **AI Training Data** - Help AI agents understand expected structure
4. **Pattern Library** - See how architectural patterns connect

## ✨ Key Features

- ✅ **Feature-First Architecture** - Organized by features, not technical layers
- ✅ **WebClient Pattern** - ALL HTTP requests through dedicated WebClient classes
- ✅ **Redux Toolkit + RTK Query** - Modern state management and server caching
- ✅ **Strict TypeScript** - Type safety throughout
- ✅ **Design Tokens** - CSS variables consumed by Tailwind
- ✅ **Policy-Free Primitives** - Reusable UI components in `shared/ui/`
- ✅ **React Router** - Client-side routing with lazy loading
- ✅ **Vitest + Testing Library** - Modern testing setup
- ✅ **Complete Example Feature** - Full implementation showing all patterns

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Installation

```bash
# 1. Copy this template to your project
cp -r infrastructures/fofa-react my-new-project
cd my-new-project

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your API URLs

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:5173
```

### Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Lint code
npm run test        # Run tests
npm run test:watch  # Run tests in watch mode
npm run type-check  # Check TypeScript types
```

## 📁 Project Structure

```
fofa-react/
├── src/
│   ├── app/                      # Application-level configuration
│   │   ├── store.ts             # Redux store setup
│   │   ├── providers/           # React providers (Redux, Theme, etc.)
│   │   ├── routes/              # Route configuration
│   │   ├── hooks/               # App-level hooks (useAppDispatch, etc.)
│   │   └── types/               # Global type definitions
│   │
│   ├── shared/                   # Shared resources
│   │   ├── ui/                  # Policy-free primitive components
│   │   │   ├── buttons/         # Button variants
│   │   │   ├── inputs/          # Input components
│   │   │   ├── forms/           # Form field components
│   │   │   ├── menus/           # Menu/dropdown components
│   │   │   ├── cards/           # Card components
│   │   │   ├── overlays/        # Modal, dialog components
│   │   │   ├── layout/          # Layout components
│   │   │   └── feedback/        # Alert, spinner, toast
│   │   │
│   │   ├── webclients/          # ⚠️ ALL HTTP communication
│   │   │   ├── infra/           # Base abstractions
│   │   │   └── {service}/       # Per-service webclients
│   │   │       ├── {Service}WebClient.ts
│   │   │       ├── requests/    # Axios calls (ONLY here)
│   │   │       └── responses/   # Response type interfaces
│   │   │
│   │   ├── hooks/               # Shared custom hooks
│   │   ├── lib/                 # Utility functions
│   │   ├── api/                 # RTK Query base API
│   │   ├── constants/           # Shared constants
│   │   └── icons/               # Icon components
│   │
│   ├── features/                 # Feature slices
│   │   └── {feature}/           # Each feature is self-contained
│   │       ├── index.ts         # Public API exports
│   │       ├── routes.tsx       # Feature routes
│   │       ├── model/           # Redux slice & types
│   │       │   ├── {feature}.slice.ts
│   │       │   ├── {feature}.selectors.ts
│   │       │   └── {feature}.types.ts
│   │       ├── api/             # RTK Query endpoints
│   │       │   └── {feature}.api.ts
│   │       ├── ui/              # Presentational components
│   │       ├── pages/           # Route pages
│   │       ├── hooks/           # Feature-specific hooks
│   │       └── tests/           # Feature tests
│   │
│   ├── styles/                   # Global styles
│   │   ├── globals.css          # Global CSS + Tailwind imports
│   │   └── tokens.css           # Design tokens (CSS variables)
│   │
│   └── test/                     # Test setup
│       └── setup.ts             # Vitest configuration
│
├── public/                       # Static assets
├── index.html                    # HTML entry point
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config (uses design tokens)
├── vite.config.ts                # Vite config
└── README.md                     # This file
```

## 🏗️ Core Architecture Patterns

### 1. WebClient Pattern (MANDATORY)

**ALL HTTP communication follows this pattern:**

```
Component/Hook → RTK Query → WebClient → Request Function → Axios
```

**Structure:**
```
shared/webclients/{service}/
  {Service}WebClient.ts    # Class with public methods
  {Service}Error.ts        # Custom error class
  requests/                # Axios calls ONLY here
    {Action}Request.ts
  responses/               # Data-only interfaces
    {Action}Response.ts
```

**Example:**
```typescript
// WebClient class (NO Axios calls)
export class ExampleApiWebClient {
  async getItems(): Promise<ItemResponse[]> {
    return await getItemsRequest(this.baseUrl, this.authToken);
  }
}

// Request function (Axios calls ONLY here)
export async function getItemsRequest(baseUrl: string, token: string | null) {
  const response = await axios.get(`${baseUrl}/items`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

// RTK Query (uses WebClient)
export const itemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      queryFn: async () => {
        const data = await exampleApiClient.getItems();
        return { data };
      },
    }),
  }),
});
```

### 2. Feature-First Organization

Each feature is self-contained with all its layers:
- **model/** - Redux slice, selectors, types
- **api/** - RTK Query endpoints (uses WebClient)
- **ui/** - Presentational components
- **pages/** - Route containers
- **hooks/** - Feature-specific hooks
- **tests/** - Feature tests

### 3. State Management Rules

- **Local State** - Transient UI (open/close, hover)
- **Redux Slice** - Cross-component business data
- **RTK Query** - Server data (cache layer)

### 4. Component Hierarchy

1. **Pages** - Route containers, orchestrate data
2. **Feature UI** - Presentational, accept props
3. **Primitives** - `shared/ui/` building blocks (policy-free)

### 5. Design Tokens System

**All design values defined as CSS variables:**

```css
/* tokens.css */
:root {
  --color-primary: 222 90% 56%;
  --radius-md: 0.5rem;
}

/* Consumed by Tailwind */
// tailwind.config.ts
colors: {
  primary: 'hsl(var(--color-primary))',
}
```

## 📖 Example Implementation

The `example` feature demonstrates all patterns:

### Feature Structure
```
features/example/
├── index.ts                          # Public exports
├── routes.tsx                        # Route definitions
├── model/
│   ├── example.slice.ts             # Redux slice
│   ├── example.selectors.ts         # State selectors
│   └── example.types.ts             # Type definitions
├── api/
│   └── example.api.ts               # RTK Query endpoints
├── ui/
│   ├── ExampleItemCard.tsx          # Item card component
│   └── ExampleItemList.tsx          # List component
├── pages/
│   └── ExamplePage.tsx              # Main page
└── tests/
    └── example.slice.test.ts        # Slice tests
```

### WebClient Implementation
```
shared/webclients/example-api/
├── ExampleApiWebClient.ts           # WebClient class
├── ExampleApiError.ts               # Error class
├── requests/
│   ├── GetExampleItemsRequest.ts    # GET request (Axios here)
│   └── CreateExampleItemRequest.ts  # POST request (Axios here)
└── responses/
    └── ExampleItemResponse.ts       # Response interface
```

## 🎨 UI Components

### Available Primitives

All primitives are policy-free and located in `shared/ui/`:

**Buttons:**
- `Button` - With intent (primary, secondary, destructive, outline, ghost, link) and size variants

**Inputs:**
- `Input` - Text input with error state
- `Label` - Form label with required indicator
- `FormField` - Field wrapper with spacing
- `FormError` - Error message display
- `FormDescription` - Helper text

**Cards:**
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

**Feedback:**
- `Alert` - Contextual messages (default, destructive, success, warning, info)
- `Spinner` - Loading indicator

**Menus:**
- `Menu`, `MenuItem`, `MenuSeparator`, `MenuLabel`

**Overlays:**
- `Modal`, `ModalHeader`, `ModalTitle`, `ModalContent`, `ModalFooter`

**Layout:**
- `Container` - Max-width container with responsive padding

### Usage Example

```tsx
import { Button } from '@/shared/ui/buttons';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/cards';
import { Alert } from '@/shared/ui/feedback';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert intent="success">Operation successful!</Alert>
        <Button intent="primary" size="md">
          Click Me
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 🧪 Testing

### Test Structure

Tests are colocated with features:
```
features/example/tests/
  example.slice.test.ts      # Redux slice tests
  ExamplePage.test.tsx       # Component tests
```

### Running Tests

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:ui           # Open Vitest UI
```

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import exampleReducer, { selectItem } from '../model/example.slice';

describe('exampleSlice', () => {
  it('should handle selectItem', () => {
    const state = exampleReducer(undefined, selectItem('item-123'));
    expect(state.selectedItemId).toBe('item-123');
  });
});
```

## 🔐 Environment Variables

Configure in `.env`:

```env
VITE_EXAMPLE_API_URL=https://api.example.com
```

Access in code:
```typescript
import.meta.env.VITE_EXAMPLE_API_URL
```

## 📝 Adding a New Feature

1. **Create feature structure:**
```bash
mkdir -p src/features/my-feature/{model,api,ui,pages,hooks,tests}
```

2. **Create Redux slice** (`model/my-feature.slice.ts`)
3. **Add selectors** (`model/my-feature.selectors.ts`)
4. **Create types** (`model/my-feature.types.ts`)
5. **Add RTK Query endpoints** (`api/my-feature.api.ts`)
6. **Build UI components** (`ui/`)
7. **Create pages** (`pages/MyFeaturePage.tsx`)
8. **Define routes** (`routes.tsx`)
9. **Export public API** (`index.ts`)
10. **Register in store** (`app/store.ts`)
11. **Add to router** (`app/routes/index.tsx`)

## 🌐 Adding a New WebClient

1. **Create structure:**
```bash
mkdir -p src/shared/webclients/my-api/{requests,responses}
```

2. **Create error class** (`MyApiError.ts`)
3. **Define responses** (`responses/MyResponse.ts`)
4. **Create requests** (`requests/MyRequest.ts` - Axios here)
5. **Build WebClient** (`MyApiWebClient.ts`)
6. **Use in RTK Query** (`features/.../api/`)

## 🚨 Critical Rules

### ✅ MUST DO:
- Use WebClient for ALL HTTP requests
- Place Axios calls ONLY in Request functions
- Define WebClients in `shared/webclients/`
- Keep UI primitives policy-free
- Use design tokens (CSS variables)
- Follow feature-first structure
- Use Tailwind (no hardcoded colors)
- Use Redux Toolkit for client state
- Use RTK Query for server cache

### ❌ NEVER DO:
- HTTP calls directly in components/hooks
- Axios outside Request functions
- WebClient with inline Axios calls
- Response types with methods
- Business logic in UI components
- Feature policy in shared/ui primitives
- Hardcoded colors
- Using fetch API (use Axios)

## 📚 Additional Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)

## 🤝 Contributing

When extending this infrastructure:
1. Follow existing patterns
2. Keep components small (<150 lines)
3. Write tests for slices and critical UI
4. Document new patterns
5. Update this README

## 📄 License

This infrastructure is provided as-is for use in your projects.

---

**Status**: Complete infrastructure ready for use.
**Version**: 1.0.0
