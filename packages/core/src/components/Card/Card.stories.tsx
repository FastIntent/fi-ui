import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Avatar } from '../Avatar/Avatar';
import { Switch } from '../Switch/Switch';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  args: {
    title: 'Default size card',
    style: { width: 300 },
  },
  render: (args) => (
    <Card {...args} extra={<a href="#">More</a>}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  ),
};

export const SmallSize: Story = {
  args: {
    size: 'small',
    title: 'Small size card',
    style: { width: 300 },
  },
  render: (args) => (
    <Card {...args} extra={<a href="#">More</a>}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  ),
};

export const Borderless: Story = {
  args: {
    title: 'Card title',
    bordered: false,
    style: { width: 300, background: '#f5f5f5' },
  },
  render: (args) => (
    <Card {...args}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  ),
};

export const Hoverable: Story = {
  args: {
    title: 'Hoverable Card',
    hoverable: true,
    style: { width: 300 },
  },
  render: (args) => (
    <Card {...args}>
      <p>Hover me to see the shadow effect</p>
    </Card>
  ),
};

const EditIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SettingIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const EllipsisIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

const cardActions = [
  <EditIcon key="edit" />,
  <SettingIcon key="setting" />,
  <EllipsisIcon key="ellipsis" />,
];

export const MetaWithLoading = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Switch checked={!loading} onChange={(checked) => setLoading(!checked)} />
      <Card loading={loading} actions={cardActions} style={{ minWidth: 300 }}>
        <Card.Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
          title="Card title"
          description={
            <>
              <p>This is the description</p>
              <p>This is the description</p>
            </>
          }
        />
      </Card>
      <Card loading={loading} actions={cardActions} style={{ minWidth: 300 }}>
        <Card.Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
          title="Card title"
          description={
            <>
              <p>This is the description</p>
              <p>This is the description</p>
            </>
          }
        />
      </Card>
    </div>
  );
};

MetaWithLoading.storyName = 'Meta + Loading';

export const WithCoverAndActions: Story = {
  args: {
    hoverable: true,
    style: { width: 240 },
  },
  render: (args) => (
    <Card
      {...args}
      cover={
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          style={{ width: '100%', height: 'auto' }}
        />
      }
      actions={[
        <span key="setting">⚙ Setting</span>,
        <span key="edit">✏ Edit</span>,
        <span key="ellipsis">… More</span>,
      ]}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Europe Street beat</div>
      <div style={{ color: '#888' }}>www.instagram.com</div>
    </Card>
  ),
};
