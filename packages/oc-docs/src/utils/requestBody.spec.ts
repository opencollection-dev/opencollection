import { describe, it, expect } from 'vitest';
import { getBodyView, selectBodyVariant } from './requestBody';

describe('requestBody', () => {
  it('renders raw json as a code view', () => {
    expect(getBodyView({ type: 'json', data: '{"a":1}' } as any)).toMatchObject({
      render: 'code',
      language: 'json',
      contentTypeLabel: 'application/json',
      code: '{"a":1}'
    });
  });

  it('treats empty raw data as none', () => {
    expect(getBodyView({ type: 'json', data: '   ' } as any).render).toBe('none');
  });

  it('renders form-urlencoded as a table', () => {
    expect(getBodyView({ type: 'form-urlencoded', data: [{ name: 'a', value: '1' }] } as any)).toMatchObject({
      render: 'table',
      variant: 'urlencoded',
      contentTypeLabel: 'application/x-www-form-urlencoded'
    });
  });

  it('renders multipart preserving text/file part types', () => {
    const view = getBodyView({
      type: 'multipart-form',
      data: [{ name: 'file', type: 'file', value: '/x.pdf' }]
    } as any) as any;
    expect(view.render).toBe('table');
    expect(view.variant).toBe('multipart');
    expect(view.rows[0].partType).toBe('file');
  });

  it('selects the chosen body variant and reports variants', () => {
    const selected = selectBodyVariant([
      { title: 'A', body: { type: 'json', data: '1' } },
      { title: 'B', selected: true, body: { type: 'text', data: 'b' } }
    ] as any);
    expect(selected.body).toMatchObject({ type: 'text' });
    expect(selected.variants?.length).toBe(2);
  });

  it('returns none for an undefined body', () => {
    expect(getBodyView(undefined).render).toBe('none');
  });
});
