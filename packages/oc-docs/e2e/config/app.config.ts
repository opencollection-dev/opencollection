/** Shape of the resolved e2e configuration. */
export interface AppConfig {
  /** Base URL the docs app is served from (used as Playwright's `baseURL`). */
  baseURL: string;
  /** Command Playwright runs to start the app (the `webServer`). */
  webServerCommand: string;
}

/**
 * Active e2e configuration.
 *
 * There is one environment today — the local dev server. `BASE_URL` overrides the
 * base URL (e.g. to run against a deployed preview) without code changes.
 *
 * When a second environment is needed, split this into `config/environments/*` and
 * resolve the active one from a `TEST_ENV` variable here. Imported by
 * `playwright.config.ts` via a relative path (path aliases do not apply while the
 * Playwright config loads).
 */
export const appConfig: AppConfig = {
  baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3001',
  webServerCommand: 'npm run dev'
};
