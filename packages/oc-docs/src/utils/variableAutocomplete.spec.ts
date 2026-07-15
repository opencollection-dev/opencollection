import { describe, it, expect } from 'vitest';
import {
  getVariableContext,
  getWordContext,
  buildVariableSuggestions,
  buildAnywordSuggestions
} from './variableAutocomplete';

describe('getVariableContext', () => {
  it('detects an open {{ with the typed word and its start index', () => {
    expect(getVariableContext('Bearer {{tok')).toEqual({ word: 'tok', start: 9 });
  });

  it('captures an empty word right after {{', () => {
    expect(getVariableContext('{{')).toEqual({ word: '', start: 2 });
  });

  it('returns null once the token is closed', () => {
    expect(getVariableContext('{{token}}')).toBeNull();
  });

  it('returns null when there is no open {{', () => {
    expect(getVariableContext('plain text')).toBeNull();
  });
});

describe('buildVariableSuggestions', () => {
  const names = ['baseUrl', 'apiToken', 'authHeader'];

  it('returns nothing for an empty word (Bruno shows no hints until >=1 char)', () => {
    expect(buildVariableSuggestions('', names)).toEqual([]);
  });

  it('matches case-insensitively by substring', () => {
    expect(buildVariableSuggestions('token', names)).toEqual(['apiToken']);
  });

  it('orders prefix matches before substring-only matches, each alphabetical', () => {
    expect(buildVariableSuggestions('qz', ['bqz', 'qzebra', 'aqz'])).toEqual(['qzebra', 'aqz', 'bqz']);
  });

  it('suggests $-prefixed mock/dynamic functions', () => {
    expect(buildVariableSuggestions('$randomUUI', names)).toContain('$randomUUID');
  });

  it('caps the result list', () => {
    const many = Array.from({ length: 100 }, (_, i) => `varName${i}`);
    expect(buildVariableSuggestions('varname', many, 50)).toHaveLength(50);
  });
});

describe('getWordContext', () => {
  it('extracts the word before the caret, including hyphens', () => {
    expect(getWordContext('Content-Ty')).toEqual({ word: 'Content-Ty', start: 0 });
  });

  it('starts the word after a non-word separator', () => {
    expect(getWordContext('Accept: appl')).toEqual({ word: 'appl', start: 8 });
  });

  it('returns an empty word when the char before the caret is a separator', () => {
    expect(getWordContext('foo ')).toEqual({ word: '', start: 4 });
  });
});

describe('buildAnywordSuggestions', () => {
  const hints = ['Content-Type', 'Content-Length', 'Accept', 'Authorization'];

  it('returns nothing for an empty word', () => {
    expect(buildAnywordSuggestions('', hints)).toEqual([]);
  });

  it('matches header names case-insensitively, prefix matches first', () => {
    expect(buildAnywordSuggestions('content', hints)).toEqual(['Content-Length', 'Content-Type']);
  });

  it('matches a substring anywhere in the header name', () => {
    expect(buildAnywordSuggestions('auth', hints)).toEqual(['Authorization']);
  });
});
