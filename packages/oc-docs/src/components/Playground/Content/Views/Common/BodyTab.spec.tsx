import React from 'react';
import { describe, it, expect } from 'vitest';
import type { HttpRequest } from '@opencollection/types/requests/http';
import { useRenderToDom } from '../../../../../hooks/useRenderToDom';
import { BodyTab } from './BodyTab';
import type { RequestBody } from '../../../../../utils/schemaHelpers';

const noop = () => {};
const item = { http: { method: 'POST', url: 'https://api.example.com' } } as HttpRequest;

const columnLabels = (root: ReturnType<typeof useRenderToDom>) =>
  root.querySelectorAll('thead th').map((th) => th.text.trim());

describe('BodyTab — form body descriptions', () => {
  it('shows a Description column with authored form-urlencoded field descriptions', () => {
    const body = {
      type: 'form-urlencoded',
      data: [{ name: 'grant_type', value: 'client_credentials', description: 'The OAuth grant type' }]
    } as RequestBody;
    const root = useRenderToDom(<BodyTab body={body} item={item} onItemChange={noop} />);
    expect(columnLabels(root)).toContain('Description');
    expect(root.text).toContain('The OAuth grant type');
  });

  it('shows a Description column with authored multipart text-field descriptions', () => {
    const body = {
      type: 'multipart-form',
      data: [{ name: 'meta', value: '{}', type: 'text', description: 'JSON metadata part' }]
    } as RequestBody;
    const root = useRenderToDom(<BodyTab body={body} item={item} onItemChange={noop} />);
    expect(columnLabels(root)).toContain('Description');
    expect(root.text).toContain('JSON metadata part');
  });
});
