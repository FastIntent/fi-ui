# Atomize UI — Import Guide & Bundle Governance

## Bundler compatibility — read this first

> **Barrel imports are fully tree-shakeable (JS and CSS) on Next.js
> (webpack/Turbopack) and Vite/Rollup.** **Subpath imports are recommended when
> bundling with plain esbuild.**

Component CSS rides along through the JS module graph (`import './index.css'`
inside each component entry, declared via `"sideEffects": ["**/*.css"]`).
webpack and Rollup (and therefore Vite) prune the CSS of components you do not
import. Plain esbuild honors `sideEffects` for JS but keeps side-effectful CSS
imports nested behind unused re-exports, so the barrel drags in every
component's CSS.

Measured impact — `import { Button }` only (enforced in CI by
`scripts/treeshake-check.mjs`):

| Bundler                               | Import style                                | JS      | CSS        |
| ------------------------------------- | ------------------------------------------- | ------- | ---------- |
| Next.js 16 + Turbopack (`next build`) | barrel `@atomizeui/core`                    | ~5.4 KB | ~6.1 KB ✅ |
| webpack (Next.js)                     | barrel `@atomizeui/core`                    | ~5.4 KB | ~6.2 KB ✅ |
| Vite production (Rollup)              | barrel `@atomizeui/core`                    | ~6.7 KB | ~6.2 KB ✅ |
| esbuild                               | barrel `@atomizeui/core`                    | ~19 KB  | ~228 KB ❌ |
| esbuild                               | subpath `@atomizeui/core/components/Button` | ~19 KB  | ~6 KB ✅   |

The Turbopack row was measured with a real `next build` (Next.js 16.2.7) on a
minimal app whose only page renders one `<Button>`: a single emitted CSS file of
6,067 bytes containing only `.atom-btn` + Wave styles, and a 5.4 KB library JS
chunk. The webpack/rollup/esbuild rows are re-measured on every
`pnpm run size-check` by `scripts/treeshake-check.mjs`.

## Recommended Import Patterns

### ✅ Next.js / webpack / Turbopack / Vite — named imports from the barrel

```tsx
import { Button, Input, Modal } from '@atomizeui/core';
// Each component's CSS is pulled in automatically through the module graph.
// Shared layers, once, at the app root:
import '@atomizeui/core/design-system.css'; // tokens (CSS custom properties)
import '@atomizeui/core/base.css'; // reset + shared keyframes + floating-label
```

### ✅ Plain esbuild — per-component subpath imports

```tsx
import { Button } from '@atomizeui/core/components/Button';
import { Modal } from '@atomizeui/core/components/Modal';
// CSS still rides along automatically — only for the components you import.
import '@atomizeui/core/design-system.css';
import '@atomizeui/core/base.css';
```

### ✅ Manual per-component CSS (surgical control)

If you prefer to manage CSS yourself (e.g. strict CSP, custom pipelines):

```tsx
import '@atomizeui/core/components/Button/index.css';
import '@atomizeui/core/components/Modal/index.css';
// plus always the shared layers:
import '@atomizeui/core/design-system.css';
import '@atomizeui/core/base.css';
```

### ✅ Design tokens only (zero component JS)

```tsx
import '@atomizeui/core/design-system.css';
// Gives you all CSS custom properties: --atom-color-primary, --atom-spacing-*, etc.
```

### ❌ Avoid — barrel default import (defeats tree-shaking)

```tsx
// ❌ Never do this — imports every component including ones you don't use
import AtomizeUI from '@atomizeui/core';
```

### ❌ Avoid — barrel imports under plain esbuild

```tsx
// ❌ esbuild keeps the CSS of ALL components when importing the barrel (~223 KB raw)
import { Button } from '@atomizeui/core';
```

---

## Next.js App Router setup

```tsx
// app/layout.tsx
import '@atomizeui/core/index.css';

// app/my-page/page.tsx  (Server Component — works fine, SSR-safe)
import { Card, Badge } from '@atomizeui/core';

// app/my-page/client-widget.tsx  (needs 'use client' only for interactive components)
('use client');
import { Modal, DatePicker } from '@atomizeui/core';
```

> **Note:** Components that manage their own open/close state (`Modal`,
> `Drawer`, `Dropdown`, `DatePicker`) must be rendered inside a Client Component
> (`'use client'`). Purely presentational components (`Button`, `Card`, `Badge`,
> `Tag`, `Alert`, `Avatar`, etc.) are fully SSR-compatible with no directive
> needed.

---

## Bundle Size Budget

These budgets are enforced automatically in CI via `pnpm run size-check`. A PR
that exceeds any budget **cannot be merged**.

| Artifact                 | Budget (raw) | Approx. gzip |
| ------------------------ | ------------ | ------------ |
| `dist/index.css`         | 200 KB       | ~22 KB       |
| `dist/design-system.css` | 40 KB        | ~4 KB        |
| `dist/index.js` (barrel) | 10 KB        | ~1 KB        |
| Largest single JS chunk  | 25 KB        | ~8 KB        |
| Total ESM JS             | 300 KB       | ~80 KB       |

### Current measurements (as of last `pnpm run size-check`)

| Artifact                     | Raw      | Gzip    |
| ---------------------------- | -------- | ------- |
| `dist/index.css`             | 150.7 KB | 21.7 KB |
| `dist/design-system.css`     | 18.1 KB  | 3.8 KB  |
| `dist/index.js`              | 2.4 KB   | 853 B   |
| Total JS (ESM)               | 78.7 KB  | —       |
| Largest chunk (`DatePicker`) | 11.2 KB  | —       |

---

## CSS Architecture Notes

### `dist/index.css` — Global stylesheet (148 KB raw)

Contains: design tokens + resets + **all 40 component stylesheets**
concatenated. Import this when you need the full library on a page (admin
panels, dashboards).

**Why it's large:** Every component's SCSS is compiled and concatenated. The
gzip ratio is excellent (~21 KB delivered), so the raw size is not a concern for
production HTTP/2 environments.

### `dist/design-system.css` — Tokens only (18 KB raw)

Contains only CSS custom properties (`--fi-*`). Safe to import globally in
`_document.tsx` or `layout.tsx` without pulling in any component styles.

### Per-component CSS (`dist/components/*/index.css`)

Individual stylesheets. Use when you want surgical CSS loading. Each file is
4–28 KB raw (averaging ~4 KB).

---

## Large Chunk Analysis

### `chunk-YOQ5XKB7.js` (11.2 KB) — DatePicker

This is the largest JS chunk because `DatePicker` depends on `dayjs` (locale
parsing) and `rc-picker` (calendar logic). It is loaded lazily only when
`DatePicker` or `RangePicker` is imported.

**Recommendation:** If DatePicker is not used on initial load, wrap it in
`React.lazy()`:

```tsx
const DatePicker = React.lazy(() =>
  import('@atomizeui/core').then((m) => ({ default: m.DatePicker }))
);
```

### `chunk-XKUTKIM2.js` / `chunk-WMXYWAEY.js` (~5–6 KB each)

rc-menu and rc-table internals. Acceptable size for the functionality provided.

---

## Governance Commands

```bash
# Run full governance gate locally (mirrors CI)
pnpm run verify

# Measure bundle sizes and compare with saved baseline
pnpm run size-check

# Run only tests (unit + a11y + SSR)
pnpm run test

# Type-check without emitting
pnpm run typecheck
```

The baseline file (`bundle-baseline.json`) is committed to the repo so that
`size-check` can report deltas between runs and alert when a change adds more
than 5 KB to any tracked artifact.
