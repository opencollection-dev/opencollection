import React, { useMemo } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import CodeEditor from '../../../../../ui/CodeEditor/CodeEditor';
import EditableTable, { type EditableTableColumn, type EditableTableRow } from '../../../../../ui/EditableTable';
import HighlightedInput from '../../../../../ui/HighlightedInput/HighlightedInput';

interface FormDataRow extends EditableTableRow {
  name: string;
  value: string;
  enabled: boolean;
}

const generateUid = () => `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
  const handleFormBodyChange = (formData: FormDataRow[]) => {
    const updatedBody = {
      type: 'form-urlencoded' as const,
      data: formData.map(f => ({
        uid: f.uid,
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

  const formBodyData: FormDataRow[] = useMemo(() => {
    if (!Array.isArray(body)) return [];
    return (body as any[]).map((field: any) => ({
      uid: field.uid || generateUid(),
      name: field.name || '',
      value: field.value || '',
      enabled: field.enabled !== false
    }));
  }, [body]);

  const formColumns: EditableTableColumn<FormDataRow>[] = useMemo(() => [
    {
      key: 'name',
      name: 'Key',
      isKeyField: true,
      placeholder: 'Key',
      width: '35%'
    },
    {
      key: 'value',
      name: 'Value',
      placeholder: 'Value',
      render: ({ row, value, isLastEmptyRow, onChange }) => (
        <HighlightedInput
          value={value}
          onChange={onChange}
          placeholder={isLastEmptyRow ? 'Value' : ''}
        />
      )
    }
  ], []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Body Type:
          </span>
          <select
            value={
              !body ? 'none' :
              'type' in body ? body.type :
              Array.isArray(body) ? 'form-urlencoded' : 'none'
            }
            onChange={(e) => {
              const bodyType = e.target.value;
              if (bodyType === 'none') {
                onItemChange({
                  ...item,
                  http: {
                    ...item.http,
                    body: undefined
                  }
                });
              } else if (['json', 'text', 'xml', 'sparql'].includes(bodyType)) {
                onItemChange({
                  ...item,
                  http: {
                    ...item.http,
                    body: { type: bodyType as any, data: '' }
                  }
                });
              } else if (bodyType === 'form-urlencoded') {
                onItemChange({
                  ...item,
                  http: {
                    ...item.http,
                    body: [] as any
                  }
                });
              }
            }}
            className="px-2 py-1 text-sm border rounded"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="none">None</option>
            <option value="json">JSON</option>
            <option value="text">Text</option>
            <option value="xml">XML</option>
            <option value="form-urlencoded">Form URL Encoded</option>
          </select>
        </div>
      </div>

      {!body ? (
        <div className="text-center py-6 border-2 border-dashed rounded" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          No body content. Select a body type to add content.
        </div>
      ) : 'data' in body && typeof body.data === 'string' ? (
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
          language={body.type === 'json' ? 'json' : body.type === 'xml' ? 'xml' : 'text'}
          height="300px"
          enableVariableHighlighting={true}
        />
      ) : Array.isArray(body) ? (
        <div>
          <div className="mb-4">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Form Data
            </span>
          </div>
          <EditableTable
            columns={formColumns}
            rows={formBodyData}
            onChange={handleFormBodyChange}
            defaultRow={{ name: '', value: '', enabled: true }}
            showCheckbox={true}
            showDelete={true}
            checkboxKey="enabled"
          />
        </div>
      ) : (
        <div className="text-center py-6" style={{ color: 'var(--text-secondary)' }}>
          Unsupported body type
        </div>
      )}
    </div>
  );
};

export default BodyTab;
