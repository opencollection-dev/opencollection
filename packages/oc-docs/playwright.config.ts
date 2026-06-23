import { defineConfig, devices } from '@playwright/test';
import { appConfig } from './e2e/config/app.config';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Everything goes under a single ./playwright-report directory: the HTML report.
  outputDir: './playwright-report/artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: './playwright-report/html', open: 'never' }],
    ['json', { outputFile: './playwright-report/results.json' }],
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
