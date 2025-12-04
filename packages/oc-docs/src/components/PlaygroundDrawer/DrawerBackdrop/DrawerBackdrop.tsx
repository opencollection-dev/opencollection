import React from 'react';
import { StyledBackdrop } from '../DrawerContent/Views/PlaygroundView/StyledWrapper';

interface DrawerBackdropProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

const DrawerBackdrop: React.FC<DrawerBackdropProps> = ({ isOpen, isCollapsed, onClose }) => {
  return (
    <StyledBackdrop
      style={{
        opacity: (isOpen && !isCollapsed) ? 1 : 0,
        pointerEvents: (isOpen && !isCollapsed) ? 'auto' : 'none',
        backdropFilter: (isOpen && !isCollapsed) ? 'blur(2px)' : 'blur(0px)',
        WebkitBackdropFilter: (isOpen && !isCollapsed) ? 'blur(2px)' : 'blur(0px)'
      }}
      onClick={onClose}
    />
  );
};

export default DrawerBackdrop;

