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
