import React from 'react';
import type { Auth } from '@opencollection/types/common/auth';
import { PropertyTable, type PropertyRow } from '../PropertyTable/PropertyTable';

interface AuthDetailsProps {
  auth?: Auth;
  authModeLabels?: Record<string, string>;
  inheritedFrom?: string;
  emptyMessage?: string;
}

const modeLabel = (auth: Auth, labels: Record<string, string>): string =>
  auth === 'inherit' ? 'Inherit' : labels[auth.type] || auth.type;

const pushRow = (rows: PropertyRow[], label: string, value: unknown, secret = false): void => {
  if (typeof value === 'string' && value.length > 0) rows.push({ label, value, secret });
};

const buildAuthRows = (auth: Exclude<Auth, 'inherit'>): PropertyRow[] => {
  const rows: PropertyRow[] = [];

  switch (auth.type) {
    case 'basic':
    case 'digest':
    case 'wsse':
      pushRow(rows, 'Username', auth.username);
      pushRow(rows, 'Password', auth.password, true);
      break;
    case 'ntlm':
      pushRow(rows, 'Username', auth.username);
      pushRow(rows, 'Password', auth.password, true);
      pushRow(rows, 'Domain', auth.domain);
      break;
    case 'bearer':
      pushRow(rows, 'Token', auth.token, true);
      break;
    case 'apikey':
      pushRow(rows, 'Key', auth.key);
      pushRow(rows, 'Value', auth.value, true);
      pushRow(rows, 'Add To', auth.placement);
      break;
    case 'awsv4':
      pushRow(rows, 'Access Key Id', auth.accessKeyId);
      pushRow(rows, 'Secret Access Key', auth.secretAccessKey, true);
      pushRow(rows, 'Session Token', auth.sessionToken, true);
      pushRow(rows, 'Service', auth.service);
      pushRow(rows, 'Region', auth.region);
      pushRow(rows, 'Profile Name', auth.profileName);
      break;
    case 'oauth1':
      pushRow(rows, 'Consumer Key', auth.consumerKey);
      pushRow(rows, 'Consumer Secret', auth.consumerSecret, true);
      pushRow(rows, 'Access Token', auth.accessToken, true);
      pushRow(rows, 'Access Token Secret', auth.accessTokenSecret, true);
      pushRow(rows, 'Signature Method', auth.signatureMethod);
      pushRow(rows, 'Callback URL', auth.callbackUrl);
      pushRow(rows, 'Placement', auth.placement);
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
      pushRow(rows, 'Flow', o.flow);
      pushRow(rows, 'Client Id', o.credentials?.clientId);
      pushRow(rows, 'Client Secret', o.credentials?.clientSecret, true);
      pushRow(rows, 'Add Credentials To', o.credentials?.placement);
      pushRow(rows, 'Access Token URL', o.accessTokenUrl);
      pushRow(rows, 'Authorization URL', o.authorizationUrl);
      pushRow(rows, 'Callback URL', o.callbackUrl);
      pushRow(rows, 'Scope', o.scope);
      pushRow(rows, 'Username', o.resourceOwner?.username);
      pushRow(rows, 'Password', o.resourceOwner?.password, true);
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
  emptyMessage
}) => {
  if (!auth) {
    return emptyMessage ? <PropertyTable rows={[]} emptyMessage={emptyMessage} /> : null;
  }

  const rows: PropertyRow[] = [{ label: 'Mode', value: modeLabel(auth, authModeLabels) }];

  if (auth === 'inherit') {
    if (inheritedFrom) rows.push({ label: 'Inherited From', value: inheritedFrom });
  } else {
    rows.push(...buildAuthRows(auth));
  }

  return <PropertyTable rows={rows} />;
};

export default AuthDetails;
