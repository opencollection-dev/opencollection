import React, { useMemo, useState } from 'react';
import { Code } from '../Code/Code';
import { Modal } from '../Modal';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import type { TestRow } from '../../utils/extractTests';

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
    <>
      <button type="button" className="oc-code-toggle oc-view-all-tests" onClick={() => setOpen(true)}>
        View complete code
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={<SectionLabel>Tests</SectionLabel>} ariaLabel="All tests">
        {open && <Code code={code} language="javascript" showLineNumbers showCopy />}
      </Modal>
    </>
  );
};

export default ViewAllTests;
