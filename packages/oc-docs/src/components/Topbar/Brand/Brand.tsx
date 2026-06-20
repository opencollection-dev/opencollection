import React from 'react';
import InitialsAvatar from '../../InitialsAvatar/InitialsAvatar';
import { StyledWrapper } from './StyledWrapper';

export interface BrandProps {
  collectionName: string;
  version?: string;
  logo?: React.ReactNode;
  /**
   * Compact (mobile) brand: avatar + a fixed "Docs" label, with the collection
   * name and version hidden. The avatar initials still derive from
   * `collectionName`; the full name + version are shown in the page body.
   */
  compact?: boolean;
}

/** Fixed product label shown beside the avatar in compact (mobile) mode. */
const PRODUCT_LABEL = 'Docs';

/**
 * Renders an arbitrary logo node. A string is treated as an image src so
 * callers can pass a URL (as `OpenCollection` does today); any other node is
 * rendered verbatim.
 */
const renderLogo = (logo: React.ReactNode, collectionName: string): React.ReactNode => {
  if (typeof logo === 'string') {
    return <img src={logo} alt={`${collectionName} logo`} />;
  }
  return logo;
};

/** Display version with a leading "v" (idempotent: "1.0.0" → "v1.0.0", "v2" → "v2"). */
const formatVersion = (version: string): string => {
  const trimmed = version.trim();
  return /^v/i.test(trimmed) ? trimmed : `v${trimmed}`;
};

const Brand: React.FC<BrandProps> = ({ collectionName, version, logo, compact = false }) => {
  const hasLogo = logo != null && logo !== '';
  return (
    <StyledWrapper className="oc-topbar__brand" data-testid="brand">
      {/* Explicit logo overrides; otherwise fall back to the initials avatar. */}
      <span className="oc-topbar__brand-logo">
        {hasLogo ? renderLogo(logo, collectionName) : <InitialsAvatar collectionName={collectionName} />}
      </span>
      {compact ? (
        <span className="oc-topbar__brand-name" data-testid="brand-name">{PRODUCT_LABEL}</span>
      ) : (
        <span className="oc-topbar__brand-text">
          <span className="oc-topbar__brand-name" data-testid="brand-name" title={collectionName}>
            {collectionName}
          </span>
          {version && (
            <span className="oc-topbar__brand-version" data-testid="brand-version">
              {formatVersion(version)}
            </span>
          )}
        </span>
      )}
    </StyledWrapper>
  );
};

export default Brand;
