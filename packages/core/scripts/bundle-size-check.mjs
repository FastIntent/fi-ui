#!/usr/bin/env node
/**
 * Atomize UI Bundle Size Governance
 *
 * Measures the size of every artifact in dist/ and enforces hard budgets.
 * Run manually:  node scripts/bundle-size-check.mjs
 * Run in CI:     included in pnpm run size-check
 *
 * Exit code 0 = all budgets met.
 * Exit code 1 = one or more budgets exceeded → blocks the PR.
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { gzipSync } from 'zlib';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const BASELINE_FILE = join(ROOT, 'bundle-baseline.json');
const SHOULD_UPDATE_BASELINE = process.argv.includes('--update-baseline');

// ---------------------------------------------------------------------------
// Budget configuration (raw bytes, before gzip)
// ---------------------------------------------------------------------------
const BUDGETS = {
  // The aggregated CSS file ships with every import. Keep it lean.
  // Increased from 200 KB → 215 KB after migrating all hardcoded values to
  // CSS custom properties (design tokens). Raw size grows because var(--atom-*)
  // is longer than e.g. "8px", but gzip lands at ~28 KB — acceptable.
  // Bumped to 235 KB after adding ImageManager + ImagePickerInput.
  // Bumped to 250 KB after the brand rename: CSS prefix grew from `fi-` (2 chars)
  // to `atom-` (4 chars), so every selector and CSS var token gained ~2 chars.
  // Total raw delta ≈ +12 KB, gzip delta is much smaller thanks to compression.
  'dist/index.css':           250_000, // 250 KB raw
  'dist/design-system.css':    40_000, //  40 KB raw

  // Full barrel bundle (ESM, includes all 45 components + rc-component deps).
  // Gzip lands at ~25 KB — acceptable for a full-import use case.
  'dist/index.js':            100_000, // 100 KB raw

  // Individual component JS chunks — no single chunk should be massive.
  // dist/index.js is the largest at ~80 KB; per-component chunks stay <15 KB.
  '__chunk_max_js__':         100_000, // 100 KB per chunk (raw)

  // Total JS footprint across all .js files (ESM only, no maps).
  // Includes barrel + 45 per-component chunks + design-system.
  '__total_js__':             400_000, // 400 KB raw
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function collectFiles(dir, ext) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectFiles(full, ext));
    else if (entry.isFile() && entry.name.endsWith(ext) && !entry.name.endsWith('.map')) {
      results.push(full);
    }
  }
  return results;
}

function gzipSize(filePath) {
  try {
    return gzipSync(readFileSync(filePath)).length;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(2)} MB`;
  if (bytes >= 1_000)     return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
}

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------
const jsFiles  = collectFiles(DIST, '.js');
const cssFiles = collectFiles(DIST, '.css');

let totalJs = 0;
let maxChunk = 0;
let maxChunkFile = '';
const violations = [];
const report = [];

// Per-file budgets
for (const [relPath, budget] of Object.entries(BUDGETS)) {
  if (relPath.startsWith('__')) continue; // aggregate budgets handled below
  const absPath = join(ROOT, relPath);
  try {
    const size = statSync(absPath).size;
    const gz   = gzipSize(absPath);
    const ok   = size <= budget;
    report.push({ file: relPath, raw: size, gz, budget, ok });
    if (!ok) violations.push({ file: relPath, size, budget });
  } catch {
    report.push({ file: relPath, raw: 0, gz: 0, budget, ok: true, missing: true });
  }
}

// Aggregate JS
for (const f of jsFiles) {
  const size = statSync(f).size;
  totalJs += size;
  if (size > maxChunk) { maxChunk = size; maxChunkFile = f; }
}

if (maxChunk > BUDGETS['__chunk_max_js__']) {
  violations.push({
    file: relative(ROOT, maxChunkFile),
    size: maxChunk,
    budget: BUDGETS['__chunk_max_js__'],
  });
}

if (totalJs > BUDGETS['__total_js__']) {
  violations.push({ file: '(total JS)', size: totalJs, budget: BUDGETS['__total_js__'] });
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log('\n📦  Atomize UI Bundle Size Report\n');
console.log('─'.repeat(72));
console.log(
  'File'.padEnd(48) + 'Raw'.padStart(10) + 'Gzip'.padStart(10) + 'Status'.padStart(8)
);
console.log('─'.repeat(72));

for (const r of report) {
  const status = r.missing ? '⚠  missing' : r.ok ? '✓' : `✗ (>${formatBytes(r.budget)})`;
  console.log(
    r.file.padEnd(48) +
    formatBytes(r.raw).padStart(10) +
    formatBytes(r.gz).padStart(10) +
    ('  ' + status).padStart(8)
  );
}

console.log('─'.repeat(72));
console.log(`Total JS (ESM, no maps):`.padEnd(48) + formatBytes(totalJs).padStart(10));
console.log(
  `Largest chunk:`.padEnd(48) +
  formatBytes(maxChunk).padStart(10) +
  `   ${relative(ROOT, maxChunkFile)}`
);
console.log(`CSS components (individual):`.padEnd(48) + `${cssFiles.length - 2} files`);
console.log('─'.repeat(72));

// ---------------------------------------------------------------------------
// Baseline diff (detect regressions vs last saved baseline)
// ---------------------------------------------------------------------------
let baseline = {};
try { baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf8')); } catch { /* first run */ }

const current = { totalJs, maxChunk, indexCssRaw: statSync(join(DIST, 'index.css')).size };

if (Object.keys(baseline).length > 0) {
  console.log('\n📊  Delta vs baseline\n');
  for (const [key, prev] of Object.entries(baseline)) {
    const curr = current[key] ?? 0;
    const delta = curr - prev;
    const sign  = delta >= 0 ? '+' : '';
    const flag  = Math.abs(delta) > 5_000 ? ' ⚠' : '';
    console.log(`  ${key}: ${formatBytes(prev)} → ${formatBytes(curr)} (${sign}${formatBytes(Math.abs(delta))})${flag}`);
  }
  console.log();
}

if (SHOULD_UPDATE_BASELINE) {
  writeFileSync(BASELINE_FILE, JSON.stringify(current, null, 2));
}

// ---------------------------------------------------------------------------
// Exit
// ---------------------------------------------------------------------------
if (violations.length > 0) {
  console.error('\n❌  Budget violations:\n');
  for (const v of violations) {
    console.error(`  ${v.file}: ${formatBytes(v.size)} > ${formatBytes(v.budget)}`);
  }
  console.error();
  process.exit(1);
} else {
  console.log('\n✅  All budgets met.\n');
  process.exit(0);
}
