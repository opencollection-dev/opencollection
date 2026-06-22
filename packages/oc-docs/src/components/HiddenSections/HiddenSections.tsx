import React, { useEffect, useState } from 'react';
import { HiddenSectionsWrapper } from './StyledWrapper';

interface HiddenSectionsProps {
  /**
   * Titles of the sections that are empty for the current item, in display order
   * (e.g. ["Body", "Auth"]). Each becomes an "(empty)" card when revealed.
   */
  titles: string[];
  className?: string;
}

/** Eye / eye-off glyph (Tabler-style), matching the finalized design. */
const EyeIcon: React.FC<{ crossed: boolean }> = ({ crossed }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {crossed ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

/**
 * Surfaces the sections that have no content for the current item behind a single
 * toggle, so the page stays clean while still signalling the sections exist. Renders
 * nothing when no section is hidden. Reusable across the request and Overview pages.
 */
export const HiddenSections: React.FC<HiddenSectionsProps> = ({ titles, className }) => {
  const [open, setOpen] = useState(false);

  // Collapse again whenever the hidden set changes (e.g. navigating to another item).
  const signature = titles.join('|');
  useEffect(() => {
    setOpen(false);
  }, [signature]);

  if (titles.length === 0) return null;
  const count = titles.length;

  return (
    <HiddenSectionsWrapper className={['oc-hidden-sections', className].filter(Boolean).join(' ')}>
      <button type="button" className="oc-hidden-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <EyeIcon crossed={open} />
        {open ? 'These fields were hidden' : `${count} hidden section${count > 1 ? 's' : ''}`}
      </button>
      {open &&
        titles.map((title) => (
          <div className="oc-hidden-item" key={title}>
            <div className="oc-hidden-item-title">{title}</div>
            <div className="oc-hidden-item-box">(empty)</div>
          </div>
        ))}
    </HiddenSectionsWrapper>
  );
};

export default HiddenSections;
