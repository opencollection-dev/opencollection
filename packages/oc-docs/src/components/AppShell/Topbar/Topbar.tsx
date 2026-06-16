/**
 * Topbar — MINIMAL STUB (BRU-3188).
 *
 * BRU-3572 replaces the BODY of this component with the real top bar (search,
 * env switcher, show-vars, Open-in-Bruno). This stub exists so the AppShell
 * compiles and lays out correctly. The path and props below are the agreed
 * cross-lane contract — do NOT change the signature without coordinating.
 */

import React from 'react';

export interface TopbarProps {
  collectionName: string;
  version?: string;
  logo?: React.ReactNode;
  searchSlot?: React.ReactNode;
  envSwitcherSlot?: React.ReactNode;
  onOpenInBruno?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  collectionName,
  version,
  logo,
  searchSlot,
  envSwitcherSlot,
  onOpenInBruno,
}) => {
  return (
    <header
      className="oc-topbar flex items-center gap-4"
      style={{
        height: 'var(--oc-topbar-height, 56px)',
        padding: '0 16px',
        borderBottom: '1px solid var(--oc-border-border1, var(--border-color))',
        backgroundColor: 'var(--oc-bg, var(--oc-sidebar-bg))',
      }}
    >
      <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
        {logo}
        <span
          className="truncate"
          style={{ color: 'var(--oc-text-primary, var(--text-primary))', fontWeight: 600, fontSize: '0.95rem' }}
        >
          {collectionName}
        </span>
        {version && (
          <span style={{ color: 'var(--oc-text-muted, var(--text-secondary))', fontSize: '0.75rem' }}>
            {version}
          </span>
        )}
      </div>

      {searchSlot && <div className="flex-1 min-w-0 hidden md:block">{searchSlot}</div>}

      <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
        {envSwitcherSlot}
        {onOpenInBruno && (
          <button
            type="button"
            onClick={onOpenInBruno}
            style={{
              fontSize: '0.8rem',
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid var(--oc-border-border1, var(--border-color))',
              color: 'var(--oc-text-primary, var(--text-primary))',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Open in Bruno
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
