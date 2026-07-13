import type { VariableScope } from '@utils/variableResolution';

export const SCOPE_LABELS: Record<VariableScope, string> = {
  collection: 'Collection',
  environment: 'Environment',
  folder: 'Folder',
  request: 'Request',
  'process.env': 'Process Env',
  dynamic: 'Dynamic',
  oauth2: 'OAuth2',
  $secrets: 'Secret',
  undefined: 'Undefined'
};

export const INVALID_NAME_WARNING =
  'Invalid variable name! Variables must only contain alpha-numeric characters, "-", "_", "."';

export const SECRET_MASK = '*'.repeat(14);
