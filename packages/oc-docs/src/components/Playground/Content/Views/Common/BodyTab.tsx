import React from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import CodeEditor from '../../../../../ui/CodeEditor/CodeEditor';
import KeyValueTable, { type KeyValueRow } from '../../../../../components/KeyValueTable/KeyValueTable';
import type { RequestBody } from '../../../../../utils/schemaHelpers';

interface BodyTabProps {
  body: RequestBody;
  onItemChange: (item: HttpRequest) => void;
  item: HttpRequest;
  fillHeight?: boolean;
}

export const BodyTab: React.FC<BodyTabProps> = ({
  body,
  onItemChange,
  item,
  fillHeight = false
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

  const handleMultipartChange = (rows: KeyValueRow[]) => {
    // Rebuild the text fields from the table; preserve any file fields untouched.
    const textEntries = rows.map(r => ({
      name: r.name,
      value: r.value,
      type: 'text' as const,
      disabled: !r.enabled
    }));
    const fileEntries = (((body as { data?: any[] })?.data as any[]) || []).filter(e => e?.type === 'file');
    onItemChange({
      ...item,
      http: {
        ...item.http,
        body: { type: 'multipart-form' as const, data: [...textEntries, ...fileEntries] }
      }
    });
  };

  return (
    <div className={`space-y-3${fillHeight ? ' h-full flex flex-col' : ''}`}>
      {!body ? (
        <div data-testid="body-empty" className="text-center py-6 border-2 border-dashed rounded" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          No body content. Select a body type to add content.
        </div>
      ) : 'data' in body && typeof body.data === 'string' ? (
        <div className={fillHeight ? 'flex-1 min-h-0' : undefined}>
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
                ? 'jsonc'
                : body.type === 'xml'
                  ? 'xml'
                  : body.type === 'sparql'
                    ? 'sparql'
                    : 'text'
            }
            height={fillHeight ? '100%' : '300px'}
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
        ) : body?.type === 'multipart-form' && Array.isArray(body?.data) ? (
        (() => {
          const entries = body.data as any[];
          const textRows: KeyValueRow[] = entries
            .filter(e => e?.type !== 'file')
            .map((e, index) => ({
              id: `mp-${index}`,
              name: e.name || '',
              value: e.value || '',
              enabled: e.disabled !== true
            }));
          const fileEntries = entries.filter(e => e?.type === 'file');

          return (
            <div data-testid="body-multipart">
              <div className="mb-4">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Multipart Form
                </span>
              </div>
              <KeyValueTable
                data={textRows}
                onChange={handleMultipartChange}
                keyPlaceholder="Key"
                valuePlaceholder="Value"
                showEnabled={true}
              />
              {fileEntries.length > 0 && (
                <div className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="mb-1 font-medium">File fields (shown for reference — not sent from the browser)</div>
                  <ul className="list-disc pl-5">
                    {fileEntries.map((e, index) => (
                      <li key={index}>
                        {e.name}: {Array.isArray(e.value) ? e.value.join(', ') : e.value || '(no path)'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })()
        ) : body?.type === 'file' && Array.isArray(body?.data) ? (
        (() => {
          const variants = body.data as any[];
          const selected = variants.find(v => v?.selected) || variants[0];

          return (
            <div data-testid="body-file" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="mb-1 font-medium" style={{ color: 'var(--text-primary)' }}>File / Binary</div>
              <div>Path: {selected?.filePath || '(no file selected)'}</div>
              <div className="mt-1">The file isn&apos;t read in the browser preview, so the request runs without the file body.</div>
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
