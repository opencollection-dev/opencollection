import React from 'react';
import InitialsAvatar from '../../InitialsAvatar/InitialsAvatar';
import TruncatedText from '../../TruncatedText/TruncatedText';
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
  /** Root test id; the name/version derive from it (`${testId}-name` etc.). */
  testId?: string;
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

const Brand: React.FC<BrandProps> = ({
  collectionName,
  version,
  logo,
  compact = false,
  testId = 'brand',
}) => {
  const hasLogo = logo != null && logo !== '';
  return (
    <StyledWrapper className="topbar-brand" data-testid={testId}>
      {/* Explicit logo overrides; otherwise fall back to the initials avatar. */}
      <span className="topbar-brand-logo">
        {hasLogo ? renderLogo(logo, collectionName) : <InitialsAvatar collectionName={collectionName} />}
      </span>
      {compact ? (
        <span className="topbar-brand-name" data-testid={`${testId}-name`}>{PRODUCT_LABEL}</span>
      ) : (
        <span className="topbar-brand-text">
          <TruncatedText text={collectionName} className="topbar-brand-name" testId={`${testId}-name`} />
          {version && (
            <span className="topbar-brand-version" data-testid={`${testId}-version`}>
              {`Version : ${version}`}
            </span>
          )}
        </span>
      )}
    </StyledWrapper>
  );
};

export default Brand;
