import React from 'react';
import { getMethodColorVar } from '../../../../theme/methodColors';
import { getShortMethod } from '../../../../utils/request';
import { StyledWrapper } from './StyledWrapper';

interface SidebarNavLinkProps {
  label: string;
  active?: boolean;
  level?: number;
  method?: string;
  icon?: React.ReactNode;
  chevron?: React.ReactNode;
  muted?: boolean;
  /** Renders a `JS` badge (accent colour) in the method column, for script files. */
  script?: boolean;
  onClick?: () => void;
  title?: string;
  slug?: string;
  testId?: string;
}

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  label,
  active = false,
  level = 0,
  method,
  icon,
  chevron,
  muted = false,
  script = false,
  onClick,
  title,
  slug,
  testId,
}) => {
  const classes = [active ? 'active' : '', muted ? 'muted' : ''].filter(Boolean).join(' ');

  const leading = method ? (
    <span className="navlink-leading navlink-method" style={{ color: getMethodColorVar(method) }}>
      {getShortMethod(method)}
    </span>
  ) : script ? (
    <span className="navlink-leading navlink-method" style={{ color: 'var(--oc-colors-accent)' }}>
      JS
    </span>
  ) : icon ? (
    <span className="navlink-leading navlink-icon">{icon}</span>
  ) : null;

  // Row is a plain container so the folder chevron (its own button) sits beside
  // the navigate button rather than nested inside it (no nested-button ARIA).
  return (
    <StyledWrapper
      className={classes}
      // Indent with margin (outside the highlight) plus a small 4px inner pad, so
      // the highlight starts just left of the chevron instead of filling the empty
      // indent, while each level's glyph still lines up under its parent. Right
      // margin keeps the highlight short of the edge: 8px at root, 4px when nested.
      style={{
        marginLeft: `${(level * 19 + 4) / 16}rem`,
        paddingLeft: '0.25rem',
        marginRight: level === 0 ? '0.5rem' : '0.25rem'
      }}
      data-testid={testId}
      data-slug={slug}
    >
      {chevron}
      <button type="button" className="navlink-main" title={title ?? label} onClick={onClick}>
        {leading}
        <span className="navlink-label">{label}</span>
      </button>
    </StyledWrapper>
  );
};

export default SidebarNavLink;
