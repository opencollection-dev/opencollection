import type { ResponseBodyFormat } from '../../../../utils/response';

/** Web-feasible preview modes (binary previews require a data buffer, which the
 *  docs playground response does not carry). */
export type PreviewMode = 'web' | 'json' | 'xml' | 'text';

/** Maps a selected response format to the preview mode used to render it. */
export const formatToPreviewMode = (format: ResponseBodyFormat): PreviewMode => {
  switch (format) {
    case 'html':
      return 'web';
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    // javascript, base64, raw, hex
    default:
      return 'text';
  }
};
