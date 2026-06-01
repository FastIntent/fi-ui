import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Basic: Story = {
  args: {
    defaultCurrent: 1,
    total: 50,
  },
};

export const More: Story = {
  args: {
    defaultCurrent: 6,
    total: 500,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    total: 50,
  },
};

export const AlignCenter: Story = {
  args: {
    align: 'center',
    total: 50,
  },
};

export const AlignEnd: Story = {
  args: {
    align: 'end',
    total: 50,
  },
};

export const Simple: Story = {
  args: {
    simple: true,
    defaultCurrent: 2,
    total: 50,
  },
};

export const ShowTotal: Story = {
  args: {
    total: 85,
    showTotal: (total) => `Total ${total} items`,
    defaultPageSize: 20,
    defaultCurrent: 1,
  },
};
