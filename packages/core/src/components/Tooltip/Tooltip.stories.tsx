import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'left',
        'right',
        'bottom',
        'topLeft',
        'topRight',
        'bottomLeft',
        'bottomRight',
        'leftTop',
        'leftBottom',
        'rightTop',
        'rightBottom',
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  args: {
    title: 'prompt text',
    placement: 'top',
  },
  render: (args) => (
    <Tooltip {...args}>
      <span>Tooltip will show on mouse enter.</span>
    </Tooltip>
  ),
};

export const Placement: Story = {
  render: () => (
    <div style={{ padding: '100px' }}>
      <div style={{ marginLeft: 75, whiteSpace: 'nowrap' }}>
        <Tooltip placement="topLeft" title="prompt text">
          <Button style={{ margin: 8 }}>TL</Button>
        </Tooltip>
        <Tooltip placement="top" title="prompt text">
          <Button style={{ margin: 8 }}>Top</Button>
        </Tooltip>
        <Tooltip placement="topRight" title="prompt text">
          <Button style={{ margin: 8 }}>TR</Button>
        </Tooltip>
      </div>
      <div style={{ width: 75, float: 'left' }}>
        <Tooltip placement="leftTop" title="prompt text">
          <Button style={{ margin: 8 }}>LT</Button>
        </Tooltip>
        <Tooltip placement="left" title="prompt text">
          <Button style={{ margin: 8 }}>Left</Button>
        </Tooltip>
        <Tooltip placement="leftBottom" title="prompt text">
          <Button style={{ margin: 8 }}>LB</Button>
        </Tooltip>
      </div>
      <div style={{ width: 75, marginLeft: 305 }}>
        <Tooltip placement="rightTop" title="prompt text">
          <Button style={{ margin: 8 }}>RT</Button>
        </Tooltip>
        <Tooltip placement="right" title="prompt text">
          <Button style={{ margin: 8 }}>Right</Button>
        </Tooltip>
        <Tooltip placement="rightBottom" title="prompt text">
          <Button style={{ margin: 8 }}>RB</Button>
        </Tooltip>
      </div>
      <div style={{ marginLeft: 75, clear: 'both', whiteSpace: 'nowrap' }}>
        <Tooltip placement="bottomLeft" title="prompt text">
          <Button style={{ margin: 8 }}>BL</Button>
        </Tooltip>
        <Tooltip placement="bottom" title="prompt text">
          <Button style={{ margin: 8 }}>Bottom</Button>
        </Tooltip>
        <Tooltip placement="bottomRight" title="prompt text">
          <Button style={{ margin: 8 }}>BR</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

export const ArrowPointAtCenter: Story = {
  args: {
    title: 'This is a tooltip',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Arrow points to center</Button>
    </Tooltip>
  ),
};
