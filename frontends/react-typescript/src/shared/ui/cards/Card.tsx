import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Card component
 * 
 * A container with border, padding, and rounded corners.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-border bg-bg shadow-sm',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * CardHeader component
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      />
    )
  }
)

CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

/**
 * CardTitle component
 */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('font-semibold leading-none tracking-tight', className)}
        {...props}
      />
    )
  }
)

CardTitle.displayName = 'CardTitle'

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * CardContent component
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        {...props}
      />
    )
  }
)

CardContent.displayName = 'CardContent'

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * CardFooter component
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
      />
    )
  }
)

CardFooter.displayName = 'CardFooter'
