import React, { type ReactNode } from 'react';
import { Tooltip } from '../../ui/Tooltip/Tooltip';
import { StyledWrapper } from './StyledWrapper';

export interface TruncatedTextProps {
  text: string;
  children?: ReactNode;
  touch?: boolean;
  className?: string;
  testId?: string;
}

const isOverflowing = (el: HTMLElement): boolean =>
  el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  children,
  touch,
  className,
  testId = 'truncated-text'
}) => (
  <Tooltip content={text} disabled={!text.trim()} shouldOpen={isOverflowing} touch={touch}>
    <StyledWrapper className={['oc-truncate', className].filter(Boolean).join(' ')} data-testid={testId}>
      {children ?? text}
    </StyledWrapper>
  </Tooltip>
);

export default TruncatedText;
