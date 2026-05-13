# Publishing @quotidian-ui packages

Published packages:

- `@quotidian-ui/tokens` — from `packages/tokens`
- `@quotidian-ui/core` — from `packages/core` (depends on tokens)

`packages/docs` is not published.

## Prerequisites

- **npm org** `@quotidian-ui` with permission to publish both packages.
- **GitHub secret** `NPM_TOKEN` on this repository: an npm token with publish access (automation or granular token).

## Version bump (required)

npm rejects republishing an existing version. Before any publish:

1. Set the same new semver in:
   - `packages/tokens/package.json` → `"version"`
   - `packages/core/package.json` → `"version"`
2. Commit and push.

**Helper:** from the repo root (requires [jq](https://jqlang.github.io/jq/)). When using pnpm, it passes a literal `--` into the script; the script skips that so the version argument is read correctly.

```bash
./scripts/bump-and-tag.sh 0.2.0
```

That updates both `package.json` files, commits, and creates an annotated git tag `v0.2.0`. Then push:

```bash
git push origin HEAD && git push origin v0.2.0
```

Or use pnpm:

```bash
pnpm release:bump -- 0.2.0
git push origin HEAD && git push origin v0.2.0
```

## CI publish (recommended)

Workflow: **Publish Packages** (`.github/workflows/publish.yml`).

**Triggers:**

- **Actions** → **Publish Packages** → **Run workflow** (manual), or
- Push a tag matching `v*` (for example after `release:bump`), or
- **Publish** a GitHub Release (`release: published`).

The workflow installs dependencies, builds tokens, publishes `@quotidian-ui/tokens`, then builds and publishes `@quotidian-ui/core`.

## Local publish (optional)

Log in to npm (`npm login`) or export `NPM_TOKEN` for non-interactive use, then from the repo root:

```bash
pnpm install --frozen-lockfile
pnpm --filter @quotidian-ui/tokens build
pnpm --filter @quotidian-ui/tokens publish --no-git-checks
pnpm --filter @quotidian-ui/core build
pnpm --filter @quotidian-ui/core publish --no-git-checks
```

Use the same version bump rules as CI.

## After publish

Consumers install or upgrade with:

```bash
pnpm add @quotidian-ui/core@<version>
```

If they pin tokens explicitly:

```bash
pnpm add @quotidian-ui/tokens@<version>
```
