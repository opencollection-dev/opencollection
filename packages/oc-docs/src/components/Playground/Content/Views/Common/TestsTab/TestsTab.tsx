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
      {Boolean(title) && (
        <h4 className="title text-sm font-semibold mb-2">
          {title}
        </h4>
      )}
      {description && (
        <div className="mb-4">
          <span className="description text-xs leading-tight">
            {description}
          </span>
        </div>
      )}
      <CodeEditor
        value={scripts.tests || ''}
        onChange={(value) => onScriptChange('tests', value)}
        language="javascript"
        height="400px"
      />
    </StyledWrapper>
  );
};

export default TestsTab;
