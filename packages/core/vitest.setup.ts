import '@testing-library/jest-dom';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import { act, cleanup } from '@testing-library/react';
import type * as JestAxe from 'jest-axe';

const jestAxe = await vi.importActual<typeof JestAxe>('jest-axe');

vi.mock('jest-axe', async () => ({
  ...jestAxe,
  axe: async (...args: Parameters<typeof jestAxe.axe>) => act(async () => jestAxe.axe(...args)),
}));

expect.extend(jestAxe.toHaveNoViolations);

vi.mock('@rc-component/motion', async () => import('./src/utils/test-mocks'));
vi.mock('rc-motion', async () => import('./src/utils/test-mocks'));

// Global mocks for JSDOM/Happy-DOM missing features (browser-only environments)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver which is not available in JSDOM
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;
}

const originalConsoleError = console.error.bind(console);
let unexpectedConsoleMessages: string[] = [];

console.warn = (...args: unknown[]) => {
  unexpectedConsoleMessages.push(`console.warn: ${args.map(String).join(' ')}`);
};

console.error = (...args: unknown[]) => {
  unexpectedConsoleMessages.push(`console.error: ${args.map(String).join(' ')}`);
};

beforeEach(() => {
  unexpectedConsoleMessages = [];
});

afterEach(async () => {
  if (typeof window !== 'undefined') {
    await act(async () => {
      cleanup();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  }

  if (unexpectedConsoleMessages.length > 0) {
    const message = unexpectedConsoleMessages.join('\n\n');
    unexpectedConsoleMessages = [];
    originalConsoleError(message);
    throw new Error(`Unexpected console output during test:\n\n${message}`);
  }
});

// Disable all CSS transitions and animations in JSDOM/Happy-DOM
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    *, *::before, *::after {
      transition: none !important;
      animation-duration: 0s !important;
      animation-delay: 0s !important;
    }
  `;
  document.head.appendChild(style);
}
