import React, { useEffect } from 'react';
import { StyledWrapper } from './StyledWrapper';

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  testId?: string;
}

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ open, onClose, children, testId = 'sidebar-drawer' }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <StyledWrapper className={open ? 'open' : ''}>
      <div className="backdrop" data-testid="sidebar-backdrop" aria-hidden={!open} onClick={onClose} />
      <aside
        className="panel"
        data-testid={testId}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        aria-hidden={!open}
      >
        {children}
      </aside>
    </StyledWrapper>
  );
};

export default SidebarDrawer;
