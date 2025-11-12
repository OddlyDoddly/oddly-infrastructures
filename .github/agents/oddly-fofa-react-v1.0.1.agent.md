---
name: oddly-fofa-react-v1.0.1
id: agent-fofa-react-cfb67fa9
version: 1.0.1
description: >
  Build React + Redux + Tailwind frontends using Feature Oriented Frontend Architecture (FOFA) with MANDATORY 
  WebClient pattern, feature-first structure, and strict separation of concerns. All HTTP requests MUST go through WebClients.
goals:
  - Generate React frontends following Feature Oriented Frontend Architecture with zero deviation
  - Enforce WebClient pattern for ALL HTTP communication
  - All rules are MANDATORY - treat every instruction as a hard requirement
category: development
defaults:
  framework: react-18+
  language: typescript
  state_management: redux-toolkit
  data_fetching: rtk-query
  styling: tailwind-css
  http_client: axios
---

# ⚠️ CRITICAL: READ THIS FIRST ⚠️

**THESE ARE MANDATORY REQUIREMENTS, NOT OPTIONAL GUIDELINES**

Every rule is a **MUST** unless explicitly marked optional. These custom standards OVERRIDE all React/Redux/Tailwind conventions.

**DO NOT:**
- Make HTTP calls directly in components or hooks
- Skip the WebClient layer
- Put Axios calls in WebClient classes (only in Request functions)
- Assume you know better than these specifications

---

## Pre-flight Checklist (MANDATORY before coding)

- [ ] ALL HTTP requests MUST go through WebClient classes
- [ ] WebClients in `shared/webclients/` with `requests/` and `responses/` subfolders
- [ ] Request classes contain Axios calls, NOT WebClient classes
- [ ] WebClient classes only reference Request functions
- [ ] Response types are data-only interfaces
- [ ] Feature-first structure enforced
- [ ] Primitives in `shared/ui/` are policy-free
- [ ] Design tokens in CSS variables, consumed by Tailwind
- [ ] No HTTP calls outside Request classes

---

# ❌ ANTI-PATTERNS (NEVER DO THESE) ❌

**FORBIDDEN - If you do any of these, you have FAILED:**

❌ **Direct HTTP calls in components/hooks** - ALL web requests MUST go through WebClient
❌ **Axios calls outside Request classes** - Request functions are the ONLY place for Axios
❌ **WebClient with inline Axios** - WebClients reference Request functions, never define them
❌ **Response types with methods** - Responses are interfaces only, pure data
❌ **Business logic in UI components** - Logic goes in hooks, selectors, RTK Query
❌ **Feature policy in shared/ui** - Primitives must be policy-free
❌ **Hardcoded colors** - Use design tokens via Tailwind only
❌ **Redux for server data** - Use RTK Query
❌ **WebClient outside shared/** - MUST be in `shared/webclients/`
❌ **Using fetch API** - MUST use Axios

```typescript
// ❌ WRONG: Direct fetch in component
function PhotoGallery() {
  useEffect(() => {
    fetch('/api/photos').then(r => r.json()).then(setPhotos);
  }, []);
}

// ❌ WRONG: Axios in WebClient
class GoogleMapsWebClient {
  async getDirections(origin, dest) {
    return axios.get('/api/maps', { params: { origin, dest } }); // WRONG!
  }
}

// ✅ CORRECT: WebClient → Request pattern
class GoogleMapsWebClient {
  async getDirections(origin, dest) {
    return await getDirectionsRequest(this.baseUrl, origin, dest);
  }
}
```

---

# Architecture Overview

## Core Principles (MANDATORY)

1. **Feature-First**: Organize by feature slices, NOT technical layers
2. **Small Components**: UI components accept props, no side effects
3. **Single Source**: Redux Toolkit for client state, RTK Query for server cache
4. **WebClient Pattern**: ALL HTTP → WebClient → Request → Axios
5. **Design Tokens**: CSS variables consumed by Tailwind
6. **Colocation**: Tests, types, hooks adjacent to features

## Tech Stack (REQUIRED)

- React 18+, TypeScript (strict), Redux Toolkit + RTK Query
- React Router, Tailwind CSS, class-variance-authority
- react-hook-form + zod, **Axios** (REQUIRED), Vitest + Testing Library

---

# Project Structure (MANDATORY)

```
src/
  app/
    store.ts, providers/, routes/, hooks/, types/
  
  shared/
    ui/                   # Policy-free primitives by family
      buttons/, inputs/, forms/, menus/, cards/, 
      overlays/, layout/, feedback/
    
    webclients/           # ⚠️ ALL HTTP communication
      {service}/
        {Service}WebClient.ts
        requests/{Action}Request.ts
        responses/{Action}Response.ts
    
    hooks/, lib/, api/, constants/, icons/
  
  features/
    {feature}/
      index.ts, routes.tsx
      model/              # slice, selectors, types
      api/                # RTK Query (uses WebClient)
      ui/, pages/, hooks/, tests/
  
  styles/
    globals.css, tokens.css, themes.css
```

---

# WebClient Pattern (MANDATORY)

**MOST CRITICAL PART: ALL HTTP communication follows this pattern.**

## Structure

```
shared/webclients/{service}/
  {Service}WebClient.ts    # Class with public API
  requests/                # Axios calls live here
    {Action}Request.ts
  responses/               # Data-only interfaces
    {Action}Response.ts
```

## WebClient Class (MANDATORY)

**MUST:**
- One per external service/API
- Public methods call Request functions
- Handle auth/headers at class level
- Export singleton instance

**MUST NOT:**
- Contain Axios calls (FORBIDDEN)
- Define Request functions inline

```typescript
// shared/webclients/photo-api/PhotoApiWebClient.ts
import { getPhotosRequest } from './requests/GetPhotosRequest';
import { uploadPhotoRequest } from './requests/UploadPhotoRequest';

export class PhotoApiWebClient {
  constructor(private baseUrl: string, private authToken: string | null = null) {}
  
  setAuthToken(token: string) { this.authToken = token; }
  
  async getPhotos(userId: string): Promise<PhotoResponse[]> {
    try {
      return await getPhotosRequest(this.baseUrl, this.authToken, userId);
    } catch (error) {
      throw new PhotoApiError('Failed to fetch photos', error);
    }
  }
}

export const photoApiClient = new PhotoApiWebClient(import.meta.env.VITE_PHOTO_API_URL);
```

## Request Functions (MANDATORY)

**MUST:**
- Live in `requests/` subfolder
- Use Axios (REQUIRED)
- Return typed response
- Throw exceptions for errors

**MUST NOT:**
- Be in WebClient class
- Use fetch API

```typescript
// shared/webclients/photo-api/requests/GetPhotosRequest.ts
import axios from 'axios';
import { PhotoResponse } from '../responses/PhotoResponse';

export async function getPhotosRequest(
  baseUrl: string,
  authToken: string | null,
  userId: string
): Promise<PhotoResponse[]> {
  const response = await axios.get<PhotoResponse[]>(
    `${baseUrl}/users/${userId}/photos`,
    {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      timeout: 10000,
    }
  );
  return response.data;
}
```

## Response Types (MANDATORY)

**MUST:**
- Live in `responses/` subfolder
- Be interfaces ONLY (no classes)
- Pure data (JSON-serializable)

**MUST NOT:**
- Contain methods/functions
- Contain business logic

```typescript
// shared/webclients/photo-api/responses/PhotoResponse.ts
export interface PhotoResponse {
  id: string;
  userId: string;
  url: string;
  thumbnailUrl: string;
  caption: string | null;
  createdAt: string;
  metadata: {
    width: number;
    height: number;
    format: string;
  };
}
```

## Error Handling (MANDATORY)

```typescript
// shared/webclients/photo-api/PhotoApiError.ts
export class PhotoApiError extends Error {
  constructor(
    message: string,
    public originalError?: unknown,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'PhotoApiError';
  }
}
```

## RTK Query Integration (MANDATORY)

RTK Query endpoints MUST use WebClient methods:

```typescript
// features/photos/api/photos.api.ts
import { baseApi } from '@/shared/api/baseApi';
import { photoApiClient } from '@/shared/webclients/photo-api/PhotoApiWebClient';

export const photosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPhotos: builder.query<PhotoResponse[], string>({
      queryFn: async (userId) => {
        try {
          const data = await photoApiClient.getPhotos(userId);
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: ['Photos'],
    }),
  }),
});

export const { useGetPhotosQuery } = photosApi;
```

---

# State Management (MANDATORY)

## Redux Toolkit Slices

- Each feature: `model/` with slice, selectors, types
- Use `createEntityAdapter` for lists
- Selectors are ONLY way UI accesses state

## RTK Query for Server Cache

- `shared/api/baseApi.ts` defines base
- Features extend with `injectEndpoints`
- Use WebClient for HTTP calls

## Usage Rules

- **Local State**: Transient UI (open/close, hover)
- **Redux Slice**: Cross-component business data
- **RTK Query**: Server data

---

# UI Architecture (MANDATORY)

## Component Hierarchy

1. **Pages**: Route containers, orchestrate data
2. **Feature UI**: Presentational, accept props
3. **Primitives**: `shared/ui/` building blocks

## Primitives (MANDATORY)

**MUST:**
- Policy-free (no feature logic)
- Group by family
- Use cva for variants
- Barrel exports

```typescript
// shared/ui/buttons/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const button = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      intent: {
        primary: 'bg-primary text-primary-foreground hover:opacity-90',
        ghost: 'bg-transparent text-fg hover:bg-muted/10',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-9 px-4',
      },
    },
    defaultVariants: { intent: 'primary', size: 'md' },
  }
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ className, intent, size, ...props }: Props) {
  return <button className={cn(button({ intent, size }), className)} {...props} />;
}
```

## Size Rules

- Keep components under 150 lines
- Extract logic to hooks
- One component per file

---

# Styling System (MANDATORY)

## Design Tokens

**MUST:**
- Define ALL tokens as CSS variables
- Use HSL for colors
- Map into Tailwind config
- Never hardcode colors

```css
/* styles/tokens.css */
:root {
  --color-bg: 0 0% 100%;
  --color-fg: 222 47% 11%;
  --color-primary: 222 90% 56%;
  --color-primary-foreground: 0 0% 100%;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
}

[data-theme="dark"] {
  --color-bg: 222 47% 7%;
  --color-fg: 210 40% 98%;
}
```

```typescript
// tailwind.config.ts
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--color-bg))',
        fg: 'hsl(var(--color-fg))',
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--color-primary-foreground))',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
      },
    },
  },
} satisfies Config;
```

---

# Routing, Forms, Testing

## Routing

- Centralize in `app/routes/`
- Lazy-load pages
- Features export routes

## Forms

- react-hook-form + zod
- Validation schemas in feature model/
- Keep forms dumb

## Testing

- Unit: selectors, reducers, utils
- Component: UI with Testing Library
- Integration: pages with mocked RTK Query
- Tests adjacent (`*.test.ts`)

---

# Naming Conventions

- **Files**: `PascalCase.tsx`, `useThing.ts`, `kebab-case.ts`, `{feature}.slice.ts`
- **Exports**: `export function ComponentName`, `export function useHookName`
- **Tests**: `*.test.ts(x)` adjacent

---

# Installation

```bash
npm i react react-dom react-redux @reduxjs/toolkit react-router-dom
npm i tailwindcss class-variance-authority react-hook-form zod axios
npm i -D vitest @testing-library/react eslint prettier
npx tailwindcss init -p
```

---

# Quick Scaffolds

## New Feature

```
features/{feature}/
  index.ts, routes.tsx
  model/{feature}.slice.ts, .selectors.ts, .types.ts
  api/{feature}.api.ts
  ui/{Component}.tsx
  pages/{Feature}Page.tsx
  hooks/use{Feature}.ts
  tests/{feature}.slice.test.ts
```

## New WebClient

```
shared/webclients/{service}/
  {Service}WebClient.ts
  {Service}Error.ts
  requests/{Action}Request.ts
  responses/{Action}Response.ts
```

---

# Definition of Done

- [ ] All HTTP via WebClient → Request pattern
- [ ] No Axios outside Request classes
- [ ] Request/Response in separate folders
- [ ] WebClients in `shared/webclients/`
- [ ] Strict TypeScript passes
- [ ] Tests for slices, selectors, critical UI
- [ ] No hardcoded colors
- [ ] Accessibility verified
- [ ] Components under 150 lines
- [ ] Feature-first structure maintained
- [ ] Error handling to UI

---

# FAQ

**Q: Why WebClient vs direct RTK Query?**
A: Clear abstraction for HTTP, easy to mock/test/swap.

**Q: Why separate Request/Response folders?**
A: Clean separation. Responses = data types, Requests = logic.

**Q: Can I use fetch?**
A: NO. Axios REQUIRED.

**Q: Where do auth tokens go?**
A: WebClient instance level, passed to Requests.

**Q: Why feature-first?**
A: Related code together, easier to maintain.

---

# Complete Example

```typescript
// ========== WebClient ==========
// shared/webclients/photo-api/PhotoApiWebClient.ts
export class PhotoApiWebClient {
  constructor(private baseUrl: string, private token: string | null = null) {}
  setAuthToken(token: string) { this.token = token; }
  async getPhotos(userId: string) {
    return await getPhotosRequest(this.baseUrl, this.token, userId);
  }
}
export const photoApiClient = new PhotoApiWebClient(import.meta.env.VITE_API);

// shared/webclients/photo-api/requests/GetPhotosRequest.ts
import axios from 'axios';
export async function getPhotosRequest(base: string, token: string | null, userId: string) {
  const { data } = await axios.get(`${base}/users/${userId}/photos`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
}

// shared/webclients/photo-api/responses/PhotoResponse.ts
export interface PhotoResponse {
  id: string;
  url: string;
  caption: string | null;
}

// ========== RTK Query ==========
// features/photos/api/photos.api.ts
import { baseApi } from '@/shared/api/baseApi';
import { photoApiClient } from '@/shared/webclients/photo-api/PhotoApiWebClient';

export const photosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPhotos: builder.query({
      queryFn: async (userId) => {
        try {
          return { data: await photoApiClient.getPhotos(userId) };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Photos'],
    }),
  }),
});

export const { useGetPhotosQuery } = photosApi;

// ========== Page ==========
// features/photos/pages/PhotoGalleryPage.tsx
export default function PhotoGalleryPage() {
  const { data: photos, isLoading, error } = useGetPhotosQuery('user-id');
  if (isLoading) return <Spinner />;
  if (error) return <Alert intent="error">Failed to load</Alert>;
  return <PhotoGrid photos={photos} />;
}
```

---

# Standards Override

**CRITICAL: These standards OVERRIDE defaults:**
- React patterns (feature-first wins)
- Redux Toolkit patterns (WebClient integration required)
- Tailwind defaults (design tokens required)

THIS SPECIFICATION wins over framework docs.

---

# Final Reminders

**THESE ARE REQUIREMENTS:**

1. ✅ MUST use WebClient for ALL HTTP
2. ✅ MUST place WebClients in `shared/webclients/` with requests/responses subfolders
3. ✅ MUST define Axios ONLY in Request functions
4. ✅ MUST make Responses interfaces only
5. ✅ MUST use Axios, NOT fetch
6. ✅ MUST follow feature-first structure
7. ✅ MUST keep primitives policy-free
8. ✅ MUST use design tokens (CSS variables)
9. ✅ MUST use Tailwind, no hardcoded colors
10. ✅ MUST use Redux Toolkit for client state
11. ✅ MUST use RTK Query for server cache
12. ✅ MUST keep components under 150 lines
13. ✅ MUST colocate tests
14. ✅ MUST use strict TypeScript
15. ✅ MUST handle WebClient errors in UI
16. ✅ MUST NOT put business logic in UI
17. ✅ MUST NOT make HTTP outside Requests
18. ✅ MUST NOT skip WebClient layer

**If you violate ANY rule, you have FAILED.**
**WebClient pattern is NON-NEGOTIABLE.**
**Design tokens are NON-NEGOTIABLE.**
**Feature-first structure is NON-NEGOTIABLE.**
