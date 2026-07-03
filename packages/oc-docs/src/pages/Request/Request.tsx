import React, { useMemo } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type { HttpRequest, HttpRequestParam } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import type { GraphQLRequest } from '@opencollection/types/requests/graphql';
import type { GrpcRequest } from '@opencollection/types/requests/grpc';
import type { WebSocketRequest } from '@opencollection/types/requests/websocket';
import { useMarkdownRenderer } from '../../hooks';
import { AUTH_MODE_LABELS } from '../../constants';
import {
  getItemName,
  getHttpMethod,
  getRequestUrl,
  getHttpHeaders,
  getHttpParams,
  getHttpBody,
  getRequestAuth,
  getItemDocs,
  getItemDescription,
  getRequestExamples,
  isUnsupportedRequest
} from '../../utils/schemaHelpers';
import {
  resolveInheritedAuth,
  getPreRequestVars,
  getPostResponseVars,
  buildScriptChain,
  getScriptFlow,
  getBodyView,
  descriptionText
} from '../../utils/request';
import { collectAssertions } from '../../utils/assertions';
import { collectTests, collectRawTestScripts } from '../../utils/fileUtils';
import { resolvePathAndQueryParams } from '../../utils/pathParams';
import { buildBreadcrumbSegments } from '../../utils/common';
import { PageWrapper } from '../../components/PageWrapper/PageWrapper';
import { Heading } from '../../components/Heading/Heading';
import { Section } from '../../components/Section/Section';
import { Breadcrumb, type BreadcrumbSegment } from '../../ui/Breadcrumb/Breadcrumb';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { FileIcon, RefreshIcon } from '../../assets/icons';
import { RequestUrlBar } from '../../components/Request/RequestUrlBar/RequestUrlBar';
import { RequestDescription } from '../../components/Request/RequestDescription/RequestDescription';
import { AuthDetails } from '../../components/AuthDetails/AuthDetails';
import { RequestParams } from '../../components/Request/RequestParams/RequestParams';
import { RequestBody } from '../../components/Request/RequestBody/RequestBody';
import { ContentTypeBadge } from '../../components/ContentTypeBadge/ContentTypeBadge';
import { PropertyTable } from '../../components/PropertyTable/PropertyTable';
import { CodeSnippetTabs } from '../../components/CodeSnippetTabs/CodeSnippetTabs';
import { Examples } from '../../components/Examples/Examples';
import { ExecutionContext } from '../../components/ExecutionContext/ExecutionContext';
import { UnsupportedRequest } from '../../components/UnsupportedRequest/UnsupportedRequest';
import { StyledWrapper } from './StyledWrapper';

interface RequestProps {
  item: HttpRequest | WebSocketRequest | GraphQLRequest | GrpcRequest;
  ancestry?: Item[];
  collection?: OpenCollection | null;
  onTryClick?: () => void;
  onBreadcrumbClick?: (uuid: string) => void;
  testId?: string;
}

type RequestContentProps = Omit<RequestProps, 'item'> & { item: HttpRequest };

const descriptionContent = (item: HttpRequest): string => getItemDocs(item) || getItemDescription(item);

const RequestContent: React.FC<RequestContentProps> = ({
  item,
  ancestry = [],
  collection,
  onTryClick,
  onBreadcrumbClick,
  testId = 'request-page'
}) => {
  const md = useMarkdownRenderer();

  const name = getItemName(item) || 'Untitled Request';
  const method = getHttpMethod(item);
  const url = getRequestUrl(item);
  const headers = getHttpHeaders(item);
  const params = getHttpParams(item) as HttpRequestParam[];
  const body = getHttpBody(item);
  const examples = getRequestExamples(item);

  const { path: pathParams, query: queryParams } = useMemo(
    () => resolvePathAndQueryParams(params, url),
    [params, url]
  );

  const descHtml = useMemo(() => {
    const content = descriptionContent(item);
    return content ? md.render(content) : '';
  }, [item, md]);

  const ownAuth = getRequestAuth(item) as Auth | undefined;
  const resolved = useMemo(() => resolveInheritedAuth(collection, ancestry, item), [collection, ancestry, item]);
  const effectiveAuth = ownAuth === 'inherit' ? resolved.auth : ownAuth;
  const showAuth = ownAuth !== undefined;
  const authInheritedBadge =
    ownAuth === 'inherit' ? (resolved.source ? `Inherited from ${resolved.source.level}` : 'Inherited') : undefined;

  const preVars = useMemo(() => getPreRequestVars(item), [item]);
  const postVars = useMemo(() => getPostResponseVars(item), [item]);

  const scriptChain = useMemo(() => buildScriptChain(collection, ancestry, item), [collection, ancestry, item]);
  const scriptFlow = useMemo(() => getScriptFlow(collection), [collection]);
  const assertions = useMemo(() => collectAssertions(item), [item]);
  const tests = useMemo(() => collectTests(collection, ancestry, item), [collection, ancestry, item]);
  const testScripts = useMemo(() => collectRawTestScripts(collection, ancestry, item), [collection, ancestry, item]);

  const segments = useMemo<BreadcrumbSegment[]>(
    () => buildBreadcrumbSegments(collection, ancestry),
    [collection, ancestry]
  );

  // Resolve the body once — drives whether the section renders at all and its heading badge.
  const bodyView = useMemo(() => getBodyView(body), [body]);
  const hasHeaders = headers.length > 0;
  const hasParams = pathParams.length > 0 || queryParams.length > 0;
  const hasBody = bodyView.render !== 'none';
  const hasVars = preVars.length > 0 || postVars.length > 0;
  const hasExamples = examples.length > 0;
  const hasExecutionContext = scriptChain.length > 0 || hasVars || assertions.length > 0 || tests.length > 0;
  const hasLeftColumn = showAuth || hasParams || hasBody || hasHeaders;

  const bodyContentType = bodyView.render !== 'none' ? bodyView.contentTypeLabel : undefined;

  const codeSnippet = <CodeSnippetTabs method={method} url={url} headers={headers} body={body} auth={effectiveAuth} />;

  return (
    <PageWrapper>
      <StyledWrapper className="request" data-testid={testId}>
        <Breadcrumb segments={segments} current={name} onSegmentClick={onBreadcrumbClick} testId="request-breadcrumb" />

        <Heading size="md" style={{ marginTop: '0.875rem' }} testId="request-title">{name}</Heading>

        <RequestUrlBar method={method} url={url} onTry={onTryClick} style={{ marginTop: '0.9375rem' }} />

        {descHtml && <RequestDescription html={descHtml} style={{ marginTop: '0.9375rem' }} />}

        <div className="request-columns">
          <div className="request-col-left">
            {hasLeftColumn ? (
              <>
                {hasParams && (
                  <Section label="Params" testId="request-section-params">
                    <RequestParams path={pathParams} query={queryParams} />
                  </Section>
                )}

                {hasBody && (
                  <Section
                    label="Body"
                    testId="request-section-body"
                    badge={bodyContentType ? <ContentTypeBadge label={bodyContentType} /> : undefined}
                  >
                    <RequestBody body={body} showContentType={false} />
                  </Section>
                )}

                {hasHeaders && (
                  <Section label="Headers" testId="request-section-headers">
                    <PropertyTable
                      rows={headers.map((h) => ({
                        label: h.name,
                        value: h.value,
                        disabled: h.disabled,
                        description: descriptionText((h as { description?: unknown }).description)
                      }))}
                    />
                  </Section>
                )}

                {showAuth && (
                  <Section
                    label="Auth"
                    testId="request-section-auth"
                    badge={authInheritedBadge ? <ContentTypeBadge label={authInheritedBadge} /> : undefined}
                  >
                    <AuthDetails auth={effectiveAuth} authModeLabels={AUTH_MODE_LABELS} emptyMessage="No auth" />
                  </Section>
                )}
              </>
            ) : (
              <EmptyState
                testId="request-config-empty"
                icon={<FileIcon />}
                heading="No request configuration"
                subheading="This request has no parameters, body, headers, or authentication configured. These may be inherited from the collection or folder."
              />
            )}
          </div>

          <div className="request-col-right">
            <Section label="Code Snippet" testId="request-section-code-snippet">{codeSnippet}</Section>
          </div>
        </div>

        {hasExamples && (
          <Section label="Examples" testId="request-section-examples" className="request-fullwidth">
            <Examples examples={examples} method={method} url={url} onTry={onTryClick} />
          </Section>
        )}

        <Section
          label="Execution Context"
          testId="request-section-execution-context"
          className="request-fullwidth"
          collapsible={hasExecutionContext}
        >
          {hasExecutionContext ? (
            <ExecutionContext
              scriptChain={scriptChain}
              preVars={preVars}
              postVars={postVars}
              assertions={assertions}
              tests={tests}
              testScripts={testScripts}
              flow={scriptFlow}
              method={method}
              url={url}
            />
          ) : (
            <EmptyState
              testId="execution-context-empty"
              icon={<RefreshIcon />}
              heading="No execution context"
              subheading="This request has no scripts, variables, asserts, or tests configured."
            />
          )}
        </Section>
      </StyledWrapper>
    </PageWrapper>
  );
};

export const Request: React.FC<RequestProps> = ({ item, ancestry = [], collection, onTryClick, onBreadcrumbClick }) => {
  if (isUnsupportedRequest(item)) {
    return <UnsupportedRequest item={item} ancestry={ancestry} collection={collection} onBreadcrumbClick={onBreadcrumbClick} />;
  }

  return (
    <RequestContent
      item={item}
      ancestry={ancestry}
      collection={collection}
      onTryClick={onTryClick}
      onBreadcrumbClick={onBreadcrumbClick}
    />
  );
};

export default Request;
