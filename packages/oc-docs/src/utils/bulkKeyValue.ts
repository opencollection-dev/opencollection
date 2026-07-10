import { KeyValueRow } from 'src/ui/KeyValueTable/KeyValueTable';

export type BulkKeyValueItem = Pick<KeyValueRow, 'name' | 'value' | 'enabled'>;

/**
 * Parse bulk-editor text into key/value items. Each line is `name: value`;
 * a line starting with `//` marks the row as disabled. Lines without a `:`
 * separator are ignored. Ported from bruno-app's `bulkKeyValueUtils`.
 */
export function parseBulkKeyValue(value: string): BulkKeyValueItem[] {
  return value
    .split(/\r?\n/)
    .map((pair): BulkKeyValueItem | null => {
      const isEnabled = !pair.trim().startsWith('//');
      const cleanPair = pair.replace(/^\/\/\s*/, '');
      const sep = cleanPair.indexOf(':');
      if (sep < 0) return null;
      return {
        name: cleanPair.slice(0, sep).trim(),
        value: cleanPair.slice(sep + 1).trim(),
        enabled: isEnabled
      };
    })
    .filter((item): item is BulkKeyValueItem => item !== null);
}

/**
 * Serialize key/value items back into bulk-editor text. Disabled rows are
 * prefixed with `//`.
 */
export function serializeBulkKeyValue(items: BulkKeyValueItem[]): string {
  return items.map((item) => `${item.enabled ? '' : '//'}${item.name}:${item.value}`).join('\n');
}
