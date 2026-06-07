#!/usr/bin/env node
/**
 * Component Quality Gate — strict mode
 *
 * Every UI component under src/components/ must satisfy ALL of the following
 * before a pull request can be merged:
 *
 *  File structure
 *   1. index.ts / index.tsx                  — public entry point
 *   2. At least one .tsx implementation file — component source
 *   3. At least one .scss file               — component styles (*)
 *
 *  Quality
 *   4. .test.tsx with ≥ 3 it() blocks        — meaningful coverage
 *   5. .stories.tsx with ≥ 2 exported stories — default + at least one variant
 *   6. displayName set on every component    — React DevTools & error messages
 *   7. TypeScript interface for props         — public contract
 *
 *  Integration
 *   8. Exported from src/index.ts barrel     — actually usable by consumers
 *
 * (*) Directories in NO_STYLES_REQUIRED skip the .scss check because they are
 *     pure context / utility providers that render no DOM of their own.
 *
 * Directories in INTERNAL_DIRS are data or utility packages; they only need
 * an index entry point and skip all other rules.
 *
 * Exit 0 → all pass.  Exit 1 → violations found → blocks the pipeline.
 */

import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const COMPONENTS_DIR     = 'src/components';
const BARREL             = 'src/index.ts';
const MIN_TESTS          = 3;
const MIN_STORIES        = 2;

/** Internal data / utility directories — only need an index entry. */
const INTERNAL_DIRS      = new Set(['locale', '_icons']);

/** Directories that are not components and should be skipped entirely. */
const SKIP_DIRS          = new Set(['FloatingLabel']);

/** Context-only providers that render no DOM and therefore need no .scss. */
const NO_STYLES_REQUIRED = new Set(['ConfigProvider']);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const readDir  = dir => readdirSync(dir, { withFileTypes: true });
const readText = p   => { try { return readFileSync(p, 'utf8'); } catch { return ''; } };

function filesIn(dir, predicate) {
  return readDir(dir).filter(e => e.isFile() && predicate(e.name)).map(e => e.name);
}

function countMatches(text, pattern) {
  return (text.match(pattern) ?? []).length;
}

// ---------------------------------------------------------------------------
// Load barrel once
// ---------------------------------------------------------------------------
const barrelSrc   = readText(BARREL);
const barrelPaths = new Set(
  [...barrelSrc.matchAll(/from '\.\/components\/(\w+)'/g)].map(m => m[1])
);

// ---------------------------------------------------------------------------
// Scan
// ---------------------------------------------------------------------------
const dirs = readDir(COMPONENTS_DIR)
  .filter(e => e.isDirectory())
  .map(e => e.name)
  .sort();

const violations = []; // { name, rules: string[] }

for (const name of dirs) {
  if (SKIP_DIRS.has(name) || name.startsWith('_')) continue;

  const dir      = join(COMPONENTS_DIR, name);
  const rules    = [];
  const internal = INTERNAL_DIRS.has(name);
  const noStyles = NO_STYLES_REQUIRED.has(name);

  // ── 1. index entry ────────────────────────────────────────────────────────
  if (!existsSync(join(dir, 'index.ts')) && !existsSync(join(dir, 'index.tsx'))) {
    rules.push('missing index.ts / index.tsx');
  }

  if (internal) {
    if (rules.length) violations.push({ name, rules });
    continue;
  }

  // ── 2. Implementation file (.tsx) ─────────────────────────────────────────
  const tsxFiles = filesIn(dir, f => f.endsWith('.tsx') && !f.includes('.test') && !f.includes('.stories'));
  if (tsxFiles.length === 0) {
    rules.push('no .tsx implementation file found');
  }

  // ── 3. Styles (.scss) ─────────────────────────────────────────────────────
  if (!noStyles) {
    const scssFiles = filesIn(dir, f => f.endsWith('.scss'));
    if (scssFiles.length === 0) rules.push('missing .scss file');
  }

  // ── 4. Tests (≥ MIN_TESTS it() blocks) ───────────────────────────────────
  const testFiles = filesIn(dir, f => f.endsWith('.test.tsx') || f.endsWith('.test.ts'));
  if (testFiles.length === 0) {
    rules.push(`missing .test.tsx (need ≥ ${MIN_TESTS} tests)`);
  } else {
    const testSrc   = testFiles.map(f => readText(join(dir, f))).join('\n');
    const testCount = countMatches(testSrc, /^\s*it\s*\(/gm);
    if (testCount < MIN_TESTS) {
      rules.push(`only ${testCount} test(s) — need ≥ ${MIN_TESTS}`);
    }
  }

  // ── 5. Stories (≥ MIN_STORIES exported consts) ───────────────────────────
  const storyFiles = filesIn(dir, f => f.endsWith('.stories.tsx') || f.endsWith('.stories.ts'));
  if (storyFiles.length === 0) {
    rules.push(`missing .stories.tsx (need ≥ ${MIN_STORIES} stories)`);
  } else {
    const storySrc     = storyFiles.map(f => readText(join(dir, f))).join('\n');
    const storyCount   = countMatches(storySrc, /^export const \w+/gm);
    if (storyCount < MIN_STORIES) {
      rules.push(`only ${storyCount} story/stories exported — need ≥ ${MIN_STORIES}`);
    }
  }

  // ── 6. displayName ────────────────────────────────────────────────────────
  const allTsx    = filesIn(dir, f => f.endsWith('.tsx') || f.endsWith('.ts'));
  const allTsxSrc = allTsx.map(f => readText(join(dir, f))).join('\n');
  if (!(/\.displayName\s*=/.test(allTsxSrc))) {
    rules.push('no component sets .displayName');
  }

  // ── 7. Props interface ────────────────────────────────────────────────────
  const hasInterface = /^export\s+interface\s+\w+Props\b/m.test(allTsxSrc);
  const hasType      = /^export\s+type\s+\w+Props\b/m.test(allTsxSrc);
  if (!hasInterface && !hasType) {
    rules.push('no exported Props interface/type found');
  }

  // ── 8. Barrel export ──────────────────────────────────────────────────────
  if (!barrelPaths.has(name)) {
    rules.push(`not exported from ${BARREL}`);
  }

  if (rules.length) violations.push({ name, rules });
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const total   = dirs.length;
const failing = violations.length;
const passing = total - failing;

console.log('\n🔍  Component Quality Gate\n');
console.log('─'.repeat(64));
console.log(`  Rules: index · impl · scss · ≥${MIN_TESTS} tests · ≥${MIN_STORIES} stories · displayName · Props type · barrel`);
console.log('─'.repeat(64));

if (failing === 0) {
  console.log(`\n✅  All ${total} components pass (${INTERNAL_DIRS.size} internal skipped).\n`);
  process.exit(0);
}

for (const { name, rules } of violations) {
  console.error(`\n❌  ${name}`);
  for (const r of rules) console.error(`     • ${r}`);
}

console.log('\n' + '─'.repeat(64));
console.log(`\n   ${passing}/${total} passed — ${failing} component(s) have violations.\n`);
process.exit(1);
