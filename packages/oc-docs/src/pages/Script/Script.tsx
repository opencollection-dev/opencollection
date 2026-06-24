import React, { useMemo } from 'react';
import type { Item, ScriptFile } from '@opencollection/types/collection/item';
import { getItemName } from '../../utils/schemaHelpers';
import { PageWrapper } from '../../components/PageWrapper/PageWrapper';
import { Heading } from '../../components/Heading/Heading';
import { Breadcrumb, type BreadcrumbSegment } from '../../ui/Breadcrumb/Breadcrumb';
import { Code } from '../../components/Code/Code';
import { StyledWrapper } from './StyledWrapper';

interface ScriptProps {
  item: ScriptFile;
  ancestry?: Item[];
  onBreadcrumbClick?: (uuid: string) => void;
}

export const Script: React.FC<ScriptProps> = ({ item, ancestry = [], onBreadcrumbClick }) => {
  const name = getItemName(item) || 'Script';
  const code = item.script ?? '';

  const segments = useMemo<BreadcrumbSegment[]>(
    () =>
      ancestry
        .map((folder) => ({ name: getItemName(folder) || 'Folder', uuid: (folder as { uuid?: string }).uuid || '' }))
        .filter((segment) => segment.uuid),
    [ancestry]
  );

  return (
    <PageWrapper>
      <StyledWrapper className="oc-script">
        <Breadcrumb segments={segments} current={name} onSegmentClick={onBreadcrumbClick} />

        <Heading size="md" style={{ marginTop: '0.875rem' }}>{name}</Heading>

        <Code code={code} language="javascript" showLineNumbers showCopy className="oc-script-code" />
      </StyledWrapper>
    </PageWrapper>
  );
};

export default Script;
