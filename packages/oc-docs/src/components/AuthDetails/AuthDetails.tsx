import React from 'react';
import type { Auth } from '@opencollection/types/common/auth';
import { PropertyTable, type PropertyRow } from '../PropertyTable/PropertyTable';

interface AuthDetailsProps {
  auth?: Auth;
  authModeLabels?: Record<string, string>;
  inheritedFrom?: string;
  emptyMessage?: string;
  testId?: string;
}

const modeLabel = (auth: Auth, labels: Record<string, string>): string =>
  auth === 'inherit' ? 'Inherit' : labels[auth.type] || auth.type;

const pushRow = (rows: PropertyRow[], testId: string, label: string, value: unknown, secret = false): void => {
  if (typeof value === 'string' && value.length > 0) rows.push({ label, value, secret, testId });
};

const buildAuthRows = (auth: Exclude<Auth, 'inherit'>): PropertyRow[] => {
  const rows: PropertyRow[] = [];

  switch (auth.type) {
    case 'basic':
    case 'digest':
    case 'wsse':
      pushRow(rows, 'username', 'Username', auth.username);
      pushRow(rows, 'password', 'Password', auth.password, true);
      break;
    case 'ntlm':
      pushRow(rows, 'username', 'Username', auth.username);
      pushRow(rows, 'password', 'Password', auth.password, true);
      pushRow(rows, 'domain', 'Domain', auth.domain);
      break;
    case 'bearer':
      pushRow(rows, 'token', 'Token', auth.token, true);
      break;
    case 'apikey':
      pushRow(rows, 'key', 'Key', auth.key);
      pushRow(rows, 'value', 'Value', auth.value, true);
      pushRow(rows, 'add-to', 'Add To', auth.placement);
      break;
    case 'awsv4':
      pushRow(rows, 'access-key-id', 'Access Key Id', auth.accessKeyId);
      pushRow(rows, 'secret-access-key', 'Secret Access Key', auth.secretAccessKey, true);
      pushRow(rows, 'session-token', 'Session Token', auth.sessionToken, true);
      pushRow(rows, 'service', 'Service', auth.service);
      pushRow(rows, 'region', 'Region', auth.region);
      pushRow(rows, 'profile-name', 'Profile Name', auth.profileName);
      break;
    case 'oauth1':
      pushRow(rows, 'consumer-key', 'Consumer Key', auth.consumerKey);
      pushRow(rows, 'consumer-secret', 'Consumer Secret', auth.consumerSecret, true);
      pushRow(rows, 'access-token', 'Access Token', auth.accessToken, true);
      pushRow(rows, 'access-token-secret', 'Access Token Secret', auth.accessTokenSecret, true);
      pushRow(rows, 'signature-method', 'Signature Method', auth.signatureMethod);
      pushRow(rows, 'callback-url', 'Callback URL', auth.callbackUrl);
      pushRow(rows, 'placement', 'Placement', auth.placement);
      break;
    case 'oauth2': {
      const o = auth as {
        flow?: string;
        scope?: string;
        accessTokenUrl?: string;
        authorizationUrl?: string;
        callbackUrl?: string;
        credentials?: { clientId?: string; clientSecret?: string; placement?: string };
        resourceOwner?: { username?: string; password?: string };
      };
      pushRow(rows, 'flow', 'Flow', o.flow);
      pushRow(rows, 'client-id', 'Client Id', o.credentials?.clientId);
      pushRow(rows, 'client-secret', 'Client Secret', o.credentials?.clientSecret, true);
      pushRow(rows, 'add-credentials-to', 'Add Credentials To', o.credentials?.placement);
      pushRow(rows, 'access-token-url', 'Access Token URL', o.accessTokenUrl);
      pushRow(rows, 'authorization-url', 'Authorization URL', o.authorizationUrl);
      pushRow(rows, 'callback-url', 'Callback URL', o.callbackUrl);
      pushRow(rows, 'scope', 'Scope', o.scope);
      pushRow(rows, 'username', 'Username', o.resourceOwner?.username);
      pushRow(rows, 'password', 'Password', o.resourceOwner?.password, true);
      break;
    }
    default:
      break;
  }
  return rows;
};

export const AuthDetails: React.FC<AuthDetailsProps> = ({
  auth,
  authModeLabels = {},
  inheritedFrom,
  emptyMessage,
  testId
}) => {
  if (!auth) {
    return emptyMessage ? <PropertyTable rows={[]} emptyMessage={emptyMessage} testId={testId} /> : null;
  }

  const rows: PropertyRow[] = [{ label: 'Mode', value: modeLabel(auth, authModeLabels), testId: 'mode' }];

  if (auth === 'inherit') {
    if (inheritedFrom) rows.push({ label: 'Inherited From', value: inheritedFrom, testId: 'inherited-from' });
  } else {
    rows.push(...buildAuthRows(auth));
  }

  return <PropertyTable rows={rows} testId={testId} />;
};

export default AuthDetails;
