# Atomize UI

> Atomic, composable, themeable React components for the Next.js App Router.

Monorepo for the Atomize UI ecosystem.

```
atomize-ui/
├── apps/
│   └── docs/                     # atomizeui.com (Next.js docs site)        — coming soon
├── packages/
│   ├── core/                     # @atomizeui/core           — the component library
│   └── blocks/                   # @atomizeui/blocks         — composed blocks    — coming soon
└── templates/
    └── saas-starter/             # @atomizeui/template-...   — free starter       — coming soon
```

## Packages

| Package                                                        | Description                                                 | Status        |
| -------------------------------------------------------------- | ----------------------------------------------------------- | ------------- |
| [`@atomizeui/core`](./packages/core)                           | Core React component library (50+ components, theming, SSR) | **v2.0.0** ✅ |
| [`@atomizeui/blocks`](./packages/blocks)                       | Production-ready composed components                        | Coming soon   |
| [`@atomizeui/template-saas-starter`](./templates/saas-starter) | Free SaaS starter template                                  | Coming soon   |
| `@atomizeui/docs` (`apps/docs`)                                | Documentation site                                          | Coming soon   |

## Development

```bash
pnpm install           # install all workspaces
pnpm build             # build all packages (turbo)
pnpm test              # run all tests
pnpm typecheck         # typecheck all packages
pnpm verify            # full pipeline: typecheck → validate → test → build → size-check → storybook
pnpm storybook         # interactive component explorer (core)
```

Powered by [Turborepo](https://turborepo.com) + [pnpm](https://pnpm.io) workspaces.

## License

MIT
