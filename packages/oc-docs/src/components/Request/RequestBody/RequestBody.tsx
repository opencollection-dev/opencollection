import React from 'react';
import type { HttpRequestBody, HttpRequestBodyVariant } from '@opencollection/types/requests/http';
import { Code } from '../../Code/Code';
import { ContentTypeBadge } from '../../ContentTypeBadge/ContentTypeBadge';
import { PropertyTable, type PropertyRow } from '../../PropertyTable/PropertyTable';
import { getBodyView } from '../../../utils/requestBody';
import { StyledWrapper } from './StyledWrapper';

interface RequestBodyProps {
  body?: HttpRequestBody | HttpRequestBodyVariant[];
  showContentType?: boolean;
  className?: string;
}

export const RequestBody: React.FC<RequestBodyProps> = ({ body, showContentType = true, className }) => {
  const view = getBodyView(body);
  if (view.render === 'none') return null;

  return (
    <StyledWrapper className={['oc-request-body', className].filter(Boolean).join(' ')}>
      {showContentType && <ContentTypeBadge label={view.contentTypeLabel} />}
      {view.render === 'code' && <Code code={view.code} language={view.language} showLineNumbers />}
      {view.render === 'table' && (
        <PropertyTable
          rows={view.rows.map<PropertyRow>((row) => ({
            label: row.name,
            value: row.value,
            disabled: row.disabled
          }))}
        />
      )}
      {view.render === 'file' && <p className="oc-request-body-file">{view.filePath}</p>}
    </StyledWrapper>
  );
};

export default RequestBody;
