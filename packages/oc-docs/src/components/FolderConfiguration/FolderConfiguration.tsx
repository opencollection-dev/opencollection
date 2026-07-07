import React from 'react';
import type { FolderConfig } from '../../utils/folder';
import { Code } from '../Code/Code';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import { PropertyTable } from '../PropertyTable/PropertyTable';
import { AuthDetails } from '../AuthDetails/AuthDetails';
import { ContentTypeBadge } from '../ContentTypeBadge/ContentTypeBadge';
import { StyledWrapper } from './StyledWrapper';

interface FolderConfigurationProps {
  config: FolderConfig;
  authModeLabels?: Record<string, string>;
  testId?: string;
}

export const FolderConfiguration: React.FC<FolderConfigurationProps> = ({ config, authModeLabels = {}, testId }) => {
  const hasHeaders = config.headers.length > 0;
  const hasAuth = Boolean(config.auth);
  const hasScripts = Boolean(config.preRequest || config.postResponse);
  const hasPreVars = config.variables.length > 0;
  const hasPostVars = config.postVariables.length > 0;
  const hasVariables = hasPreVars || hasPostVars;
  const hasTests = Boolean(config.tests);
  const inheritedBadge = config.authSource ? `Inherited from ${config.authSource.level}` : undefined;

  return (
    <StyledWrapper className="folder-configuration" data-testid={testId}>
      {hasHeaders && (
        <div className="config-group" data-testid="folder-config-headers">
          <div className="config-group-head">
            <SectionLabel className="config-group-label">Headers</SectionLabel>
          </div>
          <PropertyTable
            rows={config.headers.map((header) => ({
              label: header.name,
              value: header.value,
              disabled: header.disabled,
              description: header.description
            }))}
          />
        </div>
      )}

      {hasAuth && (
        <div className="config-group" data-testid="folder-config-auth">
          <div className="config-group-head">
            <SectionLabel className="config-group-label">Auth</SectionLabel>
            {inheritedBadge && <ContentTypeBadge label={inheritedBadge} />}
          </div>
          <AuthDetails auth={config.auth} authModeLabels={authModeLabels} testId="folder-config-auth-details" />
        </div>
      )}

      {hasScripts && (
        <div className="config-group" data-testid="folder-config-script">
          <div className="config-group-head">
            <SectionLabel className="config-group-label">Script</SectionLabel>
          </div>
          <div className="config-columns">
            {config.preRequest && (
              <div className="config-column">
                <p className="config-phase-label">Pre-Request</p>
                <Code code={config.preRequest} language="javascript" showLineNumbers />
              </div>
            )}
            {config.postResponse && (
              <div className="config-column">
                <p className="config-phase-label">Post-Response</p>
                <Code code={config.postResponse} language="javascript" showLineNumbers />
              </div>
            )}
          </div>
        </div>
      )}

      {hasVariables && (
        <div className="config-group" data-testid="folder-config-vars">
          <div className="config-group-head">
            <SectionLabel className="config-group-label">Vars</SectionLabel>
          </div>
          <div className="config-columns">
            {hasPreVars && (
              <div className="config-column">
                <p className="config-phase-label">Pre-Request</p>
                <PropertyTable
                  rows={config.variables.map((variable) => ({
                    label: variable.name,
                    value: variable.value,
                    description: variable.description,
                    disabled: variable.disabled
                  }))}
                />
              </div>
            )}
            {hasPostVars && (
              <div className="config-column">
                <p className="config-phase-label">Post-Response</p>
                <PropertyTable
                  rows={config.postVariables.map((variable) => ({
                    label: variable.name,
                    value: variable.expression,
                    description: variable.description,
                    disabled: variable.disabled
                  }))}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {hasTests && (
        <div className="config-group" data-testid="folder-config-tests">
          <div className="config-group-head">
            <SectionLabel className="config-group-label">Tests</SectionLabel>
          </div>
          <Code code={config.tests as string} language="javascript" showLineNumbers testId="folder-config-tests-code" />
        </div>
      )}
    </StyledWrapper>
  );
};

export default FolderConfiguration;
