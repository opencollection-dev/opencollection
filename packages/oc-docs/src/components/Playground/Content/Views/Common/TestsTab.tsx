import React from 'react';
import CodeEditor from '../../../../../ui/CodeEditor/CodeEditor';

interface TestsTabProps {
  scripts: {
    tests?: string;
  };
  onScriptChange: (scriptType: 'tests', value: string) => void;
  title?: string;
}

export const TestsTab: React.FC<TestsTabProps> = ({
  scripts,
  onScriptChange,
  title = "Tests"
}) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h4>
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
