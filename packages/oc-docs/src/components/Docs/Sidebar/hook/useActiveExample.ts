import { useLocation } from 'react-router-dom';
import { getItemUuid } from '../../../../utils/itemUtils';
import { useDocsNavigate } from '../../../../hooks';
import { NavigationState } from '../../../../hooks/useDocsNavigate';
import { NavModel } from '../../../../routing';

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
  const activeRequestUuid = getItemUuid(model.bySlug.get(activeSlug)?.item);
  const activeExample =
    exampleIndex != null && activeRequestUuid !== undefined
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