import React, { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  container?: Element | null;
}

export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(children, container ?? document.body);
};

export default Portal;
