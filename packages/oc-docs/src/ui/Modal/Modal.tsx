import React, { useEffect, useRef, type ReactNode } from 'react';
import { Portal } from '../../components/Portal/Portal';
import { CloseIcon } from '../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}

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
        className={['modal-backdrop', className].filter(Boolean).join(' ')}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div ref={dialogRef} className="modal-dialog" role="dialog" aria-modal="true" aria-label={ariaLabel} tabIndex={-1}>
          <div className="modal-head">
            {title !== undefined && <div className="modal-title">{title}</div>}
            <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </StyledWrapper>
    </Portal>
  );
};

export default Modal;
