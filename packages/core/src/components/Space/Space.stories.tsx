import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Space } from './Space';
import { Button } from '../Button';

const meta: Meta<typeof Space> = {
  title: 'Components/Space',
  component: Space,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Space>;

export const Basic: Story = {
  args: {
    size: 'middle',
    direction: 'horizontal',
  },
  render: (args) => (
    <Space {...args}>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="link">Link</Button>
    </Space>
  ),
};

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    size: 'middle',
  },
  render: (args) => (
    <Space {...args}>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="link">Link</Button>
    </Space>
  ),
};

export const CustomSize: Story = {
  render: (args) => {
    const [sizeType, setSizeType] = React.useState<'small' | 'middle' | 'large' | 'customize'>(
      'small'
    );
    const [customSize, setCustomSize] = React.useState<number>(16);

    return (
      <Space direction="vertical" size="large" align="start">
        <Space size="middle" align="center">
          <label>Size:</label>
          <select
            value={sizeType}
            onChange={(e) => setSizeType(e.target.value as 'small' | 'middle' | 'large')}
            style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #d9d9d9' }}
          >
            <option value="small">small</option>
            <option value="middle">middle</option>
            <option value="large">large</option>
            <option value="customize">customize</option>
          </select>
        </Space>

        {sizeType === 'customize' && (
          <Space size="middle" align="center">
            <label>Custom ({customSize}px):</label>
            <input
              type="range"
              min={0}
              max={100}
              value={customSize}
              onChange={(e) => setCustomSize(Number(e.target.value))}
            />
          </Space>
        )}

        <div
          style={{
            padding: 24,
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            background: '#fafafa',
          }}
        >
          <Space {...args} size={sizeType !== 'customize' ? sizeType : customSize}>
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="link">Link</Button>
          </Space>
        </div>
      </Space>
    );
  },
};

export const Align: Story = {
  render: (args) => {
    const mockBlockStyle = {
      display: 'inline-block',
      padding: '32px 8px 16px',
      background: 'rgba(150, 150, 150, 0.2)',
      borderRadius: 4,
    };

    const blockContainerStyle = {
      padding: 16,
      border: '1px solid #40a9ff',
      borderRadius: 4,
      background: '#fff',
    };

    return (
      <Space wrap size={16}>
        <div style={blockContainerStyle}>
          <Space {...args} align="center">
            center
            <Button type="primary">Primary</Button>
            <span style={mockBlockStyle}>Block</span>
          </Space>
        </div>
        <div style={blockContainerStyle}>
          <Space {...args} align="start">
            start
            <Button type="primary">Primary</Button>
            <span style={mockBlockStyle}>Block</span>
          </Space>
        </div>
        <div style={blockContainerStyle}>
          <Space {...args} align="end">
            end
            <Button type="primary">Primary</Button>
            <span style={mockBlockStyle}>Block</span>
          </Space>
        </div>
        <div style={blockContainerStyle}>
          <Space {...args} align="baseline">
            baseline
            <Button type="primary">Primary</Button>
            <span style={mockBlockStyle}>Block</span>
          </Space>
        </div>
      </Space>
    );
  },
};

export const WithSeparator: Story = {
  args: {
    size: 'middle',
    separator: '|',
  },
  render: (args) => (
    <Space {...args}>
      <Button type="link">Home</Button>
      <Button type="link">Application Center</Button>
      <Button type="link">Application List</Button>
      <Button type="link">An Application</Button>
    </Space>
  ),
};
