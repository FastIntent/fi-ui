import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';

const shared = {
  entry: [
    'src/index.ts',
    'src/design-system.ts',
    'src/components/*/index.{ts,tsx}',
    'src/styles/global.scss',
  ],
  sourcemap: process.env.SOURCE_MAP === 'true',
  minify: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  esbuildPlugins: [sassPlugin()],
  tsconfig: 'tsconfig.build.json',
} as const;

export default defineConfig([
  {
    // ESM — code splitting enabled so locale, ConfigProvider, and Wave are
    // extracted into shared chunks instead of being duplicated in every component.
    ...shared,
    format: ['esm'],
    dts: true, // generates .d.ts for every entry
    splitting: true,
    clean: true, // wipe dist at the start of each full build
  },
  {
    // CJS — splitting is not supported by the CommonJS module system, so we
    // compile each entry as a self-contained file. Tree-shaking via CJS is not
    // possible in any bundler, so duplication here is an acceptable trade-off.
    ...shared,
    format: ['cjs'],
    dts: true, // generates .d.cts for CJS consumers using TypeScript
    splitting: false,
    clean: false, // ESM output from config 1 must not be wiped
    // After both formats are built, replace the tsup-bundled barrel with a pure
    // re-export barrel so the consumer's bundler can tree-shake per component.
    onSuccess: 'node scripts/generate-barrel.mjs',
  },
]);
