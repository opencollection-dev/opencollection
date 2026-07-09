import React from 'react';

interface PlaygroundBoundaryProps {
  children: React.ReactNode;
}

interface PlaygroundBoundaryState {
  failed: boolean;
}

/**
 * Contains failures from the embedded request/response experience (e.g. the
 * runtime failing to load) so a crash there never white-screens the docs.
 */
class PlaygroundBoundary extends React.Component<PlaygroundBoundaryProps, PlaygroundBoundaryState> {
  state: PlaygroundBoundaryState = { failed: false };

  static getDerivedStateFromError(): PlaygroundBoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
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
    }
    return this.props.children;
  }
}

export default PlaygroundBoundary;
