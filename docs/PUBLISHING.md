# Publishing @quotidian-ui packages

Published packages:

- `@quotidian-ui/tokens` — from `packages/tokens`
- `@quotidian-ui/core` — from `packages/core` (depends on tokens)

`packages/docs` is not published.

## Prerequisites

- **npm org** `@quotidian-ui` with permission to publish both packages.
- **GitHub secret** `NPM_TOKEN`: must be a token that can publish **without** a one-time password in CI.

### Which npm token to use

If your npm account has **2FA** enabled (recommended), a classic **“Publish”** token still makes `npm publish` ask for an OTP — GitHub Actions cannot answer that, and you will see **`EOTP`** / _“requires a one-time password”_.

Use one of these instead:

1. **Classic → “Automation”**  
   [npmjs.com](https://www.npmjs.com/) → **Access Tokens** → **Generate New Token** → **Classic** → choose type **Automation**.  
   Automation tokens are meant for CI and can publish when 2FA is on.

2. **Granular Access Token**  
   Generate a granular token with **Write** (or publish) permission on packages `@quotidian-ui/tokens` and `@quotidian-ui/core` (or the whole org, if you prefer).

Then in GitHub: **Settings → Secrets and variables → Actions** → create or update **`NPM_TOKEN`** with that token value (no `npm_` prefix required in the secret name; the workflow reads `secrets.NPM_TOKEN` as `NODE_AUTH_TOKEN`).

## Troubleshooting

### `EOTP` / “This operation requires a one-time password”

Your `NPM_TOKEN` is almost certainly the wrong token type (often a **Publish** classic token). Replace it with an **Automation** classic token or a **granular** token with publish access, then re-run **Publish Packages**.

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
