import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CopyButtonWrapper } from './StyledWrapper';

interface CopyButtonProps {
  /** Text written to the clipboard when pressed. */
  text: string;
  /** Accessible label in the idle state. */
  label?: string;
  /** Accessible label shown briefly after a successful copy. */
  copiedLabel?: string;
  /** How long (ms) the confirmation state persists. */
  resetAfterMs?: number;
  className?: string;
}

const CopyGlyph: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckGlyph: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * Accessible copy-to-clipboard button. Copies `text` on press and briefly swaps
 * to a confirmation icon, with the accessible label switching to match. Fully
 * prop-driven and unaware of where it sits, so it can be reused anywhere.
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  resetAfterMs = 2000,
  className
}) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Cancel a pending reset on unmount so we never set state on a gone component.
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
    <CopyButtonWrapper
      type="button"
      className={['copy-button', className].filter(Boolean).join(' ')}
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? <CheckGlyph /> : <CopyGlyph />}
    </CopyButtonWrapper>
  );
};

export default CopyButton;
