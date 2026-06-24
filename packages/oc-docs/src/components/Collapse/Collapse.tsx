import React, { useEffect, useState } from 'react';
import { StyledWrapper } from './StyledWrapper';

interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  lazy?: boolean;
  innerClassName?: string;
  children: React.ReactNode;
}

export const Collapse: React.FC<CollapseProps> = ({ open, lazy = false, innerClassName, children, className, ...rest }) => {
  const [everOpened, setEverOpened] = useState(open);
  useEffect(() => {
    if (open) setEverOpened(true);
  }, [open]);

  return (
    <StyledWrapper {...rest} className={['collapse', open ? 'is-open' : '', className].filter(Boolean).join(' ')}>
      <div className={['collapse-clip', innerClassName].filter(Boolean).join(' ')}>
        {!lazy || everOpened ? children : null}
      </div>
    </StyledWrapper>
  );
};

export default Collapse;
