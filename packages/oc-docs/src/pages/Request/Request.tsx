import React, { useMemo } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type { HttpRequest, HttpRequestParam } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import type { Description } from '@opencollection/types/common/description';
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
  getRequestExamples
} from '../../utils/schemaHelpers';
import { resolveInheritedAuth } from '../../utils/requestAuth';
import { getPreRequestVars, getPostResponseVars } from '../../utils/requestVars';
import { buildScriptChain } from '../../utils/requestScripts';
import { collectAssertions } from '../../utils/assertions';
import { collectTests } from '../../utils/extractTests';
import { getBodyView } from '../../utils/requestBody';
import { PageWrapper } from '../../components/PageWrapper/PageWrapper';
import { Heading } from '../../components/Heading/Heading';
import { Section } from '../../components/Section/Section';
import { Breadcrumb, type BreadcrumbSegment } from '../../ui/Breadcrumb/Breadcrumb';
import { RequestUrlBar } from '../../components/Request/RequestUrlBar/RequestUrlBar';
import { RequestDescription } from '../../components/Request/RequestDescription/RequestDescription';
import { AuthDetails } from '../../components/AuthDetails/AuthDetails';
import { RequestParams } from '../../components/Request/RequestParams/RequestParams';
import { RequestBody } from '../../components/Request/RequestBody/RequestBody';
import { ContentTypeBadge } from '../../components/ContentTypeBadge/ContentTypeBadge';
import { PropertyTable } from '../../components/PropertyTable/PropertyTable';
import { CodeSnippetTabs } from '../../components/CodeSnippetTabs/CodeSnippetTabs';
import { Examples } from '../../components/Examples/Examples';
import { ExecutionContext } from '../../components/ExecutionContext';
import { StyledWrapper } from './StyledWrapper';

interface RequestProps {
  item: HttpRequest;
  /** Ancestor folders from collection root to the request's parent. */
  ancestry?: Item[];
  collection?: OpenCollection | null;
  onTryClick?: () => void;
  onBreadcrumbClick?: (uuid: string) => void;
}

/** Markdown content for the description: prefer `docs`, fall back to `info.description`. */
const descriptionContent = (item: HttpRequest): string => {
  const docs = getItemDocs(item);
  if (docs) return docs;
  const info = (item.info?.description ?? '') as Description;
  if (typeof info === 'string') return info;
  return (info && typeof info === 'object' && 'content' in info ? info.content : '') || '';
};

/**
 * The request detail page. Composition root: it reads the request via schema helpers
 * + pure utils and passes plain props to atomic, package-ready components.
 */
export const Request: React.FC<RequestProps> = ({
  item,
  ancestry = [],
  collection,
  onTryClick,
  onBreadcrumbClick
}) => {
  const md = useMarkdownRenderer();

  const name = getItemName(item) || 'Untitled Request';
  const method = getHttpMethod(item);
  const url = getRequestUrl(item);
  const headers = getHttpHeaders(item);
  const params = getHttpParams(item) as HttpRequestParam[];
  const body = getHttpBody(item);
  const examples = getRequestExamples(item);

  const pathParams = useMemo(() => params.filter((p) => p.type === 'path'), [params]);
  const queryParams = useMemo(() => params.filter((p) => p.type === 'query'), [params]);

  const descHtml = useMemo(() => {
    const content = descriptionContent(item);
    return content ? md.render(content) : '';
  }, [item, md]);

  // Auth: resolve `inherit` to its effective source for display + code generation.
  const ownAuth = getRequestAuth(item) as Auth | undefined;
  const resolved = useMemo(() => resolveInheritedAuth(collection, ancestry, item), [collection, ancestry, item]);
  const effectiveAuth = ownAuth === 'inherit' ? resolved.auth : ownAuth;
  const showAuth = ownAuth !== undefined;
  // Heading badge for inherited auth, e.g. "Inherited from collection".
  const authInheritedBadge =
    ownAuth === 'inherit' ? (resolved.source ? `Inherited from ${resolved.source.level}` : 'Inherited') : undefined;

  const preVars = useMemo(() => getPreRequestVars(item), [item]);
  const postVars = useMemo(() => getPostResponseVars(item), [item]);

  const scriptChain = useMemo(() => buildScriptChain(collection, ancestry, item), [collection, ancestry, item]);
  const assertions = useMemo(() => collectAssertions(item), [item]);
  const tests = useMemo(() => collectTests(collection, ancestry, item), [collection, ancestry, item]);

  const segments = useMemo<BreadcrumbSegment[]>(
    () =>
      ancestry
        .map((folder) => ({ name: getItemName(folder) || 'Folder', uuid: (folder as { uuid?: string }).uuid || '' }))
        .filter((segment) => segment.uuid),
    [ancestry]
  );

  const hasHeaders = headers.length > 0;
  const hasParams = pathParams.length > 0 || queryParams.length > 0;
  const hasBody = Boolean(body) && (!Array.isArray(body) || body.length > 0);
  const hasVars = preVars.length > 0 || postVars.length > 0;
  const hasExamples = examples.length > 0;
  const hasExecutionContext = scriptChain.length > 0 || hasVars || assertions.length > 0 || tests.length > 0;
  const hasLeftColumn = showAuth || hasParams || hasBody || hasHeaders;

  // Left-column sections that have no content for this request collapse into the
  // "hidden sections" toggle, in canonical order (Params · Body · Headers · Auth).
  const hiddenTitles = useMemo(
    () =>
      [
        !hasParams && 'Params',
        !hasBody && 'Body',
        !hasHeaders && 'Headers',
        !showAuth && 'Auth'
      ].filter((title): title is string => Boolean(title)),
    [hasParams, hasBody, hasHeaders, showAuth]
  );

  // Content-type label shown as a badge on the BODY heading (e.g. "application/json").
  const bodyContentType = useMemo(() => {
    const view = getBodyView(body);
    return view.render !== 'none' ? view.contentTypeLabel : undefined;
  }, [body]);

  const codeSnippet = <CodeSnippetTabs method={method} url={url} headers={headers} body={body} auth={effectiveAuth} />;

  return (
    <PageWrapper>
      <StyledWrapper className="oc-request">
        <Breadcrumb segments={segments} current={name} onSegmentClick={onBreadcrumbClick} />

        <Heading size="md" style={{ marginTop: '0.875rem' }}>{name}</Heading>

        <RequestUrlBar method={method} url={url} onTry={onTryClick} style={{ marginTop: '0.9375rem' }} />

        {descHtml && <RequestDescription html={descHtml} style={{ marginTop: '0.9375rem' }} />}

        {hasLeftColumn ? (
          <div className="request-body">
            <div className="request-col-left">
              {hasParams && (
                <Section label="Params">
                  <RequestParams path={pathParams} query={queryParams} />
                </Section>
              )}

              {hasBody && (
                <Section
                  label="Body"
                  badge={bodyContentType ? <ContentTypeBadge label={bodyContentType} /> : undefined}
                >
                  <RequestBody body={body} showContentType={false} />
                </Section>
              )}

              {hasHeaders && (
                <Section label="Headers">
                  <PropertyTable rows={headers.map((h) => ({ label: h.name, value: h.value, disabled: h.disabled }))} />
                </Section>
              )}

              {showAuth && (
                <Section
                  label="Auth"
                  badge={authInheritedBadge ? <ContentTypeBadge label={authInheritedBadge} /> : undefined}
                >
                  <AuthDetails auth={effectiveAuth} authModeLabels={AUTH_MODE_LABELS} />
                </Section>
              )}

              <HiddenSections titles={hiddenTitles} />
            </div>

            <div className="request-col-right">
              <Section label="Code Snippet">{codeSnippet}</Section>
            </div>
          </div>
        ) : (
          <Section label="Code Snippet" className="request-fullwidth">
            {codeSnippet}
          </Section>
        )}

        {hasExamples && (
          <Section label="Examples" className="request-fullwidth">
            <Examples examples={examples} method={method} url={url} onTry={onTryClick} />
          </Section>
        )}

        {hasExecutionContext && (
          <Section label="Execution Context" className="request-fullwidth" collapsible>
            <ExecutionContext
              scriptChain={scriptChain}
              preVars={preVars}
              postVars={postVars}
              assertions={assertions}
              tests={tests}
              method={method}
              url={url}
            />
          </Section>
        )}
      </StyledWrapper>
    </PageWrapper>
  );
};

export default Request;
