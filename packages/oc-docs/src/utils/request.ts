import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type {
  HttpRequest,
  HttpRequestBody,
  HttpRequestBodyVariant,
  FileBodyVariant
} from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import type { Scripts } from '@opencollection/types/common/scripts';
import type { Variable } from '@opencollection/types/common/variables';
import {
  getRequestAuth,
  getItemName,
  getRequestScripts,
  scriptsArrayToObject,
  getRequestVariables
} from './schemaHelpers';
import { getItemUuid } from './itemUtils';
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

export const descriptionText = (desc: unknown): string | undefined => {
  if (typeof desc === 'string') return desc.trim() ? desc : undefined;
  if (desc && typeof desc === 'object' && 'content' in desc) {
    const content = (desc as { content?: unknown }).content;
    return typeof content === 'string' && content.trim() ? content : undefined;
  }
  return undefined;
};

export const getDescription = (item: unknown): string | undefined => {
  if (!item || typeof item !== 'object') return undefined;
  return descriptionText((item as { description?: unknown }).description);
};

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
        .map((v) => ({ filePath: v.filePath, contentType: v.contentType, selected: v.selected }))
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
  disabled?: boolean;
}

export interface PostResponseVarRow {
  name: string;
  expression: string;
  scope?: string;
  disabled?: boolean;
}

const flattenValue = (value: Variable['value']): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const selected = value.find((v) => v.selected) ?? value[0];
    return selected ? flattenValue(selected.value) : '';
  }
  return typeof value.data === 'string' ? value.data : '';
};

export const getPreRequestVars = (item: HttpRequest): PreRequestVarRow[] =>
  getRequestVariables(item).map((v: Variable) => ({
    name: v.name,
    value: flattenValue(v.value),
    disabled: v.disabled
  }));

export const getPostResponseVars = (item: HttpRequest): PostResponseVarRow[] => {
  const actions = item.runtime?.actions ?? [];
  return actions
    .filter((a) => a.type === 'set-variable' && (a.phase ?? 'after-response') === 'after-response')
    .map((a) => ({
      name: a.variable.name,
      expression: a.selector.expression,
      scope: a.variable.scope,
      disabled: a.disabled
    }));
};

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
