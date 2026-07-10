import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { usePlaygroundUrlState } from './usePlaygroundUrlState';

const Probe: React.FC = () => {
  const { open, dock, requestSlug } = usePlaygroundUrlState();
  return <span data-open={String(open)} data-dock={dock} data-req={requestSlug ?? ''} />;
};

const renderAt = (url: string): string =>
  renderToStaticMarkup(
    <MemoryRouter initialEntries={[url]}>
      <Probe />
    </MemoryRouter>
  );

describe('usePlaygroundUrlState (read path)', () => {
  it('reports closed with the default dock when no params are present', () => {
    const html = renderAt('/');
    expect(html).toContain('data-open="false"');
    expect(html).toContain('data-dock="bottom"');
    expect(html).toContain('data-req=""');
  });

  it('reads open, dock and request slug from the query', () => {
    const html = renderAt('/?pg=1&dock=inline&pgReq=users/get');
    expect(html).toContain('data-open="true"');
    expect(html).toContain('data-dock="inline"');
    expect(html).toContain('data-req="users/get"');
  });

  it('reflects the modal dock', () => {
    expect(renderAt('/?pg=1&dock=modal')).toContain('data-dock="modal"');
  });
});
