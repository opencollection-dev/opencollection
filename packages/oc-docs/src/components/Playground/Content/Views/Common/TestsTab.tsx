import React from 'react';
import CodeEditor from '../../../../../ui/CodeEditor/CodeEditor';

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
    <div className="space-y-3">
      {Boolean(title) && (
        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h4>
      )}
      {description && (
        <div className="mb-4">
          <span className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
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
    </div>
  );
};

export default TestsTab;
