import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Contains render/commit errors from a subtree so one failing view can't blank the
 * whole app. Give it a `key` tied to the route so navigating away mounts a fresh
 * boundary instead of stranding the user on the fallback. Pass `fallback` to replace
 * the default retry UI with a context-specific message.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('ErrorBoundary caught a render error:', error);
  }

  private reset = (): void => this.setState({ hasError: false });

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <StyledWrapper role="alert">
        <p className="error-title">Something went wrong displaying this view.</p>
        <button type="button" className="error-retry" onClick={this.reset}>
          Try again
        </button>
      </StyledWrapper>
    );
  }
}

export default ErrorBoundary;
