import React from 'react';
import { getMethodColorVar } from '../../../../theme/methodColors';
import { StyledWrapper } from './StyledWrapper';

const DISPLAY_METHOD: Record<string, string> = { DELETE: 'DEL', OPTIONS: 'OPT' };
const displayMethod = (method: string): string => {
  const upper = method.toUpperCase();
  return DISPLAY_METHOD[upper] ?? upper;
};

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

  const leading = chevron ? (
    <span className="navlink-leading">{chevron}</span>
  ) : method ? (
    <span className="navlink-leading navlink-method" style={{ color: getMethodColorVar(method) }}>
      {displayMethod(method)}
    </span>
  ) : icon ? (
    <span className="navlink-leading navlink-icon">{icon}</span>
  ) : null;

  return (
    <StyledWrapper
      role="button"
      tabIndex={0}
      title={title ?? label}
      className={classes}
      style={{ paddingLeft: `${level * 14 + 8}px` }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      data-testid={testId}
      data-slug={slug}
    >
      {leading}
      <span className={`navlink-label${mono ? ' mono' : ''}`}>{label}</span>
    </StyledWrapper>
  );
};

export default SidebarNavLink;
