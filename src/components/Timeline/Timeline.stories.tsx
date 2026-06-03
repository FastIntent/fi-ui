import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Timeline, TimelineItem } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => (
    <Timeline>
      <TimelineItem>Create a services site 2015-09-01</TimelineItem>
      <TimelineItem>Solve initial network problems 2015-09-01</TimelineItem>
      <TimelineItem>Technical testing 2015-09-01</TimelineItem>
      <TimelineItem>Network problems being solved 2015-09-01</TimelineItem>
    </Timeline>
  ),
};

export const WithColors: Story = {
  render: () => (
    <Timeline>
      <TimelineItem color="success">Completed milestone</TimelineItem>
      <TimelineItem color="primary">In progress</TimelineItem>
      <TimelineItem color="error">Failed task</TimelineItem>
      <TimelineItem color="warning">Pending review</TimelineItem>
    </Timeline>
  ),
};

export const Alternate: Story = {
  render: () => (
    <Timeline mode="alternate">
      <TimelineItem>Create a services site</TimelineItem>
      <TimelineItem color="success">Solve network problems</TimelineItem>
      <TimelineItem>Technical testing</TimelineItem>
      <TimelineItem color="error">Network problems</TimelineItem>
    </Timeline>
  ),
};

export const RightAlign: Story = {
  render: () => (
    <Timeline mode="right">
      <TimelineItem>Create a services site</TimelineItem>
      <TimelineItem color="success">Solve network problems</TimelineItem>
      <TimelineItem>Technical testing</TimelineItem>
    </Timeline>
  ),
};
