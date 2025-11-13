# WebClients Architecture

This directory contains the WebClient architecture for handling all HTTP communication in the application.

## 🎯 Core Principles

1. **NO direct axios calls** anywhere in the application except in Request files
2. **ALL web requests** go through WebClient classes
3. **Request functions** are defined in separate files (not in WebClients)
4. **WebClients** only reference request functions, don't define them
5. **WebClientError** exceptions propagate to UI for user-friendly handling
6. **Response interfaces** are data-only (JSON mapping)
7. **Request functions** compose axios calls with parameters

## 📁 Directory Structure

```
webclients/
├── config/
│   └── axios-config.ts          # Axios instance creation + interceptors
├── errors/
│   └── WebClientError.ts        # Error types + handling
├── requests/                     # Request function files
│   ├── LoginRequest.ts          # executeLoginRequest()
│   ├── RegisterRequest.ts       # executeRegisterRequest()
│   ├── LogoutRequest.ts         # executeLogoutRequest()
│   └── GeocodeRequest.ts        # executeGeocodeRequest()
├── responses/                    # Response interfaces
│   ├── AuthResponses.ts         # LoginResponse, RegisterResponse, etc.
│   └── GoogleMapsResponses.ts   # GeocodeResponse, PlaceDetails, etc.
├── AuthWebClient.ts             # Auth service web client
├── GoogleMapsWebClient.ts       # Google Maps service web client
└── index.ts                     # Public API exports
```

## 🔨 Creating a New WebClient

### Step 1: Define Response Interfaces

Create data-only interfaces in `responses/` that map JSON responses:

```typescript
// responses/MyServiceResponses.ts
export interface MyDataResponse {
  id: string
  name: string
  value: number
}

export interface MyListResponse {
  items: MyDataResponse[]
  total: number
  page: number
}
```

### Step 2: Create Request Functions

Create separate files for each request in `requests/`:

```typescript
// requests/GetMyDataRequest.ts
import { AxiosInstance } from 'axios'
import { MyDataResponse } from '../responses/MyServiceResponses'

export interface GetMyDataRequestParams {
  id: string
}

export async function executeGetMyDataRequest(
  axiosInstance: AxiosInstance,
  params: GetMyDataRequestParams
): Promise<MyDataResponse> {
  const response = await axiosInstance.get<MyDataResponse>(`/mydata/${params.id}`)
  return response.data
}
```

```typescript
// requests/CreateMyDataRequest.ts
import { AxiosInstance } from 'axios'
import { MyDataResponse } from '../responses/MyServiceResponses'

export interface CreateMyDataRequestParams {
  name: string
  value: number
}

export async function executeCreateMyDataRequest(
  axiosInstance: AxiosInstance,
  params: CreateMyDataRequestParams
): Promise<MyDataResponse> {
  const response = await axiosInstance.post<MyDataResponse>('/mydata', {
    name: params.name,
    value: params.value,
  })
  return response.data
}
```

### Step 3: Create WebClient Class

Create a WebClient that **references** request functions (doesn't define axios calls):

```typescript
// MyServiceWebClient.ts
import { AxiosInstance } from 'axios'
import { defaultAxiosInstance } from './config/axios-config'
import {
  executeGetMyDataRequest,
  GetMyDataRequestParams,
} from './requests/GetMyDataRequest'
import {
  executeCreateMyDataRequest,
  CreateMyDataRequestParams,
} from './requests/CreateMyDataRequest'
import { MyDataResponse } from './responses/MyServiceResponses'

export class MyServiceWebClient {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance: AxiosInstance = defaultAxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  /**
   * Get data by ID
   */
  public async getMyData(params: GetMyDataRequestParams): Promise<MyDataResponse> {
    return executeGetMyDataRequest(this.axiosInstance, params)
  }

  /**
   * Create new data
   */
  public async createMyData(params: CreateMyDataRequestParams): Promise<MyDataResponse> {
    return executeCreateMyDataRequest(this.axiosInstance, params)
  }
}

// Default instance
export const myServiceWebClient = new MyServiceWebClient()
```

### Step 4: Export from index.ts

```typescript
// index.ts
export { MyServiceWebClient, myServiceWebClient } from './MyServiceWebClient'
export type { MyDataResponse, MyListResponse } from './responses/MyServiceResponses'
export type { GetMyDataRequestParams } from './requests/GetMyDataRequest'
export type { CreateMyDataRequestParams } from './requests/CreateMyDataRequest'
```

## 🎯 Using WebClients in Features

### In Feature API Layer

```typescript
// features/myfeature/api/myfeature-api.ts
import { myServiceWebClient } from '@/shared/webclients'

export const myFeatureApiService = {
  async getData(id: string) {
    return myServiceWebClient.getMyData({ id })
  },

  async createData(name: string, value: number) {
    return myServiceWebClient.createMyData({ name, value })
  },
}
```

### In Feature Hooks

```typescript
// features/myfeature/hooks/use-myfeature.ts
import { useState, useCallback } from 'react'
import { myFeatureApiService } from '../api/myfeature-api'
import { WebClientError, WebClientErrorCode } from '@/shared/webclients'

export function useMyFeature() {
  const [isLoading, setIsLoading] = useState(false)
  
  const loadData = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const data = await myFeatureApiService.getData(id)
      return data
    } catch (error) {
      if (error instanceof WebClientError) {
        console.error('Load failed:', error.toJSON())
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return { loadData, isLoading }
}
```

### In UI Components

```typescript
// features/myfeature/ui/MyComponent.tsx
import { WebClientError, WebClientErrorCode } from '@/shared/webclients'
import { useMyFeature } from '../hooks/use-myfeature'

export function MyComponent() {
  const { loadData } = useMyFeature()
  const [error, setError] = useState<string | null>(null)
  
  const handleLoad = async () => {
    try {
      await loadData('123')
    } catch (error) {
      if (error instanceof WebClientError) {
        // Show user-friendly message
        setError(error.getUserMessage())
        
        // Or handle specific errors
        if (error.is(WebClientErrorCode.NOT_FOUND)) {
          setError('Item not found')
        }
      }
    }
  }
  
  return (
    <div>
      <button onClick={handleLoad}>Load Data</button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
```

## 🚨 Error Handling

### WebClientError Types

```typescript
enum WebClientErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
```

### Error Handling Patterns

```typescript
try {
  await authWebClient.login({ email, password })
} catch (error) {
  if (error instanceof WebClientError) {
    // Check specific error code
    if (error.is(WebClientErrorCode.UNAUTHORIZED)) {
      showMessage('Invalid credentials')
    }
    
    // Get user-friendly message
    showMessage(error.getUserMessage())
    
    // Log for telemetry
    logger.error('API call failed', error.toJSON())
  }
}
```

## 🔌 External Services

For external services (Google Maps, Stripe, etc.), create a separate axios instance:

```typescript
// GoogleMapsWebClient.ts
import { createAxiosInstance } from './config/axios-config'

export class GoogleMapsWebClient {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string = 'https://maps.googleapis.com') {
    // Separate axios instance with different base URL
    this.axiosInstance = createAxiosInstance(baseURL)
  }

  public async geocode(params: GeocodeRequestParams): Promise<GeocodeResponse> {
    return executeGeocodeRequest(this.axiosInstance, params)
  }
}
```

## ✅ Benefits

1. **Centralized HTTP Logic** - All axios calls in one place
2. **Type Safety** - Fully typed requests and responses
3. **Error Handling** - Consistent error propagation to UI
4. **Testability** - Easy to mock WebClients
5. **Maintainability** - Clear separation of concerns
6. **Flexibility** - Easy to swap HTTP libraries

## ❌ Anti-Patterns

### DON'T: Make axios calls directly in components

```typescript
// ❌ Bad
function MyComponent() {
  const handleClick = async () => {
    const response = await axios.get('/api/data')
  }
}
```

### DON'T: Define axios calls in WebClient classes

```typescript
// ❌ Bad
class MyWebClient {
  async getData() {
    // Axios call defined here
    return await this.axiosInstance.get('/data')
  }
}
```

### DON'T: Skip error handling

```typescript
// ❌ Bad
const data = await myWebClient.getData() // No try/catch
```

### DO: Use WebClients through API services

```typescript
// ✅ Good
function MyComponent() {
  const { loadData } = useMyFeature()
  
  const handleClick = async () => {
    try {
      await loadData()
    } catch (error) {
      if (error instanceof WebClientError) {
        showError(error.getUserMessage())
      }
    }
  }
}
```

## 📚 Examples

See existing implementations:
- `AuthWebClient.ts` - Internal API example
- `GoogleMapsWebClient.ts` - External service example
- `features/auth/` - Complete feature integration

## 🧪 Testing

```typescript
import { AuthWebClient } from '@/shared/webclients'
import { AxiosInstance } from 'axios'

describe('AuthWebClient', () => {
  it('should login successfully', async () => {
    const mockAxios = {
      post: vi.fn().mockResolvedValue({
        data: { user: { id: '1' }, token: 'abc' }
      })
    } as unknown as AxiosInstance
    
    const client = new AuthWebClient(mockAxios)
    const response = await client.login({ email: 'test@example.com', password: 'pass123' })
    
    expect(response.token).toBe('abc')
  })
})
```

---

**Remember**: NO axios calls anywhere except in Request files!
