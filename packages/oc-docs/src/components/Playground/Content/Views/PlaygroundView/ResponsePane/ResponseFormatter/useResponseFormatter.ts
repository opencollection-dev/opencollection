import { useCallback, useMemo, useState } from 'react';
import { RunRequestResponse } from '../../../../../../../runner';
import { ResponseBodyFormat, useInitialResponseFormat } from '../../../../../../../utils/response';

export function useResponseFormatter(response: RunRequestResponse) {
  const { format, view } = useInitialResponseFormat(response?.headers);
  const [userSelectedFormat, setUserSelectedFormat] = useState<ResponseBodyFormat>();
  const [showPreview, setShowPreview] = useState(view === 'preview');

  const handleFormatChange = useCallback((format: ResponseBodyFormat) => {
    setUserSelectedFormat(format);
  }, []);

  const handleViewChange = useCallback((showPreview: boolean) => {
    setShowPreview(showPreview);
  }, []);

  return useMemo(() => {
    const selectedFormat = userSelectedFormat ?? format;
    return {
      selectedFormat,
      showPreview,
      handleFormatChange,
      handleViewChange
    };
  }, [handleFormatChange, handleViewChange, format, userSelectedFormat, showPreview]);
}
