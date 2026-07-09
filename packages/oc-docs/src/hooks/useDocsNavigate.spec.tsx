import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDocsNavigate } from './useDocsNavigate';

/**
 * Strategy: intercept useNavigate so its returned function has no activeRef guard
 * (the guard is a React Router internal that prevents navigate from firing outside
 * a mounted component lifecycle -- it is an implementation detail, not part of the
 * hook's contract). We mock useNavigate to return a plain vi.fn(), then:
 *
 *   1. Render the hook inside a real MemoryRouter so useLocation() reads the
 *      actual initial URL (the hook reads search from useLocation).
 *   2. Invoke the function the hook returned.
 *   3. Assert the spy was called with { pathname, search } -- verifying the hook
 *      built the right navigation target from its inputs.
 *
 * A broken hook (e.g. navigate(pathname) dropping search) would call the spy
 * with a string instead of { pathname, search }, failing both assertions.
 */

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
  mockNavigate.mockClear();
});

/**
 * Renders useDocsNavigate inside a MemoryRouter at the given URL, then calls
 * the hook's returned function with slug. Returns the args the navigate spy
 * received.
 */
function invokeHook(initialUrl: string, slug: string): unknown {
  let hookFn: ((s: string) => void) | null = null;

  const Inner: React.FC = () => {
    hookFn = useDocsNavigate();
    return null;
  };

  renderToStaticMarkup(
    <MemoryRouter initialEntries={[initialUrl]}>
      <Inner />
    </MemoryRouter>
  );

  if (hookFn === null) throw new Error('hook did not render');

  // Call the function the hook returned. This exercises the hook's logic.
  (hookFn as (s: string) => void)(slug);

  // Return the first argument passed to the navigate spy by the hook.
  return mockNavigate.mock.calls[0]?.[0];
}

describe('useDocsNavigate', () => {
  it('navigates to the slug while preserving the search string', () => {
    const arg = invokeHook('/old?pg=1&dock=inline&pgReq=get-users', 'billing/customers');
    expect(arg).toEqual({ pathname: '/billing/customers', search: '?pg=1&dock=inline&pgReq=get-users' });
  });

  it('falls back to / when slug is empty', () => {
    const arg = invokeHook('/some-page?pg=1', '');
    expect(arg).toEqual({ pathname: '/', search: '?pg=1' });
  });
});
