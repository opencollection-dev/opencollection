import React from 'react';
import CodeEditor from '../../../../../ui/CodeEditor/CodeEditor';

interface ResponseBodyTabProps {
  response: any;
}

const ResponseBodyTab: React.FC<ResponseBodyTabProps> = ({ response }) => {
  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const responseText = typeof response.data === 'string' ? response.data : formatJson(response.data);
  const contentType = response.headers?.['content-type'] || response.headers?.['Content-Type'] || '';
  let language = 'text';
  
  if (contentType.includes('application/json') || contentType.includes('text/json')) {
    language = 'json';
  } else if (contentType.includes('text/html')) {
    language = 'html';
  } else if (contentType.includes('text/xml') || contentType.includes('application/xml')) {
    language = 'xml';
  } else if (contentType.includes('text/css')) {
    language = 'css';
  } else if (contentType.includes('text/javascript') || contentType.includes('application/javascript')) {
    language = 'javascript';
  }
  
  return (
    <div className="h-full py-4" style={{ display: 'flex', flexDirection: 'column' }}>
      <CodeEditor
        value={responseText}
        onChange={() => {}} // Read-only
        language={language}
        height="100%"
        readOnly={true}
      />
    </div>
  );
};

export default ResponseBodyTab;

