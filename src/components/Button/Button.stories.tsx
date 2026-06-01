import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Radio } from '../Radio/Radio';
import { Space } from '../Space/Space';
import { Divider } from '../Divider/Divider';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'dashed', 'link', 'text', 'danger'],
    },
    size: {
      control: 'select',
      options: ['large', 'middle', 'small'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    type: 'primary',
    children: 'Primary Button',
  },
};

export const Default: Story = {
  args: {
    children: 'Default Button',
  },
};

export const Danger: Story = {
  args: {
    type: 'primary',
    danger: true,
    children: 'Danger Button',
  },
};

export const Loading: Story = {
  args: {
    type: 'primary',
    loading: true,
    children: 'Loading...',
  },
};

export const Block: Story = {
  args: {
    type: 'primary',
    block: true,
    children: 'Block Button',
  },
  parameters: {
    layout: 'padded',
  },
};

const ExampleIcon = () => (
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
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  </svg>
);

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button type="primary" shape="circle" prefixIcon={<ExampleIcon />} />
      <Button type="default" shape="circle" prefixIcon={<ExampleIcon />} />
      <Button type="dashed" shape="circle" prefixIcon={<ExampleIcon />} />
      <Button type="link" shape="circle" prefixIcon={<ExampleIcon />} />
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button type="primary" prefixIcon={<ExampleIcon />} />
      <Button type="default" prefixIcon={<ExampleIcon />} style={{ borderRadius: '50%' }} />
    </div>
  ),
};

const DownloadIcon = () => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

type SizeType = 'large' | 'middle' | 'small';

export const SizePreview: Story = {
  render: () => {
    const [size, setSize] = useState<SizeType>('large');

    return (
      <div style={{ width: 500 }}>
        <Radio.Group value={size} onChange={(e) => setSize(e.target.value as SizeType)}>
          <Radio.Button value="large">Large</Radio.Button>
          <Radio.Button value="middle">Middle</Radio.Button>
          <Radio.Button value="small">Small</Radio.Button>
        </Radio.Group>

        <Divider />

        <Space wrap>
          <Button type="primary" size={size}>
            Primary
          </Button>
          <Button size={size}>Default</Button>
          <Button type="dashed" size={size}>
            Dashed
          </Button>
          <Button type="link" size={size}>
            Link
          </Button>
        </Space>

        <Divider />

        <Space wrap>
          <Button type="primary" size={size} prefixIcon={<DownloadIcon />} />
          <Button type="primary" size={size} shape="circle" prefixIcon={<DownloadIcon />} />
          <Button type="primary" size={size} shape="round" prefixIcon={<DownloadIcon />}>
            Download
          </Button>
          <Button size={size} prefixIcon={<DownloadIcon />} />
          <Button size={size} shape="circle" prefixIcon={<DownloadIcon />} />
          <Button size={size} shape="round" prefixIcon={<DownloadIcon />}>
            Download
          </Button>
        </Space>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
