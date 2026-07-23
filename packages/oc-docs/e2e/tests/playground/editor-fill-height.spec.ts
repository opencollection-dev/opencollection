import type { Locator } from '@playwright/test';
import { test, expect } from '../../playwright';

// The Body / Tests / Scripts editors in the request pane opt into `fillHeight`, so they stretch to
// fill the pane and stop ~1rem above its bottom, instead of a short fixed-height box that either
// leaves a large empty area or overflows the pane. We assert the editor's bottom sits just above
// the view's bottom: a fixed-height editor in this dock would overflow (negative gap) or fall well
// short (large gap).
async function expectFillsPane(editor: Locator, view: Locator): Promise<void> {
  await expect(editor).toBeVisible();
  const gapBelow = async (): Promise<number> => {
    const e = await editor.boundingBox();
    const v = await view.boundingBox();
    if (!e || !v) return Number.NaN;
    return Math.round(v.y + v.height - (e.y + e.height));
  };
  // Monaco relays out after the tab becomes active; retry until the gap settles to ~1rem.
  await expect.poll(gapBelow, { message: 'editor should fill to ~1rem above the pane bottom' }).toBeLessThanOrEqual(48);
  expect(await gapBelow()).toBeGreaterThanOrEqual(4);

  const editorBox = await editor.boundingBox();
  expect(editorBox!.height).toBeGreaterThan(40);
}

test.describe('Playground request editors fill height', () => {
  // A wide viewport keeps the request-pane tabs on one row (no responsive "⋯" overflow),
  // so selecting Body/Tests/Scripts is a direct click rather than a flaky dropdown step.
  test.use({ viewport: { width: 1600, height: 900 } });

  test.beforeEach(async ({ playground }) => {
    await playground.open('bottom');
    await playground.openRequest('echo json');
  });

  test('body editor fills the request pane', async ({ playground }) => {
    await playground.selectTab('body');
    await expectFillsPane(playground.bodyEditor.root, playground.view);
  });

  test('tests editor fills the request pane', async ({ playground }) => {
    await playground.selectTab('tests');
    await expectFillsPane(playground.testsEditor.root, playground.view);
  });

  test('pre-request script editor fills the request pane', async ({ playground }) => {
    await playground.selectTab('scripts');
    await expectFillsPane(playground.preRequestScriptEditor.root, playground.view);
  });
});
