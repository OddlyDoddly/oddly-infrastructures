import { forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

/**
 * Menu Component
 * 
 * A policy-free menu container primitive for dropdown menus.
 */
export const Menu = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-bg p-1 text-fg shadow-md',
        className
      )}
      {...props}
    />
  )
);
Menu.displayName = 'Menu';

/**
 * MenuItem Component
 * 
 * Individual menu item within a Menu.
 */
export const MenuItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean }
>(({ className, disabled, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      disabled && 'pointer-events-none opacity-50',
      className
    )}
    {...props}
  />
));
MenuItem.displayName = 'MenuItem';

/**
 * MenuSeparator Component
 * 
 * Visual separator for menu sections.
 */
export const MenuSeparator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
  )
);
MenuSeparator.displayName = 'MenuSeparator';

/**
 * MenuLabel Component
 * 
 * Label for menu sections.
 */
export const MenuLabel = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props} />
  )
);
MenuLabel.displayName = 'MenuLabel';
