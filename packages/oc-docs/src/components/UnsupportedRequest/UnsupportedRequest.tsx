import React, { useMemo } from 'react';
import type { GraphQLRequest } from '@opencollection/types/requests/graphql';
import type { GrpcRequest } from '@opencollection/types/requests/grpc';
import type { WebSocketRequest } from '@opencollection/types/requests/websocket';
import { getItemDescription, getItemDocs, getItemType, getRequestUrl } from '../../utils/schemaHelpers';
import cx from '../../utils/cx';
import { Heading } from '../Heading/Heading';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import Description from '../Description/Description';
import RequestUrlBar from '../Request/RequestUrlBar/RequestUrlBar';
import BreadcrumbWrapper, { type BreadcrumbWrapperProps } from './BreadcrumbWrapper/BreadcrumbWrapper';
import { REQUEST_TYPE_LABELS } from '../../constants';
import ViewMore from '../ViewMore/ViewMore';

function getRequestTypeLabel(label: string | undefined) {
  const fallback = {
    shortName: 'RQ',
    fullName: 'This request'
  };

  if (label == null) return fallback;
  return REQUEST_TYPE_LABELS[label] ?? fallback;
}

interface UnsupportedEmptyStateProps {
  icon: React.ReactNode;
  heading: string;
  /**
   * The final subheading will look like: `${requestTypeName} ${subheadingSuffix}`
   *
   * Do not add spaces in the start of suffix.
   *
   * Implemented as `[requestTypeName, subheadingSuffix].join(' ')` to handle
   * empty suffix
   */
  subheadingSuffix: string;
}

interface UnsupportedRequestProps {
  item: WebSocketRequest | GraphQLRequest | GrpcRequest;
  showRequestDocs: boolean;
  emptyStateProps: UnsupportedEmptyStateProps;
  className?: string;
  breadcrumbs?: Omit<BreadcrumbWrapperProps, 'showBreadcrumbs' | 'item'>;
  testId?: string;
}

export const UnsupportedRequest: React.FC<UnsupportedRequestProps> = ({
  item,
  emptyStateProps,
  className,
  showRequestDocs,
  breadcrumbs,
  testId = 'unsupported-request'
}) => {
  const { icon, heading, subheadingSuffix } = emptyStateProps;
  const { shortName, fullName } = useMemo(() => getRequestTypeLabel(getItemType(item)), [item]);
  const subheading = useMemo(() => [fullName, subheadingSuffix.trim()].join(' '), [fullName, subheadingSuffix]);

  return (
    <div className={cx(className, 'w-full')} data-testid={testId}>
      <BreadcrumbWrapper showBreadcrumbs={Boolean(breadcrumbs)} item={item} {...(breadcrumbs ?? {})} />

      <Heading size="md" style={{ marginTop: '0.875rem' }} testId="unsupported-request-title">
        {fullName}
      </Heading>

      <Description text={getItemDescription(item)} />

      <RequestUrlBar className="mt-2" method={shortName} url={getRequestUrl(item)} />

      <ViewMore collapsedHeight='4.5rem' testId="overview-markdown-view-more">
        <div
          className="overview-markdown markdown-documentation mt-5"
          data-testid="overview-markdown-documentation"
          dangerouslySetInnerHTML={{ __html: getItemDocs(item) ?? '' }}
        />
      </ViewMore>

      <EmptyState
        className="mt-4"
        testId="unsupported-request-empty"
        icon={icon}
        heading={heading}
        subheading={subheading}
      />
    </div>
  );
};

export default UnsupportedRequest;
