# Typography: Noto Sans

## Summary

Replaced Inter with **Noto Sans** as the default sans font family for Quotidian UI. Mono remains JetBrains Mono.

## Motivation

Noto Sans offers broader script coverage for internationalization than Inter or Poppins, while remaining a clean geometric UI face. Components continue to consume `--font-family-sans`; only the token value and font loading changed.

## Files touched

- `packages/tokens/typography.json` — sans `$value` set to Noto Sans + system fallbacks
- `packages/tokens/build/css/variables.css` — regenerated `--font-family-sans`
- `.storybook/fonts.css` — Google Fonts import for weights 400–700 (roman + italic)
- `.storybook/preview.tsx` — imports `fonts.css`
- `README.md` — notes that consumers must load Noto Sans themselves

## How to verify

1. Rebuild tokens if needed: `pnpm --filter @quotidian-ui/tokens build`
2. Confirm `--font-family-sans` in `packages/tokens/build/css/variables.css` includes `'Noto Sans'`
3. Run Storybook (`pnpm storybook` or port 6007 if 6006 is busy)
4. Inspect a Button or Card story — computed `font-family` should start with Noto Sans
