import { test, expect } from '../../playwright';
import type { ExecutionContextTab } from '../../components/request/execution-context.component';

const GET_ALL_CUSTOMERS = ['billing', 'customers', 'Get All Customers'];
const TABS: ExecutionContextTab[] = ['variables', 'scripts', 'asserts', 'tests'];

test.describe('Request page — Execution Context', () => {
  test.beforeEach(async ({ requestPage }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);
  });

  test.describe('tabs', () => {
    test('shows a tab for each populated section, each with a count', async ({ requestPage }) => {
      const { executionContext } = requestPage;
      await expect(requestPage.section('Execution Context')).toBeVisible();
      for (const name of TABS) {
        await expect(executionContext.tab(name)).toBeVisible();
        await expect(executionContext.tab(name)).toContainText(/\d/);
      }
    });

    test('opens on the Variables tab and mounts only its panel', async ({ requestPage }) => {
      const { executionContext } = requestPage;
      await expect(executionContext.tab('variables')).toHaveAttribute('aria-selected', 'true');
      await expect(executionContext.variablesPanel).toBeVisible();
      await expect(executionContext.scriptsPanel).toBeHidden();
      await expect(executionContext.assertsPanel).toBeHidden();
      await expect(executionContext.testsPanel).toBeHidden();
    });

    test('selecting a tab reveals only that panel and marks it selected', async ({ requestPage }) => {
      const { executionContext } = requestPage;
      await executionContext.openTab('asserts');

      await expect(executionContext.tab('asserts')).toHaveAttribute('aria-selected', 'true');
      await expect(executionContext.tab('variables')).toHaveAttribute('aria-selected', 'false');
      await expect(executionContext.assertsPanel).toBeVisible();
      await expect(executionContext.variablesPanel).toBeHidden();
    });

    test('is keyboard navigable across tabs with the arrow keys', async ({ requestPage, page }) => {
      const { executionContext } = requestPage;
      await executionContext.tab('variables').focus();

      await page.keyboard.press('ArrowRight');

      await expect(executionContext.tab('scripts')).toHaveAttribute('aria-selected', 'true');
      await expect(executionContext.scriptsPanel).toBeVisible();

      await page.keyboard.press('ArrowLeft');

      await expect(executionContext.tab('variables')).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('panel content', () => {
    test('Variables lists the pre-request and post-response variables', async ({ requestPage }) => {
      const { executionContext } = requestPage;
      await executionContext.openTab('variables');

      await expect(executionContext.variablesPanel.getByText('Pre-Request')).toBeVisible();
      await expect(executionContext.variable('expectedStatus')).toBeVisible();
      await expect(executionContext.variable('customersPath')).toBeVisible();
      await expect(executionContext.variablesPanel.getByText('Post-Response')).toBeVisible();
      await expect(executionContext.variable('firstCustomerId')).toBeVisible();
    });

    test('Scripts lists the collection → folder → request chain around the HTTP call', async ({ requestPage }) => {
      const { executionContext } = requestPage;
      await executionContext.openTab('scripts');

      await expect(executionContext.scriptStep('Collection Pre-Request')).toBeVisible();
      await expect(executionContext.scriptStep('Request Pre-Request')).toBeVisible();
      await expect(executionContext.scriptStep('Collection Post-Response')).toBeVisible();
      await expect(executionContext.scriptsPanel.getByText('HTTP')).toBeVisible();
    });

    test('Scripts navigates to a folder overview from a script source', async ({ requestPage, page }) => {
      const { executionContext } = requestPage;
      await executionContext.openTab('scripts');
      await executionContext.scriptSource('customers').first().click();

      await expect(page.getByTestId('folder-page')).toBeVisible();
      await expect(page.getByTestId('folder-title')).toHaveText('customers');
    });

    test('Scripts navigates to the collection overview from the collection source', async ({ requestPage, page }) => {
      const { executionContext } = requestPage;
      await executionContext.openTab('scripts');
      await executionContext.scriptSource('Bruno Testbench').first().click();

      await expect(page.getByTestId('overview')).toBeVisible();
    });

    test('Asserts lists every assertion', async ({ requestPage }) => {
      const { executionContext } = requestPage;
      await executionContext.openTab('asserts');

      await expect(executionContext.assertion('res.status equals 200')).toBeVisible();
      await expect(executionContext.assertion('res.body is an array')).toBeVisible();
      await expect(executionContext.assertion('res.body.length greater than 0')).toBeVisible();
    });

    test('Tests lists every test case', async ({ requestPage }) => {
      const { executionContext } = requestPage;
      await executionContext.openTab('tests');

      await expect(executionContext.testCase('status is 200 OK')).toBeVisible();
      await expect(executionContext.testCase('response body is a non-empty array')).toBeVisible();
      await expect(executionContext.testCase('every customer has an id and email')).toBeVisible();
      await expect(executionContext.testCase('multi-level execution chain captured')).toBeVisible();
    });
  });

  test.describe('header extras track the active tab', () => {
    test('the execution flow shows only while Scripts is active', async ({ requestPage }) => {
      const { executionContext } = requestPage;
      await expect(executionContext.executionFlow).toBeHidden();

      await executionContext.openTab('scripts');

      await expect(executionContext.executionFlow).toHaveText('Sandwich execution flow');

      await executionContext.openTab('variables');

      await expect(executionContext.executionFlow).toBeHidden();
    });

    test('"View complete code" shows only while Tests is active and opens the code dialog', async ({ requestPage, page }) => {
      const { executionContext } = requestPage;
      await expect(executionContext.viewCompleteCodeButton).toBeHidden();

      await executionContext.openTab('tests');

      await expect(executionContext.viewCompleteCodeButton).toBeVisible();

      await executionContext.viewCompleteCodeButton.click();

      await expect(page.getByRole('dialog', { name: 'All tests' })).toBeVisible();
    });
  });

  test('persists the collapsed state across a reload', async ({ requestPage, page }) => {
    const toggle = () => requestPage.section('Execution Context').getByRole('button', { name: /Execution Context/i });
    await expect(toggle()).toHaveAttribute('aria-expanded', 'true');

    await toggle().click();

    await expect(toggle()).toHaveAttribute('aria-expanded', 'false');

    await page.reload();

    await expect(toggle()).toHaveAttribute('aria-expanded', 'false');
  });
});
