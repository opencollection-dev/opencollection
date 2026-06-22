import type {
  HttpRequestBody,
  HttpRequestBodyVariant,
  FileBodyVariant
} from '@opencollection/types/requests/http';

export interface BodyTableRow {
  name: string;
  value: string;
  partType?: 'text' | 'file';
  disabled?: boolean;
}

export type BodyView =
  | { render: 'code'; language: string; contentTypeLabel: string; code: string }
  | { render: 'table'; variant: 'urlencoded' | 'multipart'; contentTypeLabel: string; rows: BodyTableRow[] }
  | { render: 'file'; contentTypeLabel: string; filePath: string }
  | { render: 'none' };

const RAW_LANGUAGE: Record<string, string> = { json: 'json', xml: 'markup', text: 'text', sparql: 'text' };

/**
 * The full MIME content type for a body mode, e.g. `application/json` — shown on the
 * Body section chip. We display the real `Content-Type` value (not an abbreviation
 * like "JSON") so it reads exactly as the request sends it.
 */
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
  /** Present (length > 1) when the request defines multiple body variants. */
  variants?: { title: string; selected: boolean }[];
}

/** Resolve a body that may be a single body or an array of titled variants. */
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

/** Map a (resolved) body to a renderable view: code block, key/value table, file, or none. */
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
    case 'form-urlencoded':
      return {
        render: 'table',
        variant: 'urlencoded',
        contentTypeLabel: bodyContentTypeLabel(body.type),
        rows: (body.data || []).map((entry) => ({
          name: entry.name,
          value: entry.value,
          disabled: entry.disabled
        }))
      };
    case 'multipart-form':
      return {
        render: 'table',
        variant: 'multipart',
        contentTypeLabel: bodyContentTypeLabel(body.type),
        rows: (body.data || []).map((entry) => ({
          name: entry.name,
          value: Array.isArray(entry.value) ? entry.value.join(', ') : String(entry.value ?? ''),
          partType: entry.type,
          disabled: entry.disabled
        }))
      };
    case 'file': {
      const variants: FileBodyVariant[] = body.data || [];
      const selected = variants.find((v) => v.selected) ?? variants[0];
      if (!selected) return { render: 'none' };
      return { render: 'file', contentTypeLabel: bodyContentTypeLabel('file'), filePath: selected.filePath };
    }
    default:
      return { render: 'none' };
  }
};
