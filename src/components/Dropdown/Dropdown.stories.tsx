import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { Menu, MenuItem, Divider } from '../Menu/Menu';
import { Button } from '../Button/Button';
import { SpaceWithCompact as Space } from '../Space/Space';
import { Tooltip } from '../Tooltip/Tooltip';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    trigger: {
      control: { type: 'check' },
      options: ['click', 'hover', 'contextMenu'],
    },
    placement: {
      control: { type: 'select' },
      options: ['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const menu = (
  <Menu>
    <MenuItem key="1">1st menu item</MenuItem>
    <MenuItem
      key="2"
      icon={
        <span role="img" aria-label="smile">
          😊
        </span>
      }
      disabled
    >
      2nd menu item (disabled)
    </MenuItem>
    <MenuItem key="3" disabled>
      3rd menu item (disabled)
    </MenuItem>
    <Divider />
    <MenuItem key="4" danger>
      a danger item
    </MenuItem>
  </Menu>
);

export const Basic: Story = {
  args: {
    placement: 'bottomLeft',
  },
  render: (args) => (
    <Dropdown {...args} overlay={menu}>
      <Button type="primary">Hover me</Button>
    </Dropdown>
  ),
};

export const Trigger: Story = {
  args: {
    trigger: ['click'],
    placement: 'bottomLeft',
  },
  render: (args) => (
    <Dropdown {...args} overlay={menu}>
      <Button>Click me</Button>
    </Dropdown>
  ),
};

// Icons as simple SVGs
const EllipsisIcon = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
    <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3C356 643.1 431 612 512 612c81 0 156 31.1 210.2 85.1C776.1 751.3 807 823.6 809 900.8c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.8z" />
  </svg>
);

const DownIcon = () => (
  <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
    <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
  </svg>
);

const dropdownMenu = (
  <Menu>
    <MenuItem key="1" icon={<UserIcon />}>
      1st menu item
    </MenuItem>
    <MenuItem key="2" icon={<UserIcon />}>
      2nd menu item
    </MenuItem>
    <MenuItem key="3" icon={<UserIcon />} danger>
      3rd menu item
    </MenuItem>
    <MenuItem key="4" icon={<UserIcon />} danger disabled>
      4th menu item
    </MenuItem>
  </Menu>
);

export const ButtonDropdown: Story = {
  name: 'Button Dropdown',
  render: () => (
    <Space wrap size="middle">
      <Space.Compact>
        <Button>Dropdown</Button>
        <Dropdown overlay={dropdownMenu} trigger={['click']} placement="bottomRight">
          <Button icon={<EllipsisIcon />} />
        </Dropdown>
      </Space.Compact>

      <Space.Compact>
        <Button>Dropdown</Button>
        <Dropdown overlay={dropdownMenu} trigger={['click']} placement="bottomRight">
          <Button icon={<UserIcon />} />
        </Dropdown>
      </Space.Compact>

      <Space.Compact>
        <Button disabled>Dropdown</Button>
        <Dropdown overlay={dropdownMenu} trigger={['click']} placement="bottomRight" disabled>
          <Button icon={<EllipsisIcon />} disabled />
        </Dropdown>
      </Space.Compact>

      <Space.Compact>
        <Tooltip title="tooltip">
          <Button>With Tooltip</Button>
        </Tooltip>
        <Dropdown overlay={dropdownMenu} trigger={['click']} placement="bottomRight">
          <Button loading />
        </Dropdown>
      </Space.Compact>

      <Dropdown overlay={dropdownMenu} trigger={['click']}>
        <Button suffixIcon={<DownIcon />}>Button</Button>
      </Dropdown>

      <Space.Compact>
        <Button danger>Danger</Button>
        <Dropdown overlay={dropdownMenu} trigger={['click']} placement="bottomRight">
          <Button icon={<EllipsisIcon />} danger />
        </Dropdown>
      </Space.Compact>
    </Space>
  ),
};

export const Placement: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', padding: '100px' }}>
      <Dropdown overlay={menu} placement="bottomLeft">
        <Button>bottomLeft</Button>
      </Dropdown>
      <Dropdown overlay={menu} placement="topLeft">
        <Button>topLeft</Button>
      </Dropdown>
    </div>
  ),
};
