import React from 'react';
import type { HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { Code } from '../../ui/Code/Code';
import { SecretValue } from '../../ui/SecretValue/SecretValue';
import { SubHeading } from '../SubHeading/SubHeading';
import { CollectionConfigurationWrapper } from './StyledWrapper';

interface CollectionScripts {
  preRequest?: string;
  postResponse?: string;
  tests?: string;
}

interface CollectionConfigurationProps {
  headers?: HttpRequestHeader[];
  auth?: Auth;
  /** Pre-normalised scripts ({ preRequest, postResponse, tests }) supplied by the host. */
  scripts?: CollectionScripts;
  /** Maps an auth `type` to a display label (e.g. basic -> "Basic Auth"); supplied by the host. */
  authModeLabels?: Record<string, string>;
  /**
   * Test hook (`data-testid`) base, set by the composition root. Sub-elements derive
   * stable ids from it (`-row`, `-row-value`, `-subheading`, `-empty`, `-secret`, `-copy`).
   */
  testId?: string;
}

const containsVariable = (value: string): boolean => value.includes('{{');

const resolveAuthMode = (auth: Auth, labels: Record<string, string>): string =>
  auth === 'inherit' ? 'Inherit' : labels[auth.type] || auth.type;

const ConfigRow: React.FC<{ label: string; children: React.ReactNode; testId: string }> = ({ label, children, testId }) => (
  <div className="config-row" data-testid={testId}>
    <dt className="config-key">{label}</dt>
    <dd className="config-value-cell" data-testid={`${testId}-value`}>{children}</dd>
  </div>
);

const PlainValue: React.FC<{ value: string }> = ({ value }) => (
  <span className={containsVariable(value) ? 'config-value config-value--var' : 'config-value'}>{value}</span>
);

/** Italic placeholder shown for a configuration subsection that has no items yet. */
const EmptyMessage: React.FC<{ children: React.ReactNode; testId?: string }> = ({ children, testId }) => (
  <p className="config-empty-message" data-testid={testId}>{children}</p>
);

/** Read-only rows for the collection-level auth, derived from the auth `type`. */
const AuthRows: React.FC<{ auth: Auth; labels: Record<string, string>; rowTestId?: string; secretTestId?: string }> = ({
  auth,
  labels,
  rowTestId,
  secretTestId
}) => {
  const rows: React.ReactNode[] = [
    <ConfigRow key="mode" label="Mode" testId={rowTestId}><PlainValue value={resolveAuthMode(auth, labels)} /></ConfigRow>
  ];

  if (auth !== 'inherit') {
    switch (auth.type) {
      case 'basic':
      case 'digest':
      case 'ntlm':
        if (auth.username) rows.push(<ConfigRow key="username" label="Username" testId={rowTestId}><PlainValue value={auth.username} /></ConfigRow>);
        if (auth.password) rows.push(<ConfigRow key="password" label="Password" testId={rowTestId}><SecretValue value={auth.password} testId={secretTestId} /></ConfigRow>);
        break;
      case 'bearer':
        if (auth.token) rows.push(<ConfigRow key="token" label="Token" testId={rowTestId}><SecretValue value={auth.token} testId={secretTestId} /></ConfigRow>);
        break;
      case 'apikey':
        if (auth.key) rows.push(<ConfigRow key="key" label="Key" testId={rowTestId}><PlainValue value={auth.key} /></ConfigRow>);
        if (auth.value) rows.push(<ConfigRow key="value" label="Value" testId={rowTestId}><SecretValue value={auth.value} testId={secretTestId} /></ConfigRow>);
        if (auth.placement) rows.push(<ConfigRow key="placement" label="Add to" testId={rowTestId}><PlainValue value={auth.placement} /></ConfigRow>);
        break;
      default:
        break;
    }
  }

  return <dl className="config-box">{rows}</dl>;
};

/**
 * Read-only view of a collection's request defaults — headers, auth, scripts and tests.
 * Fully prop-driven (no app constants/utils) so it can be lifted into a component package.
 * Reuses `SecretValue` for sensitive values and `Code` for script/test snippets.
 */
export const CollectionConfiguration: React.FC<CollectionConfigurationProps> = ({
  headers = [],
  auth,
  scripts = {},
  authModeLabels = {},
  testId = 'collection-config'
}) => {
  const visibleHeaders = headers.filter((header) => header && header.name && header.disabled !== true);
  const hasScripts = Boolean(scripts.preRequest || scripts.postResponse);
  const hasConfig = visibleHeaders.length > 0 || Boolean(auth) || hasScripts || Boolean(scripts.tests);

  if (!hasConfig) {
    return null;
  }

  // Stable test hooks derived from the base testId.
  const rowTestId = `${testId}-row`;
  const subTestId = `${testId}-subheading`;
  const secretTestId = `${testId}-secret`;
  const copyTestId = `${testId}-copy`;

  return (
    <CollectionConfigurationWrapper className="collection-configuration" data-testid={testId}>
      <div className="config-group">
        <SubHeading testId={subTestId}>Headers</SubHeading>
        {visibleHeaders.length > 0 ? (
          <dl className="config-box">
            {visibleHeaders.map((header, index) => (
              <ConfigRow key={`${header.name}-${index}`} label={header.name} testId={rowTestId}>
                <PlainValue value={header.value} />
              </ConfigRow>
            ))}
          </dl>
        ) : (
          <EmptyMessage>Add headers to inherit in all requests in the collection</EmptyMessage>
        )}
      </div>

      <div className="config-group">
        <SubHeading testId={subTestId}>Auth</SubHeading>
        {auth ? (
          <AuthRows auth={auth} labels={authModeLabels} rowTestId={rowTestId} secretTestId={secretTestId} />
        ) : (
          <EmptyMessage>Add authentication to inherit in all requests in the collection</EmptyMessage>
        )}
      </div>

      <div className="config-group">
        <SubHeading testId={subTestId}>Script</SubHeading>
        {hasScripts ? (
          <>
            {scripts.preRequest && (
              <div className="script-block">
                <p className="script-label">Pre-Request</p>
                <Code code={scripts.preRequest} language="javascript" showLineNumbers copyTestId={copyTestId} />
              </div>
            )}
            {scripts.postResponse && (
              <div className="script-block">
                <p className="script-label">Post-Response</p>
                <Code code={scripts.postResponse} language="javascript" showLineNumbers copyTestId={copyTestId} />
              </div>
            )}
          </>
        ) : (
          <EmptyMessage>Add scripts to run for all requests in the collection</EmptyMessage>
        )}
      </div>

      <div className="config-group">
        <SubHeading testId={subTestId}>Tests</SubHeading>
        {scripts.tests ? (
          <Code code={scripts.tests} language="javascript" showLineNumbers copyTestId={copyTestId} />
        ) : (
          <EmptyMessage>Add tests to run for all requests in the collection</EmptyMessage>
        )}
      </div>
    </CollectionConfigurationWrapper>
  );
};

export default CollectionConfiguration;
