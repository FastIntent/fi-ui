import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { Space } from '../Space/Space';
import { Avatar } from '../Avatar/Avatar';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: () => (
    <Space size="large">
      <Badge count={5}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={0} showZero>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={100}>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge dot>
        <Avatar shape="square" size="large" />
      </Badge>
    </Space>
  ),
};

export const Status: Story = {
  render: () => (
    <Space direction="vertical">
      <Badge status="success" text="Success" />
      <Badge status="error" text="Error" />
      <Badge status="default" text="Default" />
      <Badge status="processing" text="Processing" />
      <Badge status="warning" text="Warning" />
    </Space>
  ),
};

export const Colors: Story = {
  render: () => (
    <Space direction="vertical">
      <Badge color="#f50" text="#f50" />
      <Badge color="purple" text="purple" />
      <Badge color="cyan" text="cyan" />
      <Badge color="gold" text="gold" />
    </Space>
  ),
};

export const Overflow: Story = {
  args: {
    count: 1000,
    overflowCount: 99,
    children: <Avatar shape="square" size="large" />,
  },
};

// Inline SVG icons for the pill story
const UserIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const Pills: Story = {
  render: () => (
    <Space size="middle" align="center">
      {/* Filled with icon + count */}
      <Badge count={11} color="#fa8c16" icon={<UserIcon />} />
      {/* Filled count only */}
      <Badge count={25} color="#f5222d" />
      {/* Outline with icon only */}
      <Badge color="#8c8c8c" variant="outline" icon={<ClockIcon />} />
      {/* Filled with overflow */}
      <Badge count={100} overflowCount={99} color="#52c41a" />
    </Space>
  ),
};
