import type { HttpRequestBody, HttpRequestBodyVariant } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { selectBodyVariant } from './requestBody';

export interface SnippetHeader {
  name: string;
  value: string;
}

export interface SnippetInput {
  method: string;
  url: string;
  /** Enabled request headers (name/value). */
  headers?: SnippetHeader[];
  body?: HttpRequestBody | HttpRequestBodyVariant[];
  /** Effective auth (already inheritance-resolved by the caller). */
  auth?: Auth;
}

type BodySnippet =
  | { kind: 'none' }
  | { kind: 'raw'; contentType: string; text: string }
  | { kind: 'urlencoded'; params: SnippetHeader[] }
  | { kind: 'multipart'; parts: { name: string; isFile: boolean; value: string }[] };

const RAW_CONTENT_TYPE: Record<string, string> = {
  json: 'application/json',
  xml: 'application/xml',
  text: 'text/plain',
  sparql: 'application/sparql-query'
};

const toBase64 = (input: string): string => {
  try {
    if (typeof btoa === 'function') return btoa(input);
  } catch {
    /* non-latin1 — fall through */
  }
  const nodeBuffer = (globalThis as { Buffer?: { from: (s: string, e: string) => { toString: (e: string) => string } } })
    .Buffer;
  return nodeBuffer ? nodeBuffer.from(input, 'utf-8').toString('base64') : input;
};

const normalizeBody = (raw: SnippetInput['body']): BodySnippet => {
  const { body } = selectBodyVariant(raw);
  if (!body || !body.type) return { kind: 'none' };
  switch (body.type) {
    case 'json':
    case 'xml':
    case 'text':
    case 'sparql': {
      const text = typeof body.data === 'string' ? body.data.trim() : '';
      return text ? { kind: 'raw', contentType: RAW_CONTENT_TYPE[body.type], text } : { kind: 'none' };
    }
    case 'form-urlencoded':
      return {
        kind: 'urlencoded',
        params: (body.data || []).filter((e) => e.disabled !== true).map((e) => ({ name: e.name, value: e.value }))
      };
    case 'multipart-form':
      return {
        kind: 'multipart',
        parts: (body.data || [])
          .filter((e) => e.disabled !== true)
          .map((e) => ({
            name: e.name,
            isFile: e.type === 'file',
            value: Array.isArray(e.value) ? e.value.join(',') : String(e.value ?? '')
          }))
      };
    default:
      return { kind: 'none' };
  }
};

/** Auth → header lines, or a comment for non-derivable schemes. `{{var}}` kept literal. */
const authContribution = (auth: Auth | undefined): { headers: SnippetHeader[]; comment?: string } => {
  if (!auth || auth === 'inherit') return { headers: [] };
  switch (auth.type) {
    case 'basic': {
      const username = auth.username ?? '';
      const password = auth.password ?? '';
      if (`${username}${password}`.includes('{{')) {
        return { headers: [], comment: 'auth: Basic Auth — credentials use variables' };
      }
      return { headers: [{ name: 'Authorization', value: `Basic ${toBase64(`${username}:${password}`)}` }] };
    }
    case 'bearer':
      return { headers: [{ name: 'Authorization', value: `Bearer ${auth.token ?? ''}` }] };
    case 'apikey':
      return auth.placement === 'query'
        ? { headers: [], comment: `auth: API Key — sent as query param "${auth.key ?? ''}"` }
        : { headers: [{ name: auth.key ?? 'X-API-Key', value: auth.value ?? '' }] };
    default:
      return { headers: [], comment: `auth: ${auth.type} — configure credentials` };
  }
};

const resolveHeaders = (
  input: SnippetInput,
  body: BodySnippet
): { headers: SnippetHeader[]; comment?: string } => {
  const headers = [...(input.headers ?? [])];
  const auth = authContribution(input.auth);
  auth.headers.forEach((h) => {
    if (!headers.some((existing) => existing.name.toLowerCase() === h.name.toLowerCase())) headers.push(h);
  });
  if (body.kind === 'raw' && !headers.some((h) => h.name.toLowerCase() === 'content-type')) {
    headers.push({ name: 'Content-Type', value: body.contentType });
  }
  return { headers, comment: auth.comment };
};

export const generateCurlCommand = (input: SnippetInput): string => {
  const body = normalizeBody(input.body);
  const { headers, comment } = resolveHeaders(input, body);
  const lines = [`curl -X ${input.method.toUpperCase()} '${input.url}'`];
  headers.forEach((h) => lines.push(`-H '${h.name}: ${h.value}'`));
  if (body.kind === 'raw') lines.push(`-d '${body.text}'`);
  else if (body.kind === 'urlencoded') body.params.forEach((p) => lines.push(`--data-urlencode '${p.name}=${p.value}'`));
  else if (body.kind === 'multipart')
    body.parts.forEach((p) => lines.push(`-F '${p.name}=${p.isFile ? `@${p.value}` : p.value}'`));
  const command = lines.join(' \\\n  ');
  return comment ? `# ${comment}\n${command}` : command;
};

export const generateJavaScriptCode = (input: SnippetInput): string => {
  const body = normalizeBody(input.body);
  const { headers, comment } = resolveHeaders(input, body);
  const headerLines = headers.map((h) => `    '${h.name}': '${h.value}'`).join(',\n');

  let setup = '';
  let bodyLine = '';
  if (body.kind === 'raw') {
    bodyLine = `,\n  body: ${JSON.stringify(body.text)}`;
  } else if (body.kind === 'urlencoded') {
    const obj = Object.fromEntries(body.params.map((p) => [p.name, p.value]));
    bodyLine = `,\n  body: new URLSearchParams(${JSON.stringify(obj)})`;
  } else if (body.kind === 'multipart') {
    setup =
      'const formData = new FormData();\n' +
      body.parts
        .map((p) => `formData.append('${p.name}', ${p.isFile ? `/* file */ '${p.value}'` : `'${p.value}'`});`)
        .join('\n') +
      '\n\n';
    bodyLine = ',\n  body: formData';
  }

  const lead = comment ? `// ${comment}\n` : '';
  return `${lead}${setup}const response = await fetch('${input.url}', {
  method: '${input.method.toUpperCase()}',
  headers: {
${headerLines}
  }${bodyLine}
});

const data = await response.json();`;
};

export const generatePythonCode = (input: SnippetInput): string => {
  const body = normalizeBody(input.body);
  const { headers, comment } = resolveHeaders(input, body);
  const headerLines = headers.map((h) => `        '${h.name}': '${h.value}'`).join(',\n');

  let bodyArg = '';
  if (body.kind === 'raw') {
    bodyArg = `,\n    data=${JSON.stringify(body.text)}`;
  } else if (body.kind === 'urlencoded') {
    const obj = Object.fromEntries(body.params.map((p) => [p.name, p.value]));
    bodyArg = `,\n    data=${JSON.stringify(obj)}`;
  } else if (body.kind === 'multipart') {
    const obj = Object.fromEntries(body.parts.map((p) => [p.name, p.value]));
    bodyArg = `,\n    files=${JSON.stringify(obj)}`;
  }

  const lead = comment ? `# ${comment}\n` : '';
  return `${lead}import requests

response = requests.${input.method.toLowerCase()}(
    '${input.url}',
    headers={
${headerLines}
    }${bodyArg}
)

data = response.json()`;
};
