import React from 'react';
import type { HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { Code } from '../Code/Code';
import { SubHeading } from '../SubHeading/SubHeading';
import { PropertyTable } from '../PropertyTable/PropertyTable';
import { AuthDetails } from '../AuthDetails/AuthDetails';
import { StyledWrapper } from './StyledWrapper';

interface CollectionScripts {
  preRequest?: string;
  postResponse?: string;
  tests?: string;
}

interface CollectionConfigurationProps {
  headers?: HttpRequestHeader[];
  auth?: Auth;
  scripts?: CollectionScripts;
  authModeLabels?: Record<string, string>;
  testId?: string;
}

export const CollectionConfiguration: React.FC<CollectionConfigurationProps> = ({
  headers = [],
  auth,
  scripts = {},
  authModeLabels = {},
}) => {
  const visibleHeaders = headers.filter((header) => header && header.name && header.disabled !== true);
  const hasHeaders = visibleHeaders.length > 0;
  const hasAuth = Boolean(auth) && (typeof auth !== 'object' || (auth as { type?: string }).type !== 'none');
  const hasScripts = Boolean(scripts.preRequest || scripts.postResponse);
  const hasTests = Boolean(scripts.tests);
  const hasConfig = hasHeaders || hasAuth || hasScripts || hasTests;

  if (!hasConfig) {
    return null;
  }

  return (
    <StyledWrapper className="collection-configuration" data-testid="collection-config">
      {hasHeaders && (
        <div className="config-group">
          <SubHeading testId="collection-config-subheading">Headers</SubHeading>
          <PropertyTable rows={visibleHeaders.map((header) => ({ label: header.name, value: header.value }))} />
        </div>
      )}

      {hasAuth && (
        <div className="config-group">
          <SubHeading testId="collection-config-subheading">Auth</SubHeading>
          <AuthDetails auth={auth} authModeLabels={authModeLabels} testId="collection-config-auth" />
        </div>
      )}

      {hasScripts && (
        <div className="config-group">
          <SubHeading testId="collection-config-subheading">Script</SubHeading>
          {scripts.preRequest && (
            <div className="script-block">
              <p className="script-label">Pre-Request</p>
              <Code code={scripts.preRequest} language="javascript" showLineNumbers />
            </div>
          )}
          {scripts.postResponse && (
            <div className="script-block">
              <p className="script-label">Post-Response</p>
              <Code code={scripts.postResponse} language="javascript" showLineNumbers />
            </div>
          )}
        </div>
      )}

      {hasTests && (
        <div className="config-group">
          <SubHeading testId="collection-config-subheading">Tests</SubHeading>
          <Code code={scripts.tests as string} language="javascript" showLineNumbers testId="collection-config-tests" />
        </div>
      )}

    </StyledWrapper>
  );
};

export default CollectionConfiguration;
