import React, { useEffect, useRef, type ReactNode } from 'react';
import { Portal } from '../../components/Portal/Portal';
import { StyledWrapper } from './StyledWrapper';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}

const CloseIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

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
      <StyledWrapper
        className={['oc-modal-backdrop', className].filter(Boolean).join(' ')}
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
      </StyledWrapper>
    </Portal>
  );
};

export default Modal;
