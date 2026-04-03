# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# From repo root (all packages via Turborepo)
pnpm build          # Build all packages
pnpm test           # Run all tests
pnpm lint           # Lint all packages
pnpm format         # Prettier write on packages/
pnpm storybook      # Start Storybook dev server (port 6006)

# From packages/core only
pnpm test           # vitest run (single run)
pnpm test:watch     # vitest (watch mode)
pnpm build          # vite build (ESM + CJS)
```

To run a single test file:

```bash
cd packages/core && pnpm vitest run src/components/Button/Button.test.tsx
```

## Architecture

This is a **pnpm + Turborepo monorepo** with three packages that have a strict dependency order:

```
@quotidian-ui/tokens → @quotidian-ui/core → @quotidian-ui/docs
```

### `packages/tokens`

Style Dictionary pipeline consuming DTCG-format JSON token files (`colors.json`, `spacing.json`, `typography.json`, `elevation.json`). Outputs to `build/`:

- `css/variables.css` — CSS custom properties consumed by components
- `js/tokens.js` + `tokens.d.ts` — JS/TS exports

Token structure uses `$value`/`$type` fields and primitive→semantic aliasing (e.g., `{color.primitive.ink.900}`).

### `packages/core`

React component library. Builds in library mode (Vite) to dual ESM/CJS output. Each component lives in its own folder with 5 files: `Component.tsx`, `Component.module.css`, `Component.stories.tsx`, `Component.test.tsx`, `index.ts`.

**Component conventions:**

- Use `forwardRef` + set `displayName`
- Use React Aria hooks (`useButton`, `useCheckbox`, `useTextField`, etc.) for accessibility — you own the markup and styling
- Support polymorphic rendering via the `polymorphic.ts` type helper (`as` prop)
- Style exclusively with CSS Modules consuming CSS variables from tokens — no hardcoded values
- Use `:focus-visible` for focus styles; use `[aria-disabled='true']` alongside `:disabled`
- Merge classNames with the `cn()` utility from `src/utils/cn.ts`

**Theming:** `ThemeProvider` sets `data-theme` on `document.documentElement`. Dark mode overrides CSS variables under `[data-theme="dark"]`. Use `useTheme()` hook to read/set theme.

### `packages/docs`

Storybook-based documentation site (WIP). Storybook config at `.storybook/` — imports token CSS in `preview.ts`, runs a11y (axe-core) audits, and integrates Vitest for story-based tests.

## Testing

- **Framework:** Vitest + React Testing Library + jsdom
- **Setup:** `packages/core/src/test-setup.ts` imports `@testing-library/jest-dom`
- **Root `vitest.config.ts`** also runs Storybook stories as visual tests via Playwright/Chromium

Test what the user experiences: query by ARIA role, test behavior and accessibility, not implementation details.
