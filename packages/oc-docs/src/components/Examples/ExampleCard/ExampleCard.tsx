import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import type {
  HttpRequestExample,
  HttpRequestHeader,
  HttpResponseHeader,
  HttpRequestBody
} from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { MethodBadge } from '../../MethodBadge/MethodBadge';
import { CopyButton } from '../../../ui/CopyButton/CopyButton';
import { PropertyTable, type PropertyRow } from '../../PropertyTable/PropertyTable';
import { RequestParams } from '../../Request/RequestParams/RequestParams';
import { AuthDetails } from '../../AuthDetails/AuthDetails';
import { Code } from '../../Code/Code';
import { AUTH_MODE_LABELS } from '../../../constants';
import { resolvePathAndQueryParams } from '../../../utils/pathParams';
import { computeBodySize, formatBytes, responseBodyLanguage } from '../../../utils/exampleResponse';
import { StyledWrapper, statusToneColor } from './StyledWrapper';

interface ExampleCardProps {
  example: HttpRequestExample;
  method: string;
  url: string;
  onTry?: () => void;
  defaultExpanded?: boolean;
}

interface PaneTab {
  id: string;
  label: string;
  hasData: boolean;
  ctype: string;
  content: React.ReactNode;
}

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`example-chevron ${open ? 'is-open' : ''}`}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const PlayIcon: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="6 4 20 12 6 20 6 4" />
  </svg>
);


const headerRows = (headers: (HttpRequestHeader | HttpResponseHeader)[]): PropertyRow[] =>
  headers.map((h) => ({ label: h.name, value: h.value, disabled: 'disabled' in h ? h.disabled : undefined }));

const headerCtype = (count: number): string => `${count} header${count === 1 ? '' : 's'}`;

/** The auth mode shown as the pane content type (e.g. "bearer", "oauth2", "inherit"). */
const authTypeLabel = (auth: Auth): string => (typeof auth === 'string' ? auth : auth.type);

/** The full MIME content type for a request body mode (shown in the pane header). */
const requestBodyCtype = (body: HttpRequestBody): string => {
  switch (body.type) {
    case 'json':
      return 'application/json';
    case 'xml':
      return 'application/xml';
    case 'text':
      return 'text/plain';
    case 'sparql':
      return 'application/sparql-query';
    case 'form-urlencoded':
      return 'application/x-www-form-urlencoded';
    case 'multipart-form':
      return 'multipart/form-data';
    case 'file':
      return 'application/octet-stream';
    default:
      return 'text/plain';
  }
};

/** The full MIME content type for a response body type. */
const responseBodyCtype = (type: string | undefined): string => {
  switch (type) {
    case 'json':
      return 'application/json';
    case 'xml':
      return 'application/xml';
    case 'html':
      return 'text/html';
    case 'binary':
      return 'application/octet-stream';
    default:
      return 'text/plain';
  }
};

const emptyPane = (label: string): React.ReactNode => <p className="pane-empty">No {label}.</p>;

/** Renders a request body: raw bodies as highlighted code, structured ones as a key/value table. */
const RequestBodyContent: React.FC<{ body: HttpRequestBody }> = ({ body }) => {
  switch (body.type) {
    case 'json':
    case 'xml':
    case 'text':
      return <Code code={body.data} language={responseBodyLanguage(body.type)} showLineNumbers />;
    case 'sparql':
      return <Code code={body.data} language="text" showLineNumbers />;
    case 'file':
      return <PropertyTable rows={body.data.map((e) => ({ label: e.filePath, value: e.contentType }))} />;
    case 'multipart-form':
      return (
        <PropertyTable
          rows={body.data.map((e) => ({ label: e.name, value: Array.isArray(e.value) ? e.value.join(', ') : e.value }))}
        />
      );
    case 'form-urlencoded':
      return <PropertyTable rows={body.data.map((e) => ({ label: e.name, value: e.value }))} />;
    default:
      return emptyPane('body');
  }
};

/**
 * One pane (REQUEST or RESPONSE): a header bar (title, tab pills, content type, optional
 * meta) over the active tab's body. Tabs follow the WAI-ARIA tabs pattern (roving
 * tabindex + arrow/Home/End navigation, a single labelled tabpanel). When the side has
 * no data at all, the tab strip is replaced by a single empty message.
 */
const Pane: React.FC<{
  title: string;
  emptyMessage: string;
  tabs: PaneTab[];
  meta?: React.ReactNode;
  /** Render the tab strip on the right of the header (RESPONSE layout). */
  tabsRight?: boolean;
  paneClassName: string;
  testId?: string;
}> = ({ title, emptyMessage, tabs, meta, tabsRight, paneClassName, testId }) => {
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const hasAnyData = tabs.some((t) => t.hasData);
  // Default to the Body tab when it has data, else the first tab with data, else the first tab.
  const defaultTab = tabs.find((t) => t.hasData && t.id === 'body') ?? tabs.find((t) => t.hasData) ?? tabs[0];
  const [activeId, setActiveId] = useState<string | undefined>(defaultTab?.id);
  const active = tabs.find((t) => t.id === activeId) ?? defaultTab;

  // Keep the selected tab visible by scrolling only the tab strip (never an
  // ancestor / the page) when the strip overflows on narrow panes.
  useEffect(() => {
    const el = tabRefs.current[active?.id ?? ''];
    const strip = el?.parentElement;
    if (!el || !strip) return;
    const tab = el.getBoundingClientRect();
    const box = strip.getBoundingClientRect();
    if (tab.left < box.left) strip.scrollLeft -= box.left - tab.left;
    else if (tab.right > box.right) strip.scrollLeft += tab.right - box.right;
  }, [active?.id]);

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((t) => t.id === active?.id);
    if (index < 0) return;
    let next = index;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const nextTab = tabs[next];
    setActiveId(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  };

  const tabStrip = hasAnyData ? (
    <div className="pane-tabs" role="tablist" aria-label={`${title} content`} onKeyDown={onTabKeyDown}>
      {tabs.map((tab) => {
        const isActive = tab.id === active?.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={tabId(tab.id)}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            data-testid={testId ? `${testId}-tab-${tab.id}` : undefined}
            className={`pane-tab ${isActive ? 'is-active' : ''}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
            {tab.hasData && <span className="pane-tab-dot" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  ) : null;

  const ctype = hasAnyData ? active?.ctype : '';

  return (
    <div className={paneClassName} data-testid={testId}>
      <div className="pane-head">
        <span className="pane-title">{title}</span>
        {tabsRight ? (
          <>
            {meta}
            <span className="pane-spacer" />
            {ctype && <span className="pane-ctype">{ctype}</span>}
            {tabStrip}
          </>
        ) : (
          <>
            {tabStrip}
            <span className="pane-spacer" />
            {ctype && <span className="pane-ctype">{ctype}</span>}
          </>
        )}
      </div>
      {hasAnyData && active ? (
        <div
          className="pane-body"
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(active.id)}
          tabIndex={0}
          data-testid={testId ? `${testId}-body` : undefined}
        >
          {active.content}
        </div>
      ) : (
        <div className="pane-body" data-testid={testId ? `${testId}-body` : undefined}>
          <p className="pane-empty">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export const ExampleCard: React.FC<ExampleCardProps> = ({ example, method, url, onTry, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(Boolean(defaultExpanded));
  const [mounted, setMounted] = useState(Boolean(defaultExpanded));
  const detailId = useId();
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = detailRef.current;
    if (!el) return;
    if (expanded) el.removeAttribute('inert');
    else el.setAttribute('inert', '');
  }, [expanded, mounted]);

  const toggle = () => {
    if (!expanded) setMounted(true);
    setExpanded((v) => !v);
  };

  const request = example.request ?? {};
  const response = example.response ?? {};
  const status = response.status;
  const responseBody = response.body;
  const name = example.name ?? 'Example';
  const description =
    typeof example.description === 'string' ? example.description : example.description?.content || undefined;

  const size = useMemo(() => computeBodySize(responseBody?.data), [responseBody]);
  const toneColor = statusToneColor(status);
  const displayUrl = request.url || url;

  const requestTabs: PaneTab[] = useMemo(() => {
    const { path: pathParams, query: queryParams } = resolvePathAndQueryParams(request.params, displayUrl);
    const hasParams = pathParams.length > 0 || queryParams.length > 0;
    const paramsCtype = [pathParams.length ? 'path' : '', queryParams.length ? 'query' : '']
      .filter(Boolean)
      .join(' & ');

    const headers = request.headers ?? [];
    const body = request.body;
    const auth = request.auth;

    return [
      {
        id: 'params',
        label: 'Params',
        hasData: hasParams,
        ctype: paramsCtype,
        content: hasParams ? <RequestParams path={pathParams} query={queryParams} /> : emptyPane('params')
      },
      {
        id: 'body',
        label: 'Body',
        hasData: Boolean(body),
        ctype: body ? requestBodyCtype(body) : '',
        content: body ? <RequestBodyContent body={body} /> : emptyPane('body')
      },
      // Auth tab is shown only when the example actually defines auth.
      ...(auth
        ? [{
            id: 'auth',
            label: 'Auth',
            hasData: true,
            ctype: authTypeLabel(auth),
            content: <AuthDetails auth={auth} authModeLabels={AUTH_MODE_LABELS} />
          }]
        : []),
      {
        id: 'headers',
        label: 'Headers',
        hasData: headers.length > 0,
        ctype: headers.length ? headerCtype(headers.length) : '',
        content: headers.length ? <PropertyTable rows={headerRows(headers)} /> : emptyPane('headers')
      }
    ];
  }, [request.params, request.body, request.auth, request.headers, displayUrl]);

  const responseTabs: PaneTab[] = useMemo(() => {
    const headers = response.headers ?? [];
    const hasBody = Boolean(responseBody?.data);
    return [
      {
        id: 'body',
        label: 'Body',
        hasData: hasBody,
        ctype: hasBody ? responseBodyCtype(responseBody?.type) : '',
        content: hasBody ? (
          <Code code={responseBody!.data} language={responseBodyLanguage(responseBody?.type)} showLineNumbers />
        ) : (
          emptyPane('body')
        )
      },
      {
        id: 'headers',
        label: 'Headers',
        hasData: headers.length > 0,
        ctype: headers.length ? headerCtype(headers.length) : '',
        content: headers.length ? <PropertyTable rows={headerRows(headers)} /> : emptyPane('headers')
      }
    ];
  }, [responseBody, response.headers]);

  const responseMeta =
    status !== undefined ? (
      <span className="pane-meta">
        <span className="pane-meta-status" style={{ color: toneColor }}>
          {status}
        </span>
        {responseBody?.data ? ` · ${formatBytes(size)}` : ''}
      </span>
    ) : undefined;

  const handleTry = () => {
    setMounted(true);
    setExpanded(true);
    onTry?.();
  };

  return (
    <StyledWrapper className="example-card" data-testid="example-card">
      <div className="example-summary">
        <button
          type="button"
          className="example-toggle"
          aria-expanded={expanded}
          aria-controls={detailId}
          data-testid="example-toggle"
          onClick={toggle}
        >
          <ChevronIcon open={expanded} />
          {status !== undefined && (
            <span
              className="example-status"
              data-testid="example-status"
              style={{ color: toneColor, background: `color-mix(in srgb, ${toneColor} 12%, transparent)` }}
            >
              {status}
            </span>
          )}
          <span className="example-name" data-testid="example-name">{name}</span>
        </button>
        {onTry && (
          <button type="button" className="example-try" onClick={handleTry}>
            <PlayIcon />
            Try
          </button>
        )}
      </div>

      {/* Grid-rows 0fr→1fr animates the height open/close with no fixed max-height. */}
      <div ref={detailRef} className={`example-detail ${expanded ? 'is-open' : ''}`}>
        <div className="example-detail-clip">
          {mounted && (
            <div className="example-detail-body" id={detailId}>
              {description && <p className="example-description">{description}</p>}

              <div className="example-url-row">
                <MethodBadge method={method} />
                <span className="example-url-text">{displayUrl}</span>
                <CopyButton text={displayUrl} />
              </div>

              <div className="example-grid">
                <Pane
                  title="REQUEST"
                  emptyMessage="No request data."
                  tabs={requestTabs}
                  paneClassName="example-pane-left"
                  testId="example-request-pane"
                />
                <Pane
                  title="RESPONSE"
                  emptyMessage="No response data."
                  tabs={responseTabs}
                  meta={responseMeta}
                  tabsRight
                  paneClassName="example-pane-right"
                  testId="example-response-pane"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

export default ExampleCard;
