import React from 'react';
import type { Auth } from '@opencollection/types/common/auth';
import { PropertyTable, type PropertyRow } from '../PropertyTable/PropertyTable';
import { AUTH_TYPES } from '../../constants';

interface AuthDetailsProps {
  auth?: Auth;
  authModeLabels?: Record<string, string>;
  inheritedFrom?: string;
  emptyMessage?: string;
  testId?: string;
}

const modeLabel = (auth: Auth, labels: Record<string, string>): string =>
  auth === 'inherit' ? 'Inherit' : labels[auth.type] || auth.type;

/** Humanize the API-key / OAuth placement stored on the schema (e.g. `queryparams` -> `Query Params`). */
const placementLabel = (placement: unknown): string | undefined => {
  if (typeof placement !== 'string' || !placement) return undefined;
  const normalized = placement.toLowerCase().replace(/[_-]/g, '');
  if (normalized === 'header' || normalized === 'headers') return 'Header';
  if (normalized === 'query' || normalized === 'queryparams' || normalized === 'queryparam') return 'Query Params';
  if (normalized === 'body') return 'Body';
  if (normalized === 'basicauthheader') return 'Basic Auth Header';
  return placement;
};

/** Title-case a snake/kebab-cased token, e.g. `authorization_code` -> `Authorization Code`. */
const humanizeToken = (value: unknown): string | undefined => {
  if (typeof value !== 'string' || !value) return undefined;
  return value
    .split(/[_-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/** OAuth2 token source (`access_token` / `id_token`) as a friendly label. */
const tokenSourceLabel = (source: unknown): string | undefined =>
  source === 'access_token' ? 'Access Token' : source === 'id_token' ? 'ID Token' : humanizeToken(source);

/** OAuth2 token placement is `{ header }` or `{ query }` — describe where the token lands. */
const tokenPlacementLabel = (placement: unknown): string | undefined => {
  if (!placement || typeof placement !== 'object') return undefined;
  const p = placement as { header?: string; query?: string };
  if (typeof p.header === 'string') return p.header ? `Header (${p.header})` : 'Header';
  if (typeof p.query === 'string') return p.query ? `Query Params (${p.query})` : 'Query Params';
  return undefined;
};

/** OAuth2 PKCE config -> `Disabled`, the challenge method (e.g. `S256`), or `Enabled`. */
const pkceLabel = (pkce: unknown): string | undefined => {
  if (!pkce || typeof pkce !== 'object') return undefined;
  const p = pkce as { disabled?: boolean; method?: string };
  if (p.disabled) return 'Disabled';
  return p.method || 'Enabled';
};

const pushRow = (rows: PropertyRow[], testId: string, label: string, value: unknown, secret = false): void => {
  if (typeof value === 'string' && value.length > 0) rows.push({ label, value, secret, testId });
};

const pushBool = (rows: PropertyRow[], testId: string, label: string, value: unknown): void => {
  if (typeof value === 'boolean') rows.push({ label, value: value ? 'Yes' : 'No', testId });
};

const buildAuthRows = (auth: Exclude<Auth, 'inherit'>): PropertyRow[] => {
  const rows: PropertyRow[] = [];

  switch (auth.type) {
    case AUTH_TYPES.BASIC:
    case AUTH_TYPES.DIGEST:
    case AUTH_TYPES.WSSE:
      pushRow(rows, 'username', 'Username', auth.username);
      pushRow(rows, 'password', 'Password', auth.password, true);
      break;
    case AUTH_TYPES.NTLM:
      pushRow(rows, 'username', 'Username', auth.username);
      pushRow(rows, 'password', 'Password', auth.password, true);
      pushRow(rows, 'domain', 'Domain', auth.domain);
      break;
    case AUTH_TYPES.BEARER:
      pushRow(rows, 'token', 'Token', auth.token, true);
      break;
    case AUTH_TYPES.API_KEY:
      pushRow(rows, 'key', 'Key', auth.key);
      pushRow(rows, 'value', 'Value', auth.value, true);
      pushRow(rows, 'add-to', 'Add To', placementLabel(auth.placement));
      break;
    case AUTH_TYPES.AWS_V4:
      pushRow(rows, 'access-key-id', 'Access Key Id', auth.accessKeyId);
      pushRow(rows, 'secret-access-key', 'Secret Access Key', auth.secretAccessKey, true);
      pushRow(rows, 'session-token', 'Session Token', auth.sessionToken, true);
      pushRow(rows, 'service', 'Service', auth.service);
      pushRow(rows, 'region', 'Region', auth.region);
      pushRow(rows, 'profile-name', 'Profile Name', auth.profileName);
      break;
    case AUTH_TYPES.OAUTH1:
      pushRow(rows, 'consumer-key', 'Consumer Key', auth.consumerKey);
      pushRow(rows, 'consumer-secret', 'Consumer Secret', auth.consumerSecret, true);
      pushRow(rows, 'access-token', 'Access Token', auth.accessToken, true);
      pushRow(rows, 'access-token-secret', 'Access Token Secret', auth.accessTokenSecret, true);
      pushRow(rows, 'signature-method', 'Signature Method', auth.signatureMethod);
      pushRow(rows, 'private-key', 'Private Key', auth.privateKey?.value, auth.privateKey?.type !== 'file');
      pushRow(rows, 'callback-url', 'Callback URL', auth.callbackUrl);
      pushRow(rows, 'verifier', 'Verifier', auth.verifier);
      pushRow(rows, 'timestamp', 'Timestamp', auth.timestamp);
      pushRow(rows, 'nonce', 'Nonce', auth.nonce);
      pushRow(rows, 'version', 'Version', auth.version);
      pushRow(rows, 'realm', 'Realm', auth.realm);
      pushBool(rows, 'include-body-hash', 'Include Body Hash', auth.includeBodyHash);
      pushRow(rows, 'placement', 'Placement', placementLabel(auth.placement));
      break;
    case AUTH_TYPES.OAUTH2: {
      const o = auth as {
        flow?: string;
        scope?: string;
        state?: string;
        accessTokenUrl?: string;
        refreshTokenUrl?: string;
        authorizationUrl?: string;
        callbackUrl?: string;
        credentials?: { clientId?: string; clientSecret?: string; placement?: string };
        resourceOwner?: { username?: string; password?: string };
        pkce?: { disabled?: boolean; method?: string };
        tokenConfig?: { source?: string; placement?: { header?: string; query?: string } };
        settings?: { autoFetchToken?: boolean; autoRefreshToken?: boolean };
      };
      pushRow(rows, 'flow', 'Flow', humanizeToken(o.flow));
      pushRow(rows, 'client-id', 'Client Id', o.credentials?.clientId);
      pushRow(rows, 'client-secret', 'Client Secret', o.credentials?.clientSecret, true);
      pushRow(rows, 'add-credentials-to', 'Add Credentials To', placementLabel(o.credentials?.placement));
      pushRow(rows, 'authorization-url', 'Authorization URL', o.authorizationUrl);
      pushRow(rows, 'access-token-url', 'Access Token URL', o.accessTokenUrl);
      pushRow(rows, 'refresh-token-url', 'Refresh Token URL', o.refreshTokenUrl);
      pushRow(rows, 'callback-url', 'Callback URL', o.callbackUrl);
      pushRow(rows, 'scope', 'Scope', o.scope);
      pushRow(rows, 'state', 'State', o.state);
      pushRow(rows, 'pkce', 'PKCE', pkceLabel(o.pkce));
      pushRow(rows, 'token-source', 'Token Source', tokenSourceLabel(o.tokenConfig?.source));
      pushRow(rows, 'token-placement', 'Token Placement', tokenPlacementLabel(o.tokenConfig?.placement));
      pushBool(rows, 'auto-fetch-token', 'Auto Fetch Token', o.settings?.autoFetchToken);
      pushBool(rows, 'auto-refresh-token', 'Auto Refresh Token', o.settings?.autoRefreshToken);
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
  testId = 'auth-details'
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
