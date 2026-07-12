import React, { useMemo } from 'react';
import type { HttpRequest, HttpRequestExample, HttpRequestHeader, HttpResponseHeader } from '@opencollection/types/requests/http';
import { MethodBadge } from '../../../../MethodBadge/MethodBadge';
import { CopyButton } from '../../../../../ui/CopyButton/CopyButton';
import { PropertyTable, type PropertyRow } from '../../../../PropertyTable/PropertyTable';
import { RequestParams } from '../../../../Request/RequestParams/RequestParams';
import { RequestBody } from '../../../../Request/RequestBody/RequestBody';
import { Code } from '../../../../Code/Code';
import { SplitDivider } from '../../../../SplitDivider/SplitDivider';
import { resolvePathAndQueryParams } from '../../../../../utils/pathParams';
import { getBodyView, getDescription } from '../../../../../utils/request';
import { getHttpMethod, getRequestUrl } from '../../../../../utils/schemaHelpers';
import { responseBodyLanguage, statusCodePhrase } from '../../../../../utils/exampleResponse';
import { statusToneColor } from '../../../../../utils/common';
import { useSplitPane } from '../../../../../hooks/useSplitPane';
import { StyledWrapper } from './StyledWrapper';

interface ExampleViewProps {
  request: HttpRequest;
  example: HttpRequestExample;
}

const headerRows = (headers: (HttpRequestHeader | HttpResponseHeader)[]): PropertyRow[] =>
  headers.map((h) => ({
    label: h.name,
    value: h.value,
    disabled: 'disabled' in h ? h.disabled : undefined,
    description: getDescription(h)
  }));

export const ExampleView: React.FC<ExampleViewProps> = ({ request, example }) => {
  const exReq = example.request ?? {};
  const exRes = example.response ?? {};
  const method = exReq.method || getHttpMethod(request) || 'GET';
  const url = exReq.url || getRequestUrl(request) || '';
  const status = exRes.status;
  const statusText = exRes.statusText || statusCodePhrase(status) || '';
  const description = getDescription(example);

  const { path: pathParams, query: queryParams } = useMemo(
    () => resolvePathAndQueryParams(exReq.params, url),
    [exReq.params, url]
  );
  const hasParams = pathParams.length > 0 || queryParams.length > 0;
  const reqHeaders = exReq.headers ?? [];
  const bodyView = getBodyView(exReq.body);
  const hasReqBody = bodyView.render !== 'none';

  const resHeaders = exRes.headers ?? [];
  const resBody = exRes.body;
  const hasResBody = Boolean(resBody?.data?.trim());

  // One draggable divider splits the Request/Response panes, shared with the
  // live playground send-response splitter.
  const { size: requestPaneWidth, isResizing, containerRef, startResize } = useSplitPane('horizontal');

  return (
    <StyledWrapper data-testid="example-view">
      <div className="example-view-head">
        <span className="example-view-name">{example.name || 'Example'}</span>
        {description && <span className="example-view-desc">{description}</span>}
      </div>

      <div className="example-view-urlbar">
        <MethodBadge method={method} />
        <span className="example-view-url">{url}</span>
        <CopyButton text={url} />
        {status ? (
          <span className="example-view-status" style={{ color: statusToneColor(status) }}>
            {status} {statusText}
          </span>
        ) : null}
      </div>

      <div className={`example-view-grid${isResizing ? ' is-resizing' : ''}`} ref={containerRef}>
        <div className="example-view-pane" style={{ width: `${requestPaneWidth}%` }} data-testid="example-view-request">
          <div className="example-view-pane-title">Request</div>
          {hasParams && (
            <div className="example-view-section">
              <div className="example-view-section-label">PARAMS</div>
              <RequestParams path={pathParams} query={queryParams} />
            </div>
          )}
          {reqHeaders.length > 0 && (
            <div className="example-view-section">
              <div className="example-view-section-label">HEADERS</div>
              <PropertyTable rows={headerRows(reqHeaders)} />
            </div>
          )}
          {hasReqBody && (
            <div className="example-view-section">
              <div className="example-view-section-label">BODY</div>
              <RequestBody body={exReq.body} showContentType={false} />
            </div>
          )}
        </div>

        <SplitDivider orientation="horizontal" onMouseDown={startResize} />

        <div className="example-view-pane example-view-pane-response" data-testid="example-view-response">
          <div className="example-view-pane-title">
            Response
            {status ? (
              <span className="example-view-status" style={{ color: statusToneColor(status) }}>
                {status} {statusText}
              </span>
            ) : null}
          </div>
          {resHeaders.length > 0 && (
            <div className="example-view-section">
              <div className="example-view-section-label">HEADERS</div>
              <PropertyTable rows={headerRows(resHeaders)} />
            </div>
          )}
          {hasResBody && (
            <div className="example-view-section">
              <div className="example-view-section-label">BODY</div>
              <Code code={resBody!.data} language={responseBodyLanguage(resBody?.type)} showLineNumbers />
            </div>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

export default ExampleView;
