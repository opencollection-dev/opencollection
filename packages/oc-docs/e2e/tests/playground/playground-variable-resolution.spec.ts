import { test, expect } from '../../playwright';

const OPEN = '/#/?pg=1&dock=bottom';
const REQUEST = 'get users';
const EXAMPLE = 'List Users';

test.describe('Playground - variable resolution in URLs', () => {
  test.beforeEach(async ({ page, playground }) => {
    await page.goto(OPEN);
    await playground.environmentSwitcher.selectEnvironment('Local');
  });

  test('example view URL resolves its variable with a hover card', async ({ playground }) => {
    await playground.exampleToggle(REQUEST).click();
    await playground.exampleRow(EXAMPLE).click();
    await expect(playground.exampleView).toBeVisible();

    const { variableCard } = playground;
    await variableCard.hoverToken('host');

    await expect(variableCard.card).toBeVisible();
    await expect(variableCard.name).toHaveText('host');
    await expect(variableCard.scopeBadge).toHaveText('Environment');
    await expect(variableCard.value).toHaveText('http://localhost:8081');
  });

  test('request URL bar shows the variable and offers variable autocomplete', async ({ playground }) => {
    await playground.openSidebarItem(REQUEST);

    const { queryBar } = playground;
    await expect(queryBar.url).toBeVisible();
    await expect(queryBar.url).toHaveValue(/\{\{host\}\}/);

    await queryBar.url.fill('');
    await queryBar.url.pressSequentially('{{h');

    await expect(queryBar.autocomplete).toBeVisible();
    await expect(queryBar.option('host')).toBeVisible();
  });
});

// Regression for a QA-reported bug: request-scoped and folder-scoped variables
// referenced in the playground were painted red (treated as undefined) even
// though they are defined, because the resolver in scope must include the open
// request and its ancestor folders, not just collection + environment.
test.describe('Playground - request/folder scoped variables resolve', () => {
  test.beforeEach(async ({ page, playground }) => {
    await page.goto('/?fixture=vars#/?pg=1&dock=bottom');
    await playground.environmentSwitcher.selectEnvironment('Dev');
    await playground.openTreeItem(['Customers', 'Variables Demo']);
    await expect(playground.queryBar.url).toBeVisible();
  });

  test('a request-scoped variable in the URL is valid, not undefined', async ({ playground }) => {
    // userId is defined in the request runtime variables (req-42).
    await expect(playground.queryBar.validToken('userId')).toHaveCount(1);
    await expect(playground.queryBar.invalidToken('userId')).toHaveCount(0);
  });

  test('a folder-scoped variable in a header is valid, not undefined', async ({ playground }) => {
    // folderScope is defined on the parent Customers folder (from-folder).
    await playground.selectTab('headers');
    await expect(playground.queryBar.validToken('folderScope')).toHaveCount(1);
    await expect(playground.queryBar.invalidToken('folderScope')).toHaveCount(0);
  });
});
