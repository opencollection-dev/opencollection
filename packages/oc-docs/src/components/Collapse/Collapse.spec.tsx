import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Collapse } from './Collapse';

const child = <p>panel content</p>;

describe('Collapse', () => {
  it('marks the track open/closed via the is-open class', () => {
    // Assert on the element's class attribute (emotion also emits a `.is-open` CSS
    // rule in a <style> tag, so a plain substring check would always match).
    expect(renderToStaticMarkup(<Collapse open>{child}</Collapse>)).toMatch(/class="oc-collapse is-open/);
    expect(renderToStaticMarkup(<Collapse open={false}>{child}</Collapse>)).not.toMatch(/class="oc-collapse is-open/);
  });

  it('keeps non-lazy children mounted even when closed (clipped, not removed)', () => {
    expect(renderToStaticMarkup(<Collapse open={false}>{child}</Collapse>)).toContain('panel content');
  });

  it('does not mount lazy children until the first open', () => {
    expect(renderToStaticMarkup(<Collapse open={false} lazy>{child}</Collapse>)).not.toContain('panel content');
    expect(renderToStaticMarkup(<Collapse open lazy>{child}</Collapse>)).toContain('panel content');
  });

  it('passes id/role/aria-* through to the outer element (for labelled regions)', () => {
    const html = renderToStaticMarkup(
      <Collapse open id="panel-1" role="region" aria-labelledby="head-1">
        {child}
      </Collapse>
    );
    expect(html).toContain('id="panel-1"');
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-labelledby="head-1"');
  });

  it('applies innerClassName to the clip (so padding/bg live off the animated track)', () => {
    expect(renderToStaticMarkup(<Collapse open innerClassName="oc-test-code">{child}</Collapse>)).toContain('oc-test-code');
  });
});
