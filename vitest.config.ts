import { defineConfig } from 'vitest/config';
import path from 'node:path';

const motionMockPath = path.resolve(__dirname, './src/utils/test-mocks.tsx');

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    environmentMatchGlobs: [['src/**/*.node.test.tsx', 'node']],
    setupFiles: ['./vitest.setup.ts'],
    passWithNoTests: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    server: {
      deps: {
        inline: [/^@rc-component\//, /^rc-/],
      },
    },
  },
  resolve: {
    alias: [
      { find: /^rc-motion(\/.*)?$/, replacement: motionMockPath },
      { find: /^@rc-component\/motion(\/.*)?$/, replacement: motionMockPath },
    ],
  },
});
