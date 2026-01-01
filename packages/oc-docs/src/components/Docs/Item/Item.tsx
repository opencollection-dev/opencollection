import React, { memo, useCallback } from 'react';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-python';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Variable } from '@opencollection/types/common/variables';
import { generateSectionId, getItemId } from '../../../utils/itemUtils';
import {
  getItemType,
  getItemName,
  getItemDocs,
  getHttpMethod,
  getRequestUrl,
  getHttpHeaders,
  getHttpBody,
  getHttpParams,
  getRequestAuth,
  getRequestVariables,
  getRequestAssertions,
  getRequestScripts,
  scriptsArrayToObject,
  isFolder,
  isHttpRequest
} from '../../../utils/schemaHelpers';
import {
  MinimalDataTable,
  CompactCodeView,
  StatusBadge
} from '../../../ui/MinimalComponents';
import { CodeSnippets } from '../CodeSnippets/CodeSnippets';
import { StyledWrapper } from './StyledWrapper';
import { Scripts } from './Scripts/Scripts';
import { useMarkdownRenderer } from '../../../hooks';

const methodColors: Record<string, string> = {
  GET: '#10b981',
  POST: '#3b82f6',
  PUT: '#f59e0b',
  PATCH: '#a855f7',
  DELETE: '#ef4444',
  HEAD: '#8b5cf6',
  OPTIONS: '#06b6d4'
};

const Item = memo(({
  item,
  parentPath = '',
  collection,
  toggleRunnerMode,
  onTryClick
}: {
  item: any;
  parentPath?: string;
  collection?: any;
  toggleRunnerMode?: () => void;
  onTryClick?: () => void;
}) => {
  const md = useMarkdownRenderer();
  const itemId = getItemId(item);
  const sectionId = generateSectionId(item, parentPath);

  if (isFolder(item)) {
    const folderItem = item as any;
    const folderName = getItemName(folderItem) || 'Untitled Folder';
    const folderDocs = getItemDocs(folderItem);
    const folderHeaders = folderItem.request?.headers || [];
    const folderVariables = getRequestVariables(folderItem);
    const folderScripts = scriptsArrayToObject(getRequestScripts(folderItem));

    return (
      <StyledWrapper
        key={itemId}
        id={`section-${sectionId}`}
      >
        <div className="item-header-minimal">
          <div className="item-title-section">
            <div className="item-type-badge folder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <span>Folder</span>
            </div>
            <h1 className="item-title">{folderName}</h1>
          </div>
        </div>

        {folderDocs && (
          <div className="item-docs">
            <div dangerouslySetInnerHTML={{ __html: md.render(String(folderDocs)) }} />
          </div>
        )}

        <div className="item-content-grid">
          {folderHeaders && folderHeaders.length > 0 && (
            <MinimalDataTable
              data={folderHeaders}
              title="Headers"
              columns={[
                { key: 'name', label: 'Name', width: '30%' },
                { key: 'value', label: 'Value', width: '50%' },
                { key: 'enabled', label: '', width: '20%', render: (val: any) => val === false ? <StatusBadge status="inactive" text="Disabled" /> : null }
              ]}
            />
          )}

          {folderVariables && folderVariables.length > 0 && (
            <MinimalDataTable
              data={folderVariables.map((v: Variable) => ({
                name: v.name,
                value: v.value || '',
                enabled: !v.disabled
              }))}
              title="Variables"
              columns={[
                { key: 'name', label: 'Name', width: '40%' },
                { key: 'value', label: 'Value', width: '40%' },
                { key: 'enabled', label: '', width: '20%', render: (val) => <StatusBadge status={val ? 'active' : 'inactive'} /> }
              ]}
            />
          )}

          <Scripts
            preRequest={folderScripts.preRequest}
            postResponse={folderScripts.postResponse}
          />
        </div>
      </StyledWrapper>
    );
  }

  const itemType = getItemType(item);
  
  if (itemType === 'script') {
    const scriptItem = item as any;
    const scriptName = getItemName(scriptItem) || 'Untitled Script';

    return (
      <StyledWrapper
        key={itemId}
        id={`section-${sectionId}`}
      >
        <div className="item-header-minimal">
          <div className="item-title-section">
            <div className="item-type-badge script">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
              <span>Script</span>
            </div>
            <h1 className="item-title">{scriptName}</h1>
          </div>
        </div>

        {scriptItem.script && (
          <CompactCodeView
            code={scriptItem.script}
            language="javascript"
          />
        )}
      </StyledWrapper>
    );
  }

  if (itemType === 'http') {
    const httpItem = item as HttpRequest;
    const scripts = scriptsArrayToObject(getRequestScripts(httpItem));

    const endpoint = {
      id: itemId,
      name: getItemName(httpItem) || 'Untitled',
      method: getHttpMethod(httpItem),
      url: getRequestUrl(httpItem),
      description: getItemDocs(httpItem) || '',
      headers: getHttpHeaders(httpItem),
      body: getHttpBody(httpItem) || { mode: 'none' },
      params: getHttpParams(httpItem),
      auth: getRequestAuth(httpItem) || { mode: 'none' },
      vars: getRequestVariables(httpItem),
      assertions: getRequestAssertions(httpItem),
      tests: '',
      script: scripts
    };

    return (
      <StyledWrapper
        key={itemId}
        id={`section-${sectionId}`}
      >
        <div className="item-header-minimal">
          <div className="item-title-section">
            <h1 className="item-title">{endpoint.name}</h1>
            <div className="endpoint-badges">
              <span className="badge-method" style={{ backgroundColor: methodColors[endpoint.method?.toUpperCase()] }}>
                {endpoint.method}
              </span>
              <span className="badge-url">{endpoint.url}</span>
              {(onTryClick || toggleRunnerMode) && (
                <button
                  className="badge-try"
                  onClick={() => {
                    if (onTryClick) {
                      onTryClick();
                    } else if (toggleRunnerMode) {
                      toggleRunnerMode();
                    }
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Try
                </button>
              )}
            </div>
          </div>
        </div>

        {endpoint.description && (
          <div className="item-docs">
            <div dangerouslySetInnerHTML={{ __html: md.render(endpoint.description) }} />
          </div>
        )}

        <div className="item-content-main">
          <div className="request-details">
            {endpoint.params && endpoint.params.length > 0 && (
              <MinimalDataTable
                data={endpoint.params}
                title="Query Parameters"
                columns={[
                  { key: 'name', label: 'Name', width: '35%' },
                  { key: 'value', label: 'Value', width: '45%' },
                  { key: 'enabled', label: '', width: '20%', render: (val: any) => val === false ? <StatusBadge status="inactive" text="Disabled" /> : null }
                ]}
              />
            )}

            {endpoint.headers && endpoint.headers.length > 0 && (
              <MinimalDataTable
                data={endpoint.headers}
                title="Headers"
                columns={[
                  { key: 'name', label: 'Name', width: '35%' },
                  { key: 'value', label: 'Value', width: '45%' },
                  { key: 'enabled', label: '', width: '20%', render: (val: any) => val === false ? <StatusBadge status="inactive" text="Disabled" /> : null }
                ]}
              />
            )}

            {endpoint.body && typeof endpoint.body === 'object' && 'data' in endpoint.body && (
              <div className="request-body-section">
                <h3 className="section-title">Body</h3>
                <CompactCodeView
                  code={(() => {
                    const bodyData = (endpoint.body as any).data;
                    const bodyType = (endpoint.body as any).type;
                    
                    // Handle different body types
                    if (bodyType === 'form-urlencoded' && Array.isArray(bodyData)) {
                      // Convert FormUrlEncodedEntry[] to string
                      return bodyData
                        .filter((entry: any) => entry.disabled !== true)
                        .map((entry: any) => `${encodeURIComponent(entry.name)}=${encodeURIComponent(entry.value)}`)
                        .join('&');
                    } else if (bodyType === 'multipart-form' && Array.isArray(bodyData)) {
                      // Convert MultipartFormEntry[] to readable format
                      return bodyData
                        .filter((entry: any) => entry.disabled !== true)
                        .map((entry: any) => `${entry.name}: ${entry.value}`)
                        .join('\n');
                    } else if (typeof bodyData === 'string') {
                      // Handle string data (json, text, xml, etc.)
                      return bodyData;
                    } else {
                      // Fallback: stringify objects
                      return JSON.stringify(bodyData, null, 2);
                    }
                  })()}
                  language={(() => {
                    const bodyType = (endpoint.body as any).type;
                    if (bodyType === 'form-urlencoded') return 'text';
                    if (bodyType === 'multipart-form') return 'text';
                    return bodyType || 'json';
                  })()}
                />
              </div>
            )}

            <Scripts
              preRequest={endpoint.script?.preRequest}
              postResponse={endpoint.script?.postResponse}
            />
          </div>

          <div className="code-snippets-wrapper">
            <CodeSnippets
              method={endpoint.method}
              url={endpoint.url}
              headers={endpoint.headers}
              body={endpoint.body}
            />
          </div>
        </div>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper
      key={itemId}
      id={`section-${sectionId}`}
    >
      <div className="item-header-minimal">
        <h1 className="item-title">{getItemName(item) || 'Untitled Item'}</h1>
        <p className="item-subtitle">Unsupported item type: {itemType}</p>
      </div>
    </StyledWrapper>
  );
}, (prevProps, nextProps) => {
  if (getItemType(prevProps.item) !== getItemType(nextProps.item)) {
    return false;
  }

  const prevItemId = getItemId(prevProps.item);
  const nextItemId = getItemId(nextProps.item);
  if (prevItemId !== nextItemId) {
    return false;
  }

  return (
    prevProps.parentPath === nextProps.parentPath
  );
});

export default Item;

