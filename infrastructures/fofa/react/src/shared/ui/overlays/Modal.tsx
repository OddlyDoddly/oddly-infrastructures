import { forwardRef, useEffect } from 'react';
import { cn } from '@/shared/lib/cn';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Callback when the modal should close
   */
  onClose?: () => void;
}

/**
 * Modal Component
 * 
 * A policy-free modal/dialog primitive.
 * 
 * @example
 * ```tsx
 * <Modal open={isOpen} onClose={() => setIsOpen(false)}>
 *   <ModalHeader>
 *     <ModalTitle>Modal Title</ModalTitle>
 *   </ModalHeader>
 *   <ModalContent>Content here</ModalContent>
 * </Modal>
 * ```
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, open, onClose, children, ...props }, ref) => {
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [open]);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div
          ref={ref}
          className={cn(
            'relative z-50 w-full max-w-lg rounded-lg border bg-bg p-6 shadow-lg',
            className
          )}
          role="dialog"
          aria-modal="true"
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
Modal.displayName = 'Modal';

export const ModalHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
  )
);
ModalHeader.displayName = 'ModalHeader';

export const ModalTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
  )
);
ModalTitle.displayName = 'ModalTitle';

export const ModalContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
  )
);
ModalContent.displayName = 'ModalContent';

export const ModalFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex justify-end gap-2', className)} {...props} />
  )
);
ModalFooter.displayName = 'ModalFooter';
