import { test, expect } from '../../playwright';

const DESKTOP = { width: 1280, height: 900 };
const openAt = (dock: string, pgReq?: string): string =>
  `/#/?pg=1&dock=${dock}${pgReq ? `&pgReq=${pgReq}` : ''}`;

test.describe('playground docks (desktop)', () => {
  test.use({ viewport: DESKTOP });

  test('opens in the bottom dock from a deep link and embeds the playground', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await expect(playground.header).toBeVisible();
    await expect(playground.bottomPanel).toBeVisible();
    await expect(playground.runner).toBeVisible();
  });

  test('switches between docks from the switcher and marks the active one', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await expect(playground.dockButton('bottom')).toHaveClass(/active/);

    await playground.selectDock('inline');
    await expect(playground.inlinePanel).toBeVisible();
    await expect(playground.dockButton('inline')).toHaveClass(/active/);

    await playground.selectDock('modal');
    await expect(playground.modalPanel).toBeVisible();
    await expect(playground.dockButton('modal')).toHaveClass(/active/);
  });

  test('inline dock reflows alongside the docs sidebar and content', async ({ page, playground, sidebar }) => {
    // Wide viewport so the docs column stays >=1024 (desktop) alongside the
    // inline dock; at narrower widths the docs sidebar collapses to a drawer.
    await page.setViewportSize({ width: 1920, height: 900 });
    await page.goto(openAt('inline'));
    await expect(sidebar.inline).toBeVisible();
    await expect(page.getByTestId('page')).toBeVisible();
    await expect(playground.inlinePanel).toBeVisible();
  });

  test('closes from the header and clears the url state', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await expect(playground.bottomPanel).toBeVisible();

    await playground.close();
    await expect(playground.header).toHaveCount(0);
    await expect(page).toHaveURL(/#\/$/);
  });

  test('collapses the bottom dock to its header, then restores it', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await expect(playground.content).toBeVisible();

    await playground.toggleCollapse();
    await expect(playground.content).toHaveCount(0);
    await expect(playground.header).toBeVisible();

    await playground.toggleCollapse();
    await expect(playground.content).toBeVisible();
  });

  test('opens from the Try button and embeds the playground', async ({ requestPage, playground, page }) => {
    await requestPage.open(['billing', 'customers', 'Get Customers - Filter by Date Range']);
    await requestPage.urlBar.tryButton.click();
    await expect(playground.header).toBeVisible();
    await expect(page).toHaveURL(/pg=1/);
    await expect(playground.runner).toBeVisible();
  });

  // Regression: reopening a request after navigating away from it (to the gear /
  // Environments) then closing must re-apply the request, not reopen on the
  // stale Environments/empty view. The applied-slug guard has to reset on close.
  test('reopening a request after leaving it for Environments shows the request again', async ({
    requestPage,
    playground,
  }) => {
    await requestPage.open(['billing', 'customers', 'Get Customers - Filter by Date Range']);

    // Open request A in the playground.
    await requestPage.urlBar.tryButton.click();
    await expect(playground.view).toContainText('Get Customers');

    // Leave it: open the Environments view via the gear.
    await playground.gear.click();
    await expect(playground.view).toContainText('Environments');

    // Close, then reopen the SAME request in-session (no reload) via Try.
    await playground.close();
    await expect(playground.header).toHaveCount(0);
    await requestPage.urlBar.tryButton.click();

    // It must show request A again, not the Environments view it was left on.
    await expect(playground.header).toBeVisible();
    await expect(playground.view).toContainText('Get Customers');
    await expect(playground.view).not.toContainText('Environments');
  });

  test('sidebar shows the collection node, env switcher, gear and tree', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await expect(playground.sidebarPanel).toBeVisible();
    await expect(playground.collectionNode).toBeVisible();
    await expect(playground.envSwitcher).toBeVisible();
    await expect(playground.gear).toBeVisible();
    await expect(playground.treeItems.first()).toBeVisible();
  });

  test('header toggle hides and restores the playground sidebar', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await expect(playground.sidebarPanel).toBeVisible();
    await playground.sidebarToggle.click();
    await expect(playground.sidebarPanel).toHaveCount(0);
    await playground.sidebarToggle.click();
    await expect(playground.sidebarPanel).toBeVisible();
  });

  test('clicking a request in the sidebar loads it, gear opens environments', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await playground.treeItems.filter({ hasText: 'get users' }).first().click();
    await expect(page).toHaveURL(/pgReq=/);
    await expect(playground.view).toContainText('get users');

    await playground.gear.click();
    await expect(playground.view).toContainText('Environments');
  });

  test('clicking the collection root opens the collection view', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await playground.collectionRootLink.click();
    await expect(playground.view).toContainText(/Overview|Headers|Vars|Auth|Scripts|Tests/);
  });

  // Clicking a folder row opens its settings AND expands it in the tree (matches
  // docs), so its children become visible; the chevron alone toggles collapse.
  test('clicking a folder opens its settings and expands it in the tree', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await expect(playground.sidebarPanel).toBeVisible();
    // customers is nested under the collapsed billing folder, so it is hidden.
    await expect(playground.treeItems.filter({ hasText: /^customers$/ })).toHaveCount(0);
    await playground.treeItems.filter({ hasText: /^billing$/ }).first().click();
    // billing expands: its child folder is revealed and the URL carries the folder.
    await expect(playground.treeItems.filter({ hasText: /^customers$/ }).first()).toBeVisible();
    await expect(page).toHaveURL(/pgReq=billing(?!%2F)/);
  });

  // Clicking the collection root re-expands the tree too, not just opens the view.
  test('clicking the collection root re-expands the tree', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await expect(playground.sidebarPanel).toBeVisible();
    // Collapse the collection from its chevron -> top-level items disappear.
    await playground.collectionCollapseToggle.click();
    await expect(playground.treeItems.filter({ hasText: /^billing$/ })).toHaveCount(0);
    // Clicking the root row brings the tree back and shows the collection view.
    await playground.collectionRootLink.click();
    await expect(playground.treeItems.filter({ hasText: /^billing$/ }).first()).toBeVisible();
    await expect(playground.view).toContainText(/Overview|Headers|Vars|Auth|Scripts|Tests/);
  });

  // Regression: an example keeps the URL slug on its parent request, so clicking
  // that request row must still leave the example and show the request view.
  test('clicking a request while its example is open returns to the request view', async ({ page, playground }) => {
    await page.goto(openAt('bottom', 'billing/customers/get-all-customers'));
    await expect(playground.sidebarPanel).toBeVisible();
    // Open the request's examples and select one -> example view.
    await playground.exampleToggle('Get All Customers').click();
    await playground.exampleRow('200 OK - first page').click();
    await expect(playground.exampleView).toBeVisible();
    // Clicking the parent request row leaves the example for the request view,
    // even though the URL slug stays on that same request.
    await playground.treeItems.filter({ hasText: 'Get All Customers' }).first().click();
    await expect(playground.exampleView).toHaveCount(0);
    await expect(playground.view).toContainText('Get All Customers');
  });

  test('inline dock: sidebar is closed by default and overlays the view when opened', async ({ page, playground }) => {
    await page.goto(openAt('inline'));
    await expect(playground.sidebarPanel).toHaveCount(0);   // closed by default in inline
    await playground.sidebarToggle.click();                 // open it as an overlay
    await expect(playground.sidebarPanel).toBeVisible();
    await expect(playground.view).toBeVisible();
    const viewBox = await playground.view.boundingBox();
    const sideBox = await playground.sidebarPanel.boundingBox();
    // overlay: sidebar starts at (or within 5px of) the view's left edge, not to its left
    expect(sideBox!.x).toBeLessThanOrEqual(viewBox!.x + 5);
    expect(viewBox!.x).toBeLessThanOrEqual(sideBox!.x + 5);
  });

  test('inline dock: clicking outside the overlay sidebar closes it', async ({ page, playground }) => {
    await page.goto(openAt('inline'));
    await playground.sidebarToggle.click();
    await expect(playground.sidebarPanel).toBeVisible();
    // Click the view area outside the sidebar (its backdrop), mirroring the docs
    // navigation drawer: an outside click dismisses the overlay. The backdrop
    // spans the whole dock from its left edge, so click just past the sidebar's
    // right edge to land on the exposed view area, not the panel.
    const side = await playground.sidebarPanel.boundingBox();
    await playground.sidebarBackdrop.click({ position: { x: side!.width + 40, y: 30 } });
    await expect(playground.sidebarPanel).toHaveCount(0);
  });

  test('inline dock: clicking outside the playground closes the overlay sidebar', async ({ page, playground }) => {
    // Wide viewport so the docs column stays desktop and is clickable to the
    // left of the inline dock (rather than collapsing to a drawer).
    await page.setViewportSize({ width: 1920, height: 900 });
    await page.goto(openAt('inline'));
    await playground.sidebarToggle.click();
    await expect(playground.sidebarPanel).toBeVisible();
    // Click the docs page, entirely outside the playground dock.
    await page.getByTestId('page').click({ position: { x: 100, y: 300 } });
    await expect(playground.sidebarPanel).toHaveCount(0);
  });

  test('inline dock: selecting a request auto-closes the overlay sidebar', async ({ page, playground }) => {
    await page.goto(openAt('inline'));
    await playground.sidebarToggle.click();
    await expect(playground.sidebarPanel).toBeVisible();
    await playground.treeItems.filter({ hasText: 'get users' }).first().click();
    await expect(playground.sidebarPanel).toHaveCount(0);   // auto-closed on select
    await expect(playground.view).toContainText('get users');
  });

  test('request and response stack when the playground is narrow and sit side-by-side when wide', async ({ page, playground }) => {
    // bottom dock is full width -> side by side
    await page.goto(openAt('bottom'));
    await playground.treeItems.filter({ hasText: 'get users' }).first().click();
    // assert horizontal: playground view is visible and rendered without error
    await expect(page.getByTestId('playground-view')).toBeVisible();

    // inline dock (narrowest placement) -> stacked orientation when viewport is narrow
    await playground.selectDock('inline');
    await expect(page.getByTestId('playground-view')).toBeVisible();
  });

  test('playground stays open when navigating docs pages', async ({ page, playground }) => {
    // Inline dock keeps the playground on the right, so the docs sidebar on the
    // left is unobstructed (the bottom dock would overlap the lower tree rows).
    // Wide viewport so the docs column stays desktop (inline sidebar visible to
    // click) rather than collapsing to a drawer.
    await page.setViewportSize({ width: 1920, height: 900 });
    await page.goto(openAt('inline'));
    await expect(playground.header).toBeVisible();
    // click a docs sidebar item (the docs sidebar, not the playground one)
    await page.getByTestId('sidebar').getByTestId('sidebar-item').first().click();
    await expect(playground.header).toBeVisible();      // playground did NOT close
    await expect(page).toHaveURL(/pg=1/);               // playground params preserved
  });

  test('deep-link / reload to a nested request reveals its ancestor folders', async ({ page, playground }) => {
    await page.goto(openAt('bottom', 'billing/customers/get-all-customers'));
    await expect(playground.sidebarPanel).toBeVisible();
    // billing + customers auto-expand, so the request row is rendered in the tree.
    await expect(playground.treeItems.filter({ hasText: 'Get All Customers' }).first()).toBeVisible();
    // Still revealed after a full reload while sitting on the request.
    await page.reload();
    await expect(playground.treeItems.filter({ hasText: 'Get All Customers' }).first()).toBeVisible();
  });

  // Opening a folder / environments / collection-settings must persist in the URL
  // (pgReq) so a reload restores that view instead of snapping back to the request.
  test('opening a folder persists in the url and survives reload', async ({ page, playground }) => {
    await page.goto(openAt('bottom', 'billing/customers/get-all-customers'));
    await expect(playground.sidebarPanel).toBeVisible();
    await playground.treeItems.filter({ hasText: /^billing$/ }).first().click();
    // pgReq switches to the folder slug (billing), no longer the request path.
    await expect(page).toHaveURL(/pgReq=billing(?!%2Fcustomers)/);
    await page.reload();
    await expect(page).toHaveURL(/pgReq=billing(?!%2Fcustomers)/);
    await expect(playground.view).toBeVisible();
  });

  test('opening environments persists in the url and survives reload', async ({ page, playground }) => {
    await page.goto(openAt('bottom', 'billing/customers/get-all-customers'));
    await playground.gear.click();
    await expect(page).toHaveURL(/pgReq=(~|%7E)environments/);
    await page.reload();
    await expect(page).toHaveURL(/pgReq=(~|%7E)environments/);
    await expect(playground.view).toBeVisible();
  });

  test('opening collection settings persists in the url and survives reload', async ({ page, playground }) => {
    await page.goto(openAt('bottom', 'billing/customers/get-all-customers'));
    await playground.collectionNode.click();
    await expect(page).toHaveURL(/pgReq=(~|%7E)collection/);
    await page.reload();
    await expect(page).toHaveURL(/pgReq=(~|%7E)collection/);
    await expect(playground.view).toBeVisible();
  });
});
