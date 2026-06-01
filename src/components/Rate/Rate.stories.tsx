import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rate } from './Rate';
import { Space } from '../Space/Space';

const meta: Meta<typeof Rate> = {
  title: 'Components/Rate',
  component: Rate,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Rate>;

export const Default: Story = {
  args: {
    defaultValue: 3,
  },
};

export const HalfStar: Story = {
  args: {
    allowHalf: true,
    defaultValue: 3.5,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 4,
    disabled: true,
  },
};

export const CustomIcon: Story = {
  args: {
    character: 'A',
    defaultValue: 3,
  },
};

export const Status = () => (
  <Space direction="vertical">
    <Rate defaultValue={2} />
    <Rate allowHalf defaultValue={2.5} />
    <Rate disabled defaultValue={4} />
  </Space>
);
