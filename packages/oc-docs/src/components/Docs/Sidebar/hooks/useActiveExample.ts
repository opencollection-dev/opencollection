import { useLocation } from 'react-router-dom';
import { getItemUuid } from '../../../../utils/itemUtils';
import { useDocsNavigate } from '../../../../hooks';
import type { NavigationState } from '../../../../hooks/useDocsNavigate';
import type { NavModel } from '../../../../routing';
import type { HttpRequest } from '@opencollection/types/requests/http';

export function useActiveExample(
  model: NavModel,
  activeSlug: string,
  uuidToSlug: Map<string, string>,
  onNavigate?: () => void
) {
  // The highlighted example rides on the navigation entry's state, not the URL,
  // so it is not shareable/deep-linked, clears itself on any navigation, and is
  // restored correctly by browser back/forward. It always belongs to the request
  // currently shown.
  const { state } = useLocation();
  const docsNavigate = useDocsNavigate();
  const exampleIndex = (state as NavigationState)?.exampleIndex;
  const activeItem = model.bySlug.get(activeSlug)?.item;
  const activeRequestUuid = getItemUuid(activeItem);
  // Bound the highlight to the request's own example count, mirroring the sibling
  // paths (PlaygroundBody, Examples) so a stale index never lights up a row.
  const exampleCount = (activeItem as HttpRequest | undefined)?.examples?.length ?? 0;
  const activeExample =
    exampleIndex != null && activeRequestUuid !== undefined && exampleIndex < exampleCount
      ? { requestUuid: activeRequestUuid, index: exampleIndex }
      : null;

  const goToExample = (requestUuid: string, index: number) => {
    const slug = uuidToSlug.get(requestUuid);
    if (slug == null) return;
    docsNavigate(slug, { state: { exampleIndex: index } });
    onNavigate?.();
  };

  return {
    goToExample,
    activeExample
  };
}
