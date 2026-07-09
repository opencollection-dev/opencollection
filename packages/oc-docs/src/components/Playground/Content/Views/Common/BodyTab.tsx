import React from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import CodeEditor from '../../../../../ui/CodeEditor/CodeEditor';
import { CopyButton } from '../../../../../ui/CopyButton/CopyButton';
import KeyValueTable, { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';

interface BodyTabProps {
  body: any;
  onItemChange: (item: HttpRequest) => void;
  item: HttpRequest;
}

export const BodyTab: React.FC<BodyTabProps> = ({
  body,
  onItemChange,
  item
}) => {
  const handleFormBodyChange = (formData: KeyValueRow[]) => {
    const updatedBody = {
      type: 'form-urlencoded' as const,
      data: formData.map(f => ({
        name: f.name,
        value: f.value,
        disabled: !f.enabled
      }))
    };
    onItemChange({ 
      ...item, 
      http: { 
        ...item.http, 
        body: updatedBody 
      } 
    });
  };

  return (
    <div className="space-y-3">
      {!body ? (
        <div className="text-center py-6 border-2 border-dashed rounded" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          No body content. Select a body type to add content.
        </div>
      ) : 'data' in body && typeof body.data === 'string' ? (
        <div className="relative">
          <CopyButton text={body.data} label="Copy body" testId="body-copy" className="absolute top-2 right-2 z-10" />
          <CodeEditor
            value={body.data}
            onChange={(value) => {
              if ('data' in body && typeof body.data === 'string') {
                onItemChange({
                  ...item,
                  http: {
                    ...item.http,
                    body: { ...body, data: value } as typeof body
                  }
                });
              }
            }}
            language={
              body.type === 'json'
                ? 'json'
                : body.type === 'xml'
                  ? 'xml'
                  : body.type === 'sparql'
                    ? 'sparql'
                    : 'text'
            }
            height="300px"
          />
        </div>
      ) : Array.isArray(body) || (body?.type === 'form-urlencoded' && Array.isArray(body?.data)) ? (
        (() => {
          const formDataArray = Array.isArray(body) ? body : (body?.data || []);
          const formBodyData: KeyValueRow[] = (formDataArray as any[]).map((field: any, index: number) => ({
            id: `form-${index}`,
            name: field.name || '',
            value: field.value || '',
            enabled: field.disabled !== true
          }));

          return (
            <div>
              <div className="mb-4">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Form Data
                </span>
              </div>
              <KeyValueTable
                data={formBodyData}
                onChange={handleFormBodyChange}
                keyPlaceholder="Key"
                valuePlaceholder="Value"
                showEnabled={true}
              />
            </div>
          );
        })()
        ) : (
        <div className="text-center py-6" style={{ color: 'var(--text-secondary)' }}>
          Unsupported body type
        </div>
      )}
    </div>
  );
};

export default BodyTab;
