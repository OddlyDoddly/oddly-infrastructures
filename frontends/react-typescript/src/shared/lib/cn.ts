import { type ClassValue, clsx } from 'clsx'

/**
 * Utility to merge class names with Tailwind classes
 * Combines clsx for conditional classes
 * 
 * @example
 * cn('text-base', isActive && 'text-primary', className)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
