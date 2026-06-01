import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [
        'success',
        'processing',
        'error',
        'warning',
        'default',
        '#f50',
        '#2db7f5',
        '#87d068',
        '#108ee9',
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Basic: Story = {
  args: {
    children: 'Tag 1',
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag color="default">default</Tag>
      <Tag color="success">success</Tag>
      <Tag color="processing">processing</Tag>
      <Tag color="error">error</Tag>
      <Tag color="warning">warning</Tag>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag color="#f50">#f50</Tag>
      <Tag color="#2db7f5">#2db7f5</Tag>
      <Tag color="#87d068">#87d068</Tag>
      <Tag color="#108ee9">#108ee9</Tag>
    </div>
  ),
};

export const Closable: Story = {
  args: {
    closable: true,
    children: 'Tag 1',
    onClose: (e) => console.log('Close tag', e),
  },
};

export const Borderless: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag bordered={false} color="success">
        success
      </Tag>
      <Tag bordered={false} color="processing">
        processing
      </Tag>
      <Tag bordered={false} color="error">
        error
      </Tag>
      <Tag bordered={false} color="warning">
        warning
      </Tag>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M6 3.5V6L7.5 7.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    children: 'Waiting',
    color: 'default',
  },
};
