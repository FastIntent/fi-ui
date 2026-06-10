import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Menu, SubMenu, MenuItem } from './Menu';
import { ItemGroup, Divider } from './index';
import { Button } from '../Button';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Menu>;

// Simple inline SVG icons (no external dependencies)
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const AppstoreIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
  </svg>
);

const SettingIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

const commonItems = [
  <MenuItem icon={<MailIcon />} key="sub1" title="Navigation One" />,
  <SubMenu icon={<AppstoreIcon />} key="sub2" title="Navigation Two">
    <MenuItem key="5">Option 5</MenuItem>
    <MenuItem key="6">Option 6</MenuItem>
    <SubMenu key="sub3" title="Submenu">
      <MenuItem key="7">Option 7</MenuItem>
      <MenuItem key="8">Option 8</MenuItem>
    </SubMenu>
  </SubMenu>,
  <Divider key="divider" />,
  <SubMenu icon={<SettingIcon />} key="sub4" title="Navigation Three">
    <MenuItem key="9">Option 9</MenuItem>
    <MenuItem key="10">Option 10</MenuItem>
    <ItemGroup key="g3" title="Group">
      <MenuItem key="13">Option 13</MenuItem>
      <MenuItem key="14">Option 14</MenuItem>
    </ItemGroup>
  </SubMenu>,
];

export const Horizontal: Story = {
  render: () => (
    <div style={{ marginBottom: 100 }}>
      <Menu mode="horizontal" defaultSelectedKeys={['1']}>
        {commonItems}
      </Menu>
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <div style={{ width: 256 }}>
      <Menu sidebar={true} mode="inline" defaultOpenKeys={['sub1']} defaultSelectedKeys={['1']}>
        {commonItems}
      </Menu>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ width: 256 }}>
      <Menu mode="vertical" defaultSelectedKeys={['1']}>
        {commonItems}
      </Menu>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div style={{ width: 256 }}>
      <Menu sidebar={true} mode="inline" multiple defaultSelectedKeys={['1', '2']}>
        {commonItems}
      </Menu>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [openKeys, setOpenKeys] = React.useState(['sub1']);

    return (
      <div style={{ width: 256 }}>
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setOpenKeys([])}>Close All</button>
          <button onClick={() => setOpenKeys(['sub1', 'sub2'])}>Open 1 & 2</button>
        </div>
        <Menu
          sidebar={true}
          mode="inline"
          openKeys={openKeys}
          onOpenChange={(keys: string[]) => setOpenKeys(keys)}
        >
          {commonItems}
        </Menu>
      </div>
    );
  },
};

export const InlineCollapsed: Story = {
  render: () => {
    const [collapsed, setCollapsed] = React.useState(true);

    return (
      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <Button onClick={() => setCollapsed(!collapsed)} style={{ marginBottom: 16 }}>
            Toggle Collapse
          </Button>
          <div style={{ width: collapsed ? 80 : 256, transition: 'width 0.3s' }}>
            <Menu
              sidebar={true}
              mode="inline"
              inlineCollapsed={collapsed}
              defaultSelectedKeys={['1']}
            >
              <SubMenu key="sub_no_icon" title="No Icon Menu">
                <MenuItem key="ni1">Option A</MenuItem>
                <MenuItem key="ni2">Option B</MenuItem>
              </SubMenu>
              {commonItems}
            </Menu>
          </div>
        </div>
      </div>
    );
  },
};
