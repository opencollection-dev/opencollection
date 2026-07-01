import React, { useCallback } from 'react';
import { Portal } from '../../ui/Portal/Portal';
import { useEscapeKey, useLockBodyScroll } from '../../hooks';
import { StyledWrapper } from './StyledWrapper';

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  testId?: string;
}

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ open, onClose, children, testId = 'sidebar-drawer' }) => {
  // Close on Escape and drop focus, so the trigger (hamburger) doesn't keep a
  // focus-visible ring from the keydown after the drawer is gone.
  const closeOnEscape = useCallback(() => {
    onClose();
    (document.activeElement as HTMLElement | null)?.blur();
  }, [onClose]);

  useEscapeKey(closeOnEscape, open);
  useLockBodyScroll(open);

  return (
    <Portal>
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
    </Portal>
  );
};

export default SidebarDrawer;
