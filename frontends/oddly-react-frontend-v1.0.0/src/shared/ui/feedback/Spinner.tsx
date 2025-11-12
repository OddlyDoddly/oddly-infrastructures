import { type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Spinner component
 * 
 * Loading indicator with different sizes.
 * 
 * @example
 * <Spinner size="md" />
 */
export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      className={cn('inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        {
          'h-4 w-4': size === 'sm',
          'h-8 w-8': size === 'md',
          'h-12 w-12': size === 'lg',
        },
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

Spinner.displayName = 'Spinner'
