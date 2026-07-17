import { getItemUuid } from '../../../../utils/itemUtils';
import { useDocsNavigate } from '../../../../hooks';
import { useActiveResolution } from '../../../../routing/hooks';
import { exampleSlugs } from '../../../../routing/slug';
import type { NavModel } from '../../../../routing';
import type { HttpRequest } from '@opencollection/types/requests/http';

export function useActiveExample(model: NavModel, uuidToSlug: Map<string, string>, onNavigate?: () => void) {
  // The active example is read from the route (<request-slug>/<example-slug>),
  // so it is shareable/deep-linked, survives reload, and back/forward restore it.
  const resolution = useActiveResolution();
  const docsNavigate = useDocsNavigate();
  const activeRequestUuid = resolution?.example ? getItemUuid(resolution.entry.item) : undefined;
  const activeExample =
    resolution?.example && activeRequestUuid !== undefined
      ? { requestUuid: activeRequestUuid, index: resolution.example.index }
      : null;

  const goToExample = (requestUuid: string, index: number) => {
    const slug = uuidToSlug.get(requestUuid);
    if (slug == null) return;
    const item = model.bySlug.get(slug)?.item as HttpRequest | null;
    const exampleSlug = exampleSlugs((item?.examples ?? []).map((example) => example.name))[index];
    if (!exampleSlug) return;
    docsNavigate(`${slug}/${exampleSlug}`);
    onNavigate?.();
  };

  return {
    goToExample,
    activeExample
  };
}
