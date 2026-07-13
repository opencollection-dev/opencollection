import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { query } from '../../test-utils/dom';
import HighlightedInput from './HighlightedInput';

const noop = () => {};

describe('HighlightedInput', () => {
  it('paints an undefined {{var}} token with the invalid class', () => {
    const root = useRenderToDom(
      <HighlightedInput value="{{randomUUID}}" onValueChange={noop} isFound={() => false} names={[]} />
    );
    expect(query(root, '.variable-invalid').text.trim()).toBe('{{randomUUID}}');
  });

  it('paints a defined {{var}} token with the valid class', () => {
    const root = useRenderToDom(
      <HighlightedInput
        value="{{baseUrl}}"
        onValueChange={noop}
        isFound={(name) => name === 'baseUrl'}
        names={['baseUrl']}
      />
    );
    expect(query(root, '.variable-valid').text.trim()).toBe('{{baseUrl}}');
  });

  it('keeps the raw value on the underlying editable input', () => {
    const root = useRenderToDom(
      <HighlightedInput value="Bearer {{token}}" onValueChange={noop} isFound={() => false} names={[]} />
    );
    expect(query(root, 'input.text-input').getAttribute('value')).toBe('Bearer {{token}}');
  });
});
