import React, { useEffect, useRef, type ReactNode } from 'react';
import { Portal } from '../Portal';
import { ModalWrapper } from './StyledWrapper';

interface ModalProps {
  /** Whether the modal is shown. Nothing is mounted (or portaled) while false. */
  open: boolean;
  onClose: () => void;
  /** Optional header content (e.g. a SectionLabel). When omitted, only the close button shows. */
  title?: ReactNode;
  children: ReactNode;
  /** Accessible name for the dialog (use when there's no visible text title). */
  ariaLabel?: string;
  className?: string;
}

/** Standard close glyph — kept consistent with the X used elsewhere in the app. */
const CloseIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/**
 * Reusable, accessible modal rendered through a Portal. Closes on Escape, on a
 * backdrop click, and via the close button; locks body scroll while open and
 * focuses the dialog on open. Presentational and prop-driven — reuse anywhere a
 * centred overlay is needed.
 */
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, ariaLabel, className }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <ModalWrapper
        className={['oc-modal-backdrop', className].filter(Boolean).join(' ')}
        // Close only when the press starts on the backdrop itself (not on a drag that
        // began inside the dialog, e.g. selecting text).
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div ref={dialogRef} className="oc-modal-dialog" role="dialog" aria-modal="true" aria-label={ariaLabel} tabIndex={-1}>
          <div className="oc-modal-head">
            {title !== undefined && <div className="oc-modal-title">{title}</div>}
            <button type="button" className="oc-modal-close" aria-label="Close" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <div className="oc-modal-body">{children}</div>
        </div>
      </ModalWrapper>
    </Portal>
  );
};

export default Modal;
