import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';
import { Space } from '../Space/Space';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    children: 'Radio',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Radio',
    disabled: true,
    checked: true,
  },
};

export const RadioGroupStory = () => {
  const [value, setValue] = useState(1);

  return (
    <Space direction="vertical">
      <Radio.Group onChange={(e) => setValue(e.target.value as number)} value={value}>
        <Radio value={1}>Option A</Radio>
        <Radio value={2}>Option B</Radio>
        <Radio value={3}>Option C</Radio>
        <Radio value={4} disabled>
          Disabled Option
        </Radio>
      </Radio.Group>
      <div style={{ marginTop: 16 }}>
        Selected Value: <b>{value}</b>
      </div>
    </Space>
  );
};

RadioGroupStory.storyName = 'Radio Group';

export const VerticalGroup = () => (
  <Radio.Group defaultValue={1} direction="vertical">
    <Radio value={1}>Option A</Radio>
    <Radio value={2}>Option B</Radio>
    <Radio value={3}>Option C</Radio>
  </Radio.Group>
);

VerticalGroup.storyName = 'Vertical Group';
