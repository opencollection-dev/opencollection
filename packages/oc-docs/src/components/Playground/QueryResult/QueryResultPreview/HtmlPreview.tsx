import { memo, useMemo } from 'react';

export interface HtmlPreviewProps {
  data: unknown;
  /** Base URL injected as `<base href>` so relative links/resources resolve. */
  baseUrl?: string;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const toHtmlString = (data: unknown): string => {
  if (data === null || data === undefined) return String(data);
  if (typeof data === 'object') {
    try {
      return JSON.stringify(data);
    } catch {
      return String(data);
    }
  }
  return String(data);
};

/**
 * Renders an HTML response inside a sandboxed iframe. Unlike bruno-app (which
 * uses an Electron `<webview>`), this runs in the browser, so a sandboxed
 * iframe with `srcDoc` is used. Scripts are disabled (no `allow-scripts`) so
 * untrusted response HTML cannot execute.
 */
const HtmlPreview = memo(({ data, baseUrl = '' }: HtmlPreviewProps) => {
  const srcDoc = useMemo(() => {
    const html = toHtmlString(data);
    const baseTag = `<base href="${escapeHtml(baseUrl)}">`;
    return html.includes('<head>')
      ? html.replace('<head>', `<head>${baseTag}`)
      : `<head>${baseTag}</head>${html}`;
  }, [data, baseUrl]);

  return (
    <div className="h-full bg-white webview-container">
      <iframe
        title="HTML preview"
        className="w-full h-full bg-white"
        style={{ border: 'none' }}
        sandbox="allow-same-origin"
        srcDoc={srcDoc}
      />
    </div>
  );
});

HtmlPreview.displayName = 'HtmlPreview';

export default HtmlPreview;
