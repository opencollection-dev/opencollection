import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { RequestUrlBar } from './RequestUrlBar';

describe('RequestUrlBar', () => {
  it('renders the method, url and a Try button', () => {
    const html = renderToStaticMarkup(<RequestUrlBar method="post" url="{{baseUrl}}/api/v1/auth/login" onTry={() => {}} />);
    expect(html).toContain('POST');
    expect(html).toContain('/api/v1/auth/login');
    expect(html).toContain('Try</button>');
  });

  it('hides the Try button when no handler is given', () => {
    const html = renderToStaticMarkup(<RequestUrlBar method="get" url="/x" />);
    expect(html).not.toContain('Try</button>');
  });
});
