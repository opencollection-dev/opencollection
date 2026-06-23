# End-to-end tests

Playwright tests for the docs app. They open the app in a real browser and check that
what a person sees on the page is correct.

Two rules shape every test here:

1. **Tests read like documentation.** The title says, in plain English, what the page
   does; the body confirms it. You shouldn't need to read the code to follow a test.
2. **Elements are found the way a person reads the screen** — a heading's words, a
   button's label, a table cell's text — never by styling classes that can change.

## What's tested

| Area | What it checks | Spec |
|------|----------------|------|
| Collection overview | the Markdown intro renders correctly (headings, lists, table, code, quote) | `tests/collection/markdown.spec.ts` |
| Theme switch | the header button flips the app light ⇄ dark and remembers the choice | `tests/theming/theme-toggle.spec.ts` |

## Running the tests

```sh
npm run test:e2e       # run headless
npm run test:e2e:ui    # run in Playwright's interactive UI
```

Playwright starts the dev server for you (see `webServer` in `playwright.config.ts`),
so there's nothing to start beforehand.

## Folder layout

```
e2e/
├── tests/                          # the tests, grouped by feature
│   ├── collection/markdown.spec.ts
│   └── theming/theme-toggle.spec.ts
├── pages/                          # one "page object" per screen
│   ├── base.page.ts                #   shared navigation (goto, reload)
│   └── collection.page.ts          #   the collection screen + its overview
├── components/                     # reusable pieces of UI (work on any screen)
│   ├── base.component.ts           #   shared base — every component has a `root`
│   ├── markdown.component.ts       #   any block of rendered Markdown
│   └── theme-toggle.component.ts   #   the light/dark switch
├── playwright/                     # the test harness
│   ├── pages.fixture.ts            #   defines the fixtures
│   └── index.ts                    #   the single thing specs import from
├── config/app.config.ts            # base URL + how to start the app
└── tsconfig.json                   # TypeScript settings for this folder
```

## The three building blocks

**Page objects** (`pages/`) describe a whole screen. They know how to get there
(`goto`) and expose the parts of the page a test cares about.

**Components** (`components/`) describe a reusable piece of UI — a Markdown block, the
theme switch. They aren't tied to one page: you point a component at the element it
lives in, and it works anywhere that UI appears.

**Fixtures** (`playwright/`) hand a test ready-made page objects and components, so a
test simply asks for what it needs by name:

```ts
test('…', async ({ collectionPage, themeToggle }) => { … });
```

Commonly-used components (the theme switch, and later the sidebar and page header) are
handed over directly — so you write `themeToggle.toggle()`, not
`layoutPage.themeToggle.toggle()`.

`pages.fixture.ts` defines those fixtures; `index.ts` combines them with Playwright's
`mergeTests` and is the one place specs import from. To add a page, drop a new
`*.fixture.ts` in this folder and add it to the `mergeTests(…)` call in `index.ts`.

## Writing a test

Import `test` and `expect` from the `playwright` folder, then pull the page objects and
components you need straight off the test callback — no `new`, no setup boilerplate:

```ts
import { test, expect } from '../../playwright';

test.describe('Collection overview', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('shows the "Getting Started" heading', async ({ collectionPage }) => {
    await expect(collectionPage.overview.heading('Getting Started')).toBeVisible();
  });
});
```

Keep the `expect`s in the test. Page objects and components only expose elements and
actions — the test decides what to check.

## How elements are located (most reliable first)

1. **Test id** for the container a component lives in —
   `getByTestId('collection-docs')`, `getByTestId('theme-toggle')`.
2. **Role + accessible name** for content and controls — `getByRole('heading', …)`,
   `getByRole('table')`. This is also how a screen reader finds them.
3. **Semantic tags** (`strong`, `code`, `blockquote`) only for Markdown output that has
   no role or test id.

Tests never reach for app styling classes; each component owns its own selectors.

## Imports

Every import is a relative path — there are no aliases. Tests import from the
`playwright` barrel; everything else points straight at the file it needs:

```ts
import { test, expect } from '../../playwright';                    // test → harness
import { CollectionPage } from '../pages/collection.page';           // harness → page
import { MarkdownComponent } from '../components/markdown.component'; // page → component
```
