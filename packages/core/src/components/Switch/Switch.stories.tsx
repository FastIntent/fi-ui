import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    size: {
      control: 'radio',
      options: ['default', 'small'],
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    defaultChecked: true,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    defaultChecked: true,
  },
};
