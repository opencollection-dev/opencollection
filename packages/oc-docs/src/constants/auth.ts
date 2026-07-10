export const AUTH_TYPES = {
  BASIC: 'basic',
  DIGEST: 'digest',
  WSSE: 'wsse',
  NTLM: 'ntlm',
  BEARER: 'bearer',
  API_KEY: 'apikey',
  AWS_V4: 'awsv4',
  OAUTH1: 'oauth1',
  OAUTH2: 'oauth2',
  EDGEGRID: 'akamai-edgegrid'
} as const;

export type AuthType = (typeof AUTH_TYPES)[keyof typeof AUTH_TYPES];

export const AUTH_MODE_LABELS: Record<string, string> = {
  basic: 'Basic Auth',
  bearer: 'Bearer Token',
  apikey: 'API Key',
  oauth2: 'OAuth 2.0',
  oauth1: 'OAuth 1.0',
  digest: 'Digest Auth',
  awsv4: 'AWS Signature v4',
  ntlm: 'NTLM',
  wsse: 'WSSE',
  'akamai-edgegrid': 'Akamai EdgeGrid'
};

export const ADDITIONAL_PARAM_GROUPS: Array<{
  key: 'authorizationRequest' | 'accessTokenRequest' | 'refreshTokenRequest';
  label: string;
}> = [
  { key: 'authorizationRequest', label: 'Authorization Request' },
  { key: 'accessTokenRequest', label: 'Access Token Request' },
  { key: 'refreshTokenRequest', label: 'Refresh Token Request' }
];

export interface SelectOption {
  value: string;
  label: string;
}

export const AUTH_MODE_OPTIONS: SelectOption[] = [
  { value: 'basic', label: 'Basic Auth' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'apikey', label: 'API Key' },
  { value: 'digest', label: 'Digest Auth' },
  { value: 'wsse', label: 'WSSE' },
  { value: 'ntlm', label: 'NTLM' },
  { value: 'awsv4', label: 'AWS Signature v4' },
  { value: 'oauth1', label: 'OAuth 1.0' },
  { value: 'oauth2', label: 'OAuth 2.0' }
];

export const API_KEY_PLACEMENTS: SelectOption[] = [
  { value: 'header', label: 'Header' },
  { value: 'query', label: 'Query Params' }
];

export const OAUTH1_SIGNATURE_METHODS: SelectOption[] = [
  'HMAC-SHA1',
  'HMAC-SHA256',
  'HMAC-SHA512',
  'RSA-SHA1',
  'RSA-SHA256',
  'RSA-SHA512',
  'PLAINTEXT'
].map((method) => ({ value: method, label: method }));

export const OAUTH1_PLACEMENTS: SelectOption[] = [
  { value: 'header', label: 'Request Header' },
  { value: 'query', label: 'Query Params' },
  { value: 'body', label: 'Request Body' }
];

export const OAUTH2_FLOWS: SelectOption[] = [
  { value: 'authorization_code', label: 'Authorization Code' },
  { value: 'client_credentials', label: 'Client Credentials' },
  { value: 'resource_owner_password_credentials', label: 'Password Credentials' },
  { value: 'implicit', label: 'Implicit' }
];

export const OAUTH2_CREDENTIALS_PLACEMENTS: SelectOption[] = [
  { value: 'basic_auth_header', label: 'Basic Auth Header' },
  { value: 'body', label: 'Request Body' }
];

export const OAUTH2_PKCE_METHODS: SelectOption[] = [
  { value: 'S256', label: 'SHA-256' },
  { value: 'plain', label: 'Plain' }
];

export const OAUTH2_TOKEN_SOURCES: SelectOption[] = [
  { value: 'access_token', label: 'Access Token' },
  { value: 'id_token', label: 'ID Token' }
];

export const OAUTH2_TOKEN_PLACEMENTS: SelectOption[] = [
  { value: 'header', label: 'Header' },
  { value: 'query', label: 'Query Params' }
];

export const OAUTH2_PARAM_PLACEMENTS: SelectOption[] = [
  { value: 'header', label: 'Header' },
  { value: 'query', label: 'Query' },
  { value: 'body', label: 'Body' }
];

export type OAuth2Flow =
  | 'authorization_code'
  | 'client_credentials'
  | 'resource_owner_password_credentials'
  | 'implicit';

export const OAUTH2_FLOW_FIELDS: Record<OAuth2Flow, string[]> = {
  authorization_code: ['authorizationUrl', 'accessTokenUrl', 'refreshTokenUrl', 'callbackUrl', 'credentials', 'scope', 'state', 'pkce', 'additionalParameters', 'tokenConfig', 'settings'],
  client_credentials: ['accessTokenUrl', 'refreshTokenUrl', 'credentials', 'scope', 'additionalParameters', 'tokenConfig', 'settings'],
  resource_owner_password_credentials: ['accessTokenUrl', 'refreshTokenUrl', 'credentials', 'resourceOwner', 'scope', 'additionalParameters', 'tokenConfig', 'settings'],
  implicit: ['authorizationUrl', 'callbackUrl', 'credentials', 'scope', 'state', 'additionalParameters', 'tokenConfig', 'settings']
};

export const OAUTH2_ADDITIONAL_PARAM_PHASES: Record<OAuth2Flow, Array<{ key: string; label: string }>> = {
  authorization_code: [
    { key: 'authorizationRequest', label: 'Authorization request params' },
    { key: 'accessTokenRequest', label: 'Access token request params' },
    { key: 'refreshTokenRequest', label: 'Refresh token request params' }
  ],
  client_credentials: [
    { key: 'accessTokenRequest', label: 'Access token request params' },
    { key: 'refreshTokenRequest', label: 'Refresh token request params' }
  ],
  resource_owner_password_credentials: [
    { key: 'accessTokenRequest', label: 'Access token request params' },
    { key: 'refreshTokenRequest', label: 'Refresh token request params' }
  ],
  implicit: [{ key: 'authorizationRequest', label: 'Authorization request params' }]
};
