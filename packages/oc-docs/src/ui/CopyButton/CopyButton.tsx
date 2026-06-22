import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyledWrapper } from './StyledWrapper';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  resetAfterMs?: number;
  testId?: string;
  style?: React.CSSProperties;
  className?: string;
}

const CopyGlyph: React.FC = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckGlyph: React.FC = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  resetAfterMs = 2000,
  testId,
  style,
  className
}) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const handleCopy = useCallback(async () => {
    if (!text || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), resetAfterMs);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — fail silently.
    }
  }, [text, resetAfterMs]);

  return (
    <StyledWrapper
      type="button"
      className={['copy-button', className].filter(Boolean).join(' ')}
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      data-testid={testId}
      style={style}
    >
      {copied ? <CheckGlyph /> : <CopyGlyph />}
    </StyledWrapper>
  );
};

export default CopyButton;
