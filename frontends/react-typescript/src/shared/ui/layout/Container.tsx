import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/cn'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

/**
 * Container component
 * 
 * Constrains content width with responsive padding.
 * 
 * @example
 * <Container size="lg">Content here</Container>
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          {
            'max-w-screen-sm': size === 'sm',
            'max-w-screen-md': size === 'md',
            'max-w-screen-lg': size === 'lg',
            'max-w-screen-xl': size === 'xl',
            'max-w-full': size === 'full',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Container.displayName = 'Container'
