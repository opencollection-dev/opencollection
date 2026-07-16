import { test, expect } from '../../playwright';

const REQUEST = '/?fixture=vars#/customers/variables-demo';

test.describe('Variable hover card', () => {
  test.beforeEach(async ({ requestPage, envSwitcher }) => {
    await requestPage.goto(REQUEST);
    await envSwitcher.selectEnvironment('Dev');
  });

  test('resolves an environment variable with its scope badge and value', async ({ requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.hoverToken('host');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.name).toHaveText('host');
    await expect(variableCard.scopeBadge).toHaveText('Environment');
    await expect(variableCard.value).toHaveText('https://api.dev.example.com');
  });

  test('badges collection, folder and request scopes correctly', async ({ page, requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.hoverToken('apiVersion');
    await expect(variableCard.scopeBadge).toHaveText('Collection');
    await expect(variableCard.value).toHaveText('2024-01');

    await page.mouse.move(0, 0);
    await expect(variableCard.card).toHaveCount(0);

    await variableCard.hoverToken('folderScope');
    await expect(variableCard.scopeBadge).toHaveText('Folder');
    await expect(variableCard.value).toHaveText('from-folder');

    await page.mouse.move(0, 0);
    await expect(variableCard.card).toHaveCount(0);

    await variableCard.hoverToken('userId');
    await expect(variableCard.scopeBadge).toHaveText('Request');
    await expect(variableCard.value).toHaveText('req-42');
  });

  test('resolves a value that references other variables', async ({ requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.hoverToken('endpoint');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.value).toHaveText('https://api.dev.example.com/v1');
  });

  test('shows the card for a variable used in an example request URL', async ({ requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.hoverToken('exampleOnly');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Collection');
    await expect(variableCard.value).toHaveText('example-value');
  });

  test('shows the card for a variable used in the request body', async ({ requestPage }) => {
    const { bodyVariableCard: variableCard } = requestPage;
    await variableCard.hoverToken('host');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Environment');
    await expect(variableCard.value).toHaveText('https://api.dev.example.com');
  });

  test('shows a (Secret) placeholder for a secret referenced in the request body', async ({ requestPage }) => {
    const { bodyVariableCard: variableCard } = requestPage;
    await variableCard.hoverToken('bearer_token');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Environment');
    await expect(variableCard.value).toHaveText('(Secret)');
    await expect(variableCard.copyButton).toHaveCount(0);
  });

  test('shows an (empty) placeholder with no copy for a defined variable that has no value', async ({ requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.hoverToken('emptyValue');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Environment');
    await expect(variableCard.value).toHaveText('(empty)');
    await expect(variableCard.copyButton).toHaveCount(0);
  });

  test('pretty-prints an object-typed value', async ({ requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.hoverToken('profile');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.value).toContainText('NYC');
    await expect(variableCard.value).toContainText('zip');
  });

  test('marks process.env and dynamic references read-only, without a value', async ({ page, requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.hoverToken('process.env.HOME');

    await expect(variableCard.scopeBadge).toHaveText('Process Env');
    await expect(variableCard.note).toHaveText('read-only');

    await page.mouse.move(0, 0);
    await expect(variableCard.card).toHaveCount(0);

    await variableCard.hoverToken('$randomInt');

    await expect(variableCard.scopeBadge).toHaveText('Dynamic');
    await expect(variableCard.note).toContainText('random value');
  });

  test('shows a (Secret) placeholder with no reveal or copy, never exposing the value', async ({ requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.pinToken('bearer_token');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Environment');
    await expect(variableCard.value).toHaveText('(Secret)');
    await expect(variableCard.card).not.toContainText('super-secret-token');
    await expect(variableCard.revealToggle).toHaveCount(0);
    await expect(variableCard.copyButton).toHaveCount(0);
  });

  test('copies the resolved value from the copy button', async ({ page, requestPage }) => {
    const { variableCard } = requestPage;
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await variableCard.pinToken('apiVersion');
    await expect(variableCard.card).toBeVisible();

    await variableCard.copyButton.click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('2024-01');
  });

  test('is read-only — no editor inside the card', async ({ requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.pinToken('host');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.editors).toHaveCount(0);
  });

  test('stays open while hovering the card, then closes after the pointer leaves', async ({ page, requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.hoverToken('host');
    await expect(variableCard.card).toBeVisible();

    await variableCard.card.hover();
    await expect(variableCard.card).toBeVisible();

    await page.mouse.move(0, 0);
    await expect(variableCard.card).toBeHidden();
  });

  test('pins on click; Escape and outside click dismiss it', async ({ page, requestPage }) => {
    const { variableCard } = requestPage;
    await variableCard.pinToken('host');
    await expect(variableCard.card).toBeVisible();

    // Pinned: leaving does not close it.
    await page.mouse.move(0, 0);
    await expect(variableCard.card).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(variableCard.card).toBeHidden();

    await variableCard.pinToken('host');
    await expect(variableCard.card).toBeVisible();

    await page.mouse.click(2, 2);
    await expect(variableCard.card).toBeHidden();
  });

  test.describe('touch', () => {
    test.use({ hasTouch: true });

    test('opens on tap', async ({ requestPage }) => {
      const { variableCard } = requestPage;
      await variableCard.token('host').tap();

      await expect(variableCard.card).toBeVisible();
      await expect(variableCard.scopeBadge).toHaveText('Environment');
    });
  });

  test.describe('narrow (mobile) viewport', () => {
    test.use({ viewport: { width: 280, height: 700 } });

    test('keeps the hover card within a narrow viewport instead of overflowing off-screen', async ({ requestPage }) => {
      const { variableCard } = requestPage;
      await variableCard.hoverToken('endpoint');
      await expect(variableCard.card).toBeVisible();

      const box = await variableCard.card.boundingBox();
      if (!box) throw new Error('hover card has no bounding box');

      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(280);
    });
  });
});

// The card also works on the Overview and Folder pages (the collection/folder
// config sections render header values through VariableText), degrading to the
// scopes those pages can see (no request scope on Overview/Folder).
test.describe('Variable hover card — Overview page', () => {
  test.beforeEach(async ({ overviewPage, envSwitcher }) => {
    await overviewPage.goto('/?fixture=vars');
    await envSwitcher.selectEnvironment('Dev');
  });

  test('shows the card for a variable used in a collection header (Collection scope)', async ({ overviewPage }) => {
    const { variableCard } = overviewPage;
    await variableCard.hoverToken('apiVersion');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Collection');
    await expect(variableCard.value).toHaveText('2024-01');
  });

  test('shows a (Secret) placeholder for a secret referenced in a collection header', async ({ overviewPage }) => {
    const { variableCard } = overviewPage;
    await variableCard.hoverToken('bearer_token');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Environment');
    await expect(variableCard.value).toHaveText('(Secret)');
  });
});

test.describe('Variable hover card — Folder page', () => {
  test.beforeEach(async ({ folderPage, envSwitcher }) => {
    await folderPage.goto('/?fixture=vars#/customers');
    await envSwitcher.selectEnvironment('Dev');
  });

  test('shows the card for a variable used in a folder header (Folder scope)', async ({ folderPage }) => {
    const { variableCard } = folderPage;
    await variableCard.hoverToken('folderScope');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Folder');
    await expect(variableCard.value).toHaveText('from-folder');
  });
});

test.describe('Variable hover card — Code snippet', () => {
  test.beforeEach(async ({ requestPage, envSwitcher }) => {
    await requestPage.goto(REQUEST);
    await envSwitcher.selectEnvironment('Dev');
  });

  test('shows the hover card for a variable inside the generated code', async ({ requestPage }) => {
    const { variableCard } = requestPage;
    await requestPage.codeSnippet.variableToken('host').hover();

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Environment');
    await expect(variableCard.value).toHaveText('https://api.dev.example.com');
  });

  test('replaces a variable with its resolved value when show variables is on', async ({ requestPage, envSwitcher }) => {
    const host = requestPage.codeSnippet.variableToken('host');
    await expect(host).toHaveText('{{host}}');

    await envSwitcher.toggle();
    await expect(host).toHaveText('https://api.dev.example.com');
  });

  test('never resolves a secret into the code, even when show variables is on', async ({ requestPage, envSwitcher }) => {
    await envSwitcher.toggle();
    await expect(requestPage.codeSnippet.variableToken('bearer_token')).toHaveText('{{bearer_token}}');
  });

  test('copy writes the revealed snippet to the clipboard when show variables is on', async ({ page, requestPage, envSwitcher }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await envSwitcher.toggle();
    await requestPage.codeSnippet.copyButton.click();

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain('https://api.dev.example.com/customers/req-42?v=2024-01');

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).not.toContain('{{host}}/customers');
    expect(copied).toContain('{{bearer_token}}');
  });

  test('toggling show variables while a card is open does not crash the page', async ({ page, requestPage, envSwitcher }) => {
    const { variableCard } = requestPage;
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await requestPage.codeSnippet.variableToken('host').hover();
    await expect(variableCard.card).toBeVisible();

    await envSwitcher.toggle();
    await expect(requestPage.codeSnippet.variableToken('host')).toHaveText('https://api.dev.example.com');
    await expect(variableCard.card).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('hover card renders above the expanded code-snippet modal', async ({ requestPage }) => {
    const { variableCard } = requestPage;
    await requestPage.codeSnippet.openExpandedView();
    await requestPage.codeSnippet.modalVariableToken('host').hover();
    await expect(variableCard.card).toBeVisible();

    const onTop = await variableCard.card.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return el.contains(hit);
    });
    expect(onTop).toBe(true);
  });
});
