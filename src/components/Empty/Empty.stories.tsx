import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Empty } from './Empty';
import { Button } from '../Button';

const meta: Meta<typeof Empty> = {
  title: 'Feedback/Empty',
  component: Empty,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Empty>;

export const Default: Story = {};

export const SimpleImage: Story = {
  args: {
    image: Empty.PRESENTED_IMAGE_SIMPLE,
    description: 'No data',
  },
};

export const CustomDescription: Story = {
  args: { description: 'No results found for your search.' },
};

export const WithAction: Story = {
  render: () => (
    <Empty description="No data available">
      <Button type="primary">Create Now</Button>
    </Empty>
  ),
};

export const NoDescription: Story = {
  args: { description: false },
};

export const CustomImage: Story = {
  args: {
    image: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#ccc" strokeWidth="2" />
        <path d="M20 32h24M32 20v24" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    description: 'No items yet',
  },
};
