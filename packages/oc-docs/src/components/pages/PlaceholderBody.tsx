/**
 * Shared placeholder body (BRU-3188). The rich page bodies are built by other
 * lanes; until then these placeholders render the page title + a note naming
 * the owning ticket, so the routing/shell can be exercised end-to-end.
 */

import React from 'react';

const PlaceholderBody: React.FC<{
  title: string;
  ownedBy: string;
  children?: React.ReactNode;
}> = ({ title, ownedBy, children }) => (
  <div className="flex flex-col gap-4">
    <h1
      style={{
        color: 'var(--oc-text-primary, var(--text-primary))',
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        margin: 0,
      }}
    >
      {title}
    </h1>

    {children}

    <div
      style={{
        marginTop: 8,
        padding: 16,
        borderRadius: 8,
        border: '1px dashed var(--oc-border-border1, var(--border-color))',
        color: 'var(--oc-text-muted, var(--text-secondary))',
        fontSize: '0.85rem',
      }}
    >
      Page body placeholder — owned by {ownedBy}.
    </div>
  </div>
);

export default PlaceholderBody;
