import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * Button variants using CVA
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      intent: {
        primary: 'bg-primary text-primary-foreground hover:opacity-90 focus-visible:ring-primary',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
        ghost: 'bg-transparent text-fg hover:bg-accent hover:text-accent-foreground',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Button component
 * 
 * A versatile button primitive with multiple variants.
 * Policy-free - feature components compose styling and behavior.
 * 
 * @example
 * <Button intent="primary" size="md">Click me</Button>
 * <Button intent="ghost" size="sm">Secondary action</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ intent, size }), className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
