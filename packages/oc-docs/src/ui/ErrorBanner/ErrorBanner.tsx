import React from 'react';
import { StyledWrapper } from './StyledWrapper';

export interface ErrorBannerProps {
  title: string;
  message: string;
  /** Optional one-line "what to do next" guidance shown beneath the message. */
  hint?: string;
  className?: string;
}

/**
 * Danger banner for a failed try-it request: bold title, monospace message,
 * and an optional next-step hint. Mirrors Bruno desktop's response error banner.
 */
const ErrorBanner: React.FC<ErrorBannerProps> = ({ title, message, hint, className = '' }) => (
  <StyledWrapper className={className}>
    <div className="error-title">{title}</div>
    <div className="error-message">{message}</div>
    {hint ? <div className="error-hint">{hint}</div> : null}
  </StyledWrapper>
);

export default ErrorBanner;
