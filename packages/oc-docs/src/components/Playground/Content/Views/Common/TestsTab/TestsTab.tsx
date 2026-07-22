import React from 'react';
import CodeEditor from '../../../../../../ui/CodeEditor/CodeEditor';
import { StyledWrapper } from './StyledWrapper';

interface TestsTabProps {
  scripts: {
    tests?: string;
  };
  onScriptChange: (scriptType: 'tests', value: string) => void;
  title?: string;
  description?: string;
}

export const TestsTab: React.FC<TestsTabProps> = ({ scripts, onScriptChange, title, description }) => {
  return (
    <StyledWrapper className="space-y-3">
      {(Boolean(title) || Boolean(description)) && (
        <div className="flex items-center justify-between mb-4">
          {title && <span className="title text-sm font-semibold">{title}</span>}
          {description && <span className="description text-xs leading-tight">{description}</span>}
        </div>
      )}
      <CodeEditor
        value={scripts.tests || ''}
        onChange={(value) => onScriptChange('tests', value)}
        language="javascript"
        height="400px"
        hintsFor={['req', 'res', 'bru']}
      />
    </StyledWrapper>
  );
};

export default TestsTab;
