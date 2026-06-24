import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Scripts } from '@opencollection/types/common/scripts';
import type { ScriptExecutionFlow } from '@opencollection/types/config/collection';
import { getRequestScripts, scriptsArrayToObject, getItemName } from './schemaHelpers';

export type ScriptLevel = 'collection' | 'folder' | 'request';
export type ScriptPhase = 'before-request' | 'after-response';

/** Script execution flow (`sandwich` | `sequential`). */
export type ScriptFlow = ScriptExecutionFlow;

/** Script config carried under `extensions.config` (e.g. `extensions.config.scripts.flow`). */
interface ConfigExtension {
  scripts?: { flow?: unknown };
}

/**
 * The collection's script execution flow. It is declared under
 * `extensions.config.scripts.flow`; we fall back to the typed `config.scripts.flow` for
 * older collections. Exactly one flow is always returned — anything other than the
 * literal `sequential` (missing, unknown value, malformed extension, null collection)
 * resolves to `sandwich`, matching the runtime default (`scripts.flow ?? 'sandwich'`).
 */
export const getScriptFlow = (collection: OpenCollection | null | undefined): ScriptFlow => {
  const ext = collection?.extensions?.config as ConfigExtension | undefined;
  const flow = ext?.scripts?.flow ?? collection?.config?.scripts?.flow;
  return flow === 'sequential' ? 'sequential' : 'sandwich';
};

export interface ScriptChainStep {
  level: ScriptLevel;
  phase: ScriptPhase;
  label: string;
  sourceName?: string;
  code: string;
  /**
   * Hierarchy index of the step's source: 0 = collection, 1..n = folders
   * (outermost→innermost), n+1 = request. Used to order the chain: pre-request runs
   * by ascending order, post-response the reverse (innermost→outermost).
   */
  order: number;
}

interface ScriptSource {
  level: ScriptLevel;
  order: number;
  sourceName?: string;
  pre?: string;
  post?: string;
}

const folderScripts = (folder: Item): Scripts | undefined =>
  (folder as { request?: { scripts?: Scripts } }).request?.scripts;

const stepLabel = (level: ScriptLevel, phase: ScriptPhase): string => {
  const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);
  return `${levelLabel} ${phase === 'before-request' ? 'Pre-Request' : 'Post-Response'}`;
};

/**
 * Build the ordered execution chain shown in the request page's Execution Context:
 * pre-request runs collection → folders(parent→child) → request; post-response runs
 * the reverse. Empty steps are skipped; `hooks` are not included.
 */
export const buildScriptChain = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  item: HttpRequest
): ScriptChainStep[] => {
  const collectionScripts = scriptsArrayToObject(collection?.request?.scripts);
  const sources: ScriptSource[] = [
    { level: 'collection', order: 0, sourceName: collection?.info?.name, pre: collectionScripts.preRequest, post: collectionScripts.postResponse }
  ];
  ancestors.forEach((folder) => {
    const s = scriptsArrayToObject(folderScripts(folder));
    sources.push({ level: 'folder', order: sources.length, sourceName: getItemName(folder), pre: s.preRequest, post: s.postResponse });
  });
  const requestScripts = scriptsArrayToObject(getRequestScripts(item));
  sources.push({ level: 'request', order: sources.length, pre: requestScripts.preRequest, post: requestScripts.postResponse });

  const steps: ScriptChainStep[] = [];

  sources.forEach((source) => {
    if (source.pre && source.pre.trim()) {
      steps.push({
        level: source.level,
        phase: 'before-request',
        label: stepLabel(source.level, 'before-request'),
        sourceName: source.sourceName,
        code: source.pre,
        order: source.order
      });
    }
  });

  [...sources].reverse().forEach((source) => {
    if (source.post && source.post.trim()) {
      steps.push({
        level: source.level,
        phase: 'after-response',
        label: stepLabel(source.level, 'after-response'),
        sourceName: source.sourceName,
        code: source.post,
        order: source.order
      });
    }
  });

  return steps;
};
