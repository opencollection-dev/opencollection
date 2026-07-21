import { memo, useMemo } from 'react';

export interface TextPreviewProps {
  data: unknown;
}

/** Renders arbitrary response data as plain, wrapped monospace text. */
const TextPreview = memo(({ data }: TextPreviewProps) => {
  const displayData = useMemo(() => {
    if (data === null || data === undefined) {
      return String(data);
    }
    if (typeof data === 'object') {
      try {
        return JSON.stringify(data);
      } catch {
        return String(data);
      }
    }
    return String(data);
  }, [data]);

  return (
    <div className="p-4 font-mono text-[13px] whitespace-pre-wrap break-words overflow-auto overflow-x-hidden w-full max-w-full h-full">
      {displayData}
    </div>
  );
});

TextPreview.displayName = 'TextPreview';

export default TextPreview;
