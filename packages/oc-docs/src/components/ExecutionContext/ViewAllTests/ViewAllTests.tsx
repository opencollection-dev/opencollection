import React, { Fragment, useMemo, useState } from 'react';
import { Code } from '../../Code/Code';
import { Modal } from '../../../ui/Modal/Modal';
import { SectionLabel } from '../../SectionLabel/SectionLabel';
import type { TestRow } from '../../../utils/extractTests';
import { StyledWrapper } from './StyledWrapper';

interface ViewAllTestsProps {
  tests: TestRow[];
}

export const ViewAllTests: React.FC<ViewAllTestsProps> = ({ tests }) => {
  const [open, setOpen] = useState(false);

  const code = useMemo(
    () => tests.map((test) => test.code.trim()).filter(Boolean).join('\n\n'),
    [tests]
  );

  if (!code) return null;

  return (
    <Fragment>
      <StyledWrapper type="button" onClick={() => setOpen(true)}>
        View complete code
      </StyledWrapper>
      <Modal open={open} onClose={() => setOpen(false)} title={<SectionLabel>Tests</SectionLabel>} ariaLabel="All tests">
        {open && <Code code={code} language="javascript" showLineNumbers showCopy />}
      </Modal>
    </Fragment>
  );
};

export default ViewAllTests;
