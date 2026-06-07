import type { Preview } from '@storybook/react';
import React, { useEffect } from 'react';
import { ConfigProvider } from '../src/components/ConfigProvider';
import { DEFAULT_PREFIX } from '../src/components/ConfigProvider/prefix';
import '../src/styles/index.scss';
import './docs-overrides.css';

const tokenVar = (token: string) => `var(--${DEFAULT_PREFIX}-${token})`;

// Map Storybook themes to ConfigProvider overrides
const themes = {
  light: {},
  dark: {
    common: {
      bgColorLayout: '#000000',
      bgColorContainer: '#141414',
      textColor: 'rgba(255, 255, 255, 0.85)',
      borderColor: '#303030',
      borderColorSecondary: '#202020',
    },
  },
  blue: {
    common: {
      primaryColor: '#1677ff',
    },
  },
  emerald: {
    common: {
      primaryColor: '#10b981',
      borderRadius: '6px',
    },
  },
  royal: {
    common: {
      primaryColor: '#7c3aed',
      borderRadius: '0px',
    },
  },
  sunset: {
    common: {
      primaryColor: '#f97316',
      borderRadius: '24px',
    },
  },
  ocean: {
    common: {
      primaryColor: '#06b6d4',
      borderRadius: '8px',
    },
  },
  vibrant: {
    common: {
      primaryColor: '#eb2f96',
      borderRadius: '12px',
      successColor: '#b7eb8f',
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', icon: 'sun', title: 'Light Default (Green)' },
          { value: 'dark', icon: 'moon', title: 'Dark Mode' },
          { value: 'blue', icon: 'circle', title: 'Classic Blue' },
          { value: 'emerald', icon: 'leaf', title: 'Emerald Green' },
          { value: 'royal', icon: 'starhollow', title: 'Royal Purple (Sharp)' },
          { value: 'sunset', icon: 'sun', title: 'Sunset Orange (Rounded)' },
          { value: 'ocean', icon: 'component', title: 'Ocean Teal' },
          { value: 'vibrant', icon: 'heart', title: 'Vibrant Pink' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeKey = context.globals.theme || 'light';

      useEffect(() => {
        // Only 'dark' gets data-theme="dark" so our [data-theme='dark'] CSS applies.
        // All other themes (including light variants like emerald/royal) get data-theme="light"
        // so the OS dark-mode media query (@media prefers-color-scheme: dark :root:not([data-theme='light']))
        // never overrides a consciously selected light theme in Storybook.
        if (themeKey === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }, [themeKey]);

      return (
        <ConfigProvider theme={themes[themeKey as keyof typeof themes]}>
          <div
            style={{
              padding: '48px',
              background: tokenVar('color-bg-layout'),
              minWidth: '400px',
              minHeight: '200px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              border: `1px solid ${tokenVar('color-border-secondary')}`,
            }}
          >
            <Story />
          </div>
        </ConfigProvider>
      );
    },
  ],
};

export default preview;
