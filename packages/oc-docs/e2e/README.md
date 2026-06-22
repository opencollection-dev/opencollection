# End-to-end tests

Playwright e2e tests for the docs app, written with a **class-based Page Object Model**
and a scalable, feature-first layout.

## Layout

```
e2e/
├── tsconfig.json          # extends the root; defines the @pages / @components / @fixtures aliases
├── config/
│   └── app.config.ts      # baseURL + webServer command (one env today; BASE_URL overrides)
├── fixtures/
│   ├── index.ts           # the project `test` — base test + every page-object fixture (mergeTests)
│   ├── layout.fixture.ts
│   └── overview.fixture.ts
├── pages/                 # one class per route/screen — *.page.ts, extend BasePage
│   ├── base.page.ts
│   ├── layout.page.ts     # app-wide chrome (mount root, theme)
│   └── overview.page.ts
├── components/            # component objects (sections of a page) — *.component.ts, extend BaseComponent
│   ├── base.component.ts
│   ├── layout/
│   │   └── theme-toggle.component.ts
│   └── overview/
│       ├── header.component.ts
│       ├── stats.component.ts
│       ├── environment-summary.component.ts
│       ├── docs.component.ts
│       └── collection-configuration.component.ts
└── tests/                 # *.spec.ts, grouped by feature
    ├── smoke/             # quick "does it boot" checks
    ├── theming/
    └── overview/
```

## The model

- **Page objects** (`pages/*.page.ts`) represent a route. They extend `BasePage`, expose
  their sections as `readonly` component instances, and own page-level actions
  (`goto`, `reload`, flows).
- **Component objects** (`components/<page>/*.component.ts`) represent a section of UI.
  They extend `BaseComponent` and are composed by pages. Grouping by page (`overview/`,
  `layout/`) keeps the folder navigable as pages and sections multiply.
- **Locators:** fixed locators are `readonly` fields (Playwright evaluates them lazily);
  locators that take an argument are methods.

  ```ts
  export class StatsComponent extends BaseComponent {
    readonly all = this.page.getByTestId('overview-stat');          // fixed → field
    item(label: string): Locator {                                  // parameterized → method
      return this.all.filter({ hasText: label });
    }
  }
  ```

- **Actions** are `async` methods (`overviewPage.goto()`, `configuration.revealSecret()`).
- **Assertions stay in specs.** Page objects/components expose locators + actions; specs do
  the `expect`s (readiness waits inside `goto()` are the one exception).
- **Only page objects and components own selectors** — specs never use raw selectors.

## Naming conventions

| Kind | File | Class |
|------|------|-------|
| Page object | `<name>.page.ts` | `XxxPage extends BasePage` |
| Component object | `<name>.component.ts` | `XxxComponent extends BaseComponent` |
| Fixture | `<feature>.fixture.ts` | — (exports a `test`) |
| Spec | `<name>.spec.ts` (`*.smoke.spec.ts` for smoke) | — |

## Imports & path aliases

`e2e/tsconfig.json` defines aliases (wired into Playwright via `tsconfig` in
`playwright.config.ts`). The rule:

- **Cross top-level folder → alias:** `@fixtures`, `@pages/*`, `@components/*`.
- **Within the same top-level folder → relative:** e.g. `overview.page.ts` imports
  `./base.page`; `header.component.ts` imports `../base.component`.

```ts
import { test, expect } from '@fixtures';                    // specs
import { OverviewPage } from '@pages/overview.page';          // fixtures → pages
import { HeaderComponent } from '@components/overview/header.component'; // pages → components
```

> `playwright.config.ts` and `config/app.config.ts` must use **relative** imports — the
> alias map does not apply while the Playwright config loads.

## Writing a spec

Import `test`/`expect` from `@fixtures` (never `@playwright/test` directly) and pull the
page objects you need off the fixture — no `new`, no construction in `beforeEach`:

```ts
import { test, expect } from '@fixtures';

test.describe('Collection Overview', () => {
  test.beforeEach(async ({ overviewPage }) => {
    await overviewPage.goto();
  });

  test('shows the collection name', async ({ overviewPage }) => {
    await expect(overviewPage.header.title).toHaveText('Bruno Testbench');
  });
});
```

## Adding a page

1. Add `pages/<name>.page.ts` extending `BasePage`.
2. Split its UI into `components/<name>/*.component.ts` (extend `BaseComponent`) and
   compose them as `readonly` fields.
3. Add `fixtures/<name>.fixture.ts` and merge it in `fixtures/index.ts` via `mergeTests()`.
4. Add specs under `tests/<feature>/`.

## Locator strategy

Prefer `data-testid` hooks (decoupled from styling/markup churn). Use `getByRole` / text
only for generated HTML with no place for a test id (e.g. rendered markdown internals).

## Future seams (deliberately not scaffolded yet)

Add these only when there's real content for them, to keep the tree readable:

- `config/environments/*` + a `TEST_ENV` resolver — when a second environment exists.
- `constants/` (routes, messages, timeouts) — when routes/strings repeat enough to centralize.
- `data/` (+ `factory/*.factory.ts`) — when tests need fixtures/generated data.
- `hooks/` (global setup/teardown) — e.g. for shared auth state (the app has none today).
- `utils/` (`*.helper.ts`) and `types/*.types.ts` — when shared, page-agnostic code appears.
- `tests/api/` — when there's an API to test directly.

## Running

```sh
npm run test:e2e          # headless
npm run test:e2e:ui       # Playwright UI mode
```
