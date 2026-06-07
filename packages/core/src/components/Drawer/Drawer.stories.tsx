import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from './Drawer';
import { Button } from '../Button/Button';

import { Select, Option } from '../Select/Select';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Drawer
        </Button>
        <Drawer title="Basic Drawer" open={open} onClose={() => setOpen(false)}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </>
    );
  },
};

type PlacementType = 'right' | 'left' | 'top' | 'bottom';

export const Placement: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<PlacementType>('right');

    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Select
          value={placement}
          style={{ width: 120 }}
          onChange={(val: PlacementType) => setPlacement(val)}
        >
          <Option value="left">Left</Option>
          <Option value="right">Right</Option>
          <Option value="top">Top</Option>
          <Option value="bottom">Bottom</Option>
        </Select>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Drawer
        </Button>
        <Drawer
          title={`Drawer - ${placement}`}
          placement={placement}
          open={open}
          onClose={() => setOpen(false)}
        >
          <p>
            This drawer is sliding from the <strong>{placement}</strong>.
          </p>
        </Drawer>
      </div>
    );
  },
};
