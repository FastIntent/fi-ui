#!/usr/bin/env node
/**
 * Post-build barrel generator.
 *
 * Replaces the tsup-bundled dist/index.js and dist/index.cjs with pure
 * re-export barrels so the consumer's bundler (Vite, webpack, etc.) can
 * tree-shake at the per-component level:
 *
 *   import { Button } from '@atomizeui/core'
 *   → only Button's code + its deps land in the consumer's bundle.
 *
 * dist/index.css  → left untouched (already correct from tsup + sass plugin)
 * dist/index.d.ts → left untouched (tsup generates correct type re-exports)
 */

import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const sass = require('sass');

const SOURCE = 'src/index.ts';
const ESM_OUT = 'dist/index.js';
const CJS_OUT = 'dist/index.cjs';

// ---------------------------------------------------------------------------
// Parse export statements from src/index.ts
// ---------------------------------------------------------------------------
// Each entry: { kind: 'star' | 'named', names: string[], path: string }
const exports_list = [];
const seen = new Set();

for (const raw of readFileSync(SOURCE, 'utf8').split('\n')) {
  const line = raw.trim();

  // Skip blank lines, comments, type-only exports, and non-component paths
  if (!line.startsWith('export') || line.startsWith('export type') || !line.includes('from')) continue;

  const pathMatch = line.match(/from '(\.\/components\/\w+)'/);
  if (!pathMatch) continue; // skip style imports and non-component paths

  const compPath = pathMatch[1];

  if (line.startsWith('export *')) {
    const key = `star:${compPath}`;
    if (seen.has(key)) continue; // deduplicate (e.g. Popover appears twice)
    seen.add(key);
    exports_list.push({ kind: 'star', names: [], path: compPath });
  } else {
    // export { A, B, C } from './components/X'
    const namesMatch = line.match(/\{([^}]+)\}/);
    if (!namesMatch) continue;
    const names = namesMatch[1].split(',').map(n => n.trim()).filter(Boolean);
    const key = `named:${compPath}`;
    if (seen.has(key)) continue;
    seen.add(key);
    exports_list.push({ kind: 'named', names, path: compPath });
  }
}

// ---------------------------------------------------------------------------
// ESM barrel
// ---------------------------------------------------------------------------
const esmLines = exports_list.map(({ kind, names, path }) => {
  const resolved = `${path}/index.js`;
  return kind === 'star'
    ? `export * from '${resolved}';`
    : `export { ${names.join(', ')} } from '${resolved}';`;
});

// CRITICAL: the main barrel must NOT carry `"use client"`. With that
// directive, Next.js treats the whole file as a client boundary and
// eagerly evaluates every re-export — tree-shaking is disabled at the
// barrel level. Each component's own `index.js` already carries the
// directive, so the client boundary stays at the right granularity.
const esm = esmLines.join('\n') + '\n';
writeFileSync(ESM_OUT, esm, 'utf8');

// ---------------------------------------------------------------------------
// CJS barrel
// ---------------------------------------------------------------------------
const cjsLines = [
  // CJS barrel intentionally without `"use client"` (same reasoning as
  // the ESM barrel — keep tree-shaking working at the per-export level).
  "'use strict';",
  "Object.defineProperty(exports, '__esModule', { value: true });",
  '',
];

for (const { kind, names, path } of exports_list) {
  const resolved = `${path}/index.cjs`;
  const varName = '_' + path.replace('./components/', '');

  cjsLines.push(`var ${varName} = require('${resolved}');`);

  if (kind === 'star') {
    cjsLines.push(
      `Object.keys(${varName}).forEach(function (k) {`,
      `  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k))`,
      `    exports[k] = ${varName}[k];`,
      `});`,
    );
  } else {
    for (const name of names) {
      cjsLines.push(`exports.${name} = ${varName}.${name};`);
    }
  }
  cjsLines.push('');
}

const cjs = cjsLines.join('\n') + '\n';
writeFileSync(CJS_OUT, cjs, 'utf8');

// ---------------------------------------------------------------------------
// Remove empty chunks produced by esbuild's splitting pass.
// When an entry consists solely of side-effectful SCSS imports (extracted to
// CSS by the sass plugin) the resulting JS chunk is 0 bytes. These files are
// harmless but add noise to the dist output.
//
// IMPORTANT: after deleting empty chunks, strip all `import'../../<chunk>.js'`
// side-effect imports that reference them from per-component entry files.
// Without this step the per-component index.js files still hold a stale import
// to a file that no longer exists, causing Module-not-found errors in webpack.
// ---------------------------------------------------------------------------
const deletedChunks = new Set();
let removed = 0;
for (const file of readdirSync('dist')) {
  if (!file.endsWith('.js') && !file.endsWith('.cjs')) continue;
  const abs = join('dist', file);
  if (statSync(abs).size === 0) {
    unlinkSync(abs);
    deletedChunks.add(file);
    removed++;
  }
}

// Strip imports of deleted chunks from per-component ESM entry files.
if (deletedChunks.size > 0) {
  const COMP_DIR = 'dist/components';
  for (const comp of readdirSync(COMP_DIR)) {
    const jsFile = join(COMP_DIR, comp, 'index.js');
    if (!existsSync(jsFile)) continue;
    let src = readFileSync(jsFile, 'utf8');
    let changed = false;
    for (const chunk of deletedChunks) {
      // Match bare side-effect imports: import'../../chunk-XXXX.js'; (with or without spaces)
      const re = new RegExp(`import\\s*'[^']*${chunk.replace('.', '\\.')}';?`, 'g');
      const next = src.replace(re, '');
      if (next !== src) { src = next; changed = true; }
    }
    if (changed) writeFileSync(jsFile, src, 'utf8');
  }
}

// ---------------------------------------------------------------------------
// CSS deduplication — strip dependency CSS from per-component CSS files.
//
// The bundler (esbuild) merges ALL CSS from the JS import chain into each
// component's index.css.  This means Upload's CSS includes Button + Modal +
// Slider CSS, and Popconfirm's includes Popover + Button.
//
// We fix this by re-compiling each component's SCSS independently (which
// produces only its own styles) and then adding JS imports for CSS
// dependencies so the consumer bundler resolves them through the module graph.
// ---------------------------------------------------------------------------
const COMPONENTS_SRC  = 'src/components';
const COMPONENTS_DIST = 'dist/components';

// 1. Build component cross-dependency map from source TS/TSX imports
const cssDeps = {};  // { compName: [depCompName, ...] }
const allComps = readdirSync(COMPONENTS_SRC).filter(f => {
  const full = join(COMPONENTS_SRC, f);
  return existsSync(full) && statSync(full).isDirectory() && !f.startsWith('_') && !f.startsWith('.');
});

for (const comp of allComps) {
  const dir = join(COMPONENTS_SRC, comp);
  const srcFiles = readdirSync(dir).filter(f =>
    (f.endsWith('.tsx') || f.endsWith('.ts')) &&
    !f.endsWith('.d.ts') &&
    !f.includes('.test.') &&
    !f.includes('.stories.')
  );
  const deps = new Set();

  for (const f of srcFiles) {
    const src = readFileSync(join(dir, f), 'utf8');
    for (const m of src.matchAll(/from\s+['"]\.\.\/(\w+)['"\/]/g)) {
      const dep = m[1];
      if (dep !== comp && allComps.includes(dep) && dep !== 'ConfigProvider' && dep !== 'locale' && dep !== '_icons') {
        // Only count as CSS dep if the dependency has SCSS files
        const depDir = join(COMPONENTS_SRC, dep);
        if (readdirSync(depDir).some(df => df.endsWith('.scss'))) {
          deps.add(dep);
        }
      }
    }
  }

  if (deps.size > 0) cssDeps[comp] = [...deps].sort();
}

// 2. Re-compile each component's own SCSS and replace dist CSS
let cssDeduped = 0;
let cssSaved   = 0;

for (const comp of allComps) {
  const distCSS = join(COMPONENTS_DIST, comp, 'index.css');
  if (!existsSync(distCSS)) continue;

  const srcDir    = join(COMPONENTS_SRC, comp);
  const scssFiles = readdirSync(srcDir).filter(f => f.endsWith('.scss'));
  if (scssFiles.length === 0) continue;

  const originalSize = statSync(distCSS).size;
  let ownCSS = '';

  try {
    for (const f of scssFiles) {
      const result = sass.compile(join(srcDir, f), { style: 'compressed' });
      ownCSS += result.css;
    }
  } catch {
    continue; // SCSS compilation failed — keep original CSS
  }

  // Only replace if it actually saves space (dependency CSS was present)
  if (ownCSS.length < originalSize - 100) {
    writeFileSync(distCSS, ownCSS, 'utf8');
    cssSaved += originalSize - ownCSS.length;
    cssDeduped++;
  }
}

// ---------------------------------------------------------------------------
// Inject CSS imports into per-component ESM entry files.
//
// After this step, a consumer bundler (Vite, Next.js webpack, Turbopack) will
// automatically pull in the component's CSS when the component is imported:
//
//   import { Button } from '@atomizeui/core'
//   → bundler follows Button/index.js → sees `import './index.css'` → done.
//
// For components with CSS dependencies (e.g. Popconfirm → Popover + Button),
// we also inject imports to the dependency CSS files so the consumer gets
// everything they need without duplication.
//
// Only ESM files receive the injection because CSS imports have no meaning in
// Node.js CJS environments (SSR runtime). Browser bundlers handle CSS imports
// from ESM just fine.
// ---------------------------------------------------------------------------
let cssInjected = 0;

for (const comp of readdirSync(COMPONENTS_DIST)) {
  const compDir = join(COMPONENTS_DIST, comp);
  if (!statSync(compDir).isDirectory()) continue;

  const jsFile  = join(compDir, 'index.js');

  if (!existsSync(jsFile)) continue;

  let src = readFileSync(jsFile, 'utf8');

  // Remove stale import to styles/global.js (file does not exist in dist).
  src = src.replace(/import\s*'\.\.\/\.\.\/styles\/global\.js';\n?/g, '');

  // Inject component-specific CSS import.
  const cssFile = join(compDir, 'index.css');
  if (existsSync(cssFile) && !src.includes("import'./index.css'")) {
    src = `import'./index.css';\n` + src;
    cssInjected++;
  }

  // Inject dependency CSS imports so transitive CSS loads through the module graph.
  const deps = cssDeps[comp];
  if (deps) {
    for (const dep of deps) {
      const depCSSImport = `import'../${dep}/index.css';`;
      if (!src.includes(depCSSImport)) {
        const depCSSFile = join(COMPONENTS_DIST, dep, 'index.css');
        if (existsSync(depCSSFile)) {
          src = depCSSImport + '\n' + src;
        }
      }
    }
  }

  writeFileSync(jsFile, src, 'utf8');
}

// ---------------------------------------------------------------------------
// Inject CSS imports into the per-component shared chunk.
//
// THE BUG: Turbopack (and esbuild bundlers) optimize named re-exports by
// inlining the resolution. When a consumer writes:
//
//   import { Switch } from '@atomizeui/core/components/Switch'
//
// Turbopack jumps straight from the consumer's source to the anonymous
// chunk `dist/chunk-KMO43BST.js` that contains Switch's implementation,
// silently skipping `dist/components/Switch/index.js` — the only file
// where `import './index.css'` lives. The CSS side-effect is dropped.
//
// THE FIX: inject the CSS import into the implementation chunk itself.
// Each component lives in its own dedicated chunk (one chunk = one
// component, established by inspecting the `export{X}from'chunk-Y.js'`
// pattern in barrels). So we only inject ONE component's CSS into ONE
// chunk — no duplication, no leaking styles between components.
//
// We KEEP the side-effect imports in the component barrels too as
// fallback for bundlers that don't inline re-exports (older webpack,
// Vite SSR, etc.).
// ---------------------------------------------------------------------------
const chunkToComponent = {}; // 'chunk-XXX.js' → 'Switch'

for (const comp of readdirSync(COMPONENTS_DIST)) {
  const jsFile = join(COMPONENTS_DIST, comp, 'index.js');
  if (!existsSync(jsFile)) continue;
  const src = readFileSync(jsFile, 'utf8');

  // Match: export{a as Switch,b as Other}from'../../chunk-KMO43BST.js'
  // The chunk in the FIRST `from'../../chunk-X.js'` after an `export{}` block
  // is the implementation chunk.
  const m = src.match(/export\s*\{[^}]+\}\s*from\s*'\.\.\/\.\.\/(chunk-[A-Z0-9]+\.js)'/);
  if (!m) continue;
  const chunkFile = m[1];
  // First-wins: if two components map to the same chunk (rare with
  // splitting:true) we'd flag it — but each component has its own
  // dedicated chunk in this setup.
  if (!chunkToComponent[chunkFile]) {
    chunkToComponent[chunkFile] = comp;
  }
}

let chunkInjected = 0;
for (const [chunkFile, comp] of Object.entries(chunkToComponent)) {
  const full = join('dist', chunkFile);
  if (!existsSync(full)) continue;
  const cssFile = join(COMPONENTS_DIST, comp, 'index.css');
  if (!existsSync(cssFile)) continue;
  // Relative path from dist/chunk-X.js → dist/components/Comp/index.css
  const cssImport = `import'./components/${comp}/index.css';`;
  let src = readFileSync(full, 'utf8');
  if (src.includes(cssImport)) continue;

  // Insert after the "use client" directive if present
  if (src.startsWith('"use client"')) {
    const firstNL = src.indexOf('\n');
    src = src.slice(0, firstNL + 1) + cssImport + '\n' + src.slice(firstNL + 1);
  } else {
    src = cssImport + '\n' + src;
  }
  writeFileSync(full, src, 'utf8');
  chunkInjected++;
}

// ---------------------------------------------------------------------------
// Inject `"use client"` directive into every component entry and shared chunk.
//
// Required by the Next.js App Router: any module that uses React hooks,
// browser APIs, or event handlers must declare itself a Client Component.
// Without this directive, importing @atomizeui/core from a Server Component
// page (the default in App Router) throws:
//
//   You're importing a module that depends on `useState` into a React
//   Server Component module.
//
// Excluded — these are not interactive React code:
//   - dist/server/**        (Node-only filesystem adapters)
//   - dist/design-system.*  (token script, no React)
//   - dist/styles/**        (raw CSS or empty placeholders)
// ---------------------------------------------------------------------------
const DIRECTIVE = '"use client";';
let directiveInjected = 0;

function injectDirective(filePath) {
  if (!existsSync(filePath)) return false;
  const src = readFileSync(filePath, 'utf8');
  if (src.startsWith('"use client"') || src.startsWith("'use client'")) return false;
  writeFileSync(filePath, DIRECTIVE + '\n' + src, 'utf8');
  return true;
}

function shouldInject(relPath) {
  // Server adapters run in Node — never client.
  if (relPath.startsWith('dist/server/')) return false;
  // Raw CSS / SCSS outputs.
  if (relPath.startsWith('dist/styles/')) return false;
  // Only JS modules — skip declarations, sourcemaps, css.
  if (!relPath.endsWith('.js') && !relPath.endsWith('.cjs')) return false;
  // index.js / index.cjs already received the directive above.
  if (relPath === ESM_OUT || relPath === CJS_OUT) return false;
  return true;
}

function walkAndInject(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndInject(full);
    } else if (shouldInject(full)) {
      if (injectDirective(full)) directiveInjected++;
    }
  }
}

walkAndInject('dist');

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log(`✓ barrel  ${ESM_OUT}  (${esm.length} B, ${exports_list.length} modules)`);
console.log(`✓ barrel  ${CJS_OUT} (${cjs.length} B, ${exports_list.length} modules)`);
if (cssDeduped > 0) console.log(`✓ css     deduped ${cssDeduped} component CSS files (saved ${(cssSaved / 1024).toFixed(1)} KB)`);
if (cssInjected > 0) console.log(`✓ css     injected CSS import into ${cssInjected} component entries`);
if (chunkInjected > 0) console.log(`✓ css     injected CSS import into ${chunkInjected} implementation chunks (Turbopack inline-re-export workaround)`);
if (directiveInjected > 0) console.log(`✓ "use client" injected into ${directiveInjected} client-side modules`);
if (removed > 0) console.log(`✓ removed ${removed} empty chunk(s)`);
