/**
 * React hooks bridging the router (HashRouter) to the pure nav model
 * (BRU-3188). Active item is derived from the URL, not from redux selection.
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectDocsCollection } from '../store/slices/docs';
import { buildNavModel } from './navModel';
import { resolveSlug, type Resolution } from './resolve';
import type { NavModel } from './types';

/** Memoised nav model for the currently loaded collection. */
export const useNavModel = (): NavModel => {
  const collection = useAppSelector(selectDocsCollection);
  return useMemo(() => buildNavModel(collection), [collection]);
};

/**
 * Resolve the current hash path to its entry + prev/next neighbours.
 * Returns null when the path does not match any known slug (caller redirects).
 */
export const useActiveResolution = (): Resolution | null => {
  const model = useNavModel();
  const { pathname } = useLocation();
  return useMemo(() => resolveSlug(model, pathname), [model, pathname]);
};
