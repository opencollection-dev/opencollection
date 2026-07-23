import React from 'react';
import HtmlPreview from './HtmlPreview';
import JsonPreview from './JsonPreview';
import TextPreview from './TextPreview';
import XmlPreview from './XmlPreview/XmlPreview';
import type { PreviewMode } from './previewMode';

export type { PreviewMode } from './previewMode';

export interface QueryResultPreviewProps {
  /** The response body to preview. */
  data: unknown;
  /** How to render the data. */
  previewMode: PreviewMode;
  /** Base URL used to resolve relative links/resources in the HTML preview. */
  baseUrl?: string;
}

/**
 * Renders a response body preview. Ported from bruno-app's QueryResultPreview,
 * scoped to the modes feasible in a browser (HTML via sandboxed iframe, JSON,
 * XML, and plain text). Editor rendering stays in ResponseBodyTab's CodeEditor.
 */
const QueryResultPreview: React.FC<QueryResultPreviewProps> = ({ data, previewMode, baseUrl }) => {
  switch (previewMode) {
    case 'web':
      return <HtmlPreview data={data} baseUrl={baseUrl ?? ''} />;
    case 'json':
      return <JsonPreview data={data} />;
    case 'xml':
      return <XmlPreview data={data} />;
    case 'text':
      return <TextPreview data={data} />;
    default:
      return (
        <div className="p-4 flex flex-col items-center justify-center h-full text-center">
          <div className="text-lg font-semibold mb-2" style={{ color: 'var(--oc-text)' }}>
            No Preview Available
          </div>
          <div className="text-sm" style={{ color: 'var(--oc-colors-text-muted)' }}>
            Sorry, no preview is available for this content type.
          </div>
        </div>
      );
  }
};

export default QueryResultPreview;
