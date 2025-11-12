import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/ui/buttons'
import { Input } from '@/shared/ui/inputs'
import { useAuth } from '../hooks/use-auth'

/**
 * Login form validation schema
 */
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export interface LoginFormProps {
  onSuccess?: () => void
}

/**
 * LoginForm component
 * 
 * Feature UI component for login.
 * Uses react-hook-form + zod for validation.
 * Delegates auth logic to useAuth hook.
 * 
 * @example
 * <LoginForm onSuccess={() => navigate('/dashboard')} />
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  
  const onSubmit = async (data: LoginFormData) => {
    setApiError(null)
    const result = await login(data)
    
    if (result.success) {
      onSuccess?.()
    } else {
      setApiError(result.error || 'Login failed. Please try again.')
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-fg mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          error={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-fg mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          error={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>
      
      {apiError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {apiError}
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  )
}
