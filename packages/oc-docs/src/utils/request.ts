import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type {
  HttpRequest,
  HttpRequestBody,
  HttpRequestBodyVariant,
  FileBodyVariant,
  HttpRequestHeader,
  HttpResponseHeader
} from '@opencollection/types/requests/http';
import type { PropertyRow } from '../components/PropertyTable/PropertyTable';
import type { Auth } from '@opencollection/types/common/auth';
import type { Scripts } from '@opencollection/types/common/scripts';
import type { Variable, SecretVariable, VariableValue, VariableValueType } from '@opencollection/types/common/variables';
import type { Action, ActionSetVariable, ActionVariableScope } from '@opencollection/types/common/actions';
import type { Description } from '@opencollection/types/common/description';
import {
  getRequestAuth,
  getItemName,
  getRequestScripts,
  scriptsArrayToObject,
  getRequestVariables
} from './schemaHelpers';
import { getItemUuid } from './itemUtils';
import { isSecretVariable, unwrapVariableValue } from './variableResolution';
import { COLLECTION_ROOT_CRUMB } from './common';

export const humanizeAuthMode = (auth: Auth | undefined, labels: Record<string, string>): string => {
  if (!auth) return 'No Auth';
  if (auth === 'inherit') return 'Inherit';
  return labels[auth.type] || auth.type;
};

export interface ResolvedAuth {
  auth?: Auth;
  source?: { level: 'collection' | 'folder'; name: string };
}

const folderAuth = (folder: Item): Auth | undefined =>
  (folder as { request?: { auth?: Auth } }).request?.auth;

const isConcrete = (auth: Auth | undefined): boolean => !!auth && auth !== 'inherit';

export const resolveInheritedAuth = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  item: HttpRequest
): ResolvedAuth => {
  const own = getRequestAuth(item) as Auth | undefined;
  if (own !== 'inherit') return { auth: own };

  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const auth = folderAuth(ancestors[i]);
    if (isConcrete(auth)) {
      return { auth, source: { level: 'folder', name: getItemName(ancestors[i]) || 'Folder' } };
    }
  }

  const collectionAuth = collection?.request?.auth as Auth | undefined;
  if (isConcrete(collectionAuth)) {
    return { auth: collectionAuth, source: { level: 'collection', name: collection?.info?.name || 'Collection' } };
  }

  return { auth: 'inherit' };
};

export const getDescription = (item: unknown): string | undefined => {
  if (!item || typeof item !== 'object') return undefined;
  const desc = (item as { description?: unknown }).description;
  if (typeof desc === 'string') return desc.trim() ? desc : undefined;
  if (desc && typeof desc === 'object' && 'content' in desc) {
    const content = (desc as { content?: unknown }).content;
    return typeof content === 'string' && content.trim() ? content : undefined;
  }
  return undefined;
};

export const headerRows = (headers: (HttpRequestHeader | HttpResponseHeader)[]): PropertyRow[] =>
  headers.map((h) => ({
    label: h.name,
    value: h.value,
    disabled: Boolean((h as HttpRequestHeader).disabled),
    description: getDescription(h)
  }));

const typeOfVariableValue = (value: VariableValue | undefined): VariableValueType | undefined =>
  typeof value === 'object' ? value.type : undefined;

export const getVariableType = (variable?: Variable | SecretVariable): VariableValueType | undefined => {
  if (!variable) return undefined;

  if (isSecretVariable(variable)) return variable.type;

  const { value } = variable;

  if (Array.isArray(value)) {
    if (value.length === 0) return undefined;
    const activeVariant = value.find((variant) => variant.selected) ?? value[0];
    return typeOfVariableValue(activeVariant.value);
  }

  return typeOfVariableValue(value);
};

export const getVariableTypeLabel = (variable?: Variable | SecretVariable): string =>
  getVariableType(variable) ?? 'string';

export interface BodyTableRow {
  name: string;
  value: string;
  partType?: 'text' | 'file';
  contentType?: string;
  disabled?: boolean;
  description?: string;
}

export interface FileBodyRow {
  filePath: string;
  contentType?: string;
  selected?: boolean;
  description?: string;
}

export type BodyView =
  | { render: 'code'; language: string; contentTypeLabel: string; code: string }
  | { render: 'table'; variant: 'urlencoded' | 'multipart'; contentTypeLabel: string; rows: BodyTableRow[] }
  | { render: 'file'; contentTypeLabel: string; files: FileBodyRow[] }
  | { render: 'none' };

const RAW_LANGUAGE: Record<string, string> = { json: 'json', xml: 'markup', text: 'text', sparql: 'text' };

const BODY_CONTENT_TYPE: Record<string, string> = {
  json: 'application/json',
  xml: 'application/xml',
  text: 'text/plain',
  sparql: 'application/sparql-query',
  'form-urlencoded': 'application/x-www-form-urlencoded',
  'multipart-form': 'multipart/form-data',
  file: 'application/octet-stream'
};

export const bodyContentTypeLabel = (type: string): string => BODY_CONTENT_TYPE[type] || type;

/** Example response body `type` -> Prism language. */
export const RESPONSE_LANGUAGE: Record<string, string> = {
  json: 'json',
  xml: 'markup',
  html: 'markup',
  text: 'text',
  binary: 'text'
};

/** Example response body `type` -> full MIME content type. */
export const RESPONSE_CONTENT_TYPE: Record<string, string> = {
  json: 'application/json',
  xml: 'application/xml',
  html: 'text/html',
  binary: 'application/octet-stream'
};

/** HTTP status code -> reason phrase (e.g. 404 -> "Not Found"). */
export const STATUS_CODE_PHRASES: Record<number, string> = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choice',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required'
};

export interface SelectedBody {
  body?: HttpRequestBody;
  variants?: { title: string; selected: boolean }[];
}

export const selectBodyVariant = (
  body: HttpRequestBody | HttpRequestBodyVariant[] | undefined
): SelectedBody => {
  if (!body) return {};
  if (Array.isArray(body)) {
    if (body.length === 0) return {};
    const selected = body.find((v) => v.selected) ?? body[0];
    const variants = body.map((v) => ({ title: v.title, selected: v === selected }));
    return { body: selected.body, variants: variants.length > 1 ? variants : undefined };
  }
  return { body };
};

export const getBodyView = (
  rawBody: HttpRequestBody | HttpRequestBodyVariant[] | undefined
): BodyView => {
  const { body } = selectBodyVariant(rawBody);
  if (!body || !body.type) return { render: 'none' };

  switch (body.type) {
    case 'json':
    case 'xml':
    case 'text':
    case 'sparql': {
      const data = typeof body.data === 'string' ? body.data : '';
      if (!data.trim()) return { render: 'none' };
      return {
        render: 'code',
        language: RAW_LANGUAGE[body.type] || 'text',
        contentTypeLabel: bodyContentTypeLabel(body.type),
        code: data
      };
    }
    case 'form-urlencoded': {
      const rows: BodyTableRow[] = (body.data || [])
        .map((entry) => ({
          name: entry.name,
          value: entry.value,
          disabled: entry.disabled,
          description: getDescription(entry)
        }))
        .filter((row) => row.name || row.value);
      if (rows.length === 0) return { render: 'none' };
      return { render: 'table', variant: 'urlencoded', contentTypeLabel: bodyContentTypeLabel(body.type), rows };
    }
    case 'multipart-form': {
      const rows: BodyTableRow[] = (body.data || [])
        .map((entry) => ({
          name: entry.name,
          value: Array.isArray(entry.value) ? entry.value.join(', ') : String(entry.value ?? ''),
          partType: entry.type,
          contentType: entry.contentType,
          disabled: entry.disabled,
          description: getDescription(entry)
        }))
        .filter((row) => row.name || row.value);
      if (rows.length === 0) return { render: 'none' };
      return { render: 'table', variant: 'multipart', contentTypeLabel: bodyContentTypeLabel(body.type), rows };
    }
    case 'file': {
      const variants: FileBodyVariant[] = body.data || [];
      const files: FileBodyRow[] = variants
        .map((v) => ({ filePath: v.filePath, contentType: v.contentType, selected: v.selected, description: getDescription(v) }))
        .filter((f) => f.filePath || f.contentType);
      if (files.length === 0) return { render: 'none' };
      return { render: 'file', contentTypeLabel: bodyContentTypeLabel('file'), files };
    }
    default:
      return { render: 'none' };
  }
};

export type ScriptLevel = 'collection' | 'folder' | 'request';
export type ScriptPhase = 'before-request' | 'after-response';

export type ScriptFlow = 'sandwich' | 'sequential';

interface ConfigExtension {
  scripts?: { flow?: unknown };
}

export const getScriptFlow = (collection: OpenCollection | null | undefined): ScriptFlow => {
  const ext = collection?.extensions?.config as ConfigExtension | undefined;
  const flow = ext?.scripts?.flow ?? (collection?.config as ConfigExtension | undefined)?.scripts?.flow;
  return flow === 'sequential' ? 'sequential' : 'sandwich';
};

export interface ScriptChainStep {
  level: ScriptLevel;
  phase: ScriptPhase;
  label: string;
  sourceName?: string;
  sourceUuid?: string;
  code: string;
  order: number;
}

interface ScriptSource {
  level: ScriptLevel;
  order: number;
  sourceName?: string;
  sourceUuid?: string;
  pre?: string;
  post?: string;
}

const folderScripts = (folder: Item): Scripts | undefined =>
  (folder as { request?: { scripts?: Scripts } }).request?.scripts;

const stepLabel = (level: ScriptLevel, phase: ScriptPhase): string => {
  const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);
  return `${levelLabel} ${phase === 'before-request' ? 'Pre-Request' : 'Post-Response'}`;
};

export const buildScriptChain = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  item: HttpRequest
): ScriptChainStep[] => {
  const collectionScripts = scriptsArrayToObject(collection?.request?.scripts);
  const sources: ScriptSource[] = [
    { level: 'collection', order: 0, sourceName: collection?.info?.name, sourceUuid: COLLECTION_ROOT_CRUMB, pre: collectionScripts.preRequest, post: collectionScripts.postResponse }
  ];
  ancestors.forEach((folder) => {
    const s = scriptsArrayToObject(folderScripts(folder));
    sources.push({ level: 'folder', order: sources.length, sourceName: getItemName(folder), sourceUuid: getItemUuid(folder), pre: s.preRequest, post: s.postResponse });
  });
  const requestScripts = scriptsArrayToObject(getRequestScripts(item));
  sources.push({ level: 'request', order: sources.length, pre: requestScripts.preRequest, post: requestScripts.postResponse });

  const steps: ScriptChainStep[] = [];

  sources.forEach((source) => {
    if (source.pre && source.pre.trim()) {
      steps.push({
        level: source.level,
        phase: 'before-request',
        label: stepLabel(source.level, 'before-request'),
        sourceName: source.sourceName,
        sourceUuid: source.sourceUuid,
        code: source.pre,
        order: source.order
      });
    }
  });

  [...sources].reverse().forEach((source) => {
    if (source.post && source.post.trim()) {
      steps.push({
        level: source.level,
        phase: 'after-response',
        label: stepLabel(source.level, 'after-response'),
        sourceName: source.sourceName,
        sourceUuid: source.sourceUuid,
        code: source.post,
        order: source.order
      });
    }
  });

  return steps;
};

export interface PreRequestVarRow {
  name: string;
  value: string;
  type?: string;
  description?: string;
  disabled?: boolean;
}

export interface PostResponseVarRow {
  name: string;
  expression: string;
  scope?: string;
  description?: string;
  disabled?: boolean;
}

// Editable post-response variable used by VariablesTab (expr = capture expression).
export interface PostResponseVar {
  name?: string;
  expr?: string;
  disabled?: boolean;
  scope?: ActionVariableScope;
  description?: Description;
}

export interface PostResponseRowInput {
  name?: string;
  value?: string;
  enabled?: boolean;
  scope?: ActionVariableScope;
  description?: Description;
}

// Shared row-builders. Request items keep vars/actions under `runtime`; collection
// and folder defaults keep them under `request` — but both map to the same rows.
const toPreRequestVarRow = (variable: Variable): PreRequestVarRow => ({
  name: variable.name,
  value: unwrapVariableValue(variable.value),
  type: getVariableTypeLabel(variable),
  description: getDescription(variable),
  disabled: variable.disabled
});

export const isAfterResponseSetVariable = (action: Action): action is ActionSetVariable =>
  action.type === 'set-variable' && (action.phase ?? 'after-response') === 'after-response';

const toPostResponseVarRow = (action: Action): PostResponseVarRow => ({
  name: action.variable.name,
  expression: action.selector.expression,
  scope: action.variable.scope,
  description: getDescription(action),
  disabled: action.disabled
});

export const getPreRequestVars = (item: HttpRequest): PreRequestVarRow[] =>
  getRequestVariables(item).map(toPreRequestVarRow);

export const getPostResponseVars = (item: HttpRequest): PostResponseVarRow[] =>
  (item.runtime?.actions ?? []).filter(isAfterResponseSetVariable).map(toPostResponseVarRow);

// Bridge the OC actions model (after-response set-variable) to the editable Variables rows, and back.
export const actionsToPostResponseVars = (actions: Action[] = []): PostResponseVar[] =>
  actions.filter(isAfterResponseSetVariable).map((action) => ({
    name: action.variable?.name,
    expr: action.selector?.expression,
    disabled: action.disabled,
    scope: action.variable?.scope,
    description: action.description
  }));

export const postResponseVarsToActions = (rows: PostResponseRowInput[], actions: Action[] = []): Action[] => {
  const others = actions.filter((action) => !isAfterResponseSetVariable(action));
  const postActions: ActionSetVariable[] = rows.map((row) => ({
    type: 'set-variable',
    phase: 'after-response',
    selector: { expression: row.value ?? '', method: 'jsonq' },
    variable: { name: row.name ?? '', scope: row.scope || 'runtime' },
    disabled: !row.enabled,
    ...(row.description !== undefined ? { description: row.description } : {})
  }));
  return [...others, ...postActions];
};

type RequestDefaultsHolder =
  | { request?: { variables?: Variable[]; actions?: Action[] } }
  | null
  | undefined;

export const getRequestDefaultsVars = (
  node: RequestDefaultsHolder
): { preVars: PreRequestVarRow[]; postVars: PostResponseVarRow[] } => {
  const request = node?.request ?? {};

  const preVars = (request.variables ?? [])
    .filter((v): v is Variable => Boolean(v && v.name))
    .map(toPreRequestVarRow);

  const postVars = (request.actions ?? [])
    .filter((a) => isAfterResponseSetVariable(a) && Boolean(a.variable?.name))
    .map(toPostResponseVarRow);

  return { preVars, postVars };
};

export const getCollectionVariables = (
  collection: OpenCollection | null | undefined
): { preVars: PreRequestVarRow[]; postVars: PostResponseVarRow[] } => getRequestDefaultsVars(collection);

/**
 * Short, uppercased method name matching the design (DELETE -> DEL, OPTIONS ->
 * OPT); every other method is shown as-is. Single source for the method badges
 * and filter chips so the abbreviations can't drift between components.
 */
export const getShortMethod = (method: string): string => {
  const m = method.toUpperCase();
  if (m === 'DELETE') return 'DEL';
  if (m === 'OPTIONS') return 'OPT';
  return m;
};
