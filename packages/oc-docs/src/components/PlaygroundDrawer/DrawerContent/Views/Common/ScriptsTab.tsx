import React from 'react';
import CodeEditor from '../../../../../ui/CodeEditor/CodeEditor';

interface ScriptsTabProps {
  scripts: {
    preRequest?: string;
    postResponse?: string;
    tests?: string;
  };
  onScriptChange: (scriptType: 'preRequest' | 'postResponse' | 'tests', value: string) => void;
  title?: string;
  description?: string;
  showTests?: boolean;
}

export const ScriptsTab: React.FC<ScriptsTabProps> = ({
  scripts,
  onScriptChange,
  title = "Scripts",
  description,
  showTests = true
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        {description && (
          <span className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Pre-request Script
          </label>
          <CodeEditor
            value={scripts.preRequest || ''}
            onChange={(value: string) => onScriptChange('preRequest', value)}
            language="javascript"
            height="150px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Post-response Script
          </label>
          <CodeEditor
            value={scripts.postResponse || ''}
            onChange={(value: string) => onScriptChange('postResponse', value)}
            language="javascript"
            height="150px"
          />
        </div>

        {showTests && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Tests
            </label>
            <CodeEditor
              value={scripts.tests || ''}
              onChange={(value: string) => onScriptChange('tests', value)}
              language="javascript"
              height="150px"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptsTab;
