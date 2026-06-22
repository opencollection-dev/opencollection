import { mergeTests } from '@playwright/test';
import { test as layoutTest } from './layout.fixture';
import { test as overviewTest } from './overview.fixture';

/**
 * The project `test`: Playwright's base test merged with every page-object fixture.
 * Every spec imports `test` and `expect` from here (never `@playwright/test`
 * directly), so each new page object becomes available everywhere by adding one
 * fixture file and merging it below.
 */
export const test = mergeTests(layoutTest, overviewTest);
export { expect } from '@playwright/test';
