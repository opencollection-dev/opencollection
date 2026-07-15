import React, { useMemo } from 'react';
import type { GraphQLRequest } from '@opencollection/types/requests/graphql';
import type { GrpcRequest } from '@opencollection/types/requests/grpc';
import type { WebSocketRequest } from '@opencollection/types/requests/websocket';
import { getItemDescription, getItemDocs, getItemType, getRequestUrl } from '../../utils/schemaHelpers';
import { getValidClasses } from '../../utils/common';
import { Heading } from '../Heading/Heading';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import Description from '../Description/Description';
import RequestUrlBar from '../Request/RequestUrlBar/RequestUrlBar';
import RequestDescription from '../Request/RequestDescription/RequestDescription';
import BreadcrumbWrapper, { type BreadcrumbWrapperProps } from './BreadcrumbsWrapper/BreadcrumbsWrapper';

const REQUEST_TYPE_LABELS: Record<string, { shortName: string; fullName: string }> = {
  websocket: {
    shortName: 'WS',
    fullName: 'Websocket'
  },
  graphql: {
    shortName: 'GQL',
    fullName: 'GraphQL'
  },
  grpc: {
    shortName: 'GRPC',
    fullName: 'gRPC'
  }
};

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
  console.log({item})
  const { shortName, fullName } = useMemo(() => getRequestTypeLabel(getItemType(item)), [item]);
  const subheading = useMemo(() => [fullName, subheadingSuffix.trim()].join(' '), [fullName, subheadingSuffix]);

  return (
    <div className={getValidClasses(className, 'w-full')} data-testid={testId}>
      <BreadcrumbWrapper showBreadcrumbs={Boolean(breadcrumbs)} item={item} {...(breadcrumbs ?? {})} />

      <Heading size="md" style={{ marginTop: '0.875rem' }} testId="unsupported-request-title">
        {fullName}
      </Heading>

      <Description text={getItemDescription(item)} />

      <RequestUrlBar className="mt-2" method={shortName} url={getRequestUrl(item)} />

      {showRequestDocs && <RequestDescription className="mt-5" html={getItemDocs(item) ?? ''} />}

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
