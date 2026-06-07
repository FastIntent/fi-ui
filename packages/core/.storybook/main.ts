import type { StorybookConfig } from '@storybook/react-vite';
import type { InlineConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@chromatic-com/storybook'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (viteConfig: InlineConfig) => {
    viteConfig.build ??= {};

    // Storybook's own pre-compiled manager/docs assets land at ~660-890 kB raw
    // (gzip: ~157-275 kB). They come from Storybook internals and cannot be split
    // further. Raise the warning threshold to avoid false positives.
    viteConfig.build.chunkSizeWarningLimit = 1000;

    viteConfig.build.rollupOptions ??= {};
    viteConfig.build.rollupOptions.output ??= {};

    const output = viteConfig.build.rollupOptions.output as Record<string, unknown>;
    output.manualChunks = (id: string) => {
      // rc-picker depends on dayjs and vice-versa (circular). Keep them in one
      // chunk to avoid the "Circular chunk" Rollup warning.
      if (id.includes('dayjs') || id.includes('@rc-component') || /[\\/]rc-[a-z]/.test(id))
        return 'vendor-rc';

      // @dnd-kit (used by Table drag-and-drop stories)
      if (id.includes('@dnd-kit')) return 'vendor-dnd';

      // No catch-all — let Rollup's default algorithm handle React, Storybook
      // core, and everything else naturally.
    };

    return viteConfig;
  },
};
export default config;
