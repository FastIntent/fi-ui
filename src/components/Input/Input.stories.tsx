import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input, TextArea } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'middle', 'small'],
    },
    status: {
      control: 'select',
      options: ['error', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Basic usage',
    style: { width: 300 },
  },
};

export const WithPrefix: Story = {
  args: {
    prefix: '👤',
    placeholder: 'Username',
    style: { width: 300 },
  },
};

export const WithSuffix: Story = {
  args: {
    suffix: '.com',
    placeholder: 'Domain',
    style: { width: 300 },
  },
};

export const Clearable: Story = {
  args: {
    allowClear: true,
    defaultValue: 'Hello World',
    style: { width: 300 },
  },
};

export const ErrorStatus: Story = {
  args: {
    status: 'error',
    placeholder: 'Error status',
    style: { width: 300 },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    style: { width: 300 },
  },
};

export const TextAreaStory = {
  name: 'TextArea',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 620 }}>
      <TextArea placeholder="with showCount and maxLength" showCount maxLength={20} rows={1} />
      <TextArea placeholder="can resize" showCount maxLength={100} rows={3} />
      <TextArea placeholder="disable resize" showCount maxLength={100} resize={false} rows={5} />
      <TextArea placeholder="autoSize (min 2, max 5 rows)" autoSize={{ minRows: 2, maxRows: 5 }} />
      <TextArea placeholder="error status" status="error" rows={3} />
      <TextArea placeholder="disabled" disabled rows={3} />
    </div>
  ),
};
