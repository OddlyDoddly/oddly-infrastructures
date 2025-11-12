import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const containerVariants = cva('w-full mx-auto px-4', {
  variants: {
    maxWidth: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    maxWidth: 'xl',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

/**
 * Container Component
 * 
 * A policy-free container primitive that provides consistent max-width
 * and horizontal padding for page layouts.
 * 
 * @example
 * ```tsx
 * <Container maxWidth="lg">
 *   <h1>Page Content</h1>
 * </Container>
 * ```
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth, ...props }, ref) => (
    <div ref={ref} className={cn(containerVariants({ maxWidth }), className)} {...props} />
  )
);
Container.displayName = 'Container';
