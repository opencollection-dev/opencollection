import React, { useMemo } from 'react';
import type { Item } from '@opencollection/types/collection/item';
import type { GraphQLRequest } from '@opencollection/types/requests/graphql';
import type { GrpcRequest } from '@opencollection/types/requests/grpc';
import type { WebSocketRequest } from '@opencollection/types/requests/websocket';
import { getItemName, getItemType } from '../../utils/schemaHelpers';
import { PageWrapper } from '../PageWrapper/PageWrapper';
import { Heading } from '../Heading/Heading';
import { Breadcrumb, type BreadcrumbSegment } from '../../ui/Breadcrumb/Breadcrumb';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { EyeOffIcon } from '../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

interface UnsupportedRequestProps {
  item: WebSocketRequest | GraphQLRequest | GrpcRequest;
  ancestry?: Item[];
  onBreadcrumbClick?: (uuid: string) => void;
}

const REQUEST_TYPE_LABELS: Record<string, string> = {
  websocket: 'Websocket',
  graphql: 'GraphQL',
  grpc: 'gRPC'
};

export const UnsupportedRequest: React.FC<UnsupportedRequestProps> = ({ item, ancestry = [], onBreadcrumbClick }) => {
  const typeLabel = REQUEST_TYPE_LABELS[getItemType(item) ?? ''] ?? 'This request';
  const name = getItemName(item) || typeLabel;

  const segments = useMemo<BreadcrumbSegment[]>(
    () =>
      ancestry
        .map((folder) => ({ name: getItemName(folder) || 'Folder', uuid: (folder as { uuid?: string }).uuid || '' }))
        .filter((segment) => segment.uuid),
    [ancestry]
  );

  return (
    <PageWrapper>
      <StyledWrapper className="unsupported-request" data-testid="unsupported-request">
        <Breadcrumb segments={segments} current={name} onSegmentClick={onBreadcrumbClick} testId="unsupported-request-breadcrumb" />

        <Heading size="md" style={{ marginTop: '0.875rem' }} testId="unsupported-request-title">{typeLabel}</Heading>

        <EmptyState
          className="unsupported-request-message"
          testId="unsupported-request-empty"
          icon={<EyeOffIcon />}
          heading="Preview not available"
          subheading={`${typeLabel} documentation isn't supported in this viewer.`}
        />
      </StyledWrapper>
    </PageWrapper>
  );
};

export default UnsupportedRequest;
