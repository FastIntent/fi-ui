# AtomizeUI Visual Principles

> Maximum clarity, minimum decoration.

The contract every Kit (Dashboard, Authentication, Landing, future
Premium Suites) must honor. If you're building inside this ecosystem,
these rules win over your local preferences. They're what keeps a
visitor jumping between Dashboard Kit, Landing Kit and any premium
suite feeling like one product.

---

## 1. Philosophy

- **Whitespace is a feature.** When in doubt, give it more air.
- **Borders over shadows.** Shadows only on hover, never permanent.
- **Color is rare.** The page is mostly neutral. Green earns its
  presence by being scarce.
- **Density is opt-in.** Comfortable by default; consumers can request
  compact via `ConfigProvider`.
- **Motion is communication.** Use it to explain causality, never to
  decorate.
- **Light is the default theme.** Dark is offered, not assumed. We
  ignore `prefers-color-scheme` for the initial render — the
  AtomizeUI identity is built around white surfaces and a controlled
  accent.

---

## 2. Spacing scale

Multiples of 4. Avoid arbitrary values.

| Token                | Value | Use                                        |
| -------------------- | ----- | ------------------------------------------ |
| `--atom-spacing-xxs` | 3px   | Hairline gaps (chip padding, badge insets) |
| `--atom-spacing-xs`  | 4px   | Tight icon gaps                            |
| `--atom-spacing-sm`  | 4px\* | Stacking small siblings                    |
| `--atom-spacing-md`  | 16px  | Default padding inside cards               |
| `--atom-spacing-lg`  | 24px  | Page gutters, section gaps                 |
| `--atom-spacing-xl`  | 32px  | Major section breaks                       |

(\* `sm` is currently the same as `xs` in the core — favor `md` upward.)

When in doubt, pick the next-larger step. Reduce only to fix a real
density problem.

---

## 3. Radius scale

Larger surfaces get larger corners.

| Surface                                    | Radius                           |
| ------------------------------------------ | -------------------------------- |
| Buttons, Inputs, Tags, Chips               | **8px** (`--atom-border-radius`) |
| Cards small (KPI, stat)                    | **16px**                         |
| Panels (Charts, Activity, Data containers) | **20px**                         |
| Dialogs, Drawers, Modals                   | **24px**                         |
| Avatars, Pills                             | `999px` (circular)               |

This creates an automatic depth gradient: small interactive elements
stay tight; large container surfaces feel calm.

---

## 4. Shadows

| When                                 | Effect                                                          |
| ------------------------------------ | --------------------------------------------------------------- |
| Resting state                        | **No shadow.** Border carries the boundary.                     |
| Hover on a card/panel                | `--kit-shadow-hover` — soft lift, 1px + 4–12px                  |
| Modals, Drawers, Popovers, Dropdowns | The native component's elevation from the core (don't override) |
| Focus state                          | Outline + `box-shadow: 0 0 0 2px primary-color-outline`         |

**Never** apply a permanent drop shadow to a card. A page full of
shadowed cards reads as cluttered and dated.

---

## 5. Color tokens

### Brand

| Role               | Light                                         | Dark      | Use                                                                                                                                                   |
| ------------------ | --------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary            | `#25ac01`                                     | `#2f9e44` | **CTAs only.** Primary button, "New release", primary call to action, focus rings, the active sidebar marker.                                         |
| Accent soft        | `#5cbf3a`                                     | `#4dbf5d` | **Datavis.** Sparklines, progress bars, charts, indicator fills. Keeps the page green-but-quiet so the primary CTA stays the loudest thing on screen. |
| Primary opacity 8% | `color-mix(in srgb, primary 8%, transparent)` | same      | Active surface backgrounds (sidebar selected row, etc.)                                                                                               |

> **Rule:** if it's something the user clicks to make something happen,
> it's primary. If it's something the user reads to understand a number,
> it's accent-soft. Buttons and bars must never wear the same green.

### Surfaces (depth scale)

| Token               | Light                             | Dark                     | Purpose                                        |
| ------------------- | --------------------------------- | ------------------------ | ---------------------------------------------- |
| `--kit-bg-canvas`   | `var(--atom-color-bg-layout)`     | `#0b0f12`                | Page background, deepest layer                 |
| `--kit-bg-elevated` | `var(--atom-color-bg-container)`  | `#101418`                | Sidebar                                        |
| `--kit-bg-card`     | `var(--atom-color-bg-container)`  | `#141a1f`                | Cards and panels                               |
| `--kit-bg-hover`    | `var(--atom-color-fill-tertiary)` | `#1a2128`                | Interactive hover                              |
| `--kit-bg-header`   | `rgba(248, 250, 252, 0.62)`       | `rgba(11, 15, 18, 0.62)` | Frosted sticky header (uses `backdrop-filter`) |

### Text

| Role                                     | Token                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Headings                                 | `--atom-color-text-heading`                                                                             |
| Body                                     | `--atom-color-text`                                                                                     |
| Labels / secondary                       | `--atom-color-text-secondary`                                                                           |
| Hints, metadata                          | `--atom-color-text-tertiary`                                                                            |
| Section headers in nav (e.g. "OVERVIEW") | `--atom-color-text-quaternary` — barely visible by design                                               |
| Placeholders                             | `--atom-color-text-tertiary` (not `--atom-color-text-placeholder` — too faint at our typographic scale) |

### Borders

| Token                       | Value                       | Purpose                         |
| --------------------------- | --------------------------- | ------------------------------- |
| `--kit-border-soft` (light) | `#ececec`                   | Almost-imperceptible separators |
| `--kit-border-soft` (dark)  | `rgba(255, 255, 255, 0.06)` | Same intent, dark               |

Borders define structure. They are nearly invisible on purpose.

---

## 6. Typography

| Element                      | Size                                     | Weight | Tracking           |
| ---------------------------- | ---------------------------------------- | ------ | ------------------ |
| Page title (h1)              | 26px                                     | 600    | `-0.015em`         |
| Panel title (h2)             | 15px                                     | 600    | `-0.01em`          |
| KPI value                    | 30px                                     | 600    | `-0.02em`          |
| Body                         | 14px (`--atom-font-size`)                | 400    | normal             |
| Sidebar item                 | 13.5px                                   | 500    | normal             |
| Metadata, hints              | 12.5–13px                                | 500    | normal             |
| Section header (nav)         | 10px                                     | 600    | `0.12em` uppercase |
| Numeric values (KPIs, stats) | use `font-variant-numeric: tabular-nums` |

Heading weights stop at 600. Bolder reads as marketing, not product.

---

## 7. Motion

| Where                               | Duration | Easing                           |
| ----------------------------------- | -------- | -------------------------------- |
| Hover state transitions             | 150ms    | `ease`                           |
| Card lift on hover                  | 180ms    | `ease`                           |
| Enter animations (bar fills, fades) | 1.1s     | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Theme toggle                        | 200ms    | `ease`                           |

Always respect `@media (prefers-reduced-motion: reduce)` — disable
enter animations, keep only state transitions.

Never animate `transform` on persistent elements (the original card
sit-in-place; only hover lifts).

---

## 8. Iconography

- **16×16** baseline for inline nav and inline metadata.
- **20×20** for action buttons and panel headers.
- **28–32** for empty states and large feature highlights.
- **Stroke 1.75** for nav icons (16px); **1.5** otherwise.
- **Inline SVG** preferred. Avoid icon-font dependencies in Kits.

The active sidebar item's icon drops to `opacity: 0.75` — it's
already loud because of color and rail, so the icon "breathes". On
hover any item icon snaps to `opacity: 1`.

---

## 9. The CTA contract

A page has **at most one primary CTA visible above the fold**.

- Primary CTA → `<Button type="primary">` (verde primary, full intensity).
- Secondary action → default button (border + neutral fill).
- Tertiary / "Cancel" / "Skip" → ghost (text + hover background).

If two things look equally clickable, the user picks neither.

---

## 10. What NOT to do

- ❌ No gradients on backgrounds. Datavis fills only.
- ❌ No box-shadow on resting state.
- ❌ No more than one primary color per visible area.
- ❌ No emoji as iconography in product UI.
- ❌ No off-grid spacings (no `13px`, no `7px`).
- ❌ No `border-radius` micro-tuning per component — pick from the scale.
- ❌ No "elaborate empty state" illustrations. A small Result component
  with one sentence is plenty.
- ❌ No theme inversion just because it looks cool. Dark is opt-in.

---

## 11. Verification checklist (per Kit, before publish)

For every page in a Kit:

### Visual

- [ ] Renders correctly in Light
- [ ] Renders correctly in Dark
- [ ] Mobile (375)
- [ ] Tablet (768)
- [ ] Desktop (1280+)

### Functional

- [ ] Keyboard navigation works
- [ ] Visible focus states on every interactive element
- [ ] Empty state designed
- [ ] Loading state designed
- [ ] Error state designed
- [ ] At least one primary CTA, never two

### Technical

- [ ] Server-renders (no `window` at module level)
- [ ] Zero hydration warnings in the console
- [ ] TypeScript strict, zero errors
- [ ] Zero `console.warn` at runtime
- [ ] CLS < 0.05 on first load
- [ ] Lighthouse Accessibility ≥ 95

### Brand

- [ ] CTAs use primary color
- [ ] Datavis uses accent-soft
- [ ] Logo is the official lockup, not invented
- [ ] Spacing values come from the scale
- [ ] Radius values come from the scale

If you ship a Kit that fails any of these, you owe the next Kit
author a coffee.

---

## Where this document lives

This file is the canonical visual contract for the AtomizeUI ecosystem.
It is referenced by:

- `templates/dashboard/` (Dashboard Kit)
- `templates/authentication/` (Authentication Kit — when it exists)
- `templates/landing/` (Landing Kit — when it exists)
- `apps/web/` (atomizeui.com)
- Future Premium Suites (CRM, Analytics, Workspace, Commerce, …)

When a Kit needs to deviate (rare, justified), it must say so in its
README with a one-line reason.
