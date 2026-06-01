import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageContainer } from './PageContainer';
import { Button } from '../Button';

const meta: Meta<typeof PageContainer> = {
  title: 'Components/Layout/PageContainer',
  component: PageContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageContainer>;

export const Default: Story = {
  args: {
    title: 'Dashboard Overview',
    description: 'Monitor your system performance and user activity in real-time.',
    children: (
      <div
        style={{
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          minHeight: '200px',
        }}
      >
        Sample Content inside PageContainer
      </div>
    ),
  },
};

export const WithExtra: Story = {
  args: {
    ...Default.args,
    extra: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button size="middle">Filter</Button>
        <Button size="middle" type="primary">
          Create New
        </Button>
      </div>
    ),
  },
};

export const OnlyTitle: Story = {
  args: {
    title: 'Just a Title',
    children: 'No extra header information.',
  },
};

export const CustomClassName: Story = {
  args: {
    ...Default.args,
    className: 'custom-page-container',
  },
};
