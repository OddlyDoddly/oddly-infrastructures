import { forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * FormField Component
 * 
 * A wrapper component for form fields that provides consistent spacing.
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props} />
  )
);
FormField.displayName = 'FormField';

/**
 * FormError Component
 * 
 * Displays validation error messages.
 */
export const FormError = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm font-medium text-destructive', className)} {...props} />
  )
);
FormError.displayName = 'FormError';

/**
 * FormDescription Component
 * 
 * Displays helper text for form fields.
 */
export const FormDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
FormDescription.displayName = 'FormDescription';
