import React from 'react';
import type { HttpRequestBody, HttpRequestBodyVariant } from '@opencollection/types/requests/http';
import { Code } from '@components/Code/Code';
import { ContentTypeBadge } from '@components/ContentTypeBadge/ContentTypeBadge';
import { PropertyTable, type PropertyRow } from '@components/PropertyTable/PropertyTable';
import { VariableText } from '@components/VariableText/VariableText';
import { getBodyView, type BodyTableRow } from '@utils/request';
import { StyledWrapper } from './StyledWrapper';

interface RequestBodyProps {
  body?: HttpRequestBody | HttpRequestBodyVariant[];
  showContentType?: boolean;
  className?: string;
  hideRowBorders?: boolean;
}

/**
 * Multipart part value: a "File" tag for file parts, the value itself (with {{var}}
 * highlighting), and a per-part content-type badge when one is set.
 */
const BodyPartValue: React.FC<{ row: BodyTableRow }> = ({ row }) => (
  <span className="request-body-part">
    {row.partType === 'file' ? <span className="request-body-file-tag">File</span> : null}
    <VariableText value={row.value} />
    {row.contentType ? <span className="request-body-content-type">{row.contentType}</span> : null}
  </span>
);

export const RequestBody: React.FC<RequestBodyProps> = ({ body, showContentType = true, className, hideRowBorders = false }) => {
  const view = getBodyView(body);
  if (view.render === 'none') return null;

  return (
    <StyledWrapper className={['request-body', className].filter(Boolean).join(' ')}>
      {showContentType && <ContentTypeBadge label={view.contentTypeLabel} />}
      {view.render === 'code' && <Code code={view.code} language={view.language} showLineNumbers />}
      {view.render === 'table' && (
        <PropertyTable
          hideRowBorders={hideRowBorders}
          rows={view.rows.map<PropertyRow>((row) => ({
            label: row.name,
            value: row.value,
            disabled: row.disabled,
            description: row.description,
            node: row.partType === 'file' || row.contentType ? <BodyPartValue row={row} /> : undefined
          }))}
        />
      )}
      {view.render === 'file' && (
        <PropertyTable
          hideRowBorders={hideRowBorders}
          rows={view.files.map<PropertyRow>((file, index) => ({
            label: view.files.length > 1 ? `File ${index + 1}${file.selected ? ' · selected' : ''}` : 'File',
            value: file.filePath,
            description: file.description,
            node: file.contentType ? (
              <span className="request-body-part">
                <VariableText value={file.filePath} />
                <span className="request-body-content-type">{file.contentType}</span>
              </span>
            ) : undefined
          }))}
        />
      )}
    </StyledWrapper>
  );
};

export default RequestBody;
