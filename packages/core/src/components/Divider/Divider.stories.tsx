import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Divider>;

const TextContent = () => (
  <p style={{ margin: 0 }}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
);

export const Basic: Story = {
  render: () => (
    <>
      <TextContent />
      <Divider />
      <TextContent />
    </>
  ),
};

export const Sizes: Story = {
  render: () => (
    <>
      <TextContent />
      <Divider size="small" />
      <TextContent />
      <Divider size="medium" />
      <TextContent />
      <Divider size="large" />
      <TextContent />
    </>
  ),
};

export const WithText: Story = {
  render: () => (
    <>
      <TextContent />
      <Divider>Text</Divider>
      <TextContent />
      <Divider orientation="left">Left Text</Divider>
      <TextContent />
      <Divider orientation="right">Right Text</Divider>
      <TextContent />
    </>
  ),
};

export const Dashed: Story = {
  render: () => (
    <>
      <TextContent />
      <Divider dashed />
      <TextContent />
    </>
  ),
};

export const CustomLayout: Story = {
  render: () => (
    <>
      <Divider orientation="left" orientationMargin={0.1}>
        10% Margin Left
      </Divider>
      <Divider orientation="right" orientationMargin={0.1}>
        10% Margin Right
      </Divider>
      <Divider textPaddingInline="2em">2em Text Padding</Divider>
      <div style={{ background: '#eee', padding: '10px' }}>
        Vertical
        <Divider type="vertical" verticalMarginInline={20} />
        with 20px margin
      </div>
    </>
  ),
};
