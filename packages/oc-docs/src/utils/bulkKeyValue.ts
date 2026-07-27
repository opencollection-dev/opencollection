import { KeyValueRow } from 'src/components/KeyValueTable/KeyValueTable';

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

/**
 * Re-attach descriptions to freshly-parsed bulk rows. The bulk text only carries name/value/enabled,
 * so each row's description is matched back from `original` — a snapshot of the rows taken when bulk
 * edit was entered — by exact name, then (among same-named rows) the closest by index, consuming each
 * original once. A reordered row keeps its description, while
 * a renamed key or an extra duplicate gets none. `original` is not mutated.
 */
export function preserveDescriptions(
  parsed: BulkKeyValueItem[],
  original: KeyValueRow[],
  idPrefix: string
): KeyValueRow[] {
  const candidatesByName = new Map<string, { index: number; description: unknown; matched: boolean }[]>();
  original.forEach((row, index) => {
    const name = row.name || '';
    const candidates = candidatesByName.get(name) ?? [];
    candidates.push({ index, description: row.description, matched: false });
    candidatesByName.set(name, candidates);
  });

  return parsed.map((item, index) => {
    const row: KeyValueRow = { id: `${idPrefix}-${index}`, name: item.name, value: item.value, enabled: item.enabled };
    const candidates = candidatesByName.get(item.name || '');
    if (!candidates?.length) return row;

    let best: { index: number; description: unknown; matched: boolean } | null = null;
    let bestDistance = Infinity;
    for (const candidate of candidates) {
      if (candidate.matched) continue;
      const distance = Math.abs(candidate.index - index);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    }
    if (!best) return row;
    best.matched = true;
    return best.description ? { ...row, description: best.description } : row;
  });
}
