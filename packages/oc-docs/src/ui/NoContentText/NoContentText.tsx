import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface NoContentTextProps {
  className?: string;
  text: string;
  testId?: string
}

const NoContentText : React.FC<NoContentTextProps> = ({ 
  className,
  text,
  testId = 'no-content-text' 
}) => {
  return (
    <StyledWrapper className={className} data-testid={testId}>
      {text}
    </StyledWrapper>
  )
}

export default NoContentText