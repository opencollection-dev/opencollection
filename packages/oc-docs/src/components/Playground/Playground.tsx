import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { usePlaygroundUrlState, useIsMobilePhone } from '../../hooks';
import { useAppDispatch } from '../../store/hooks';
import { resetPlaygroundEnvironments } from '@slices/playground';
import InlineDock from './docks/InlineDock/InlineDock';
import BottomSheetDock from './docks/BottomSheetDock/BottomSheetDock';
import ModalDock from './docks/ModalDock/ModalDock';
import MobileDock from './docks/MobileDock/MobileDock';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';

// Lazy so opening the dock shell never eagerly loads the runner/QuickJS runtime.
const PlaygroundBody = lazy(() => import('./PlaygroundBody/PlaygroundBody'));

const playgroundLoadError = (
  <div
    data-testid="playground-load-error"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 16,
      textAlign: 'center',
      color: 'var(--text-secondary)',
      fontSize: 13,
    }}
  >
    The playground failed to load in this environment.
  </div>
);

interface PlaygroundProps {
  /** Bumped on each Try click, so the bottom sheet can re-expand from collapsed. */
  openNonce?: number;
}

const Playground: React.FC<PlaygroundProps> = ({ openNonce }) => {
  const dispatch = useAppDispatch();
  const { open, dock, requestSlug, setDock, closePlayground } = usePlaygroundUrlState();
  const isPhone = useIsMobilePhone();
  // On a phone the playground is always the fullscreen MobileDock, and its
  // sidebar behaves like the inline dock's overlay. Feed that dock downstream so
  // the sidebar-open default and PlaygroundBody's overlay behaviour follow.
  const effectiveDock = isPhone ? 'inline' : dock;

  // discard environment edits when the playground reopens
  useEffect(() => {
    if (open) dispatch(resetPlaygroundEnvironments());
  }, [open, dispatch]);
  // In the inline dock the sidebar is an overlay over the request/response, so it
  // starts closed (content full width) and opens on demand; bottom/modal show it
  // side by side, so it starts open. Reset to the dock's default when the dock changes.
  const [sidebarOpen, setSidebarOpen] = useState(effectiveDock !== 'inline');
  useEffect(() => {
    setSidebarOpen(effectiveDock !== 'inline');
  }, [effectiveDock]);

  // Tracks which request slug has been applied to the view. Lives here (not in
  // PlaygroundBody) because Playground stays mounted across a dock switch but
  // unmounts on close: so a dock switch keeps the guard (no yank back to the
  // request when the user is on the gear/a folder), while close -> reopen resets
  // it so re-opening a request re-applies it.
  const appliedSlugRef = useRef<string | null>(null);

  if (!open) return null;

  const shared = {
    dock: effectiveDock,
    onDockChange: setDock,
    onToggleSidebar: () => setSidebarOpen((value) => !value),
    onClose: closePlayground,
  };

  const body = (
    <ErrorBoundary fallback={playgroundLoadError}>
      <Suspense fallback={<div data-testid="playground-loading" style={{ padding: 16 }} />}>
        <PlaygroundBody
          requestSlug={requestSlug}
          sidebarOpen={sidebarOpen}
          dock={effectiveDock}
          onCloseSidebar={() => setSidebarOpen(false)}
          appliedSlugRef={appliedSlugRef}
        />
      </Suspense>
    </ErrorBoundary>
  );

  if (isPhone) return <MobileDock {...shared}>{body}</MobileDock>;
  if (dock === 'inline') return <InlineDock {...shared}>{body}</InlineDock>;
  if (dock === 'modal') return <ModalDock {...shared}>{body}</ModalDock>;
  return <BottomSheetDock {...shared} openNonce={openNonce}>{body}</BottomSheetDock>;
};

export default Playground;
