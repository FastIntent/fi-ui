import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';
import { PageContainer } from './PageContainer';
import { Button } from '../Button';

// ─────────────────────────────────────────────
// Mock Data & Icons
// ─────────────────────────────────────────────

const IconPie = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);

const IconUsers = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconFile = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const menuData = [
  {
    key: 'g1',
    label: 'GENERAL',
    type: 'group' as const,
    children: [
      { key: 'dashboard', label: 'Dashboard', icon: <IconPie /> },
      { key: 'projects', label: 'Projects', icon: <IconFile /> },
    ],
  },
  {
    key: 'g2',
    label: 'ADMINISTRATION',
    type: 'group' as const,
    children: [
      { key: 'users', label: 'Users', icon: <IconUsers /> },
      {
        key: 'tasks',
        label: 'Tasks',
        icon: <IconFile />,
        extra: (
          <span
            style={{
              padding: '0 8px',
              borderRadius: '4px',
              background: '#f0f0f0',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            12
          </span>
        ),
      },
    ],
  },
];

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Default: Story = {
  args: {
    title: 'Fast Admin Storybook',
    logo: (
      <div
        style={{
          width: 24,
          height: 24,
          background: '#006aff',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
          paddingLeft: 8,
        }}
      >
        F
      </div>
    ),
    menuData: menuData,
    userInfo: {
      name: 'Jane Smith',
      avatar: (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          JS
        </div>
      ),
    },
    footerRender: '© 2024 Fast UI Layout Component',
    children: (
      <PageContainer
        title="Welcome to Storybook"
        description="This is the Layout component integrated with PageContainer."
        extra={<Button type="primary">Action Button</Button>}
      >
        <div
          style={{
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #f0f0f0',
            minHeight: '60vh',
          }}
        >
          <h3>Content Area</h3>
          <p>
            This layout is fully responsive and supports sidebar collapse, mobile drawer, and
            themes.
          </p>
        </div>
      </PageContainer>
    ),
  },
};

export const Collapsed: Story = {
  args: {
    ...Default.args,
    defaultCollapsed: true,
  },
};

export const NoSearch: Story = {
  args: {
    ...Default.args,
    showSearch: false,
  },
};

export const CustomHeaderRight: Story = {
  args: {
    ...Default.args,
    headerRight: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button size="small">Custom 1</Button>
        <Button size="small" type="primary">
          Custom 2
        </Button>
      </div>
    ),
  },
};

export const MobileView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
