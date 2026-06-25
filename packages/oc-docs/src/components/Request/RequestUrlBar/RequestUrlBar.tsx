import React from 'react';
import { MethodBadge } from '../../MethodBadge/MethodBadge';
import { VariableText } from '../../VariableText/VariableText';
import { CopyButton } from '../../../ui/CopyButton/CopyButton';
import { StyledWrapper } from './StyledWrapper';

interface RequestUrlBarProps {
  method: string;
  url: string;
  onTry?: () => void;
  tryLabel?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const RequestUrlBar: React.FC<RequestUrlBarProps> = ({
  method,
  url,
  onTry,
  tryLabel = 'Try',
  style,
  className
}) => (
  <StyledWrapper style={style} className={['request-url-bar', className].filter(Boolean).join(' ')} data-testid="request-url-bar">
    <span className="request-url-bar-method" data-testid="request-method">
      <MethodBadge method={method} />
    </span>
    <span className="request-url-bar-url" data-testid="request-url">
      <VariableText value={url} />
    </span>
    <span className="request-url-bar-actions">
      <CopyButton
        text={url}
        label="Copy URL"
        style={{
          width: '1.5rem',
          height: '1.5rem',
          backgroundColor: 'var(--oc-background-base)',
          borderColor: 'var(--oc-table-border)'
        }}
      />
      {onTry && (
        <button type="button" className="request-try" onClick={onTry} data-testid="request-try-button">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: 'block' }}>
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
          {tryLabel}
        </button>
      )}
    </span>
  </StyledWrapper>
);

export default RequestUrlBar;
