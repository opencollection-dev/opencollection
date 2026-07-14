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
      // Indent via margin (outside the background) with a fixed 4px inner pad, so
      // the highlight starts just 4px left of the chevron instead of filling the
      // empty indent. margin-left + 4px keeps the leading glyph at the same
      // level*19+8 offset (chevron 12px + gap 7px step), preserving alignment and
      // guide lines. Right margin keeps the pill short of the edge: 8px root, 4px nested.
      style={{
        marginLeft: `${level * 19 + 4}px`,
        paddingLeft: '4px',
        marginRight: level === 0 ? '8px' : '4px',
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
