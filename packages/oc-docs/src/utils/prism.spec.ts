import { describe, it, expect } from 'vitest';
import Prism from './prism';

describe('prism javascript grammar customizations', () => {
  it('tags a declared name, a bare reference, and a property access distinctly', () => {
    const html = Prism.highlight('const name = user.value;', Prism.languages.javascript, 'javascript');

    expect(html).toContain('<span class="token var-name">name</span>');
    expect(html).toContain('<span class="token variable">user</span>');
    expect(html).toContain('<span class="token property">value</span>');
  });

  it('still tags a method call as a function, not a property', () => {
    const html = Prism.highlight('bru.getEnvName();', Prism.languages.javascript, 'javascript');

    expect(html).toContain('<span class="token variable">bru</span>');
    expect(html).toContain('<span class="token function">getEnvName</span>');
    expect(html).not.toContain('class="token property">getEnvName<');
  });

  it('tags bare call targets like a variable, matching Bruno\'s CodeMirror colors', () => {
    const html = Prism.highlight('test("does a thing", function () { expect(1).to.equal(1); });', Prism.languages.javascript, 'javascript');

    expect(html).toContain('<span class="token variable">test</span>');
    expect(html).toContain('<span class="token variable">expect</span>');
    expect(html).not.toContain('class="token function">test<');
    expect(html).not.toContain('class="token function">expect<');
  });

  it('tags every name in a destructured or multi-declarator declaration', () => {
    const destructured = Prism.highlight('const { a, b } = obj;', Prism.languages.javascript, 'javascript');
    expect(destructured).toContain('<span class="token var-name">a</span>');
    expect(destructured).toContain('<span class="token var-name">b</span>');

    const arrayDestructured = Prism.highlight('const [x, y] = arr;', Prism.languages.javascript, 'javascript');
    expect(arrayDestructured).toContain('<span class="token var-name">x</span>');
    expect(arrayDestructured).toContain('<span class="token var-name">y</span>');

    const multiDeclarator = Prism.highlight('let m, n;', Prism.languages.javascript, 'javascript');
    expect(multiDeclarator).toContain('<span class="token var-name">m</span>');
    expect(multiDeclarator).toContain('<span class="token var-name">n</span>');
  });
});