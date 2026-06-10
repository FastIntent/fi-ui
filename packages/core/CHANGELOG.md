# @atomizeui/core

## 2.1.6

### Patch Changes

- Align control metrics with the design-token scale:
  - Fix `--atom-spacing-sm` token: `4px` → `8px` (was a typo duplicating `xs`;
    the margin-scale comments already documented 8px as intended). Components
    consuming the `sm` spacing tier gain consistent breathing room.
  - Tooltip: padding now derives from the global spacing scale via
    `--atom-tooltip-padding-v/h`; fixed inverted left/right placement arrow
    transforms that left a 2px gap between arrow and bubble.
  - InputNumber: handler arrows sized via new
    `--atom-input-number-handler-font-size/width` tokens so they fit the `sm`
    (24px) control; with `prefix`/`suffix` the handlers anchor to the wrapper
    edge and fade/slide in on hover/focus while the suffix shifts aside.
  - InputOTP: cells re-scaled to the control-height scale (24/32/40px) with
    per-tier font sizes and Input-consistent 1px border and radius.

## 2.1.5

### Patch Changes

- Harden distribution for strict-ESM and CJS consumers:
  - `dayjs/locale/es` is now imported with an explicit `.js` extension — the
    extensionless specifier broke strict-ESM resolution (webpack
    `fullySpecified`, Node ESM).
  - `ItemGroup` and `Divider` pass-through re-exports moved from `Menu.tsx` to
    the Menu barrel, removing unused `@rc-component/menu` bindings from the
    self-contained CJS bundles of `ImageManager` and `ImagePickerInput`.
  - New tree-shaking CI gate (`scripts/treeshake-check.mjs`) bundles the package
    as a real consumer (webpack barrel, Rollup barrel/subpath) and enforces
    per-bundler JS/CSS budgets on every `size-check`.
  - Documented the measured per-bundler tree-shaking matrix in `BUNDLE_GUIDE.md`
    (Turbopack/webpack/Vite: ~6 KB CSS for a single component; plain esbuild
    should use subpath imports).
