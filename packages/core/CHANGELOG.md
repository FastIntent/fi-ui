# @atomizeui/core

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
