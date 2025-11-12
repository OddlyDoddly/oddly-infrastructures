import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper precedence.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 * 
 * @example
 * cn('px-2 py-1', condition && 'bg-primary')
 * cn({ 'bg-primary': isPrimary, 'bg-secondary': !isPrimary })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
