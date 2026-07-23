import React from 'react';
import CodeEditor from '../../../../../ui/CodeEditor/CodeEditor';
import { ResponseBodyFormat } from '../../../../../utils/response';
import { RunRequestResponse } from '../../../../../runner';
import { QueryResultPreview } from '../../../QueryResult/QueryResult';
import { formatToPreviewMode } from '../../../QueryResult/QueryResultPreview/previewMode';

interface ResponseBodyTabProps {
  response: RunRequestResponse;
  selectedFormat: ResponseBodyFormat;
  showPreview: boolean;
}

const ResponseBodyTab: React.FC<ResponseBodyTabProps> = ({ response, selectedFormat, showPreview }) => {
  // The runner parses JSON responses into objects; the editor needs a string.
  const editorValue =
    response?.data == null
      ? ''
      : typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data, null, 2);

  // The tab-panel is height-constrained; own the scroll here so a tall body
  // (e.g. a large JSON tree) scrolls within the response area instead of
  // overflowing and being clipped.
  return (
    <div className="h-full overflow-auto">
      {showPreview ? (
        <QueryResultPreview
          data={response?.data}
          previewMode={formatToPreviewMode(selectedFormat)}
          baseUrl={response?.url}
        />
      ) : (
        <CodeEditor
          value={editorValue}
          onChange={() => {}} // Read-only
          language={selectedFormat}
          height="100%"
          readOnly={true}
        />
      )}
    </div>
  );
};

export default ResponseBodyTab;
