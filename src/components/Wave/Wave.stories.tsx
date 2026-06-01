import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Wave } from './Wave';

const meta: Meta<typeof Wave> = {
  title: 'Utility/Wave',
  component: Wave,
  parameters: {
    docs: {
      description: {
        component:
          'Internal ripple-effect wrapper used by Button, Switch, Checkbox, and Radio. ' +
          'Click the element below to see the wave animation.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Wave>;

export const Default: Story = {
  render: () => (
    <Wave>
      <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Click me</button>
    </Wave>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Wave disabled>
      <button style={{ padding: '8px 16px', cursor: 'not-allowed', opacity: 0.5 }}>
        Disabled (no wave)
      </button>
    </Wave>
  ),
};
