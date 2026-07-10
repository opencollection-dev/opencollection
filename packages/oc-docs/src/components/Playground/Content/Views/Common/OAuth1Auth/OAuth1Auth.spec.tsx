import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import OAuth1Auth from '.';

const noop = () => {};

describe('OAuth1Auth', () => {
  it('renders the core HMAC-SHA1 fields and hides the Private Key field', () => {
    const root = useRenderToDom(
      <OAuth1Auth auth={{ type: 'oauth1', consumerKey: 'ck-123', signatureMethod: 'HMAC-SHA1' }} onChange={noop} />
    );
    const labels = root.querySelectorAll('label').map((label) => label.text.trim());

    expect(labels).toContain('Consumer Key');
    expect(labels).toContain('Token Secret');
    expect(labels).toContain('Add to');
    expect(labels).not.toContain('Private Key');
    expect(root.querySelector('input')?.getAttribute('value')).toBe('ck-123');
  });

  it('shows the Private Key field for RSA signatures', () => {
    const root = useRenderToDom(<OAuth1Auth auth={{ type: 'oauth1', signatureMethod: 'RSA-SHA256' }} onChange={noop} />);
    const labels = root.querySelectorAll('label').map((label) => label.text.trim());

    expect(labels).toContain('Private Key');
  });
});
