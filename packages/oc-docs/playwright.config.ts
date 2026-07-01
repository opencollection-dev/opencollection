import { defineConfig, devices } from '@playwright/test';
import { appConfig } from './e2e/config/app.config';

export default defineConfig({
  testDir: './e2e',
  tsconfig: './e2e/tsconfig.json',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    baseURL: appConfig.baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: appConfig.webServerCommand,
    url: appConfig.baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
