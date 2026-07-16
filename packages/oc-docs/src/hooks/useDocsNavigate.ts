import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface NavigationState {
  exampleIndex: number;
}

/**
 * Navigate between docs pages while preserving the playground's URL params
 * (pg / dock / pgReq live in the query string). Docs navigation changes only
 * the pathname, so an open playground stays open across page changes.
 */
export const useDocsNavigate = (): ((
  slug: string,
  options?: { replace?: boolean; state?: NavigationState }
) => void) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  return useCallback(
    (slug: string, options?: { replace?: boolean; state?: NavigationState }) => {
      const pathname = slug ? `/${slug}` : '/';
      navigate({ pathname, search }, options);
    },
    [navigate, search]
  );
};
