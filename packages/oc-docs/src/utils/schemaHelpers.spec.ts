import { describe, it, expect } from 'vitest';
import type { Item as OpenCollectionItem } from '@opencollection/types/collection/item';
import { getItemDescription, getRequestBadgeLabel, normalizeHttpMethod } from './schemaHelpers';

const item = (data: Record<string, unknown>): OpenCollectionItem => data as unknown as OpenCollectionItem;

describe('getItemDescription', () => {
  it('reads a plain string description from the info block', () => {
    expect(getItemDescription({ info: { description: 'Short summary.' } } as any)).toBe('Short summary.');
  });

  it('reads the content of a structured description', () => {
    expect(
      getItemDescription({ info: { description: { content: 'Rich summary.', type: 'text/markdown' } } } as any)
    ).toBe('Rich summary.');
  });

  it('returns an empty string when there is no description', () => {
    expect(getItemDescription({ info: {} } as any)).toBe('');
    expect(getItemDescription({} as any)).toBe('');
    expect(getItemDescription(null)).toBe('');
    expect(getItemDescription(undefined)).toBe('');
  });
});

describe('getRequestBadgeLabel', () => {
  it('returns the HTTP method for http requests', () => {
    expect(getRequestBadgeLabel(item({ type: 'http', method: 'POST' }))).toBe('POST');
    expect(getRequestBadgeLabel(item({ type: 'http' }))).toBe('GET');
  });

  it('returns short protocol labels for non-HTTP requests', () => {
    expect(getRequestBadgeLabel(item({ type: 'graphql' }))).toBe('GQL');
    expect(getRequestBadgeLabel(item({ type: 'grpc' }))).toBe('GRPC');
    expect(getRequestBadgeLabel(item({ type: 'websocket' }))).toBe('WS');
  });

  it('returns undefined for items that carry no badge', () => {
    expect(getRequestBadgeLabel(item({ type: 'folder' }))).toBeUndefined();
    expect(getRequestBadgeLabel(item({ type: 'script' }))).toBeUndefined();
    expect(getRequestBadgeLabel(null)).toBeUndefined();
  });
});

describe('normalizeHttpMethod', () => {
  it('trims edge whitespace and uppercases', () => {
    expect(normalizeHttpMethod('  post ')).toBe('POST');
  });

  it('strips internal whitespace so an accidental space is not an invalid token', () => {
    expect(normalizeHttpMethod('PUR GE')).toBe('PURGE');
    expect(normalizeHttpMethod('q u e r y')).toBe('QUERY');
  });

  it('returns an empty string for empty or whitespace-only input', () => {
    expect(normalizeHttpMethod('')).toBe('');
    expect(normalizeHttpMethod('   ')).toBe('');
  });

  it('leaves forbidden-but-valid verbs untouched', () => {
    expect(normalizeHttpMethod('connect')).toBe('CONNECT');
  });
});
