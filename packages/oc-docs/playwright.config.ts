import { defineConfig, devices } from '@playwright/test';
// Relative import is required: the `tsconfig` path aliases below do NOT apply while
// this config (or anything it imports) loads.
import { appConfig } from './e2e/config/app.config';

export default defineConfig({
  testDir: './e2e',
  // Apply the e2e path-alias map (@pages, @components, @fixtures) to every test file
  // and everything it imports.
  tsconfig: './e2e/tsconfig.json',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: './test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: './playwright-report', open: 'never' }],
    ['json', { outputFile: './test-results/results.json' }],
  ],
  use: {
    baseURL: appConfig.baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: appConfig.webServerCommand,
    url: appConfig.baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
