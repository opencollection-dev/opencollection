import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  type DockMode,
  type PlaygroundUrlState,
  DEFAULT_DOCK,
  readPlaygroundParams,
  writePlaygroundParams,
} from '../utils/playgroundDock';

export interface PlaygroundUrlApi extends PlaygroundUrlState {
  openPlayground: (requestSlug?: string | null) => void;
  closePlayground: () => void;
  setDock: (dock: DockMode) => void;
  setRequestSlug: (requestSlug?: string | null) => void;
  setRequestExample: (requestSlug?: string | null, exampleSlug?: string | null) => void;
}

export const usePlaygroundUrlState = (): PlaygroundUrlApi => {
  const [params, setParams] = useSearchParams();
  const state = readPlaygroundParams(params);

  const openPlayground = useCallback(
    (requestSlug?: string | null) => {
      setParams((prev) => {
        // Keep the current dock when the playground is already open (e.g. Try
        // clicked while docked inline/modal); only fall back to the default when
        // opening fresh.
        const current = readPlaygroundParams(prev);
        return writePlaygroundParams(prev, {
          open: true,
          dock: current.open ? current.dock : DEFAULT_DOCK,
          requestSlug,
        });
      });
    },
    [setParams]
  );

  const closePlayground = useCallback(() => {
    setParams((prev) => writePlaygroundParams(prev, { open: false }));
  }, [setParams]);

  const setDock = useCallback(
    (dock: DockMode) => {
      setParams(
        (prev) => {
          const current = readPlaygroundParams(prev);
          return writePlaygroundParams(prev, { open: true, dock, requestSlug: current.requestSlug });
        },
        { replace: true }
      );
    },
    [setParams]
  );

  const setRequestSlug = useCallback(
    (requestSlug?: string | null) => {
      setParams((prev) => {
        const current = readPlaygroundParams(prev);
        return writePlaygroundParams(prev, { open: true, dock: current.dock, requestSlug });
      });
    },
    [setParams]
  );

  // Open a specific example: writes pgReq + pgEx together so a reload / share
  // restores the same example (they must move as one, see writePlaygroundParams).
  const setRequestExample = useCallback(
    (requestSlug?: string | null, exampleSlug?: string | null) => {
      setParams((prev) => {
        const current = readPlaygroundParams(prev);
        return writePlaygroundParams(prev, { open: true, dock: current.dock, requestSlug, exampleSlug });
      });
    },
    [setParams]
  );

  return { ...state, openPlayground, closePlayground, setDock, setRequestSlug, setRequestExample };
};
