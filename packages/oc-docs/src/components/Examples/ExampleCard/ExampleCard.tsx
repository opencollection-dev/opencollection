import React, { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react';
import type {
  HttpRequestExample,
  HttpRequestHeader,
  HttpResponseHeader
} from '@opencollection/types/requests/http';
import { MethodBadge } from '../../MethodBadge/MethodBadge';
import { ChevronArrow } from '../../ChevronArrow/ChevronArrow';
import { CopyButton } from '../../../ui/CopyButton/CopyButton';
import { PropertyTable, type PropertyRow } from '../../PropertyTable/PropertyTable';
import { TruncatedText } from '../../TruncatedText/TruncatedText';
import { Description } from '../../Description/Description';
import { RequestParams } from '../../Request/RequestParams/RequestParams';
import { RequestBody } from '../../Request/RequestBody/RequestBody';
import { Code } from '../../Code/Code';
import { PlayIcon } from '../../../assets/icons';
import { resolvePathAndQueryParams } from '../../../utils/pathParams';
import { getBodyView, getDescription, getValueType } from '../../../utils/request';
import { computeBodySize, formatBytes, responseBodyLanguage, responseBodyContentType, statusCodePhrase } from '../../../utils/exampleResponse';
import { statusToneColor } from '../../../utils/common';
import { StyledWrapper } from './StyledWrapper';

interface ExampleCardProps {
  example: HttpRequestExample;
  method: string;
  url: string;
  onTry?: () => void;
  defaultExpanded?: boolean;
  testId?: string;
}

interface PaneTab {
  id: string;
  label: string;
  hasData: boolean;
  ctype: string;
  content: React.ReactNode;
}

const headerRows = (headers: (HttpRequestHeader | HttpResponseHeader)[]): PropertyRow[] =>
  headers.map((h) => ({
    label: h.name,
    value: h.value,
    type: getValueType(h),
    disabled: 'disabled' in h ? h.disabled : undefined,
    description: getDescription(h)
  }));

const headerCtype = (count: number): string => `${count} header${count === 1 ? '' : 's'}`;

const emptyPane = (label: string): React.ReactNode => <p className="pane-empty">No {label}.</p>;

const Pane: React.FC<{
  title: string;
  emptyMessage: string;
  tabs: PaneTab[];
  meta?: React.ReactNode;
  tabsRight?: boolean;
  paneClassName: string;
  testId?: string;
}> = ({ title, emptyMessage, tabs, meta, tabsRight, paneClassName, testId }) => {
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const hasAnyData = tabs.some((t) => t.hasData);
  const defaultTab = tabs.find((t) => t.hasData && t.id === 'body') ?? tabs.find((t) => t.hasData) ?? tabs[0];
  const [activeId, setActiveId] = useState<string | undefined>(defaultTab?.id);
  const active = tabs.find((t) => t.id === activeId) ?? defaultTab;

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
          <Fragment>
            {meta}
            <span className="pane-spacer" />
            {ctype && <span className="pane-ctype">{ctype}</span>}
            {tabStrip}
          </Fragment>
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

export const ExampleCard: React.FC<ExampleCardProps> = ({ example, method, url, onTry, defaultExpanded, testId = 'example-card' }) => {
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

  const request = (example.request ?? {}) as NonNullable<typeof example.request>;
  const response = example.response ?? {};
  const status = response.status;
  // Prefer the stored reason phrase; fall back to the standard phrase for the code.
  const statusText = response.statusText || statusCodePhrase(status);
  const responseBody = response.body;
  const name = example.name ?? 'Example';
  const description = getDescription(example);

  const size = useMemo(() => computeBodySize(responseBody?.data), [responseBody]);
  const toneColor = statusToneColor(status);
  // Prefer the example's own method/url; fall back to the request-level values.
  const displayMethod = request.method || method;
  const displayUrl = request.url || url;

  const requestTabs: PaneTab[] = useMemo(() => {
    const { path: pathParams, query: queryParams } = resolvePathAndQueryParams(request.params, displayUrl);
    const hasParams = pathParams.length > 0 || queryParams.length > 0;
    const paramsCtype = [pathParams.length ? 'path' : '', queryParams.length ? 'query' : '']
      .filter(Boolean)
      .join(' & ');

    const headers = request.headers ?? [];
    const body = request.body;
    // Reuse the shared body model so examples inherit every request-body edge case:
    // empty/whitespace/empty-collection -> 'none', descriptions, multipart part-type +
    // per-part content type, file variants + selected, and {{var}} highlighting.
    const bodyView = getBodyView(body);
    const hasBody = bodyView.render !== 'none';

    return [
      {
        id: 'params',
        label: 'Params',
        hasData: hasParams,
        ctype: paramsCtype,
        content: hasParams ? <RequestParams path={pathParams} query={queryParams} hideRowBorders /> : emptyPane('params')
      },
      {
        id: 'body',
        label: 'Body',
        hasData: hasBody,
        ctype: hasBody ? bodyView.contentTypeLabel : '',
        content: hasBody ? <RequestBody body={body} showContentType={false} hideRowBorders /> : emptyPane('body')
      },
      {
        id: 'headers',
        label: 'Headers',
        hasData: headers.length > 0,
        ctype: headers.length ? headerCtype(headers.length) : '',
        content: headers.length ? <PropertyTable hideRowBorders rows={headerRows(headers)} /> : emptyPane('headers')
      }
    ];
  }, [request.params, request.body, request.headers, displayUrl]);

  const responseTabs: PaneTab[] = useMemo(() => {
    const headers = response.headers ?? [];
    const hasBody = Boolean(responseBody?.data?.trim());
    return [
      {
        id: 'body',
        label: 'Body',
        hasData: hasBody,
        ctype: hasBody ? responseBodyContentType(responseBody?.type) : '',
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
        content: headers.length ? <PropertyTable hideRowBorders rows={headerRows(headers)} /> : emptyPane('headers')
      }
    ];
  }, [responseBody, response.headers]);

  const responseMeta = status ? (
    <span className="pane-meta">
      <span className="pane-meta-status" style={{ color: toneColor }}>
        {status}
        {statusText ? ` ${statusText}` : ''}
      </span>
      {responseBody?.data?.trim() ? ` · ${formatBytes(size)}` : ''}
    </span>
  ) : undefined;

  const handleTry = () => {
    setMounted(true);
    setExpanded(true);
    onTry?.();
  };

  return (
    <StyledWrapper className="example-card" data-testid={testId}>
      <div className="example-summary">
        <button
          type="button"
          className="example-toggle"
          aria-expanded={expanded}
          aria-controls={detailId}
          data-testid="example-toggle"
          onClick={toggle}
        >
          <ChevronArrow open={expanded} size={14} className="example-chevron" />
          {status ? (
            <span
              className="example-status"
              data-testid="example-status"
              style={{ color: toneColor, background: `color-mix(in srgb, ${toneColor} 12%, transparent)` }}
            >
              {status}
            </span>
          ) : null}
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
              <Description text={description} className="example-description" />

              <div className="example-url-row">
                <MethodBadge method={displayMethod} />
                <TruncatedText className="example-url-text" text={displayUrl} />
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
