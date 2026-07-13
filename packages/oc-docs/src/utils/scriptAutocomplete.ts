import { getVariableContext } from './variableAutocomplete';

export type ScriptApiRoot = 'req' | 'res' | 'bru';

/**
 * The Bruno scripting API completion surface, mirrored from Bruno's
 * `STATIC_API_HINTS`. Each entry is a full dotted path (with its call signature
 * as literal text); completions are derived by walking these paths segment by
 * segment. Keep in sync with Bruno's list when the scripting API changes.
 */
export const STATIC_API_HINTS: Record<ScriptApiRoot, string[]> = {
  req: [
    'req',
    'req.url',
    'req.method',
    'req.headers',
    'req.body',
    'req.timeout',
    'req.getUrl()',
    'req.setUrl(url)',
    'req.getHost()',
    'req.getPath()',
    'req.getQueryString()',
    'req.getMethod()',
    'req.getAuthMode()',
    'req.setMethod(method)',
    'req.getHeader(name)',
    'req.getHeaders()',
    'req.setHeader(name, value)',
    'req.setHeaders(data)',
    'req.deleteHeader(name)',
    'req.deleteHeaders(data)',
    'req.getBody()',
    'req.setBody(data)',
    'req.setMaxRedirects(maxRedirects)',
    'req.getTimeout()',
    'req.setTimeout(timeout)',
    'req.getExecutionMode()',
    'req.getName()',
    'req.getPathParams()',
    'req.getTags()',
    'req.disableParsingResponseJson()',
    'req.onFail(function(err) {})',
    'req.headerList',
    'req.headerList.get(name)',
    'req.headerList.one(name)',
    'req.headerList.all()',
    'req.headerList.count()',
    'req.headerList.has(name)',
    'req.headerList.has(name, value)',
    'req.headerList.find(fn)',
    'req.headerList.filter(fn)',
    'req.headerList.indexOf(item)',
    'req.headerList.each(fn)',
    'req.headerList.map(fn)',
    'req.headerList.reduce(fn, initialValue)',
    'req.headerList.toObject()',
    'req.headerList.toString()',
    'req.headerList.toJSON()',
    'req.headerList.add(headerObj)',
    'req.headerList.upsert(headerObj)',
    'req.headerList.remove(predicate)',
    'req.headerList.clear()',
    'req.headerList.populate(items)',
    'req.headerList.repopulate(items)',
    'req.headerList.assimilate(source, prune)'
  ],
  res: [
    'res',
    'res.status',
    'res.statusText',
    'res.headers',
    'res.body',
    'res.responseTime',
    'res.url',
    'res.getStatus()',
    'res.getStatusText()',
    'res.getHeader(name)',
    'res.getHeaders()',
    'res.getBody()',
    'res.setBody(data)',
    'res.getResponseTime()',
    'res.getSize()',
    'res.getSize().header',
    'res.getSize().body',
    'res.getSize().total',
    'res.getUrl()',
    'res.headerList',
    'res.headerList.get(name)',
    'res.headerList.one(name)',
    'res.headerList.all()',
    'res.headerList.count()',
    'res.headerList.has(name)',
    'res.headerList.has(name, value)',
    'res.headerList.find(fn)',
    'res.headerList.filter(fn)',
    'res.headerList.indexOf(item)',
    'res.headerList.each(fn)',
    'res.headerList.map(fn)',
    'res.headerList.reduce(fn, initialValue)',
    'res.headerList.toObject()',
    'res.headerList.toString()',
    'res.headerList.toJSON()'
  ],
  bru: [
    'bru',
    'bru.cwd()',
    'bru.getEnvName()',
    'bru.getProcessEnv(key)',
    'bru.hasEnvVar(key)',
    'bru.getEnvVar(key)',
    'bru.getFolderVar(key)',
    'bru.getCollectionVar(key)',
    'bru.setCollectionVar(key, value)',
    'bru.hasCollectionVar(key)',
    'bru.deleteCollectionVar(key)',
    'bru.deleteAllCollectionVars()',
    'bru.getAllCollectionVars()',
    'bru.setEnvVar(key, value)',
    'bru.deleteEnvVar(key)',
    'bru.getAllEnvVars()',
    'bru.deleteAllEnvVars()',
    'bru.hasVar(key)',
    'bru.getVar(key)',
    'bru.setVar(key,value)',
    'bru.deleteVar(key)',
    'bru.deleteAllVars()',
    'bru.getAllVars()',
    'bru.setNextRequest(requestName)',
    'bru.getRequestVar(key)',
    'bru.runRequest(requestPathName)',
    'bru.sendRequest(requestConfig)',
    'bru.sendRequest(requestConfig, callback)',
    'bru.getAssertionResults()',
    'bru.getTestResults()',
    'bru.sleep(ms)',
    "bru.visualize('html', { content })",
    "bru.visualize('html', { template, data, options })",
    'bru.clearVisualizations()',
    'bru.getSecretVar(key)',
    'bru.getOauth2CredentialVar(key)',
    'bru.getCollectionName()',
    'bru.isSafeMode()',
    'bru.hasGlobalEnvVar(key)',
    'bru.getGlobalEnvVar(key)',
    'bru.setGlobalEnvVar(key, value)',
    'bru.deleteGlobalEnvVar(key)',
    'bru.getAllGlobalEnvVars()',
    'bru.deleteAllGlobalEnvVars()',
    'bru.runner',
    'bru.runner.setNextRequest(requestName)',
    'bru.runner.skipRequest()',
    'bru.runner.stopExecution()',
    'bru.runner.iterationIndex',
    'bru.runner.totalIterations',
    'bru.runner.iterationData',
    'bru.runner.iterationData.has(key)',
    'bru.runner.iterationData.get(key)',
    'bru.runner.iterationData.set(key, value)',
    'bru.runner.iterationData.get()',
    'bru.runner.iterationData.stringify()',
    'bru.runner.iterationData.unset(key)',
    'bru.interpolate(str)',
    'bru.cookies',
    'bru.cookies.get(name)',
    'bru.cookies.has(name)',
    'bru.cookies.has(name, value)',
    'bru.cookies.one(name)',
    'bru.cookies.all()',
    'bru.cookies.count()',
    'bru.cookies.idx(index)',
    'bru.cookies.indexOf(item)',
    'bru.cookies.find(fn)',
    'bru.cookies.filter(fn)',
    'bru.cookies.each(fn)',
    'bru.cookies.map(fn)',
    'bru.cookies.reduce(fn, initialValue)',
    'bru.cookies.toObject()',
    'bru.cookies.toString()',
    'bru.cookies.add(cookieObj)',
    'bru.cookies.upsert(cookieObj)',
    'bru.cookies.remove(name)',
    'bru.cookies.delete(name)',
    'bru.cookies.clear()',
    'bru.cookies.jar()',
    'bru.cookies.jar().getCookie(url, name, callback)',
    'bru.cookies.jar().getCookies(url, callback)',
    'bru.cookies.jar().setCookie(url, name, value, callback)',
    'bru.cookies.jar().setCookie(url, cookieObject, callback)',
    'bru.cookies.jar().setCookies(url, cookiesArray, callback)',
    'bru.cookies.jar().clear(callback)',
    'bru.cookies.jar().deleteCookies(url, callback)',
    'bru.cookies.jar().deleteCookie(url, name, callback)',
    'bru.cookies.jar().hasCookie(url, name, callback)',
    'bru.utils',
    'bru.utils.minifyJson(json)',
    'bru.utils.minifyXml(xml)',
    'bru.resetOauth2Credential(credentialId)'
  ]
};

const IDENTIFIER_CHAR = /[A-Za-z0-9_$]/;
const OBJECT_PATH_CHAR = /[A-Za-z0-9_$.]/;

interface MemberAccess {
  /** The dotted prefix the caret is a member of, ending in `.` (e.g. `bru.cookies.`), or `''` at the root. */
  objectPath: string;
  /** The partial identifier typed after `objectPath`. */
  partial: string;
}

/**
 * Split the text before the caret into the object path being accessed and the
 * partial member typed so far. A leading run of identifier characters is the
 * partial; if it is preceded by `.`, the run of `[\w$.]` ending at that dot is
 * the object path. Anything else (a paren, an operator) resets to the root.
 */
const parseMemberAccess = (textBeforeCaret: string): MemberAccess => {
  let wordStart = textBeforeCaret.length;
  while (wordStart > 0 && IDENTIFIER_CHAR.test(textBeforeCaret[wordStart - 1])) wordStart -= 1;
  const partial = textBeforeCaret.slice(wordStart);
  const beforeWord = textBeforeCaret.slice(0, wordStart);
  if (!beforeWord.endsWith('.')) return { objectPath: '', partial };

  let pathStart = beforeWord.length;
  while (pathStart > 0 && OBJECT_PATH_CHAR.test(beforeWord[pathStart - 1])) pathStart -= 1;
  return { objectPath: beforeWord.slice(pathStart), partial };
};

const rankByPartial = (candidates: string[], partial: string, max: number): string[] => {
  if (!partial) return candidates.slice(0, max);
  const lower = partial.toLowerCase();
  const prefix: string[] = [];
  const substring: string[] = [];
  for (const candidate of candidates) {
    const lowerCandidate = candidate.toLowerCase();
    if (lowerCandidate.startsWith(lower)) prefix.push(candidate);
    else if (lowerCandidate.includes(lower)) substring.push(candidate);
  }
  return [...prefix, ...substring].slice(0, max);
};

/**
 * Bruno-style script/test autocomplete: given the text on the current line up
 * to the caret and the API roots this editor exposes (`showHintsFor`), return
 * the completion labels — the immediate members of the object path being typed
 * (or the enabled roots at the top level). Returns nothing inside a `{{…}}`
 * token, matching Bruno's script editors, which do not complete variables.
 */
export const getScriptApiCompletions = (textBeforeCaret: string, roots: ScriptApiRoot[], max = 50): string[] => {
  const enabledRoots = roots.filter((root) => root in STATIC_API_HINTS);
  if (!enabledRoots.length) return [];
  if (getVariableContext(textBeforeCaret)) return [];

  const { objectPath, partial } = parseMemberAccess(textBeforeCaret);

  if (objectPath === '') return rankByPartial(enabledRoots, partial, max);

  const seen = new Set<string>();
  const members: string[] = [];
  for (const root of enabledRoots) {
    for (const hint of STATIC_API_HINTS[root]) {
      if (hint.length <= objectPath.length || !hint.startsWith(objectPath)) continue;
      const nextSegment = hint.slice(objectPath.length).split('.')[0];
      if (nextSegment && !seen.has(nextSegment)) {
        seen.add(nextSegment);
        members.push(nextSegment);
      }
    }
  }
  return rankByPartial(members, partial, max);
};
