import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const spinnerVariants = cva('inline-block animate-spin rounded-full border-2 border-current border-r-transparent', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  /**
   * Accessible label for screen readers
   */
  label?: string;
}

/**
 * Spinner Component
 * 
 * A policy-free loading spinner primitive.
 * 
 * @example
 * ```tsx
 * <Spinner size="md" label="Loading data..." />
 * ```
 */
export function Spinner({ size, className, label = 'Loading...' }: SpinnerProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className={cn(spinnerVariants({ size }))} role="status" aria-label={label} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
