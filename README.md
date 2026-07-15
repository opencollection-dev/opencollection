# OpenCollection

An open specification for describing **executable API collections**: requests, environments, variables, authentication, scripts, and assertions, stored as plain YAML.

## What is OpenCollection?

OpenCollection is a format for describing API collections in a way that tools can read, write, and run. A collection is a tree of HTTP, GraphQL, gRPC, and WebSocket requests, together with the environments, variables, auth, scripts, and assertions needed to actually send them.

Most API formats describe a contract. OpenAPI tells you an endpoint exists, what it accepts, and what it returns. OpenCollection captures the next step: the concrete request, with these headers, this body, this environment, this token, and these assertions on the response. A collection is something you run, not just something you read.

The format is plain YAML with a published JSON Schema. It is an open specification: published, openly licensed, and not tied to any single application or proprietary format.

## Why it exists

| Layer | Format | Answers |
|---|---|---|
| Contract | OpenAPI | What does this API look like? |
| Orchestration | Arazzo | How do I chain calls across APIs? |
| **Execution** | **OpenCollection** | **Send this request, with these variables, and check this result.** |

OpenAPI has no concept of "send this request now, with these variables, and assert this response." That executable working set is what teams keep in their API client, and until now it has lived in proprietary, tool-locked formats. OpenCollection is that artifact in an open, neutral YAML format.

## The specification

The current version is **1.0.0**. The schema is authored in [JSON Schema (draft-07)](http://json-schema.org/draft-07/schema#).

- Read the human-readable spec at [spec.opencollection.com](https://spec.opencollection.com).
- Browse the schema interactively at [schema.opencollection.com](https://schema.opencollection.com).
- Read the schema source at [`packages/oc-schema/src/opencollection.schema.json`](./packages/oc-schema/src/opencollection.schema.json).

## Example

```yaml
opencollection: "1.0.0"
info:
  name: Sample API
  version: "1.0.0"
items:
  - info:
      name: Get Users
      type: http
    http:
      method: GET
      url: https://api.example.com/users
      params:
        - name: limit
          value: "10"
          type: query
```

A collection can be a single bundled file or a tree of files and folders on disk.

## Adoption

[Bruno](https://www.usebruno.com), the open-source, git-native API client used by tens of thousands of teams, reads and writes OpenCollection as a native storage format. Bruno can generate documentation from a collection and import from and export to other formats through the same schema.

## Repository layout

This repository is an npm-workspaces monorepo.

### Published packages

| Package | Description |
|---|---|
| [`@opencollection/schema`](./packages/oc-schema) | The JSON Schema definitions for the OpenCollection format. |
| [`@opencollection/types`](./packages/oc-types) | TypeScript types for the OpenCollection schema. |
| [`@opencollection/converters`](./packages/oc-converters) | Converters from other collection formats into OpenCollection. |

### Sites in this repository

| Directory | Description |
|---|---|
| [`packages/oc-spec-site`](./packages/oc-spec-site) | The human-readable specification site (spec.opencollection.com). |
| [`packages/oc-schema-explorer`](./packages/oc-schema-explorer) | The interactive schema explorer (schema.opencollection.com). |

## Using OpenCollection in your tools

OpenCollection is meant to be consumed by any tool. The packages below let you read, validate, and manipulate collections through openly-licensed libraries with no dependency on a particular application.

### Validate a collection

For a tool that ingests OpenCollection files (a CI check, an editor integration, a registry that validates on publish), the schema is published so you can validate against it directly:

```bash
npm install @opencollection/schema ajv
```

```js
import Ajv from 'ajv';
import { OpenCollectionSchema } from '@opencollection/schema';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(OpenCollectionSchema);

if (!validate(myCollection)) {
  console.error(validate.errors);
}
```

### Work with collections in TypeScript

For type-safe access to collection objects in a TypeScript project:

```bash
npm install --save-dev @opencollection/types
```

### Migrate existing collections

To convert collections from another format into OpenCollection:

```bash
npm install @opencollection/converters
```

```js
import { brunoToOpenCollection } from '@opencollection/converters';

const collection = brunoToOpenCollection(brunoCollection);
```

## Project and maintenance

OpenCollection is currently authored and maintained by [Bruno](https://www.usebruno.com). The specification, schema, and tooling are developed in the open, and contributions are welcome.

## Contributing

See [contributing.md](./contributing.md) to build the packages locally. Issues and pull requests are tracked on [GitHub](https://github.com/opencollection-dev/opencollection).
