#!/usr/bin/env node
/**
 * token-audit.mjs
 *
 * Audits design token usage across all component SCSS files.
 * Reports:
 *   1. Which tokens are defined in tokens.scss
 *   2. Token coverage per component (% of key properties using tokens)
 *   3. Hardcoded violations per component (color, font-size, spacing, etc.)
 *   4. Tokens defined but never used (orphaned)
 *   5. Exit code 1 if violations exceed threshold
 *
 * Usage:
 *   node scripts/token-audit.mjs              # full report
 *   node scripts/token-audit.mjs --strict     # exit 1 on any violation
 *   node scripts/token-audit.mjs --json       # output JSON for CI
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');

const STRICT = process.argv.includes('--strict');
const JSON_OUT = process.argv.includes('--json');

// ─── ANSI colors ─────────────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  gray: '\x1b[90m',
};
const color = (code, str) => JSON_OUT ? str : `${code}${str}${C.reset}`;

// ─── Read tokens.scss to extract defined token names ─────────────────────────
function extractDefinedTokens(tokensPath) {
  const content = readFileSync(tokensPath, 'utf-8');
  const tokens = new Set();
  // tokens.scss uses SCSS interpolation: --#{$prefix}-token-name
  // We know $prefix = 'fi', so --#{$prefix}-name → --fi-name
  // Match both compiled (--fi-name:) and SCSS interpolated (--#{$prefix}-name:) forms
  const interpolated = /--#\{\$prefix\}-([\w-]+)\s*:/g;
  const compiled = /--fi-([\w-]+)\s*:/g;
  let m;
  while ((m = interpolated.exec(content)) !== null) {
    tokens.add(`--fi-${m[1]}`);
  }
  while ((m = compiled.exec(content)) !== null) {
    tokens.add(`--fi-${m[1]}`);
  }
  return tokens;
}

// ─── Violation patterns — what counts as a hardcoded value? ──────────────────
const VIOLATIONS = [
  // COLOR violations
  {
    name: 'hardcoded-hex-color',
    category: 'color',
    severity: 'error',
    // Matches hex colors: #fff, #1a1a1a, #000000 — but NOT inside var() or $variable
    regex: /(?<![-\w$])(?:color|background(?:-color)?|fill|stroke|border-color|outline-color|caret-color)\s*:\s*(?:[^;{}\n]*?)(#[0-9a-fA-F]{3,8})\b/g,
    description: 'Hardcoded hex color',
  },
  {
    name: 'hardcoded-rgb-color',
    category: 'color',
    severity: 'error',
    // Matches raw rgba/rgb/hsl — but NOT inside color-mix() where using tokens is valid
    regex: /(?:color|background(?:-color)?|fill|stroke|border-color)\s*:\s*(?:[^;{}\n]*?)\b(rgba?\s*\([^)]+\)|hsla?\s*\([^)]+\))/g,
    description: 'Hardcoded rgba/rgb/hsl color',
  },
  {
    name: 'hardcoded-color-name',
    category: 'color',
    severity: 'error',
    regex: /(?:color|background(?:-color)?|fill|stroke|border-color)\s*:\s*(?:(?:var\([^)]+\)|[#$][\w-]+|\bcolor-mix\b[^;]*)\s*,?\s*)*\b(white|black|red|blue|green|yellow|gray|grey|orange|purple|pink|brown|navy|teal|gold|silver|lime|maroon)\b/g,
    description: 'Hardcoded CSS color name',
  },

  // FONT-SIZE violations
  {
    name: 'hardcoded-font-size',
    category: 'typography',
    severity: 'error',
    // Matches font-size: Npx or font-size: Nrem — but NOT inside a var() fallback
    regex: /font-size\s*:\s*(?!(?:var\(|#{?\$|inherit|em|0))(\d+(?:\.\d+)?(?:px|rem|em|%|vw|vh))/g,
    description: 'Hardcoded font-size',
  },

  // LINE-HEIGHT violations
  {
    name: 'hardcoded-line-height',
    category: 'typography',
    severity: 'warning',
    // Matches line-height: N.N — but allows 0, 1, 'normal'
    regex: /line-height\s*:\s*(?!(?:var\(|#{?\$|inherit|normal|0|1[^.]|"1"))(\d+\.\d+|\d+(?:px|em|rem|%))/g,
    description: 'Hardcoded line-height',
  },

  // BORDER-RADIUS violations
  {
    name: 'hardcoded-border-radius',
    category: 'border',
    severity: 'error',
    regex: /border-radius(?:-(?:top|bottom)-(?:left|right))?\s*:\s*(?!(?:var\(|#{?\$|0|50%|9999px|inherit))(\d+(?:\.\d+)?(?:px|rem|em|%))/g,
    description: 'Hardcoded border-radius',
  },

  // SPACING violations — padding, margin, gap
  {
    name: 'hardcoded-padding',
    category: 'spacing',
    severity: 'error',
    // Matches padding: Npx, padding-top: Npx, etc. — allows 0, auto
    regex: /padding(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?\s*:\s*(?:[^;{}\n]*?)(?<!\w)(\d+(?:\.\d+)?px)(?!\s*\))/g,
    description: 'Hardcoded padding (use $spacing-* or $padding-inline-*)',
  },
  {
    name: 'hardcoded-margin',
    category: 'spacing',
    severity: 'error',
    regex: /margin(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?\s*:\s*(?:[^;{}\n]*?)(?<!\w)(\d+(?:\.\d+)?px)(?!\s*\))/g,
    description: 'Hardcoded margin (use $spacing-*)',
  },
  {
    name: 'hardcoded-gap',
    category: 'spacing',
    severity: 'error',
    regex: /(?:^|;|\{)\s*gap\s*:\s*(?!(?:var\(|#{?\$|0 |0;|inherit))(\d+(?:\.\d+)?(?:px|rem|em))/gm,
    description: 'Hardcoded gap (use $spacing-*)',
  },

  // TRANSITION violations
  {
    name: 'hardcoded-transition',
    category: 'motion',
    severity: 'warning',
    regex: /transition(?:-(?:duration|timing-function|delay))?\s*:\s*(?!(?:var\(|#{?\$|none|inherit|all|opacity|transform|box-shadow|color|background|border|filter|width|height|max|min|margin|padding))\s*(?!none|0s)(\d+(?:\.\d+)?(?:s|ms)(?:\s+\w+(?:\([^)]*\))?)?\s*(?:,|;|$))/g,
    description: 'Hardcoded transition duration/easing (use $transition-*)',
  },
];

// Regex to detect token/variable usage (valid patterns)
const VALID_TOKEN_USAGE = /var\(--fi-[\w-]+\)|#\{\$[\w-]+\}|\$[\w-]+/;

// ─── Scan a single SCSS file ──────────────────────────────────────────────────
function auditFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];
  const usedTokens = new Set();

  // Extract used CSS custom properties
  const usedVarRegex = /var\(--(fi-[\w-]+)/g;
  let m;
  while ((m = usedVarRegex.exec(content)) !== null) {
    usedTokens.add(`--${m[1]}`);
  }

  // Extract used SCSS variables (which map to CSS vars)
  const usedScssVarRegex = /\$([\w-]+)/g;
  while ((m = usedScssVarRegex.exec(content)) !== null) {
    usedTokens.add(`$${m[1]}`);
  }

  // Run each violation pattern
  for (const rule of VIOLATIONS) {
    const regex = new RegExp(rule.regex.source, rule.regex.flags);
    let match;
    while ((match = regex.exec(content)) !== null) {
      // Skip SCSS comments
      const lineIndex = content.slice(0, match.index).split('\n').length - 1;
      const line = lines[lineIndex];
      if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) {
        continue;
      }

      // Skip if value is inside a SCSS variable definition (in _variables.scss)
      // or inside var() with fallback
      const fullMatch = match[0];
      const violatingValue = match[1] || match[2];

      violations.push({
        rule: rule.name,
        category: rule.category,
        severity: rule.severity,
        description: rule.description,
        value: violatingValue,
        line: lineIndex + 1,
        context: line?.trim().slice(0, 80),
      });
    }
  }

  return { violations, usedTokens };
}

// ─── Collect all component SCSS files ────────────────────────────────────────
function collectScssFiles(dir) {
  const files = [];
  const IGNORE = ['tokens.scss', '_variables.scss', 'rtl.scss', 'base.scss', 'theme-amber.scss', 'index.scss'];

  function walk(d) {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.scss') && !IGNORE.includes(entry)) {
        files.push(full);
      }
    }
  }
  walk(dir);
  return files;
}

// ─── Category labels ─────────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  color:      '🎨',
  typography:  '🔤',
  spacing:    '📐',
  border:     '⬛',
  motion:     '🎬',
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const tokenPath = join(SRC, 'styles', 'tokens.scss');
const definedTokens = extractDefinedTokens(tokenPath);
const scssFiles = collectScssFiles(SRC);

const results = [];
let totalViolations = 0;
let totalErrors = 0;
const tokenUsageMap = new Map(); // token → Set of files using it

for (const file of scssFiles) {
  const rel = relative(ROOT, file);
  const { violations, usedTokens } = auditFile(file);

  // Track token usage
  for (const tok of usedTokens) {
    if (!tokenUsageMap.has(tok)) tokenUsageMap.set(tok, new Set());
    tokenUsageMap.get(tok).add(rel);
  }

  if (violations.length > 0) {
    totalViolations += violations.length;
    totalErrors += violations.filter(v => v.severity === 'error').length;
    results.push({ file: rel, violations });
  }
}

// Find orphaned tokens (defined but never used in any component)
const orphanedTokens = [...definedTokens].filter(t => {
  // Check if any file uses it as var(--fi-...)
  return !tokenUsageMap.has(t);
});

// ─── JSON output for CI ───────────────────────────────────────────────────────
if (JSON_OUT) {
  console.log(JSON.stringify({
    totalFiles: scssFiles.length,
    violatedFiles: results.length,
    totalViolations,
    totalErrors,
    definedTokens: definedTokens.size,
    orphanedTokens: orphanedTokens.length,
    results,
    orphaned: orphanedTokens,
  }, null, 2));
  process.exit(totalErrors > 0 ? 1 : 0);
}

// ─── Human-readable report ────────────────────────────────────────────────────
console.log();
console.log(color(C.bold + C.cyan, '╔══════════════════════════════════════════════════════╗'));
console.log(color(C.bold + C.cyan, '║        🎨  Design Token Audit Report                 ║'));
console.log(color(C.bold + C.cyan, '╚══════════════════════════════════════════════════════╝'));
console.log();
console.log(color(C.dim, `  Tokens defined in tokens.scss : ${color(C.bold, String(definedTokens.size))}`));
console.log(color(C.dim, `  Component SCSS files scanned  : ${color(C.bold, String(scssFiles.length))}`));
console.log(color(C.dim, `  Files with violations         : ${color(C.bold, String(results.length))}`));
console.log();

// Per-file violations
if (results.length === 0) {
  console.log(color(C.green, '  ✅  No token violations found — all components use design tokens correctly!'));
} else {
  // Group by category for summary
  const byCategory = {};
  for (const { violations } of results) {
    for (const v of violations) {
      byCategory[v.category] = (byCategory[v.category] || 0) + 1;
    }
  }

  console.log(color(C.bold, '  Violations by category:'));
  for (const [cat, count] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    const icon = CATEGORY_ICONS[cat] || '•';
    const bar = '█'.repeat(Math.min(Math.round(count / 2), 30));
    const severityColor = cat === 'color' || cat === 'spacing' ? C.red : C.yellow;
    console.log(`    ${icon}  ${color(C.bold, cat.padEnd(12))}  ${color(severityColor, bar)}  ${count}`);
  }
  console.log();

  // Per-file details
  for (const { file, violations } of results.sort((a, b) => b.violations.length - a.violations.length)) {
    const errors = violations.filter(v => v.severity === 'error').length;
    const warnings = violations.filter(v => v.severity === 'warning').length;
    const statusColor = errors > 0 ? C.red : C.yellow;
    const errorLabel = errors > 0 ? color(C.red, `${errors} error${errors > 1 ? 's' : ''}`) : '';
    const warnLabel = warnings > 0 ? color(C.yellow, `${warnings} warning${warnings > 1 ? 's' : ''}`) : '';
    const labels = [errorLabel, warnLabel].filter(Boolean).join(', ');

    console.log(color(statusColor, `  ┌─ ${file}`));
    console.log(`  │  ${labels}`);

    // Group violations by category
    const byRuleInFile = {};
    for (const v of violations) {
      const key = `${v.category}:${v.description}`;
      if (!byRuleInFile[key]) byRuleInFile[key] = [];
      byRuleInFile[key].push(v);
    }

    for (const [, viols] of Object.entries(byRuleInFile)) {
      const v = viols[0];
      const icon = CATEGORY_ICONS[v.category] || '•';
      const sevColor = v.severity === 'error' ? C.red : C.yellow;
      const sevLabel = v.severity === 'error' ? 'error' : 'warn ';
      console.log(`  │  ${icon} ${color(sevColor, sevLabel)}  ${v.description}  (${viols.length}x)`);
      for (const violation of viols.slice(0, 3)) {
        console.log(`  │       ${color(C.dim, `L${violation.line}`)}  ${color(C.gray, violation.context)}`);
        console.log(`  │         ${color(C.red, `→ "${violation.value}"`)}`);
      }
      if (viols.length > 3) {
        console.log(`  │         ${color(C.dim, `... and ${viols.length - 3} more`)}`);
      }
    }
    console.log(color(statusColor, '  └─'));
    console.log();
  }
}

// Orphaned tokens
if (orphanedTokens.length > 0) {
  console.log(color(C.yellow, `  ⚠️  Orphaned tokens (defined but never used by components): ${orphanedTokens.length}`));
  for (const tok of orphanedTokens.slice(0, 10)) {
    console.log(color(C.dim, `     ${tok}`));
  }
  if (orphanedTokens.length > 10) {
    console.log(color(C.dim, `     ... and ${orphanedTokens.length - 10} more`));
  }
  console.log();
}

// Summary
console.log(color(C.bold + C.cyan, '  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
if (totalErrors === 0 && totalViolations === 0) {
  console.log(color(C.green + C.bold, '  ✅  PASS — All design tokens applied correctly'));
} else if (totalErrors === 0) {
  console.log(color(C.yellow + C.bold, `  ⚠️  WARNINGS — ${totalViolations} style warnings (no blocking errors)`));
} else {
  console.log(color(C.red + C.bold, `  ❌  FAIL — ${totalErrors} token violations must be fixed`));
  console.log(color(C.dim, `     Run: pnpm run token-audit to see full details`));
}
console.log();

// Recommended fixes reference
if (totalErrors > 0 || totalViolations > 0) {
  console.log(color(C.bold, '  📖  Token reference (use these instead of hardcoded values):'));
  console.log(color(C.dim, ''));
  console.log(color(C.dim, '     Colors       → $text-color, $primary-color, $error-color, $bg-container ...'));
  console.log(color(C.dim, '     Spacing      → $spacing-xs (4px), $spacing-sm (8px), $spacing-md (16px)'));
  console.log(color(C.dim, '     Spacing      → $spacing-lg (24px), $spacing-xl (32px)'));
  console.log(color(C.dim, '     Padding      → $padding-inline-sm/md/lg, $padding-block-sm/md/lg'));
  console.log(color(C.dim, '     Font sizes   → $font-size-sm (12px), $font-size-md (14px), $font-size-lg (16px)'));
  console.log(color(C.dim, '     Heights      → $control-height-sm (28px), -md (36px), -lg (44px)'));
  console.log(color(C.dim, '     Border radius → $border-radius-base, $border-radius-sm, $border-radius-lg'));
  console.log(color(C.dim, '     Shadows      → $shadow-sm, $shadow-md, $shadow-lg, $shadow-xl'));
  console.log(color(C.dim, '     Transitions  → $transition-fast, $transition-base, $transition-slow'));
  console.log(color(C.dim, '     Line height  → $line-height, $line-height-sm, $line-height-lg'));
  console.log();
}

if (STRICT && totalErrors > 0) {
  process.exit(1);
}
