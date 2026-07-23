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
  fillHeight?: boolean;
}

export const TestsTab: React.FC<TestsTabProps> = ({ scripts, onScriptChange, title, description, fillHeight = false }) => {
  return (
    <StyledWrapper className={`space-y-3${fillHeight ? ' h-full flex flex-col' : ''}`}>
      {(Boolean(title) || Boolean(description)) && (
        <div className="flex items-center justify-between mb-4">
          {title && <span className="title text-sm font-semibold">{title}</span>}
          {description && <span className="description text-xs leading-tight">{description}</span>}
        </div>
      )}
      <div className={fillHeight ? 'flex-1 min-h-0' : undefined}>
        <CodeEditor
          value={scripts.tests || ''}
          onChange={(value) => onScriptChange('tests', value)}
          language="javascript"
          height={fillHeight ? '100%' : '400px'}
          hintsFor={['req', 'res', 'bru']}
        />
      </div>
    </StyledWrapper>
  );
};

export default TestsTab;
