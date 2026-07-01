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
  mono?: boolean;
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
  mono = false,
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
  ) : icon ? (
    <span className="navlink-leading navlink-icon">{icon}</span>
  ) : null;

  // Row is a plain container so the folder chevron (its own button) sits beside
  // the navigate button rather than nested inside it (no nested-button ARIA).
  return (
    <StyledWrapper
      className={classes}
      style={{ paddingLeft: `${level * 14 + 8}px` }}
      data-testid={testId}
      data-slug={slug}
    >
      {chevron}
      <button type="button" className="navlink-main" title={title ?? label} onClick={onClick}>
        {leading}
        <span className={`navlink-label${mono ? ' mono' : ''}`}>{label}</span>
      </button>
    </StyledWrapper>
  );
};

export default SidebarNavLink;
