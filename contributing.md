# Contributing to OpenCollection

Thanks for your interest in OpenCollection. This guide covers how to set up the repository, work on the packages, and propose changes.

For an overview of what OpenCollection is and how the repository is organized, see the [README](./README.md).

## Prerequisites

- Node.js `v22.11.0` (see [`.nvmrc`](./.nvmrc)). With nvm: `nvm use`.
- npm (ships with Node).

## Setup

This repository is an npm-workspaces monorepo. Install all packages from the root:

```bash
git clone https://github.com/opencollection-dev/opencollection.git
cd opencollection
npm install
```

A single install at the root wires up every workspace.

## Working on the packages

Run a workspace script with `npm run <script> --workspace=<package-name>`.

### `@opencollection/schema`

The JSON Schema definitions for the OpenCollection format, and the source of truth for the spec. The schema files live in [`packages/oc-schema/src`](./packages/oc-schema/src). There is no build step: edit the JSON directly.

Any change to the schema is a change to the specification. Update the schema explorer and the spec site to match, and follow the versioning rules below.

### `@opencollection/types`

TypeScript types for the OpenCollection schema. Build with:

```bash
npm run build --workspace=@opencollection/types
```

Keep the types in sync with the schema whenever the schema changes.

### `@opencollection/converters`

Converters from other collection formats into OpenCollection. Plain JavaScript source in [`packages/oc-converters/src`](./packages/oc-converters/src); no build step.

### Schema explorer

The interactive schema explorer served at schema.opencollection.com. A Vite app:

```bash
npm run dev     --workspace=@opencollection/schema-explorer   # local dev server
npm run build   --workspace=@opencollection/schema-explorer   # production build
npm run preview --workspace=@opencollection/schema-explorer   # preview the build
```

The build copies the schema from `@opencollection/schema`, so run a fresh build after changing the schema.

### Spec site

The human-readable specification served at spec.opencollection.com. A Vite app:

```bash
npm run dev     --workspace=oc-spec-site
npm run build   --workspace=oc-spec-site
npm run preview --workspace=oc-spec-site
```

## Making changes

1. Open or comment on an issue first for anything beyond a small fix, so the change can be discussed before you build it.
2. Create a branch from `main`.
3. Make your change. If it touches the schema, update the types, the schema explorer, and the spec site so they stay consistent.
4. Open a pull request against `main` describing the change and linking the issue.

Continuous integration runs end-to-end tests on pull requests via GitHub Actions.

## Changing the schema

The schema is the specification, so changes are versioned deliberately.

- Additive, backward-compatible changes are minor.
- Changes that break existing valid collections are major and need a clear migration path.
- Note the version impact of your change in the pull request.

## Reporting issues

File issues on [GitHub](https://github.com/opencollection-dev/opencollection/issues). For bugs, include the smallest collection that reproduces the problem and what you expected to happen.
