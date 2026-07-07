import React, { Fragment, useMemo, useState } from 'react';
import { Code } from '../../Code/Code';
import { Modal } from '../../../ui/Modal/Modal';
import { SectionLabel } from '../../SectionLabel/SectionLabel';
import type { RawTestScript } from '../../../utils/fileUtils';
import { StyledWrapper } from './StyledWrapper';

interface ViewAllTestsProps {
  scripts: RawTestScript[];
  testId?: string;
}

const SCOPE_LABEL: Record<RawTestScript['level'], string> = {
  collection: 'Collection',
  folder: 'Folder',
  request: 'Request'
};

export const ViewAllTests: React.FC<ViewAllTestsProps> = ({ scripts, testId }) => {
  const [open, setOpen] = useState(false);

  // Show the complete authored scripts (setup + all blocks), not just parsed test() snippets.
  // When more than one level contributes, prefix each with a scope comment for attribution.
  const code = useMemo(() => {
    const parts = scripts.filter((s) => s.code.trim());
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].code;
    return parts
      .map((s) => `// ${SCOPE_LABEL[s.level]}${s.sourceName ? `: ${s.sourceName}` : ''}\n${s.code}`)
      .join('\n\n');
  }, [scripts]);

  if (!code) return null;

  return (
    <Fragment>
      <StyledWrapper type="button" onClick={() => setOpen(true)} data-testid={testId}>
        View complete code
      </StyledWrapper>
      <Modal open={open} onClose={() => setOpen(false)} title={<SectionLabel>Tests</SectionLabel>} ariaLabel="All tests">
        {open && <Code code={code} language="javascript" showLineNumbers showCopy />}
      </Modal>
    </Fragment>
  );
};

export default ViewAllTests;
