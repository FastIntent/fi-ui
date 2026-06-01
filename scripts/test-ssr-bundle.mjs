/**
 * SSR Bundle Test Script
 * Tests that components from the built CJS bundle render correctly in Node.js
 * without any DOM environment (no window, document, or navigator).
 *
 * Usage: node scripts/test-ssr-bundle.mjs
 * Prerequisite: Run `pnpm build` first to generate the dist/index.cjs bundle.
 */

import { renderToString } from 'react-dom/server';
import React from 'react';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Import components from the built CJS bundle
let components;
try {
  components = require('../dist/index.cjs');
} catch (err) {
  console.error('Failed to load dist/index.cjs. Did you run `pnpm build`?');
  console.error(err.message);
  process.exit(1);
}

const { Button, Input, Alert, Badge, Tag, Card, Avatar } = components;

const tests = [
  {
    name: 'Button',
    render: () =>
      renderToString(React.createElement(Button, { type: 'primary' }, 'Click me')),
    validate: (html) => html.includes('Click me'),
  },
  {
    name: 'Input',
    render: () =>
      renderToString(React.createElement(Input, { placeholder: 'Enter text' })),
    validate: (html) => html.length > 0,
  },
  {
    name: 'Alert',
    render: () =>
      renderToString(React.createElement(Alert, { type: 'info', message: 'Hello World' })),
    validate: (html) => html.includes('Hello World'),
  },
  {
    name: 'Badge',
    render: () =>
      renderToString(React.createElement(Badge, { count: 5 }, 'Item')),
    validate: (html) => html.length > 0,
  },
  {
    name: 'Tag',
    render: () =>
      renderToString(React.createElement(Tag, { color: 'blue' }, 'Tag Text')),
    validate: (html) => html.includes('Tag Text'),
  },
  {
    name: 'Card',
    render: () =>
      renderToString(React.createElement(Card, { title: 'Card Title' }, 'Card Content')),
    validate: (html) => html.includes('Card Title') && html.includes('Card Content'),
  },
  {
    name: 'Avatar',
    render: () =>
      renderToString(React.createElement(Avatar, { size: 'default' }, 'A')),
    validate: (html) => html.length > 0,
  },
];

let passed = 0;
let failed = 0;

console.log('Running SSR bundle tests in Node.js (no DOM)...\n');

for (const test of tests) {
  try {
    const html = test.render();

    if (typeof html !== 'string') {
      throw new Error(`renderToString did not return a string, got: ${typeof html}`);
    }

    if (!html) {
      throw new Error('renderToString returned an empty string');
    }

    if (test.validate && !test.validate(html)) {
      throw new Error(`Validation failed. HTML: ${html.slice(0, 200)}`);
    }

    console.log(`  PASS  ${test.name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL  ${test.name}: ${err.message}`);
    failed++;
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${tests.length} tests`);

if (failed > 0) {
  console.error('\nSome SSR tests failed. Fix the issues above before shipping.');
  process.exit(1);
} else {
  console.log('\nAll SSR bundle tests passed!');
  process.exit(0);
}
