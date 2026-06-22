import React, { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  /** Element to render into. Defaults to `document.body`. */
  container?: Element | null;
}

/**
 * Renders its children into a DOM node outside the parent component hierarchy
 * (default: `document.body`). SSR-safe — it only portals after mount, so the
 * server render and first client render match. Reusable wherever content must
 * escape overflow/stacking contexts (modals, popovers, toasts).
 */
export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(children, container ?? document.body);
};

export default Portal;
