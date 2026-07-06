# oc-docs — Engineering Conventions

Guidance for writing code in this package (the OpenCollection docs viewer). Keep changes
consistent with what's already here: read the neighbouring files first and match their style.

## Commands

```bash
npm run dev            # Vite dev server (:3001)
npm run test:run       # Vitest unit suite (SSR, no browser)
npm run test:e2e       # Playwright e2e (add -- --project=chromium)
npm run lint           # eslint, --max-warnings 0 (warnings fail)
tsc --noEmit           # type-check only
```

Before considering a change done: `tsc --noEmit`, `npm run test:run`, and the relevant e2e must all pass.

## Golden rule

Write clean, neat, self-documenting code. Prefer clear names and small, single-purpose functions
over comments. When you spot the same logic in two places, extract a shared helper rather than copy it.

## Formatting & spacing

There is no Prettier config — formatting is enforced by consistency, so **match the surrounding code exactly**:

- 2-space indentation, no tabs.
- Single quotes for strings; semicolons always.
- Trailing commas in multi-line literals/arrays; none on single-line.
- ~120-column soft limit; wrap long call chains / prop lists one item per line.
- One blank line between logical blocks; no double blank lines; no trailing whitespace.
- Spaces inside `{ ... }` for imports and object literals: `import { Foo } from './foo'`.

## Naming conventions

- **Variables / functions**: `camelCase`. Names read as what they are: `preVars`, `activeIndex`, `bubbleRef`.
- **Functions are verbs**: `getRequestDefaultsVars`, `resolveValue`, `buildEdgeGridRows`, `humanizeManager`.
- **Booleans / predicates**: prefix `is`/`has`/`should` — `isSecretVariable`, `hasConfiguredAuth`, `shouldOpen`.
- **Components & types**: `PascalCase` (`SecretValue`, `PreRequestVarRow`, `AnchorProps`).
- **Constants**: `SCREAMING_SNAKE_CASE` (`AUTH_TYPES`, `SECRET_MASK`, `ADDITIONAL_PARAM_GROUPS`).
- **Files**: one component per folder, file named after it (`SecretValue.tsx`); util modules `camelCase.ts`.
- Avoid abbreviations and single letters except tight local map/filter callbacks (`.map((v) => ...)`).

## TypeScript

- `strict` is on. Never introduce `any` — `@typescript-eslint/no-explicit-any` is a warning and
  `lint` runs with `--max-warnings 0`, so it fails CI. Type it, or use `unknown` + a narrow.
- Prefer **type-predicate filters** over `!` / `as` assertions:
  ```ts
  .filter((v): v is Variable => Boolean(v && v.name))   // good — v is typed after this
  ```
- Import shared domain types from `@opencollection/types/...` (e.g. `Action`, `Auth`, `Variable`);
  don't hand-roll a local shape that duplicates one that already exists.
- Annotate exported function signatures; let inference handle obvious locals.

## Comments

Comment the **why**, never the **what**. Explain non-obvious decisions, invariants, and gotchas;
delete comments that merely restate the code. If a comment is needed to explain *what* a block does,
prefer renaming/extracting until it isn't.

## Directory layout & where code goes

| Dir | Holds | Notes |
|-----|-------|-------|
| `ui/` | Generic, reusable primitives (`Tooltip`, `Table`, `SecretValue`, `IconButton`) | No app/domain knowledge. Reusable anywhere. |
| `components/` | App-specific composed pieces (`AuthDetails`, `ExecutionContext`, `PropertyTable`) | May know about collection/request shapes; compose `ui/` primitives. |
| `pages/` | Route-level screens (`Request`, `Environments`, `Folder`) | One per route; assemble `components/`. Thin — push logic into utils/components. |
| `utils/` | Pure, side-effect-free functions (`request.ts`, `environments.ts`) | No React/JSX. Each module has a co-located `*.spec.ts`. |
| `constants/` | Static values & label maps (`auth.ts`, `request.ts`) | Re-exported through the barrel — see below. |
| `hooks/` | Reusable React hooks | `useX` naming. |
| `store/` | Redux slices & selectors | Path alias `@slices/*`. |
| `routing/`, `theme/`, `assets/` | Routing model, theme tokens, icons/svgs | |

Decision guide: **pure data-shaping → `utils/`; static value → `constants/`; reusable visual with no
domain knowledge → `ui/`; domain-aware visual → `components/`; a whole route → `pages/`.**

### `utils/`
- Pure functions only. No imports from `components/`/`pages/`/React.
- Extract shared row-builders / predicates instead of duplicating map/filter bodies across functions.
- Every module ships a `*.spec.ts` beside it covering the branches.

### `constants/`
- Add the value to the right module (`auth.ts`, `request.ts`, `environment.ts`, `regex.ts`), then
  **re-export it from `constants/index.ts`**. Import from the barrel everywhere:
  ```ts
  import { AUTH_TYPES, ADDITIONAL_PARAM_GROUPS } from '../../constants';   // not '../../constants/auth'
  ```

### `ui/` & `components/`
- One component per folder. Standard shape:
  ```
  Thing/
    Thing.tsx          # component
    StyledWrapper.ts   # emotion styles (only if it needs its own styling)
    Thing.spec.tsx     # unit test
  ```
- Write function components as `React.FC<Props>` with a co-located `interface ThingProps`.
- Export **named + default**: `export const Thing ...` and `export default Thing;`.
- Provide a `testId?: string` prop with a sensible default and put it on the root as `data-testid`.
- Compose class names with the project idiom:
  ```tsx
  className={['thing', className].filter(Boolean).join(' ')}
  ```

### `pages/`
- Keep pages declarative: fetch/select from the store, hand data to components, render layout.
  No heavy data-munging inline — that belongs in `utils/`.

## Styling (emotion + Tailwind v4)

- Component-scoped styles live in a co-located `StyledWrapper.ts` using `@emotion/styled`:
  ```ts
  import styled from '@emotion/styled';
  export const StyledWrapper = styled.div`
    padding: 0.25rem 0.5rem;
    border-radius: var(--oc-radius);
    color: var(--text-primary);
  `;
  ```
- Use theme **CSS custom properties** (`var(--text-primary)`, `var(--oc-background-base)`, `var(--oc-radius)`),
  not hard-coded colours.
- ⚠️ **Tailwind v4 is also active.** A semantic class name used in emotion selectors must **not** collide
  with a Tailwind utility name (`collapse`, `hidden`, `visible`, `block`, `flex`, `grid`, `container`, …).
  Such a name gets Tailwind's utility styles applied too (e.g. `collapse` → `visibility: collapse`, which
  once hid a whole panel). Prefer specific, prefixed names like `oc-tooltip`, `vars-field`, `secret-value`.

## Testing

Every change ships with its tests in the same commit. There are two layers — pick the one that
matches what you're verifying, and don't reach for e2e when a unit test would do.

### At a glance

| | Unit (Vitest) | E2E (Playwright) |
|-|---------------|------------------|
| Run | `npm run test:run` | `npm run test:e2e -- --project=chromium` |
| Scope | Pure functions & single-component render output | The whole app in a real browser |
| Environment | Node — **SSR only, no DOM** | Real Chromium, served by the dev server |
| Location | co-located `src/**/*.spec.ts(x)` | `e2e/tests/**/*.spec.ts` |
| Assert on | returned data / rendered HTML | what the user actually sees |

### Unit tests (Vitest)

Config: `vitest.config.ts` — `environment: 'node'`, `globals: true`, collects
`src/**/*.{test,spec}.{ts,tsx}`, excludes `e2e/**`.

**The rule that shapes every unit test: there is no browser.** The environment is `node`, so there is
**no `document`, `window`, jsdom, or happy-dom**. You cannot mount a component, fire events, or read
layout (`getBoundingClientRect`, refs, effects). Components are verified by **server-side rendering to
an HTML string** and inspecting it. Anything needing real layout, refs, effects, or user interaction
belongs in an e2e test instead.

**What to unit-test**
- `utils/` — every branch of every pure function. Cheapest, highest-value tests; co-locate `foo.spec.ts`
  next to `foo.ts` and cover the empty / malformed / disabled cases too.
- Component **render output** — given props, does the right text / structure / `data-testid` appear, and
  are the right things hidden or masked?

**Two rendering styles** — use whichever fits:

1. String-contains — quickest, for presence/absence:
   ```tsx
   import { renderToStaticMarkup } from 'react-dom/server';
   import { describe, it, expect } from 'vitest';
   import { VariablesPanel } from './VariablesPanel';

   it('labels the post-response captures', () => {
     const html = renderToStaticMarkup(
       <VariablesPanel preVars={[]} postVars={[{ name: 'sessionId', expression: 'res.body.id', scope: 'runtime' }]} />
     );
     expect(html).toContain('Post-Response');
     expect(html).toContain('sessionId');
   });
   ```

2. Parse + query by `data-testid` — when you need a specific element's text or a node count. Use the
   shared `useRenderToDom` helper (renders, parses with `node-html-parser`, and strips emotion's `<style>`
   blocks so their CSS never counts as content):
   ```tsx
   import { useRenderToDom } from '../../hooks/useRenderToDom';

   const root = useRenderToDom(<AuthDetails auth={{ type: 'basic', username: 'u', password: 's3cr3t' }} testId="auth" />);
   expect(root.querySelector('[data-testid="auth-mode"]')?.text.trim()).toBe('Basic Auth');
   expect(root.querySelectorAll('[data-testid="auth-row"]')).toHaveLength(2);
   ```
   A spec that wants a throwing `getByTestId` can wrap it locally — see `AuthDetails.spec.tsx`.

**Unit conventions**
- **Never assert on emotion's hashed class names** (`css-1ab2c3`) — they're unstable. Assert on text,
  `data-testid`, tag, or role.
- Always strip `<style>` before matching text (the helper does it) — otherwise CSS strings leak into
  `.text` / `toContain`.
- Test behaviour and branches, not implementation details.
- Keep fixtures inline and minimal — build only the shape the code reads. Type them; use `as any` only
  for deliberately-malformed inputs.
- Names describe behaviour: `it('masks the password and shows the username')`, not `it('works')`.

### E2E tests (Playwright)

Config: `playwright.config.ts` — `webServer` starts the dev server automatically; run against
`--project=chromium`. Full guide in `e2e/README.md`.

**Two rules (from the e2e README):**
1. **Tests read like documentation** — the title states, in plain English, what the page does; the body
   confirms it.
2. **Locate elements by `data-testid` only** — never by styling classes. Ids come from components'
   `testId` props. Rendered-Markdown internals (which have no test id) are matched by role/tag *within*
   their test-id'd container.

**Page Object Model** — three building blocks under `e2e/`:
- `pages/` — one page object per screen; owns navigation (`goto`, or `.open([...trail])` which walks the
  sidebar for pages that have no URL of their own) and composes the sections a test needs.
- `components/` — reusable pieces; each has a `root` and works anywhere that UI appears. Shared controls
  (markdown, theme toggle, sidebar, breadcrumb) live at the top level; **sections that belong to one page
  live in a subfolder named after it** (`components/request/…`).
- `playwright/` — fixtures. `pages.fixture.ts` defines them; `index.ts` merges them and is the single
  barrel specs import from.

**Writing an e2e test** — pull ready-made objects off the callback (no `new`, no setup boilerplate):
```ts
import { test, expect } from '../../playwright';

test.describe('Request page', () => {
  test.beforeEach(async ({ requestPage }) => {
    await requestPage.open(['billing', 'customers', 'Get All Customers']);
  });

  test('shows the pre-request and post-response variables', async ({ requestPage }) => {
    const { executionContext } = requestPage;
    await expect(executionContext.variables.getByText('Pre-Request')).toBeVisible();
    await expect(executionContext.variables.getByText('Post-Response')).toBeVisible();
  });
});
```

**E2E conventions**
- Keep every `expect` **in the test**; page objects/components expose only elements and actions — the
  test decides what to check.
- Imports are **relative** — no path aliases in `e2e/`. Specs import `test`/`expect` from `../../playwright`.
- Adding a page: add a `*.fixture.ts` and merge it in `playwright/index.ts`; put its page object in
  `pages/` and its sections in `components/<page>/`.
- When you rename or refactor UI, **keep `testId`s stable** — they are the contract the e2e suite relies
  on. If one must change, update the component's `testId` prop, the page-object/component locator, and the
  spec together.

### Before you call a change done

Run all three and confirm they're green:
```bash
tsc --noEmit
npm run test:run
npm run test:e2e -- --project=chromium
```
If you touched a shared label, `testId`, or output shape, grep for it across **both** `src/**/*.spec.*`
and `e2e/**` and update every assertion in the same change.
