#!/usr/bin/env node
/**
 * Tree-shaking governance — bundles dist/ as a real consumer would and
 * enforces per-bundler budgets on the "import { Button } only" scenario.
 *
 * Scenarios:
 *   1. webpack + barrel   (Next.js, primary target)   → CSS must stay low
 *   2. rollup  + barrel   (Vite production)           → CSS must stay low
 *   3. rollup  + subpath  (per-component imports)     → CSS must stay low
 *   4. esbuild + barrel   (documented limitation)     → report only, never fails
 *
 * Scenario 4 is EXPECTED to pull in the CSS of every component: esbuild
 * honors the `sideEffects` field to drop unused JS, but keeps side-effectful
 * CSS imports nested behind unused re-exports. webpack and Rollup (and
 * therefore Vite) prune them correctly. Documented in BUNDLE_GUIDE.md —
 * plain-esbuild consumers should use subpath imports.
 *
 * Exit code 0 = all enforced budgets met.
 * Exit code 1 = a budget exceeded, or a scenario failed to bundle.
 */

import { mkdtempSync, mkdirSync, symlinkSync, writeFileSync, readFileSync, rmSync, statSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

const BUDGETS = {
  // webpack prunes unused components' CSS via subtree skipping. Button + Wave
  // CSS is ~6 KB raw today; headroom for token growth.
  webpackBarrelCss: 25_000,
  webpackBarrelJs: 60_000, // minified by webpack production mode

  // Rollup respects the sideEffects field the same way Vite production does.
  rollupBarrelCss: 25_000,
  rollupBarrelJs: 80_000, // unminified rollup output

  // Subpath import only reaches Button's own graph in any bundler.
  rollupSubpathCss: 25_000,
  rollupSubpathJs: 80_000,
};

const externalRe = /^(react|react-dom|dayjs)(\/|$)/;

// ---------------------------------------------------------------------------
// Sandbox: fake consumer project with node_modules/@atomizeui/core → this pkg
// ---------------------------------------------------------------------------
const sandbox = mkdtempSync(join(tmpdir(), 'atomize-treeshake-'));
mkdirSync(join(sandbox, 'node_modules', '@atomizeui'), { recursive: true });
symlinkSync(ROOT, join(sandbox, 'node_modules', '@atomizeui', 'core'), 'dir');

const BARREL_ENTRY = join(sandbox, 'entry-barrel.js');
const SUBPATH_ENTRY = join(sandbox, 'entry-subpath.js');
writeFileSync(BARREL_ENTRY, "import { Button } from '@atomizeui/core';\nconsole.log(Button);\n");
writeFileSync(
  SUBPATH_ENTRY,
  "import { Button } from '@atomizeui/core/components/Button';\nconsole.log(Button);\n"
);

function formatBytes(bytes) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(2)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
}

// ---------------------------------------------------------------------------
// Scenario 1 — webpack + barrel (strict ESM resolution, like Next.js)
// ---------------------------------------------------------------------------
async function runWebpackBarrel() {
  const { default: webpack } = await import('webpack');
  const { default: MiniCssExtractPlugin } = await import('mini-css-extract-plugin');
  const outDir = join(sandbox, 'webpack-out');

  const stats = await new Promise((resolvePromise, reject) => {
    webpack(
      {
        mode: 'production',
        context: sandbox,
        entry: BARREL_ENTRY,
        output: { path: outDir, filename: 'bundle.js' },
        externals: ({ request }, callback) =>
          externalRe.test(request) ? callback(null, 'module ' + request) : callback(),
        experiments: { outputModule: true },
        module: {
          rules: [
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')] },
          ],
        },
        plugins: [new MiniCssExtractPlugin()],
      },
      (err, result) => (err ? reject(err) : resolvePromise(result))
    );
  });

  if (stats.hasErrors()) {
    throw new Error(stats.toString({ errors: true, all: false }));
  }

  return {
    js: statSync(join(outDir, 'bundle.js')).size,
    css: statSync(join(outDir, 'main.css')).size,
  };
}

// ---------------------------------------------------------------------------
// Scenarios 2 & 3 — rollup (Vite production equivalent)
// ---------------------------------------------------------------------------
async function runRollup(entry) {
  const { rollup } = await import('rollup');
  const { default: nodeResolve } = await import('@rollup/plugin-node-resolve');
  const { default: commonjs } = await import('@rollup/plugin-commonjs');

  // CSS modules become a tiny side-effect stub so retention follows the same
  // sideEffects-field semantics Vite applies; original byte size is recorded
  // here and counted only for modules that survive tree-shaking.
  const cssSizes = new Map();
  const cssCollector = {
    name: 'css-collector',
    transform(code, id) {
      if (!id.endsWith('.css')) return null;
      cssSizes.set(id, Buffer.byteLength(code));
      return { code: `globalThis.__atomizeCssBytes = (globalThis.__atomizeCssBytes || 0) + ${cssSizes.get(id)};`, map: null };
    },
  };

  const bundle = await rollup({
    input: entry,
    external: (id) => externalRe.test(id),
    plugins: [cssCollector, nodeResolve({ rootDir: sandbox }), commonjs()],
    onwarn(warning, warn) {
      // "use client" directives are expected in dist output; Rollup drops them.
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    },
  });

  const { output } = await bundle.generate({ format: 'esm' });
  await bundle.close();

  let js = 0;
  let css = 0;
  for (const chunk of output) {
    if (chunk.type !== 'chunk') continue;
    js += Buffer.byteLength(chunk.code);
    for (const [id, mod] of Object.entries(chunk.modules)) {
      if (id.endsWith('.css') && mod.renderedLength > 0) css += cssSizes.get(id) ?? 0;
    }
  }
  return { js, css };
}

// ---------------------------------------------------------------------------
// Scenario 4 — esbuild + barrel (informational)
// ---------------------------------------------------------------------------
async function runEsbuildBarrel() {
  const esbuild = await import('esbuild');
  const result = await esbuild.build({
    entryPoints: [BARREL_ENTRY],
    bundle: true,
    write: false,
    minify: true,
    format: 'esm',
    outdir: join(sandbox, 'esbuild-out'),
    external: ['react', 'react-dom', 'dayjs', 'dayjs/*'],
    logLevel: 'silent', // expected ignored-bare-import warnings — this scenario documents them
  });
  let js = 0;
  let css = 0;
  for (const file of result.outputFiles) {
    if (file.path.endsWith('.css')) css += file.contents.length;
    else if (file.path.endsWith('.js')) js += file.contents.length;
  }
  return { js, css };
}

// ---------------------------------------------------------------------------
// Run all scenarios
// ---------------------------------------------------------------------------
const violations = [];

function check(label, actual, budget) {
  const ok = actual <= budget;
  if (!ok) violations.push({ label, actual, budget });
  return ok ? '✓' : `✗ (>${formatBytes(budget)})`;
}

try {
  console.log('\n🌲  Atomize UI Tree-shaking Report — `import { Button }` only\n');
  console.log('─'.repeat(72));

  const wp = await runWebpackBarrel();
  console.log(`webpack + barrel   (Next.js, primary target)`);
  console.log(
    `  JS  ${formatBytes(wp.js).padStart(9)}   ${check('webpack barrel JS', wp.js, BUDGETS.webpackBarrelJs)}`
  );
  console.log(
    `  CSS ${formatBytes(wp.css).padStart(9)}   ${check('webpack barrel CSS', wp.css, BUDGETS.webpackBarrelCss)}`
  );

  const bar = await runRollup(BARREL_ENTRY);
  console.log(`rollup  + barrel   (Vite production)`);
  console.log(
    `  JS  ${formatBytes(bar.js).padStart(9)}   ${check('rollup barrel JS', bar.js, BUDGETS.rollupBarrelJs)}`
  );
  console.log(
    `  CSS ${formatBytes(bar.css).padStart(9)}   ${check('rollup barrel CSS', bar.css, BUDGETS.rollupBarrelCss)}`
  );

  const sub = await runRollup(SUBPATH_ENTRY);
  console.log(`rollup  + subpath  (per-component imports)`);
  console.log(
    `  JS  ${formatBytes(sub.js).padStart(9)}   ${check('rollup subpath JS', sub.js, BUDGETS.rollupSubpathJs)}`
  );
  console.log(
    `  CSS ${formatBytes(sub.css).padStart(9)}   ${check('rollup subpath CSS', sub.css, BUDGETS.rollupSubpathCss)}`
  );

  const esb = await runEsbuildBarrel();
  console.log(`esbuild + barrel   (informational — documented esbuild limitation)`);
  console.log(`  JS  ${formatBytes(esb.js).padStart(9)}   —`);
  console.log(
    `  CSS ${formatBytes(esb.css).padStart(9)}   — expected: full library CSS (see BUNDLE_GUIDE.md)`
  );

  console.log('─'.repeat(72));
} catch (err) {
  console.error('\n❌  Tree-shaking check failed to bundle:\n');
  console.error(err.message ?? err);
  rmSync(sandbox, { recursive: true, force: true });
  process.exit(1);
}

rmSync(sandbox, { recursive: true, force: true });

if (violations.length > 0) {
  console.error('\n❌  Tree-shaking budget violations:\n');
  for (const v of violations) {
    console.error(`  ${v.label}: ${formatBytes(v.actual)} > ${formatBytes(v.budget)}`);
  }
  console.error();
  process.exit(1);
}

console.log('\n✅  Tree-shaking budgets met.\n');
