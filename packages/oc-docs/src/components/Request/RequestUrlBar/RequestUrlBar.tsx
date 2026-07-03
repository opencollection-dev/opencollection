import React from 'react';
import { MethodBadge } from '../../MethodBadge/MethodBadge';
import { VariableText } from '../../VariableText/VariableText';
import { CopyButton } from '../../../ui/CopyButton/CopyButton';
import { SendIcon } from '../../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

interface RequestUrlBarProps {
  method: string;
  url: string;
  onTry?: () => void;
  tryLabel?: string;
  style?: React.CSSProperties;
  className?: string;
  testId?: string;
}

export const RequestUrlBar: React.FC<RequestUrlBarProps> = ({
  method,
  url,
  onTry,
  tryLabel = 'Try',
  style,
  className,
  testId = 'request-url-bar'
}) => (
  <StyledWrapper style={style} className={['request-url-bar', className].filter(Boolean).join(' ')} data-testid={testId}>
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
          <SendIcon />
          {tryLabel}
        </button>
      )}
    </span>
  </StyledWrapper>
);

export default RequestUrlBar;
