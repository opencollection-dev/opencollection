import React from 'react';
import { MethodBadge } from '../MethodBadge';
import { VariableText } from '../VariableText';
import { CopyButton } from '../../ui/CopyButton/CopyButton';
import { RequestUrlBarWrapper } from './StyledWrapper';

interface RequestUrlBarProps {
  method: string;
  url: string;
  /** Opens the playground/runner. When omitted, the "Try it" button is hidden. */
  onTry?: () => void;
  tryLabel?: string;
  /** Per-instance style overrides (e.g. page-specific spacing). */
  style?: React.CSSProperties;
  className?: string;
}

/** The method + URL bar with copy and a "Try it" action. */
export const RequestUrlBar: React.FC<RequestUrlBarProps> = ({
  method,
  url,
  onTry,
  tryLabel = 'Try',
  style,
  className
}) => (
  <RequestUrlBarWrapper style={style} className={['oc-request-url-bar', className].filter(Boolean).join(' ')}>
    <span className="oc-request-url-bar-method">
      <MethodBadge method={method} />
    </span>
    <span className="oc-request-url-bar-url">
      <VariableText value={url} />
    </span>
    <span className="oc-request-url-bar-actions">
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
        <button type="button" className="oc-request-try" onClick={onTry}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: 'block' }}>
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
          {tryLabel}
        </button>
      )}
    </span>
  </RequestUrlBarWrapper>
);

export default RequestUrlBar;
