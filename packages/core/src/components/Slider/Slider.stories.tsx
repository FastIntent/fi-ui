import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';
import { Space } from '../Space/Space';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Slider>;

const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: { color: '#f50' },
    label: <strong>100°C</strong>,
  },
};

export const Default: Story = {
  args: {
    defaultValue: 30,
  },
};

export const Range: Story = {
  args: {
    range: true,
    defaultValue: [20, 50],
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 40,
    disabled: true,
  },
};

export const CustomSteps: Story = {
  args: {
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 50,
  },
};

export const WithMarks = () => (
  <div style={{ width: 500, padding: '20px 40px' }}>
    <p>included=true</p>
    <Slider marks={marks} defaultValue={37} />
    <Slider marks={marks} range defaultValue={[26, 37]} />
    <p>included=false</p>
    <Slider marks={marks} defaultValue={37} included={false} />
    <p>marks &amp; step</p>
    <Slider marks={marks} step={10} defaultValue={37} />
    <p>step=null</p>
    <Slider marks={marks} step={null} defaultValue={[26, 37]} range />
  </div>
);

export const Vertical = () => (
  <div style={{ display: 'flex', gap: 0 }}>
    <div style={{ display: 'inline-block', height: 300, marginInlineStart: 70 }}>
      <Slider vertical defaultValue={30} />
    </div>
    <div style={{ display: 'inline-block', height: 300, marginInlineStart: 70 }}>
      <Slider vertical range step={10} defaultValue={[20, 50]} />
    </div>
    <div style={{ display: 'inline-block', height: 300, marginInlineStart: 70 }}>
      <Slider vertical range marks={marks} defaultValue={[26, 37]} />
    </div>
  </div>
);
