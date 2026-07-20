import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import BreadcrumbWrapper from './BreadcrumbWrapper';
import { getByTestId, queryByTestId } from '../../../test-utils/dom';

const collection = { info: { name: 'My collection' } } as unknown as OpenCollection;

const ancestry = [
  { uuid: 'folder-1', info: { name: 'Auth', type: 'folder' } }
] as unknown as Item[];

describe('BreadcrumbWrapper', () => {
  it('renders the passed name as the current breadcrumb', () => {
    const root = parse(
      renderToStaticMarkup(<BreadcrumbWrapper showBreadcrumbs name="Login" collection={collection} />)
    );
    expect(getByTestId(root, 'unsupported-request-breadcrumb-current').text).toContain('Login');
  });

  it('renders the ancestry folders as clickable segments alongside the current name', () => {
    const root = parse(
      renderToStaticMarkup(
        <BreadcrumbWrapper showBreadcrumbs name="Login" collection={collection} ancestry={ancestry} />
      )
    );
    const segments = root.querySelectorAll('[data-testid="unsupported-request-breadcrumb-segment"]');
    const segmentText = segments.map((segment) => segment.text).join(' ');
    expect(segmentText).toContain('My collection');
    expect(segmentText).toContain('Auth');
    expect(getByTestId(root, 'unsupported-request-breadcrumb-current').text).toContain('Login');
  });

  it('renders nothing when showBreadcrumbs is false', () => {
    const root = parse(
      renderToStaticMarkup(<BreadcrumbWrapper showBreadcrumbs={false} name="Login" collection={collection} />)
    );
    expect(queryByTestId(root, 'unsupported-request-breadcrumb')).toBeNull();
  });
});
