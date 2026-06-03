import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { hexToRgb } from './color-utils';
import { Button } from '../Button';

const meta: Meta<typeof ColorPicker> = {
  title: 'Data Entry/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {};

export const Controlled: Story = {
  render: () => {
    const [color, setColor] = useState('#25ac01');
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ColorPicker value={color} onChange={setColor} />
        <span style={{ fontFamily: 'monospace' }}>{color}</span>
      </div>
    );
  },
};

export const ShowText: Story = {
  args: { showText: true, defaultValue: '#ff6600' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <ColorPicker size="small" defaultValue="#1677ff" showText />
      <ColorPicker size="middle" defaultValue="#1677ff" showText />
      <ColorPicker size="large" defaultValue="#1677ff" showText />
    </div>
  ),
};

export const DisabledAlpha: Story = {
  args: { disabledAlpha: true, defaultValue: '#ff4d4f' },
};

export const AllowClear: Story = {
  args: { allowClear: true, defaultValue: '#faad14' },
};

export const WithPresets: Story = {
  args: {
    presets: [
      {
        label: 'Recommended',
        colors: ['#25ac01', '#1677ff', '#722ed1', '#eb2f96', '#ff4d4f', '#faad14', '#52c41a'],
      },
      {
        label: 'Recent',
        colors: ['#f5222d', '#fa8c16', '#a0d911', '#13c2c2', '#2f54eb', '#722ed1'],
      },
    ],
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '#1677ff' },
};

export const ShowTextRGB: Story = {
  name: 'Show Text (RGB)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <ColorPicker
        size="middle"
        defaultValue="#108ee9"
        showText={(hex) => {
          const rgb = hexToRgb(hex);
          return rgb ? `rgb(${rgb.r},${rgb.g},${rgb.b})` : hex;
        }}
      />
      <ColorPicker
        size="large"
        defaultValue="#108ee9"
        showText={(hex) => {
          const rgb = hexToRgb(hex);
          return rgb ? `rgb(${rgb.r},${rgb.g},${rgb.b})` : hex;
        }}
      />
    </div>
  ),
};

export const CustomTrigger: Story = {
  render: () => (
    <ColorPicker defaultValue="#722ed1">
      <Button type="primary">Pick Color</Button>
    </ColorPicker>
  ),
};
