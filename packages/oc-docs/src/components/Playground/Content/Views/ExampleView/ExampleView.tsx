import React, { useMemo } from 'react';
import type { HttpRequest, HttpRequestExample } from '@opencollection/types/requests/http';
import { MethodBadge } from '../../../../MethodBadge/MethodBadge';
import { CopyButton } from '../../../../../ui/CopyButton/CopyButton';
import { PropertyTable } from '../../../../PropertyTable/PropertyTable';
import { RequestParams } from '../../../../Request/RequestParams/RequestParams';
import { RequestBody } from '../../../../Request/RequestBody/RequestBody';
import { Code } from '../../../../Code/Code';
import { SplitDivider } from '../../../../SplitDivider/SplitDivider';
import { resolvePathAndQueryParams } from '../../../../../utils/pathParams';
import { getBodyView, getDescription, headerRows } from '../../../../../utils/request';
import { getHttpMethod, getRequestUrl } from '../../../../../utils/schemaHelpers';
import { responseBodyLanguage, statusCodePhrase } from '../../../../../utils/exampleResponse';
import { statusToneColor } from '../../../../../utils/common';
import { useSplitPane, type SplitOrientation } from '../../../../../hooks/useSplitPane';
import { StyledWrapper } from './StyledWrapper';

interface ExampleViewProps {
  request: HttpRequest;
  example: HttpRequestExample;
  orientation?: SplitOrientation;
}

export const ExampleView: React.FC<ExampleViewProps> = ({ request, example, orientation = 'horizontal' }) => {
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
  const reqHeaders = useMemo(() => exReq.headers ?? [], [exReq.headers]);
  const bodyView = useMemo(() => getBodyView(exReq.body), [exReq.body]);
  const hasReqBody = bodyView.render !== 'none';
  const reqHeaderRows = useMemo(() => headerRows(reqHeaders), [reqHeaders]);

  const resHeaders = useMemo(() => exRes.headers ?? [], [exRes.headers]);
  const resBody = exRes.body;
  const hasResBody = Boolean(resBody?.data?.trim());
  const resHeaderRows = useMemo(() => headerRows(resHeaders), [resHeaders]);

  const { size: paneSize, isResizing, containerRef, startResize } = useSplitPane(orientation);
  const paneStyle = orientation === 'vertical' ? { height: `${paneSize}%` } : { width: `${paneSize}%` };
  const statusBadge = status ? (
    <span className="example-view-status" style={{ color: statusToneColor(status) }}>
      {status} {statusText}
    </span>
  ) : null;

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
        {statusBadge}
      </div>

      <div
        className={`example-view-grid${isResizing ? ' is-resizing' : ''}`}
        data-orientation={orientation}
        ref={containerRef}
      >
        <div className="example-view-pane" style={paneStyle} data-testid="example-view-request">
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
              <PropertyTable rows={reqHeaderRows} />
            </div>
          )}
          {hasReqBody && (
            <div className="example-view-section">
              <div className="example-view-section-label">BODY</div>
              <RequestBody body={exReq.body} showContentType={false} />
            </div>
          )}
        </div>

        <SplitDivider orientation={orientation} onPointerDown={startResize} testId="example-view-divider" />

        <div className="example-view-pane example-view-pane-response" data-testid="example-view-response">
          <div className="example-view-pane-title">
            Response
            {statusBadge}
          </div>
          {resHeaders.length > 0 && (
            <div className="example-view-section">
              <div className="example-view-section-label">HEADERS</div>
              <PropertyTable rows={resHeaderRows} />
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
