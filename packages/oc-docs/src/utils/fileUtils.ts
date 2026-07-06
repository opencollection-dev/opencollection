import type { OpenCollection } from '@opencollection/types';
import type { Item, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Scripts } from '@opencollection/types/common/scripts';
import { getItemName, getRequestScripts, scriptsArrayToObject, isFolder } from './schemaHelpers';
import { isYamlFile, parseYaml } from './yamlUtils';
import type { ScriptFlow } from './request';

const loadOpenCollectionData = async (source: string | File): Promise<any> => {
  let content: string;

  if (source instanceof File) {
    content = await source.text();
  } else if (typeof source === 'string') {
    if (source.startsWith('http://') || source.startsWith('https://')) {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch collection: ${response.statusText}`);
      }
      content = await response.text();
    } else {
      content = source;
    }
  } else {
    throw new Error('Invalid source type for collection');
  }

  try {
    return parseYaml(content);
  } catch (yamlError) {
    try {
      return JSON.parse(content);
    } catch (jsonError) {
      throw new Error('Failed to parse collection as YAML or JSON');
    }
  }
};

export const loadCollectionFromUrl = async (source: string | File): Promise<any> => {
  try {
    if (source instanceof File) {
      const fileName = source.name.toLowerCase();

      if (isYamlFile(fileName)) {
        return await loadOpenCollectionData(source);
      } else {
        const content = await source.text();
        return JSON.parse(content);
      }
    }

    if (typeof source === 'string') {
      if (source.startsWith('file://') || source.startsWith('/')) {
        const filePath = source.replace('file://', '');

        const response = await fetch(`http://localhost:3001/api/read-collection?path=${encodeURIComponent(filePath)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to load collection: ${response.statusText}`);
        }

        return await response.json();
      } else if (source.startsWith('http://') || source.startsWith('https://')) {
        const response = await fetch(source);

        if (!response.ok) {
          throw new Error(`Failed to load collection: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || '';
        const isYamlUrl = isYamlFile(source);
        const isYamlContentType = contentType.includes('yaml') || contentType.includes('yml');

        if (isYamlUrl || isYamlContentType) {
          const yamlText = await response.text();
          return await loadOpenCollectionData(yamlText);
        } else {
          return await response.json();
        }
      } else {
        const response = await fetch(`http://localhost:3001/api/read-collection?path=${encodeURIComponent(source)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to load collection: ${response.statusText}`);
        }

        return await response.json();
      }
    }

    throw new Error('Invalid source type for collection loading');
  } catch (error) {
    console.error('Error loading collection:', error);
    throw error;
  }
};

const getUuid = (item: Item | null | undefined): string | undefined =>
  (item as { uuid?: string } | null | undefined)?.uuid;

const childItems = (item: Item): Item[] => ((item as { items?: Item[] }).items ?? []);

export const findItemByUuid = (items: Item[] | undefined, uuid: string): Item | null => {
  if (!items || !uuid) return null;
  for (const item of items) {
    if (getUuid(item) === uuid) return item;
    if (isFolder(item)) {
      const found = findItemByUuid(childItems(item), uuid);
      if (found) return found;
    }
  }
  return null;
};

export const getAncestorsByUuid = (collection: OpenCollection | null | undefined, uuid: string): Item[] => {
  if (!collection?.items || !uuid) return [];
  const path: Item[] = [];

  const walk = (items: Item[]): boolean => {
    for (const item of items) {
      if (getUuid(item) === uuid) return true;
      if (isFolder(item)) {
        path.push(item);
        if (walk(childItems(item))) return true;
        path.pop();
      }
    }
    return false;
  };

  walk(collection.items);
  return path;
};

export const findAndUpdateItem = (
  items: Item[] | undefined,
  uuid: string,
  updater: (item: any) => void
): boolean => {
  if (!items) return false;

  for (const item of items) {
    const itemUuid = (item as any).uuid;
    if (itemUuid === uuid) {
      updater(item);
      return true;
    }

    if (isFolder(item)) {
      const folder = item as Folder;
      if (folder.items && findAndUpdateItem(folder.items, uuid, updater)) {
        return true;
      }
    }
  }

  return false;
};

export const hydrateWithUUIDs = (collection: OpenCollection): OpenCollection => {
  const assignUUID = (item: Item): Item => {
    const uuid = (item as any).uuid || crypto.randomUUID();

    const hydratedItem = { ...item, uuid } as any;

    if (isFolder(item)) {
      const folder = item as Folder;
      if (folder.items && folder.items.length > 0) {
        hydratedItem.items = folder.items.map(assignUUID);
      }
    }

    return hydratedItem;
  };

  const hydratedCollection = { ...collection };

  if (collection.items && collection.items.length > 0) {
    hydratedCollection.items = collection.items.map(assignUUID);
  }

  return hydratedCollection;
};

export const generateSafeId = (input: string): string => {
  if (!input) return 'unnamed-item';

  return input
    .toLowerCase()
    .replace(/[^a-z0-9\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const getItemId = (item: any): string => {
  if (!item) return 'unnamed-item';
  return item.id || item.uid || getItemName(item) || item.name || 'unnamed-item';
};

export const generateSectionId = (item: any, parentPath?: string): string => {
  const itemId = getItemId(item);
  const safeItemId = generateSafeId(itemId);

  if (parentPath) {
    const safeParentPath = generateSafeId(parentPath);
    return `${safeParentPath}-${safeItemId}`;
  }

  return safeItemId;
};

export const sortItemsWithFoldersFirst = (items: Item[]): Item[] => {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return [...items].filter((item) => item != null).sort((a, b) => {
    const aIsFolder = isFolder(a);
    const bIsFolder = isFolder(b);

    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;

    const nameA = getItemId(a).toLowerCase();
    const nameB = getItemId(b).toLowerCase();

    return nameA.localeCompare(nameB);
  });
};

const TEST_PATTERN = /\b(?:test|it)(?:\.\w+)?\s*\(\s*(['"`])((?:\\.|(?!\1).)*)\1/g;

export interface ParsedTest {
  name: string;
  code: string;
}

const closingParen = (code: string, open: number): number => {
  let depth = 0;
  for (let i = open; i < code.length; i += 1) {
    const ch = code[i];
    const next = code[i + 1];

    if (ch === "'" || ch === '"' || ch === '`') {
      i += 1;
      while (i < code.length && code[i] !== ch) i += code[i] === '\\' ? 2 : 1;
      continue;
    }
    if (ch === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i += 1;
      i += 1;
      continue;
    }
    if (ch === '(') depth += 1;
    else if (ch === ')' && (depth -= 1) === 0) return i;
  }
  return -1;
};

export const extractTests = (code: string | undefined): ParsedTest[] => {
  if (!code) return [];
  const tests: ParsedTest[] = [];
  TEST_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null = TEST_PATTERN.exec(code);
  while (match !== null) {
    const name = (match[2] ?? '').replace(/\\(['"`\\])/g, '$1').trim();
    const open = code.indexOf('(', match.index);
    const close = open === -1 ? -1 : closingParen(code, open);
    const end = close === -1 ? code.length : code[close + 1] === ';' ? close + 2 : close + 1;
    const source = code.slice(match.index, end).trim();
    tests.push({ name, code: source });
    match = TEST_PATTERN.exec(code);
  }
  return tests;
};

export const extractTestNames = (code: string | undefined): string[] => extractTests(code).map((t) => t.name);

export interface TestRow {
  level: 'request' | 'folder' | 'collection';
  sourceName?: string;
  name: string;
  code: string;
  /** True when the script has no test()/it() wrapper and we surface the raw script instead. */
  raw?: boolean;
}

const testsCode = (scripts: Scripts | undefined): string | undefined => scriptsArrayToObject(scripts).tests;

const folderScripts = (folder: Item): Scripts | undefined =>
  (folder as { request?: { scripts?: Scripts } }).request?.scripts;

interface TestSource {
  level: TestRow['level'];
  code: string | undefined;
  sourceName?: string;
}

const forEachTestSource = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  item: HttpRequest,
  flow: ScriptFlow,
  visit: (level: TestRow['level'], code: string | undefined, sourceName?: string) => void
): void => {
  const sources: TestSource[] = [
    { level: 'collection', code: testsCode(collection?.request?.scripts), sourceName: collection?.info?.name },
    ...ancestors.map((folder): TestSource => ({
      level: 'folder',
      code: testsCode(folderScripts(folder)),
      sourceName: getItemName(folder)
    })),
    { level: 'request', code: testsCode(getRequestScripts(item)) }
  ];

  const ordered = flow === 'sequential' ? sources : [...sources].reverse();
  ordered.forEach((source) => visit(source.level, source.code, source.sourceName));
};

export const collectTests = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  item: HttpRequest,
  flow: ScriptFlow = 'sandwich'
): TestRow[] => {
  const rows: TestRow[] = [];
  forEachTestSource(collection, ancestors, item, flow, (level, code, sourceName) => {
    if (!code || !code.trim()) return;
    const parsed = extractTests(code);
    if (parsed.length > 0) {
      parsed.forEach((test) => rows.push({ level, name: test.name, code: test.code, sourceName }));
    } else {
      // Free-form test script (bare assertions / setup, no test()/it() wrapper): keep the
      // Tests section visible by surfacing the raw script rather than dropping it silently.
      rows.push({ level, name: 'Test script', code: code.trim(), sourceName, raw: true });
    }
  });

  return rows;
};

export interface RawTestScript {
  level: TestRow['level'];
  sourceName?: string;
  code: string;
}

/** The complete authored tests script at each level, in EE execution order (flow-aware), unparsed. */
export const collectRawTestScripts = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  item: HttpRequest,
  flow: ScriptFlow = 'sandwich'
): RawTestScript[] => {
  const scripts: RawTestScript[] = [];
  forEachTestSource(collection, ancestors, item, flow, (level, code, sourceName) => {
    if (code && code.trim()) scripts.push({ level, code: code.trim(), sourceName });
  });

  return scripts;
};
