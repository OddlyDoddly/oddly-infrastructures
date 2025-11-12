import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

/**
 * Input component
 * 
 * A styled text input primitive.
 * Accepts standard HTML input props.
 * 
 * @example
 * <Input type="text" placeholder="Enter name" />
 * <Input type="email" error={!!errors.email} />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-border bg-bg px-3 py-1 text-sm transition-colors',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
