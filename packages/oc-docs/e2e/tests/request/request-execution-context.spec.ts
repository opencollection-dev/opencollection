import { test, expect } from '../../playwright';

const GET_ALL_CUSTOMERS = ['billing', 'customers', 'Get All Customers'];

test.describe('Request page — Execution Context', () => {
  test.beforeEach(async ({ requestPage }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);
  });

  test('shows a section with Scripts, Variables, Asserts and Tests cards', async ({ requestPage }) => {
    const { executionContext } = requestPage;
    await expect(requestPage.section('Execution Context')).toBeVisible();
    await expect(executionContext.scripts).toBeVisible();
    await expect(executionContext.variables).toBeVisible();
    await expect(executionContext.asserts).toBeVisible();
    await expect(executionContext.tests).toBeVisible();
  });

  test('lists the collection → folder → request script chain around the HTTP call', async ({ requestPage }) => {
    const { executionContext } = requestPage;
    await expect(executionContext.script('Collection Pre-Request')).toBeVisible();
    await expect(executionContext.script('Request Pre-Request')).toBeVisible();
    await expect(executionContext.script('Collection Post-Response')).toBeVisible();
    await expect(executionContext.scripts.getByText('HTTP')).toBeVisible();
  });

  test('shows the script execution flow', async ({ requestPage }) => {
    await expect(requestPage.executionContext.scripts.getByText('Sandwich execution flow')).toBeVisible();
  });

  test('shows the pre-request and post-response variables', async ({ requestPage }) => {
    const { executionContext } = requestPage;
    await expect(executionContext.variables.getByText('Pre-Request')).toBeVisible();
    await expect(executionContext.variable('expectedStatus')).toBeVisible();
    await expect(executionContext.variable('customersPath')).toBeVisible();
    await expect(executionContext.variables.getByText('Post Response')).toBeVisible();
    await expect(executionContext.variable('firstCustomerId')).toBeVisible();
  });

  test('lists all the assertions in the execution context', async ({ requestPage }) => {
    const { executionContext } = requestPage;
    await expect(executionContext.assertion('res.status equals 200')).toBeVisible();
    await expect(executionContext.assertion('res.body is an array')).toBeVisible();
    await expect(executionContext.assertion('res.body.length greater than 0')).toBeVisible();
  });

  test('lists every test case run for the request', async ({ requestPage }) => {
    const { executionContext } = requestPage;
    await expect(executionContext.testCase('status is 200 OK')).toBeVisible();
    await expect(executionContext.testCase('response body is a non-empty array')).toBeVisible();
    await expect(executionContext.testCase('every customer has an id and email')).toBeVisible();
    await expect(executionContext.testCase('multi-level execution chain captured')).toBeVisible();
  });
});
