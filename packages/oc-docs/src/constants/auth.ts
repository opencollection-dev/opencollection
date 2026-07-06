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
