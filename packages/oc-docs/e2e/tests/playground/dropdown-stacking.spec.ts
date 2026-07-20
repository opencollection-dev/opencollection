import { test, expect } from '../../playwright';
import { EnvSwitcherComponent } from '../../components/layout/env-switcher.component';
import type { Locator } from '@playwright/test';

/**
 * Regression: the environment selector dropdown must stack above the playground
 * docks in every dock mode. Its menu is portaled to <body> with --z-popover so
 * it clears the docks (all at or below --z-modal). We assert not just visibility
 * but that the option is the topmost element at its own centre — a menu hidden
 * behind a dock is "visible" to the DOM but not the hit-test.
 */

const DESKTOP = { width: 1280, height: 900 };

const isTopmost = async (option: Locator): Promise<boolean> => {
  const box = await option.boundingBox();
  if (!box) return false;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  return option.page().evaluate(
    ({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      return !!el?.closest('[role="menu"]');
    },
    { x, y }
  );
};

test.describe('env selector dropdown stacks above the docks', () => {
  test.use({ viewport: DESKTOP });

  for (const dock of ['inline', 'bottom'] as const) {
    test(`top-nav env dropdown clears the ${dock} dock`, async ({ page, playground }) => {
      await playground.open(dock);
      await expect(playground.panel(dock)).toBeVisible();

      const envSwitcher = new EnvSwitcherComponent(page);
      await envSwitcher.open();

      await expect(envSwitcher.menu).toBeVisible();
      await expect(envSwitcher.option('Prod')).toBeVisible();
      expect(await isTopmost(envSwitcher.option('Prod'))).toBe(true);
    });
  }

  test('playground env dropdown clears the modal dock', async ({ page, playground }) => {
    await playground.open('modal');
    await expect(playground.modalPanel).toBeVisible();

    // The playground env switcher lives in the playground sidebar, so it must be
    // on screen before we can open it.
    await expect(playground.sidebarPanel).toBeVisible();

    const envSwitcher = new EnvSwitcherComponent(page, 'playground-env-switcher');
    await envSwitcher.open();

    await expect(envSwitcher.menu).toBeVisible();
    await expect(envSwitcher.option('Prod')).toBeVisible();
    expect(await isTopmost(envSwitcher.option('Prod'))).toBe(true);
  });
});
