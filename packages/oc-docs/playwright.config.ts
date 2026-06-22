import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
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
    baseURL: 'http://127.0.0.1:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }, // TEMP local-only: use system Chrome; DO NOT COMMIT
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3001',
    reuseExistingServer: !process.env.CI,
  },
});
