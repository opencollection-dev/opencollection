/** Shape of the resolved e2e configuration. */
export interface AppConfig {
  /** Base URL the docs app is served from (used as Playwright's `baseURL`). */
  baseURL: string;
  /** Command Playwright runs to start the app (the `webServer`). */
  webServerCommand: string;
}

/**
 * Active e2e configuration.
 */
export const appConfig: AppConfig = {
  baseURL:'http://127.0.0.1:3001',
  webServerCommand: 'npm run dev'
};
