import { test, expect } from '../../playwright';

const FIXTURE = '/?fixture=folders';
const page$ = (s: string) => `${FIXTURE}#/${s}`;

test.describe('page-based navigation', () => {
  test('deep-link to a nested request renders only that page on fresh load', async ({ page }) => {
    await page.goto(page$('bookings/lifecycle/create-booking'));

    const active = page.getByTestId('page');
    await expect(active).toHaveAttribute('data-page-slug', 'bookings/lifecycle/create-booking');
    await expect(active).toHaveAttribute('data-page-type', 'request');
    await expect(page.getByRole('heading', { name: 'Create Booking', level: 1 })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toHaveCount(0);
  });

  test('breadcrumb reflects the folder hierarchy', async ({ page }) => {
    await page.goto(page$('bookings/lifecycle/create-booking'));
    const bc = page.getByTestId('request-breadcrumb');
    await expect(bc).toContainText('Hotel API');
    await expect(bc).toContainText('Bookings');
    await expect(bc).toContainText('Lifecycle');
    await expect(page.getByRole('heading', { name: 'Create Booking', level: 1 })).toBeVisible();
  });

  test('auto-expands ancestor folders so the deep-linked item is visible in the sidebar', async ({ page }) => {
    await page.goto(page$('bookings/lifecycle/create-booking'));
    await expect(page.getByTestId('sidebar-item').filter({ hasText: 'Cancel Booking' })).toBeVisible();
  });

  test('prev/next walks the hierarchy in sequence order', async ({ page }) => {
    await page.goto(page$('bookings/lifecycle/create-booking'));

    const next = page.getByTestId('next-link');
    await expect(next).toContainText('Confirm Booking');
    await next.click();

    await expect(page.getByTestId('page')).toHaveAttribute(
      'data-page-slug',
      'bookings/lifecycle/confirm-booking'
    );
    await expect(page.getByTestId('prev-link')).toContainText('Create Booking');
    await expect(page.getByTestId('next-link')).toContainText('Cancel Booking');
  });

  test('slug URL is stable across reload', async ({ page }) => {
    await page.goto(page$('authentication/login'));
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/#\/authentication\/login$/);
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
  });

  test('a script item renders as its own script page', async ({ page }) => {
    await page.goto(page$('setup-script'));
    const active = page.getByTestId('page');
    await expect(active).toHaveAttribute('data-page-slug', 'setup-script');
    await expect(active).toHaveAttribute('data-page-type', 'script');
    await expect(page.getByRole('heading', { name: 'Setup Script', level: 1 })).toBeVisible();
  });

  test('a folder whose name has special characters resolves via its encoded slug', async ({ page }) => {
    // "Customers/%$" -> the slash/percent/dollar are percent-encoded, so the
    // folder keeps its own page instead of colliding or collapsing.
    await page.goto(page$('customers%2F%25%24'));
    const active = page.getByTestId('page');
    await expect(active).toHaveAttribute('data-page-slug', 'customers%2F%25%24');
    await expect(active).toHaveAttribute('data-page-type', 'folder');
    await expect(page.getByTestId('folder-title')).toHaveText('Customers/%$');
  });

  test('a request inside a special-character folder deep-links (encoded parent + separator)', async ({ page }) => {
    await page.goto(page$('customers%2F%25%24/list-customers'));
    const active = page.getByTestId('page');
    await expect(active).toHaveAttribute('data-page-slug', 'customers%2F%25%24/list-customers');
    await expect(active).toHaveAttribute('data-page-type', 'request');
    await expect(page.getByTestId('request-title')).toHaveText('List customers');
  });

  test('unknown slug redirects to the overview', async ({ page }) => {
    await page.goto(page$('does/not/exist'));
    await expect(page.getByTestId('page')).toHaveAttribute('data-page-type', 'overview');
  });

  test('clicking a sidebar item navigates to its slug route', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.locator('[data-testid="sidebar-item"][data-slug="authentication"]').click();
    await expect(page.getByTestId('page')).toHaveAttribute('data-page-slug', 'authentication');
    await expect(page).toHaveURL(/#\/authentication$/);
  });
});
