export type DockMode = 'inline' | 'bottom' | 'modal';

export const DOCK_MODES: DockMode[] = ['inline', 'bottom', 'modal'];
export const DEFAULT_DOCK: DockMode = 'bottom';

export const PARAM_OPEN = 'pg';
export const PARAM_DOCK = 'dock';
export const PARAM_REQUEST = 'pgReq';
export const PARAM_EXAMPLE = 'pgEx';

export const isDockMode = (value: string | null | undefined): value is DockMode =>
  value === 'inline' || value === 'bottom' || value === 'modal';

export interface PlaygroundUrlState {
  open: boolean;
  dock: DockMode;
  requestSlug: string | null;
  // The saved example open under the request, if any. Only meaningful with a
  // requestSlug (an example is always addressed relative to its parent request).
  exampleSlug: string | null;
}

// Dock lives only in the URL (so a shared link reproduces the sender's dock).
// It is never persisted; a fresh open with no `dock` param falls back to the
// default, matching the playground's "refresh resets everything" rule.
export const readPlaygroundParams = (params: URLSearchParams): PlaygroundUrlState => {
  const open = params.get(PARAM_OPEN) === '1';
  const dockParam = params.get(PARAM_DOCK);
  const dock = isDockMode(dockParam) ? dockParam : DEFAULT_DOCK;
  const requestSlug = params.get(PARAM_REQUEST);
  // An example slug only makes sense with a parent request; drop it otherwise.
  const exampleSlug = requestSlug ? params.get(PARAM_EXAMPLE) : null;
  return { open, dock, requestSlug, exampleSlug };
};

interface WriteInput {
  open: boolean;
  dock?: DockMode;
  requestSlug?: string | null;
  exampleSlug?: string | null;
}

export const writePlaygroundParams = (params: URLSearchParams, input: WriteInput): URLSearchParams => {
  const next = new URLSearchParams(params);
  if (!input.open) {
    next.delete(PARAM_OPEN);
    next.delete(PARAM_DOCK);
    next.delete(PARAM_REQUEST);
    next.delete(PARAM_EXAMPLE);
    return next;
  }
  next.set(PARAM_OPEN, '1');
  if (input.dock) next.set(PARAM_DOCK, input.dock);
  if (input.requestSlug) next.set(PARAM_REQUEST, input.requestSlug);
  else next.delete(PARAM_REQUEST);
  // The example is scoped to its request: keep pgEx only when both are present.
  if (input.requestSlug && input.exampleSlug) next.set(PARAM_EXAMPLE, input.exampleSlug);
  else next.delete(PARAM_EXAMPLE);
  return next;
};
