# @fastintent/fi-ui

An enterprise-class UI component library for React, optimized for **Next.js App
Router**. Lightweight, themeable, and highly composable.

---

## Features

- **50 Components** — Complete coverage for enterprise application UIs.
- **Zero-config CSS** — Each component's styles load automatically via
  tree-shaking. No manual CSS imports required.
- **Next.js Native** — Full support for Server Components and SSR with zero
  hydration errors.
- **Dynamic Theming** — Customize everything through CSS variables (`--fi-*`)
  with zero React re-render cost.
- **Lightweight** — Modular JS with full tree-shaking, ~28 KB CSS gzip.
- **443 Tests** — Comprehensive test coverage across all components.

---

## Installation

```bash
pnpm add @fastintent/fi-ui
```

## Quick Start

```tsx
import { Button, Table, ConfigProvider } from '@fastintent/fi-ui';

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
|                  | `Checkbox`, `Radio`, `Switch`, `Slider`, `Rate`, `Upload`                           |
| **Data Display** | `Table`, `Calendar`, `Collapse`, `Avatar`, `Badge`, `Tag`, `Timeline`, `Tooltip`    |
|                  | `Popover`, `Popconfirm`, `Empty`, `Skeleton`                                        |
| **Feedback**     | `Alert`, `Modal`, `Drawer`, `Spin`, `Progress`, `Result`, `Message`, `Notification` |
| **System**       | `ConfigProvider`, `FloatingLabel`, `Wave`                                           |

---

## Theming

Use `ConfigProvider` at the root of your app to inject design tokens. Theming is
powered by native CSS variables — switching themes has **zero** React re-render
cost.

```tsx
import { ConfigProvider } from '@fastintent/fi-ui';

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

The CSS for each component loads **automatically** when you import the
component. No extra CSS imports needed.

```tsx
// Button.css, Table.css, and Tooltip.css are included automatically
import { Button, Table, Tooltip } from '@fastintent/fi-ui';
```

This works because each component's JS file references its own CSS. The bundler
follows the reference, and thanks to `"sideEffects": ["**/*.css"]` in
`package.json`, CSS files are never tree-shaken away. **Only the CSS of
components you actually use is included.**

```
import { Button } from '@fastintent/fi-ui'
         |
dist/index.js  ->  export { Button } from './components/Button/index.js'
                            |
              Button/index.js  ->  import './index.css'   // included
                                   export { Button }      // included

dist/components/Input/index.js    <- not imported, its CSS is excluded
dist/components/Card/index.js     <- not imported, its CSS is excluded
```

### Global CSS fallback

For environments without a bundler (CDN, plain HTML, Webpack v4):

```tsx
import '@fastintent/fi-ui/dist/index.css'; // all components
import '@fastintent/fi-ui/dist/design-system.css'; // design tokens only
```

---

## Development

```bash
pnpm install        # Install dependencies
pnpm storybook      # Interactive component explorer
pnpm test           # Run tests (443 tests)
pnpm build          # Production build
pnpm verify         # Full pipeline: typecheck -> lint -> token audit -> test -> build -> size-check
```

---

## Conventions

- **CSS Prefix**: `fi-` (e.g., `.fi-table`, `.fi-button`)
- **Token Prefix**: `--fi-` (e.g., `--fi-primary-color`)
- **Architecture**: Simplified BEM with a scalable design token system.

---

## License

MIT
