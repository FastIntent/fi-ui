import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';
import { Tooltip } from '../Tooltip';
import { Divider } from '../Divider';

// Simple inline SVG icons (no external icon library needed)
const UserIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const DiamondIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 9l10 13L22 9 12 2zm0 3.5L19 9l-7 9.1L5 9l7-3.5z" />
  </svg>
);

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Basic: Story = {
  args: {
    children: 'U',
  },
};

export const Image: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
    alt: 'User Avatar',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar size="small">S</Avatar>
      <Avatar size="default">D</Avatar>
      <Avatar size="large">L</Avatar>
      <Avatar size={64}>64</Avatar>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Avatar shape="circle">C</Avatar>
      <Avatar shape="square">S</Avatar>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 6C7.38071 6 8.5 4.88071 8.5 3.5C8.5 2.11929 7.38071 1 6 1C4.61929 1 3.5 2.11929 3.5 3.5C3.5 4.88071 4.61929 6 6 6Z"
          stroke="white"
          strokeWidth="1"
        />
        <path
          d="M1 10.5C1 8.567 2.567 7 4.5 7H7.5C9.433 7 11 8.567 11 10.5"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: 220 }}>
      {/* 1 — All visible */}
      <AvatarGroup>
        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip title="User" placement="top">
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserIcon />} />
        </Tooltip>
        <Avatar style={{ backgroundColor: '#1677ff' }} icon={<DiamondIcon />} />
      </AvatarGroup>

      <Divider />

      {/* 2 — Max count 2 with overflow counter */}
      <AvatarGroup max={{ count: 2, style: { color: '#f56a00', backgroundColor: '#fde3cf' } }}>
        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip title="User" placement="top">
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserIcon />} />
        </Tooltip>
        <Avatar style={{ backgroundColor: '#1677ff' }} icon={<DiamondIcon />} />
      </AvatarGroup>

      <Divider />

      {/* 3 — Large + max count 2 */}
      <AvatarGroup
        size="large"
        max={{ count: 2, style: { color: '#f56a00', backgroundColor: '#fde3cf' } }}
      >
        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip title="User" placement="top">
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserIcon />} />
        </Tooltip>
        <Avatar style={{ backgroundColor: '#1677ff' }} icon={<DiamondIcon />} />
      </AvatarGroup>

      <Divider />

      {/* 4 — Large + max count 2 + click popover */}
      <AvatarGroup
        size="large"
        max={{
          count: 2,
          style: { color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' },
          popover: { trigger: 'click' },
        }}
      >
        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip title="User" placement="top">
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserIcon />} />
        </Tooltip>
        <Avatar style={{ backgroundColor: '#1677ff' }} icon={<DiamondIcon />} />
      </AvatarGroup>

      <Divider />

      {/* 5 — Square shape */}
      <AvatarGroup shape="square">
        <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>A</Avatar>
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserIcon />} />
        <Avatar style={{ backgroundColor: '#1677ff' }} icon={<DiamondIcon />} />
      </AvatarGroup>
    </div>
  ),
};

export const Initials: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Avatar>U</Avatar>
      <Avatar>USER</Avatar>
      <Avatar>ANTONIO</Avatar>
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Avatar style={{ backgroundColor: '#7265e6' }}>L</Avatar>
      <Avatar style={{ backgroundColor: '#ffbf00' }}>M</Avatar>
      <Avatar style={{ backgroundColor: '#00a2ae' }}>N</Avatar>
    </div>
  ),
};
