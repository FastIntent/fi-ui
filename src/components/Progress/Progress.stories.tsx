import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';
import { Space } from '../Space/Space';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    percent: 30,
  },
};

export const Active: Story = {
  args: {
    percent: 50,
    active: true,
  },
};

export const Success: Story = {
  args: {
    percent: 100,
  },
};

export const Exception: Story = {
  args: {
    percent: 70,
    status: 'exception',
  },
};

export const Circle: Story = {
  args: {
    type: 'circle',
    percent: 75,
  },
};

export const CustomFormat: Story = {
  args: {
    type: 'circle',
    percent: 100,
    format: () => 'Done',
  },
};

export const Dashboard = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Progress percent={30} />
    <Progress percent={50} status="active" />
    <Progress percent={70} status="exception" />
    <Progress percent={100} />
    <div style={{ display: 'flex', gap: 16 }}>
      <Progress type="circle" percent={75} />
      <Progress type="circle" percent={100} />
      <Progress type="circle" percent={70} status="exception" />
    </div>
  </Space>
);
