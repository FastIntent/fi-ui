# Atomize UI — Import Guide & Bundle Governance

## Recommended Import Patterns

### ✅ Named imports from root (tree-shakeable)

The library's `package.json` declares `"sideEffects": ["**/*.css"]`, meaning
bundlers (webpack, Vite, esbuild, Turbopack) will automatically tree-shake any
component you do **not** import.

```tsx
// ✅ Best practice — only the components you use are bundled
import { Button, Input, Modal } from '@atomizeui/core';
import '@atomizeui/core/index.css'; // full token + reset sheet (~22 KB gzip)
```

### ✅ Per-component CSS (maximum tree-shaking)

For performance-critical apps, import only the CSS for each component you use:

```tsx
import { Button } from '@atomizeui/core';
import { Modal } from '@atomizeui/core';
import { DatePicker } from '@atomizeui/core';

import '@atomizeui/core/Button/index.css';
import '@atomizeui/core/Modal/index.css';
import '@atomizeui/core/DatePicker/index.css';
// plus always the design tokens:
import '@atomizeui/core/design-system.css'; // ~3.8 KB gzip — CSS vars & tokens only
```

### ✅ Design tokens only (zero component JS)

```tsx
import '@atomizeui/core/design-system.css';
// Gives you all CSS custom properties: --fi-color-primary, --fi-spacing-*, etc.
```

### ❌ Avoid — barrel default import (defeats tree-shaking)

```tsx
// ❌ Never do this — imports every component including ones you don't use
import AtomizeUI from '@atomizeui/core';
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
