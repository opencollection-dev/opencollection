import { useMemo } from 'react';
import { RunRequestResponse } from '../runner';

export function useInitialResponseFormat(headers: RunRequestResponse['headers']): ResponseBodyFormatViewData {
  return useMemo<ResponseBodyFormatViewData>(() => {
    if (headers == null) {
      return { format: 'raw', view: 'preview' };
    }
    const key = Object.keys(headers).find((header) => header.toLowerCase() === 'content-type');
    const contentType = key ? headers[key] : 'raw';
    return getDefaultResponseFormat(contentType);
  }, [headers]);
}

// Normalize & extract MIME type from full header
const extractMimeType = (contentType = '') => {
  const cleaned = String(contentType).trim().toLowerCase();
  const match = cleaned.match(/^[^;]+/); // strip "; charset=utf-8"
  return match ? match[0] : cleaned;
};

export type ResponseBodyFormat = 'html' | 'json' | 'xml' | 'javascript' | 'base64' | 'raw' | 'hex';

export type ResponseBodyView = 'preview' | 'editor';

export interface ResponseBodyFormatViewData {
  format: ResponseBodyFormat;
  view: ResponseBodyView;
}

export function getDefaultResponseFormat(contentType: string): ResponseBodyFormatViewData {
  const mime = extractMimeType(contentType);

  const rules = [
    // ====== HTML ======
    { test: /^text\/html$/, result: { format: 'html', view: 'preview' } },

    // ====== JSON (including custom +json types) ======
    {
      test: /^application\/(json|.+\+json)$/,
      result: { format: 'json', view: 'editor' }
    },
    {
      test: /^text\/(json|.+\+json)$/,
      result: { format: 'json', view: 'editor' }
    },

    // ====== XML (including custom +xml types) ======
    {
      test: /^application\/(xml|.+\+xml)$/,
      result: { format: 'xml', view: 'editor' }
    },
    {
      test: /^text\/(xml|.+\+xml)$/,
      result: { format: 'xml', view: 'editor' }
    },

    // ====== JavaScript ======
    {
      test: /^(application|text)\/javascript$/,
      result: { format: 'javascript', view: 'editor' }
    },

    // ====== Images, audio, video, PDFs → preview (base64) ======
    { test: /^image\//, result: { format: 'base64', view: 'preview' } },
    { test: /^audio\//, result: { format: 'base64', view: 'preview' } },
    { test: /^video\//, result: { format: 'base64', view: 'preview' } },
    {
      test: /^application\/pdf$/,
      result: { format: 'base64', view: 'preview' }
    },

    // ====== Any other text types ======
    { test: /^text\//, result: { format: 'raw', view: 'editor' } }
  ];

  for (const rule of rules) {
    if (rule.test.test(mime)) {
      return rule.result as ResponseBodyFormatViewData;
    }
  }

  // ====== Fallback ======
  return { format: 'raw', view: 'editor' };
}
