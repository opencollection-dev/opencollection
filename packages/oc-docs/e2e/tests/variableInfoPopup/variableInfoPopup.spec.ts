import { test, expect } from '../../playwright';

const REQUEST = '/?fixture=vars#/customers/variables-demo';

test.describe('Variable hover card', () => {
  test.beforeEach(async ({ page, envSwitcher }) => {
    await page.goto(REQUEST);
    await expect(page.getByTestId('request-page')).toBeVisible();
    await envSwitcher.selectEnvironment('Dev');
  });

  test('resolves an environment variable with its scope badge and value', async ({ variableCard }) => {
    await variableCard.hoverToken('host');
    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.name).toHaveText('host');
    await expect(variableCard.scopeBadge).toHaveText('Environment');
    await expect(variableCard.value).toHaveText('https://api.dev.example.com');
  });

  test('badges collection, folder and request scopes correctly', async ({ variableCard, page }) => {
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

  test('resolves a value that references other variables', async ({ variableCard }) => {
    await variableCard.hoverToken('endpoint');
    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.value).toHaveText('https://api.dev.example.com/v1');
  });

  test('shows the card for a variable used in an example request URL', async ({ variableCard }) => {
    await variableCard.hoverToken('exampleOnly');
    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Collection');
    await expect(variableCard.value).toHaveText('example-value');
  });

  test('pretty-prints an object-typed value', async ({ variableCard }) => {
    await variableCard.hoverToken('profile');
    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.value).toContainText('NYC');
    await expect(variableCard.value).toContainText('zip');
  });

  test('marks process.env and dynamic references read-only, without a value', async ({ variableCard, page }) => {
    await variableCard.hoverToken('process.env.HOME');
    await expect(variableCard.scopeBadge).toHaveText('Process Env');
    await expect(variableCard.note).toHaveText('read-only');

    await page.mouse.move(0, 0);
    await expect(variableCard.card).toHaveCount(0);
    await variableCard.hoverToken('$randomInt');
    await expect(variableCard.scopeBadge).toHaveText('Dynamic');
    await expect(variableCard.note).toContainText('random value');
  });

  test('masks a secret, reveals it on toggle, and copies the real value', async ({ page, variableCard }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await variableCard.pinToken('bearer_token');
    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Environment');

    const masked = (await variableCard.value.textContent()) ?? '';
    expect(masked).not.toContain('super-secret-token');
    expect(masked.length).toBeGreaterThan(0);

    await variableCard.revealToggle.click();
    await expect(variableCard.value).toHaveText('super-secret-token');

    await variableCard.copyButton.click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('super-secret-token');
  });

  test('copies the resolved value from the copy button', async ({ page, variableCard }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await variableCard.pinToken('apiVersion');
    await expect(variableCard.card).toBeVisible();
    await variableCard.copyButton.click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('2024-01');
  });

  test('is read-only — no editor inside the card', async ({ variableCard }) => {
    await variableCard.pinToken('host');
    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.card.locator('textarea, input, .CodeMirror')).toHaveCount(0);
  });

  test('stays open while hovering the card, then closes after the pointer leaves', async ({ page, variableCard }) => {
    await variableCard.hoverToken('host');
    await expect(variableCard.card).toBeVisible();
    await variableCard.card.hover();
    await expect(variableCard.card).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(variableCard.card).toBeHidden();
  });

  test('pins on click; Escape and outside click dismiss it', async ({ page, variableCard }) => {
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

    test('opens on tap', async ({ variableCard }) => {
      await variableCard.token('host').tap();
      await expect(variableCard.card).toBeVisible();
      await expect(variableCard.scopeBadge).toHaveText('Environment');
    });
  });
});

// The card also works on the Overview and Folder pages (the collection/folder
// config sections render header values through VariableText), degrading to the
// scopes those pages can see (no request scope on Overview/Folder).
test.describe('Variable hover card — Overview page', () => {
  test.beforeEach(async ({ page, envSwitcher }) => {
    await page.goto('/?fixture=vars');
    await expect(page.getByTestId('page')).toHaveAttribute('data-page-type', 'overview');
    await envSwitcher.selectEnvironment('Dev');
  });

  test('shows the card for a variable used in a collection header (Collection scope)', async ({ variableCard }) => {
    await variableCard.hoverToken('apiVersion');
    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Collection');
    await expect(variableCard.value).toHaveText('2024-01');
  });

  test('masks a secret referenced in a collection header', async ({ variableCard }) => {
    await variableCard.hoverToken('bearer_token');
    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Environment');
    await expect(variableCard.revealToggle).toBeVisible();
  });
});

test.describe('Variable hover card — Folder page', () => {
  test.beforeEach(async ({ page, envSwitcher }) => {
    await page.goto('/?fixture=vars#/customers');
    await expect(page.getByTestId('page')).toHaveAttribute('data-page-type', 'folder');
    await envSwitcher.selectEnvironment('Dev');
  });

  test('shows the card for a variable used in a folder header (Folder scope)', async ({ variableCard }) => {
    await variableCard.hoverToken('folderScope');
    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.scopeBadge).toHaveText('Folder');
    await expect(variableCard.value).toHaveText('from-folder');
  });
});

test.describe('Variable hover card — Code snippet', () => {
  test.beforeEach(async ({ page, envSwitcher }) => {
    await page.goto(REQUEST);
    await expect(page.getByTestId('request-page')).toBeVisible();
    await envSwitcher.selectEnvironment('Dev');
  });

  test('shows the hover card for a variable inside the generated code', async ({ requestPage, variableCard }) => {
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
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    // Revealed values are copied (host, request-scoped userId, collection-scoped apiVersion) ...
    expect(copied).toContain('https://api.dev.example.com/customers/req-42?v=2024-01');
    // ... but the URL is no longer a template, and secrets stay as tokens.
    expect(copied).not.toContain('{{host}}/customers');
    expect(copied).toContain('{{bearer_token}}');
  });
});
