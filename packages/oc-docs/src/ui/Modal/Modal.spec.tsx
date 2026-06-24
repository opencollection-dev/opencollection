import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

vi.mock('../Portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => children
}));

describe('Modal', () => {
  it('renders nothing while closed', () => {
    const html = renderToStaticMarkup(
      <Modal open={false} onClose={() => {}}>
        <p>body</p>
      </Modal>
    );
    expect(html).toBe('');
  });

  it('renders an accessible dialog with the title, close button and children when open', () => {
    const html = renderToStaticMarkup(
      <Modal open onClose={() => {}} title={<span>Code snippet</span>}>
        <p>snippet body</p>
      </Modal>
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('Code snippet');
    expect(html).toContain('snippet body');
    expect(html).toContain('aria-label="Close"');
  });

  it('omits the title slot when no title is provided but keeps the close button', () => {
    const html = renderToStaticMarkup(
      <Modal open onClose={() => {}} ariaLabel="Plain dialog">
        <p>body</p>
      </Modal>
    );
    expect(html).not.toContain('class="modal-title"');
    expect(html).toContain('aria-label="Plain dialog"');
    expect(html).toContain('aria-label="Close"');
  });
});
