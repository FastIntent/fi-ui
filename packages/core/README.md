# @atomizeui/core

Atomize UI — an enterprise-class React component library for the **Next.js App
Router**. Atomic, composable, themeable.

---

## Features

- **50+ Components** — Complete coverage for enterprise application UIs.
- **Zero-config CSS** — Each component's styles load automatically via
  tree-shaking. No manual CSS imports required.
- **Next.js Native** — Full support for Server Components and SSR with zero
  hydration errors.
- **Dynamic Theming** — Customize everything through CSS variables (`--atom-*`)
  with zero React re-render cost.
- **Lightweight** — Modular JS with full tree-shaking, ~28 KB CSS gzip.
- **440+ Tests** — Comprehensive test coverage across all components.
- **Server adapters** — Filesystem-backed `ImageManager` ready out of the box
  via `@atomizeui/core/server`.

---

## Installation

```bash
pnpm add @atomizeui/core
```

## Quick Start

```tsx
import { Button, Table, ConfigProvider } from '@atomizeui/core';

export default function App() {
  return (
    <ConfigProvider theme={{ common: { primaryColor: '#1677ff' } }}>
      <Button type="primary">Get Started</Button>
    </ConfigProvider>
  );
}
```

---

## Components

| Category         | Components                                                                          |
| ---------------- | ----------------------------------------------------------------------------------- |
| **General**      | `Button`, `Flex`, `Typography` (`Title`, `Text`, `Paragraph`)                       |
| **Layout**       | `Card`, `Space`, `Grid` (`Row`, `Col`), `Layout`, `Divider`                         |
| **Navigation**   | `Breadcrumb`, `Menu`, `Dropdown`, `Pagination`, `Steps`, `Tabs`                     |
| **Data Entry**   | `Form`, `Input`, `TextArea`, `InputNumber`, `InputOTP`, `Select`, `DatePicker`      |
|                  | `Checkbox`, `Radio`, `Switch`, `Slider`, `Rate`, `Upload`, `ColorPicker`            |
|                  | `ImagePickerInput`                                                                  |
| **Data Display** | `Table`, `Calendar`, `Collapse`, `Avatar`, `Badge`, `Tag`, `Timeline`, `Tooltip`    |
|                  | `Popover`, `Popconfirm`, `Empty`, `Skeleton`, `ImageManager`                        |
| **Feedback**     | `Alert`, `Modal`, `Drawer`, `Spin`, `Progress`, `Result`, `Message`, `Notification` |
| **System**       | `ConfigProvider`, `FloatingLabel`, `Wave`                                           |

---

## Theming

Use `ConfigProvider` at the root of your app to inject design tokens. Theming is
powered by native CSS variables — switching themes has **zero** React re-render
cost.

```tsx
import { ConfigProvider } from '@atomizeui/core';

const theme = {
  common: {
    primaryColor: '#722ed1',
    borderRadius: '8px',
  },
  Table: {
    headerBg: '#fafafa',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
```

---

## CSS Strategy

The package ships CSS in three layers. Two of them you import once at the app
root; the third loads automatically per component.

```css
/* globals.css — or wherever your root stylesheet lives */
@import '@atomizeui/core/design-system.css'; /* tokens (light + dark) */
@import '@atomizeui/core/base.css'; /* reset + shared primitives */
```

| Layer                                      | What it contains                                                                                              | When to import          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `@atomizeui/core/design-system.css`        | Design tokens (colors, spacing, radii, typography) for both light and dark themes                             | once at the app root    |
| `@atomizeui/core/base.css`                 | Reset + scrollbar styles + shared keyframes (`rotate`, slide animations) + floating-label utility (~850 B gz) | once at the app root    |
| `@atomizeui/core/components/<X>/index.css` | The component's own visual rules                                                                              | automatic per component |

The third layer is fully automatic — each component's JS file references its own
CSS, and thanks to `"sideEffects": ["**/*.css"]` in `package.json` the bundler
keeps that side-effect intact. **Only the CSS of components you actually use is
included.**

```tsx
// Button.css, Table.css, and Tooltip.css are included automatically
import { Button, Table, Tooltip } from '@atomizeui/core';
```

```
import { Button } from '@atomizeui/core'
         |
dist/index.js  ->  export { Button } from './components/Button/index.js'
                            |
              Button/index.js  ->  import './index.css'   // included
                                   export { Button }      // included

dist/components/Input/index.js    <- not imported, its CSS is excluded
dist/components/Card/index.js     <- not imported, its CSS is excluded
```

> **Why `base.css` is separate.** Keyframes like `@keyframes rotate` and
> `@keyframes fiSlideUpIn` are shared by two or more components. If each
> component shipped its own copy the consumer's bundle would ship the same rule
> multiple times. `base.css` collects every shared primitive into a single file
> so it loads once, regardless of how many components you use.

### Smaller CSS for single-component imports

If you only need a couple of components, import the two root stylesheets once
and pull each component from its sub-path. The bundler still resolves transitive
CSS for you:

```tsx
// Layout (load once across the app)
import '@atomizeui/core/design-system.css';
import '@atomizeui/core/base.css';

// Page or component file — bundler resolves the rest
import { ImageManager } from '@atomizeui/core/components/ImageManager';
```

### Global CSS fallback

For environments without a bundler (CDN, plain HTML, Webpack v4):

```tsx
import '@atomizeui/core/dist/index.css'; // all components
import '@atomizeui/core/dist/design-system.css'; // design tokens only
import '@atomizeui/core/dist/styles/base.css'; // reset + shared primitives
```

---

## Server adapters (`@atomizeui/core/server`)

The `ImageManager` is fed by a tiny server adapter. We ship a filesystem-backed
factory that handles sandboxing, MIME validation, file size limits, and mutation
hooks — no extra code to write:

```ts
// app/actions/images.ts
'use server';
import { createFsImageManagerActions } from '@atomizeui/core/server';
import { revalidatePath } from 'next/cache';

export const imageActions = createFsImageManagerActions({
  rootDir: 'public/uploads',
  publicPrefix: '/uploads',
  maxFileSize: 10 * 1024 * 1024,
  onMutation: () => revalidatePath('/media'),
});
```

```tsx
// app/media/page.tsx
'use client';
import { ImageManager } from '@atomizeui/core';
import { imageActions } from '../actions/images';

export default function MediaPage() {
  return <ImageManager mode="edit" multiple actions={imageActions} />;
}
```

Bring your own storage adapter by implementing the `ImageManagerActions`
interface — Vercel Blob, S3, Cloudinary, anything works the same way.

---

## Development

```bash
pnpm install        # Install dependencies
pnpm storybook      # Interactive component explorer
pnpm test           # Run tests
pnpm build          # Production build
pnpm verify         # Full pipeline: typecheck -> lint -> token audit -> test -> build -> size-check
```

---

## Conventions

- **CSS Prefix**: `atom-` (e.g., `.atom-table`, `.atom-button`)
- **Token Prefix**: `--atom-` (e.g., `--atom-primary-color`)
- **Architecture**: Simplified BEM with a scalable design token system.

---

## License

MIT
