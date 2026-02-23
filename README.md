# Quotidian UI

> The everyday design system — built with React, TypeScript, CSS Modules, and React Aria.

Quotidian UI is a design system component library that provides accessible, token-driven, and themeable UI components for React applications.

## Tech Stack

- **React 19** — Component framework
- **TypeScript** — Type safety
- **CSS Modules** — Scoped styling with zero runtime cost
- **React Aria** — Accessibility primitives
- **Style Dictionary** — Design token pipeline
- **Vite** — Library bundling (Rollup under the hood)
- **Vitest** — Unit testing
- **Storybook 10** — Visual development and documentation
- **pnpm** — Package manager
- **Turborepo** — Monorepo task runner

## Project Structure

```
quotidian-ui/
├── packages/
│   ├── tokens/              # Design tokens (source of truth)
│   │   ├── src/             # Token JSON files (DTCG format)
│   │   ├── build/           # Generated outputs (CSS, JS, TS)
│   │   └── build-tokens.mjs # Style Dictionary build script
│   │
│   ├── core/                # React component library
│   │   └── src/
│   │       ├── components/  # UI components
│   │       ├── context/     # ThemeProvider
│   │       ├── hooks/       # Shared hooks
│   │       ├── utils/       # cn(), polymorphic types
│   │       └── index.ts     # Barrel export
│   │
│   └── docs/                # Documentation site (future)
│
├── .storybook/              # Storybook configuration
├── turbo.json               # Turborepo task config
└── pnpm-workspace.yaml      # Workspace config
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm (install via `corepack enable`)

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd quotidian-ui

# Install dependencies
pnpm install

# Build all packages (tokens must build before core)
pnpm turbo build

# Start Storybook for development
pnpm storybook
```

---

## Creating a New Component

Every component follows the same structure and conventions. Here's how to add one from scratch.

### 1. Create the folder

```bash
mkdir packages/core/src/components/YourComponent
```

### 2. Create the files

```
YourComponent/
├── YourComponent.tsx           # Component implementation
├── YourComponent.module.css    # Styles (consuming tokens)
├── YourComponent.stories.tsx   # Storybook stories
├── YourComponent.test.tsx      # Tests
└── index.ts                    # Barrel export
```

### 3. Write the component

Follow these conventions:

```tsx
// YourComponent.tsx
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './YourComponent.module.css';

export interface YourComponentProps {
  /** Describe the prop */
  variant?: 'default' | 'alt';
  /** Always accept className for consumer overrides */
  className?: string;
  children?: React.ReactNode;
}

export const YourComponent = forwardRef<HTMLDivElement, YourComponentProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.root, styles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

YourComponent.displayName = 'YourComponent';
```

**Rules:**

- Always use `forwardRef` — consumers need ref access for focus management and animations
- Always accept and merge `className` via `cn()` — consumers need style overrides
- Always use CSS Modules consuming tokens — no hardcoded colors, spacing, or typography
- Use React Aria hooks when the component is interactive (buttons, inputs, dialogs, etc.)
- Add JSDoc comments on every prop — these show up in Storybook's controls panel
- Set `displayName` — helps debugging in React DevTools

### 4. Write the styles

```css
/* YourComponent.module.css */
.root {
  font-family: var(--font-family-sans);
  color: var(--color-semantic-text-primary);
  /* Use tokens for ALL values */
}
```

**Rules:**

- Every value must come from a token (`var(--token-name)`)
- Never hardcode colors, spacing, font sizes, or border radius
- Use `:focus-visible` for focus styles (not `:focus`)
- Use `[aria-disabled='true']` alongside `:disabled` for non-native disabled elements

### 5. Write the barrel export

```ts
// index.ts
export { YourComponent } from './YourComponent';
export type { YourComponentProps } from './YourComponent';
```

### 6. Add to the root barrel export

Update `packages/core/src/index.ts`:

```ts
export { YourComponent } from './components/YourComponent';
export type { YourComponentProps } from './components/YourComponent';
```

### 7. Write a story

```tsx
// YourComponent.stories.tsx
import type { Meta, StoryObj } from 'storybook';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'alt'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
  args: {
    children: 'Hello',
  },
};
```

### 8. Write tests

```tsx
// YourComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('renders children', () => {
    render(<YourComponent>Hello</YourComponent>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(
      <YourComponent className="custom">Hello</YourComponent>
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});
```

### 9. Verify

```bash
# Visual check
pnpm storybook

# Run tests
cd packages/core
pnpm test

# Build
pnpm build
```

---

## Testing

### Running tests

```bash
# Run all tests once
pnpm turbo test

# Run core tests in watch mode (during development)
cd packages/core
pnpm test:watch

# Run a specific test file
cd packages/core
npx vitest run src/components/Button/Button.test.tsx
```

### Testing philosophy

We use **React Testing Library** and test from the user's perspective:

- **Query by role** (`getByRole`), not by test ID or class name
- **Test behavior**, not implementation — "does clicking the button fire the callback?" not "does the button have class X?"
- **Every test is an accessibility test** — if `getByRole('button')` fails, the component isn't accessible

### What to test for each component

1. **Rendering** — Does it render with default props? With all variants?
2. **Interaction** — Does onClick/onPress fire? Does keyboard navigation work?
3. **Accessibility** — Correct ARIA attributes? Focusable via Tab?
4. **Props** — Does `className` merge? Does `isDisabled` prevent interaction?
5. **Edge cases** — Empty children? Missing optional props?

### Storybook for visual testing

Storybook serves as a visual testing environment. The **a11y addon** runs axe-core audits on every story automatically. Check the "Accessibility" tab in Storybook to catch issues.

```bash
pnpm storybook
```

---

## Design Tokens

### Overview

Tokens are the single source of truth for all visual design decisions. They live in `packages/tokens/src/` as JSON files using the [DTCG format](https://design-tokens.github.io/community-group/format/) (`$value` and `$type` prefixes).

### Token architecture

Tokens are organized in two tiers:

- **Primitive tokens** — Raw values with no opinion about usage (e.g., `blue-600: #2563eb`)
- **Semantic tokens** — Intent-based aliases that reference primitives (e.g., `action-primary: {blue-600}`)

Components only consume semantic tokens. This enables theming — in dark mode, `bg-primary` swaps from white to gray-900, and every component updates automatically.

### Token files

| File | Contains |
|------|----------|
| `colors.json` | Color primitives and semantic color aliases |
| `spacing.json` | Spacing scale (4px base unit) |
| `typography.json` | Font families, weights, sizes, line heights |
| `elevation.json` | Box shadows, border radius, transitions |

### Adding a new token

1. Add the token to the appropriate JSON file in `packages/tokens/src/`:

```json
{
  "color": {
    "primitive": {
      "purple": {
        "500": { "$value": "#8b5cf6", "$type": "color" }
      }
    }
  }
}
```

2. If it's a new semantic token, reference the primitive:

```json
{
  "color": {
    "semantic": {
      "accent": { "$value": "{color.primitive.purple.500}", "$type": "color" }
    }
  }
}
```

3. Rebuild tokens:

```bash
pnpm turbo build --filter @quotidian-ui/tokens
```

4. The new token is now available as a CSS custom property:

```css
.myClass {
  color: var(--color-semantic-accent);
}
```

### Updating an existing token

1. Change the value in the JSON file
2. Rebuild: `pnpm turbo build --filter @quotidian-ui/tokens`
3. Every component consuming that token updates automatically — no code changes needed

### Token outputs

Style Dictionary generates:

| Output | Location | Usage |
|--------|----------|-------|
| CSS custom properties | `build/css/variables.css` | Imported in Storybook and consumer apps |
| JavaScript constants | `build/js/tokens.js` | For token values needed in JS logic |
| TypeScript declarations | `build/js/tokens.d.ts` | Type safety for JS token usage |

---

## Theming

### How it works

The `ThemeProvider` sets a `data-theme` attribute on the document root. Semantic tokens are overridden per theme using CSS:

```css
:root {
  --color-semantic-bg-primary: #ffffff;
}

[data-theme="dark"] {
  --color-semantic-bg-primary: #111827;
}
```

Components reference `var(--color-semantic-bg-primary)` and don't know or care which theme is active. The swap happens through CSS inheritance.

### Using ThemeProvider

```tsx
import { ThemeProvider } from '@quotidian-ui/core';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <YourApp />
    </ThemeProvider>
  );
}
```

Options for `defaultTheme`: `'light'` | `'dark'` | `'system'`

---

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm turbo build` | Build all packages (tokens → core → docs) |
| `pnpm turbo build --filter @quotidian-ui/tokens` | Build tokens only |
| `pnpm turbo build --filter @quotidian-ui/core` | Build core only |
| `pnpm turbo test` | Run all tests |
| `pnpm storybook` | Start Storybook dev server |
| `cd packages/core && pnpm test:watch` | Watch mode tests for core |

---

## Architecture Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Package manager | pnpm | Workspace protocol, strict `node_modules`, industry standard for DS |
| Monorepo tool | Turborepo | Dependency-aware builds, caching, lightweight config |
| Styling | CSS Modules | Zero runtime, scoped classes, full CSS control |
| Accessibility | React Aria | Hook-based primitives, you own the markup and styling |
| Token pipeline | Style Dictionary | Industry standard, multi-platform output, DTCG compatible |
| Token format | DTCG (`$value`) | Emerging W3C standard the industry is converging on |
| Bundler | Vite (library mode) | Rollup under the hood, tree-shakeable ESM output |
| Testing | Vitest + RTL | Shares Vite config, fast, user-perspective testing |
| Documentation | Storybook | Visual development, interactive props, built-in a11y audits |

---

## Publishing (future)

The library will be published to npm as scoped packages:

- `@quotidian-ui/tokens` — Design tokens (CSS + JS)
- `@quotidian-ui/core` — React component library

Consumer usage:

```bash
npm install @quotidian-ui/core
```

```tsx
import { Button, ThemeProvider } from '@quotidian-ui/core';
import '@quotidian-ui/tokens/css';

function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Click me</Button>
    </ThemeProvider>
  );
}
```
