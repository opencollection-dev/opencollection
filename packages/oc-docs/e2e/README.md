# End-to-end tests

Playwright tests for the docs app. They open the app in a real browser and check that
what a person sees on the page is correct.

Two rules shape every test here:

1. **Tests read like documentation.** The title says, in plain English, what the page
   does; the body confirms it.
2. **Elements are located by `data-testid`.** The app sets a stable test id on each
   meaningful element (via the components' `testId` props); tests target those, never
   styling classes. Rendered-Markdown internals — which have no test id — are matched
   by role/tag within their test-id'd container.

## What's tested

| Area | Spec |
|------|------|
| Collection Overview — version/name, stat counts, environments, configuration | `tests/overview/overview.spec.ts` |
| Overview documentation — rendered Markdown | `tests/overview/overview-documentation.spec.ts` |
| Light/dark theme switch | `tests/theming/theme-toggle.spec.ts` |

## Running the tests

```sh
npm run test:e2e       # run headless
npm run test:e2e:ui    # run in Playwright's interactive UI
```

Playwright starts the dev server for you (see `webServer` in `playwright.config.ts`).

## Folder layout

```
e2e/
├── tests/                          # the tests, grouped by feature
│   ├── overview/overview.spec.ts
│   ├── overview/overview-documentation.spec.ts
│   └── theming/theme-toggle.spec.ts
├── pages/                          # one "page object" per screen
│   ├── base.page.ts                #   shared navigation (goto, reload)
│   └── overview.page.ts            #   OverviewPage + its page-specific sections
├── components/                     # common pieces, reused across pages
│   ├── base.component.ts           #   shared base — every component has a `root`
│   ├── markdown.component.ts       #   any block of rendered Markdown
│   ├── copy-button.component.ts    #   a copy-to-clipboard button
│   ├── secret-value.component.ts   #   a masked value with a reveal toggle
│   └── theme-toggle.component.ts   #   the light/dark switch
├── playwright/                     # the test harness
│   ├── pages.fixture.ts            #   defines the fixtures
│   └── index.ts                    #   merges them; the single import for specs
├── config/app.config.ts            # base URL + how to start the app
└── tsconfig.json                   # TypeScript settings for this folder
```

## The three building blocks

**Page objects** (`pages/`) describe a whole screen. They own navigation (`goto`) and
expose the parts of the page a test cares about. **Sections that belong only to one
page live in that page's file** — e.g. the Overview's header, stats, environments and
configuration sections are defined inside `overview.page.ts`, not in `components/`.

**Components** (`components/`) are **common and reused across pages** — the Markdown
renderer and the theme switch. They aren't tied to one page: point a component at the
element it lives in (its `root`) and it works anywhere that UI appears. The Overview's
documentation section, for instance, is just the common `MarkdownComponent` scoped to
the `overview-markdown-documentation` container.

**Fixtures** (`playwright/`) hand a test ready-made page objects and common components:

```ts
test('…', async ({ overviewPage, themeToggle }) => { … });
```

`pages.fixture.ts` defines them; `index.ts` combines them with Playwright's `mergeTests`
and is the single place specs import from. To add a page, drop a new `*.fixture.ts` in
this folder and merge it in `index.ts`.

## Writing a test

Import `test` and `expect` from the `playwright` folder, then pull the page objects and
components you need off the test callback — no `new`, no setup boilerplate:

```ts
import { test, expect } from '../../playwright';

test.describe('Collection Overview', () => {
  test.beforeEach(async ({ overviewPage }) => {
    await overviewPage.goto();
  });

  test('shows the collection name in the header', async ({ overviewPage }) => {
    await expect(overviewPage.header.collectionName).toHaveText('Bruno Testbench');
  });
});
```

Keep the `expect`s in the test. Page objects and sections only expose elements and
actions — the test decides what to check.

## Imports

Every import is a relative path — there are no path aliases. Specs import from the
`playwright` barrel; everything else points straight at the file it needs:

```ts
import { test, expect } from '../../playwright';                    // test → harness
import { OverviewPage } from '../pages/overview.page';               // harness → page
import { MarkdownComponent } from '../components/markdown.component'; // page → component
```
