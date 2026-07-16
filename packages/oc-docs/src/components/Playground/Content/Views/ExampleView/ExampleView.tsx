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
import { statusToneColor, statusToneBackground } from '../../../../../utils/common';
import { useSplitPane, type SplitOrientation } from '../../../../../hooks/useSplitPane';
import { StyledWrapper } from './StyledWrapper';

interface ExampleViewProps {
  request: HttpRequest;
  example: HttpRequestExample;
  orientation?: SplitOrientation;
}

export const ExampleView: React.FC<ExampleViewProps> = ({ request, example, orientation = 'horizontal' }) => {
  const model = useMemo(() => {
    const exReq = example.request ?? {};
    const exRes = example.response ?? {};
    const url = exReq.url || getRequestUrl(request) || '';
    const { path: pathParams, query: queryParams } = resolvePathAndQueryParams(exReq.params, url);
    const bodyView = getBodyView(exReq.body);
    const resBody = exRes.body;
    return {
      method: exReq.method || getHttpMethod(request) || 'GET',
      url,
      status: exRes.status,
      statusText: exRes.statusText || statusCodePhrase(exRes.status) || '',
      description: getDescription(example),
      pathParams,
      queryParams,
      hasParams: pathParams.length > 0 || queryParams.length > 0,
      reqHeaderRows: headerRows(exReq.headers ?? []),
      reqBody: exReq.body,
      hasReqBody: bodyView.render !== 'none',
      resHeaderRows: headerRows(exRes.headers ?? []),
      resBody,
      hasResBody: Boolean(resBody?.data?.trim())
    };
  }, [example, request]);

  const {
    method, url, status, statusText, description,
    pathParams, queryParams, hasParams,
    reqHeaderRows, reqBody, hasReqBody,
    resHeaderRows, resBody, hasResBody
  } = model;

  const { size: paneSize, isResizing, containerRef, startResize } = useSplitPane(orientation);
  const paneStyle = orientation === 'vertical' ? { height: `${paneSize}%` } : { width: `${paneSize}%` };
  const statusBadge = status ? (
    <span
      className="example-view-status"
      style={{ color: statusToneColor(status), backgroundColor: statusToneBackground(status) }}
    >
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
          {reqHeaderRows.length > 0 && (
            <div className="example-view-section">
              <div className="example-view-section-label">HEADERS</div>
              <PropertyTable rows={reqHeaderRows} />
            </div>
          )}
          {hasReqBody && (
            <div className="example-view-section">
              <div className="example-view-section-label">BODY</div>
              <RequestBody body={reqBody} showContentType={false} />
            </div>
          )}
        </div>

        <SplitDivider orientation={orientation} onPointerDown={startResize} testId="example-view-divider" />

        <div className="example-view-pane example-view-pane-response" data-testid="example-view-response">
          <div className="example-view-pane-title">
            Response
            {statusBadge}
          </div>
          {resHeaderRows.length > 0 && (
            <div className="example-view-section">
              <div className="example-view-section-label">HEADERS</div>
              <PropertyTable rows={resHeaderRows} />
            </div>
          )}
          {hasResBody && (
            <div className="example-view-section">
              <div className="example-view-section-label">BODY</div>
              <Code code={resBody!.data} language={responseBodyLanguage(resBody!.type)} showLineNumbers />
            </div>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

export default ExampleView;
