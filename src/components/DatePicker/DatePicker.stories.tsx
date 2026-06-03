import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'middle', 'large'],
    },
    status: {
      control: { type: 'select' },
      options: ['', 'error', 'warning'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    placeholder: 'Select date',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <DatePicker size="small" placeholder="Small" />
      <DatePicker size="middle" placeholder="Middle" />
      <DatePicker size="large" placeholder="Large" />
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <DatePicker status="error" placeholder="Error" />
      <DatePicker status="warning" placeholder="Warning" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled',
  },
};

export const ForcedOpen: Story = {
  args: {
    open: true,
    placeholder: 'Always open',
  },
};

import { RangePicker } from './index';

export const Range: StoryObj<typeof RangePicker> = {
  render: () => (
    <div>
      <RangePicker />
    </div>
  ),
};
