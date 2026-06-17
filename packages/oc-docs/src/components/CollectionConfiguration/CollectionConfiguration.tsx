import React from 'react';
import type { HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { Code } from '../Code';
import { SecretValue } from '../SecretValue';
import { SubHeading } from '../SubHeading';
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
}

const containsVariable = (value: string): boolean => value.includes('{{');

const resolveAuthMode = (auth: Auth, labels: Record<string, string>): string =>
  auth === 'inherit' ? 'Inherit' : labels[auth.type] || auth.type;

const ConfigRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="config-row">
    <dt className="config-key">{label}</dt>
    <dd className="config-value-cell">{children}</dd>
  </div>
);

const PlainValue: React.FC<{ value: string }> = ({ value }) => (
  <span className={containsVariable(value) ? 'config-value config-value--var' : 'config-value'}>{value}</span>
);

/** Italic placeholder shown for a configuration subsection that has no items yet. */
const EmptyMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="config-empty-message">{children}</p>
);

/** Read-only rows for the collection-level auth, derived from the auth `type`. */
const AuthRows: React.FC<{ auth: Auth; labels: Record<string, string> }> = ({ auth, labels }) => {
  const rows: React.ReactNode[] = [
    <ConfigRow key="mode" label="Mode"><PlainValue value={resolveAuthMode(auth, labels)} /></ConfigRow>
  ];

  if (auth !== 'inherit') {
    switch (auth.type) {
      case 'basic':
      case 'digest':
      case 'ntlm':
        if (auth.username) rows.push(<ConfigRow key="username" label="Username"><PlainValue value={auth.username} /></ConfigRow>);
        if (auth.password) rows.push(<ConfigRow key="password" label="Password"><SecretValue value={auth.password} /></ConfigRow>);
        break;
      case 'bearer':
        if (auth.token) rows.push(<ConfigRow key="token" label="Token"><SecretValue value={auth.token} /></ConfigRow>);
        break;
      case 'apikey':
        if (auth.key) rows.push(<ConfigRow key="key" label="Key"><PlainValue value={auth.key} /></ConfigRow>);
        if (auth.value) rows.push(<ConfigRow key="value" label="Value"><SecretValue value={auth.value} /></ConfigRow>);
        if (auth.placement) rows.push(<ConfigRow key="placement" label="Add to"><PlainValue value={auth.placement} /></ConfigRow>);
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
  authModeLabels = {}
}) => {
  const visibleHeaders = headers.filter((header) => header && header.name && header.disabled !== true);
  const hasScripts = Boolean(scripts.preRequest || scripts.postResponse);
  const hasConfig = visibleHeaders.length > 0 || Boolean(auth) || hasScripts || Boolean(scripts.tests);

  if (!hasConfig) {
    return null;
  }

  return (
    <CollectionConfigurationWrapper className="collection-configuration">
      <div className="config-group">
        <SubHeading>Headers</SubHeading>
        {visibleHeaders.length > 0 ? (
          <dl className="config-box">
            {visibleHeaders.map((header, index) => (
              <ConfigRow key={`${header.name}-${index}`} label={header.name}>
                <PlainValue value={header.value} />
              </ConfigRow>
            ))}
          </dl>
        ) : (
          <EmptyMessage>Add headers to inherit in all requests in the collection</EmptyMessage>
        )}
      </div>

      <div className="config-group">
        <SubHeading>Auth</SubHeading>
        {auth ? (
          <AuthRows auth={auth} labels={authModeLabels} />
        ) : (
          <EmptyMessage>Add authentication to inherit in all requests in the collection</EmptyMessage>
        )}
      </div>

      <div className="config-group">
        <SubHeading>Script</SubHeading>
        {hasScripts ? (
          <>
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
          </>
        ) : (
          <EmptyMessage>Add scripts to run for all requests in the collection</EmptyMessage>
        )}
      </div>

      <div className="config-group">
        <SubHeading>Tests</SubHeading>
        {scripts.tests ? (
          <Code code={scripts.tests} language="javascript" showLineNumbers />
        ) : (
          <EmptyMessage>Add tests to run for all requests in the collection</EmptyMessage>
        )}
      </div>
    </CollectionConfigurationWrapper>
  );
};

export default CollectionConfiguration;
