import React from 'react';
import type { HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { Code } from '../Code/Code';
import { SubHeading } from '../SubHeading/SubHeading';
import { PropertyTable, type PropertyRow } from '../PropertyTable/PropertyTable';
import { AuthDetails } from '../AuthDetails/AuthDetails';
import { VariablesPanel } from '../ExecutionContext/VariablesPanel/VariablesPanel';
import { getDescription, type PreRequestVarRow, type PostResponseVarRow } from '../../utils/request';
import { hasConfiguredAuth } from '../../utils/collectionOverview';
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
  preVars?: PreRequestVarRow[];
  postVars?: PostResponseVarRow[];
  authModeLabels?: Record<string, string>;
  testId?: string;
}

export const CollectionConfiguration: React.FC<CollectionConfigurationProps> = ({
  headers = [],
  auth,
  scripts = {},
  preVars = [],
  postVars = [],
  authModeLabels = {},
  testId = 'collection-config',
}) => {
  const headerRows: PropertyRow[] = headers
    .filter((header) => header && header.name)
    .map((header) => ({
      label: header.name,
      value: header.value,
      disabled: header.disabled,
      description: getDescription(header)
    }));

  const hasHeaders = headerRows.length > 0;
  const hasAuth = hasConfiguredAuth(auth);
  const hasVars = preVars.length > 0 || postVars.length > 0;
  const hasScripts = Boolean(scripts.preRequest || scripts.postResponse);
  const hasTests = Boolean(scripts.tests);
  const hasConfig = hasHeaders || hasAuth || hasVars || hasScripts || hasTests;

  if (!hasConfig) {
    return null;
  }

  return (
    <StyledWrapper className="collection-configuration" data-testid={testId}>
      {hasHeaders && (
        <div className="config-group">
          <SubHeading className='script-label' testId={`${testId}-subheading`}>Headers</SubHeading>
          <PropertyTable rows={headerRows} testId={`${testId}-headers`} />
        </div>
      )}

      {hasAuth && (
        <div className="config-group">
          <SubHeading className='script-label' testId={`${testId}-subheading`}>Auth</SubHeading>
          <AuthDetails auth={auth} authModeLabels={authModeLabels} testId={`${testId}-auth`} />
        </div>
      )}

      {hasVars && (
        <div className="config-group">
          <SubHeading className='script-label' testId={`${testId}-subheading`}>Variables</SubHeading>
          <VariablesPanel preVars={preVars} postVars={postVars} variant="stacked" />
        </div>
      )}

      {hasScripts && (
        <div className="config-group">
          <SubHeading className='script-label' testId={`${testId}-subheading`}>Script</SubHeading>
          {scripts.preRequest && (
            <div className="script-block">
              <p className="script-phase-label">Pre-Request</p>
              <Code code={scripts.preRequest} language="javascript" showLineNumbers />
            </div>
          )}
          {scripts.postResponse && (
            <div className="script-block">
              <p className="script-phase-label">Post-Response</p>
              <Code code={scripts.postResponse} language="javascript" showLineNumbers />
            </div>
          )}
        </div>
      )}

      {hasTests && (
        <div className="config-group">
          <SubHeading className='script-label' testId={`${testId}-subheading`}>Tests</SubHeading>
          <Code code={scripts.tests as string} language="javascript" showLineNumbers testId={`${testId}-tests`} />
        </div>
      )}

    </StyledWrapper>
  );
};

export default CollectionConfiguration;
