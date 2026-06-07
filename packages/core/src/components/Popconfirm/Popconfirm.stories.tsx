import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popconfirm } from './Popconfirm';
import { Button } from '../Button';

const meta: Meta<typeof Popconfirm> = {
  title: 'Components/Popconfirm',
  component: Popconfirm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A simple and compact confirmation dialog. Built directly on top of the `Popover` architecture to ensure identical animation, placement, and collision behavior while providing a strict confirm/cancel pattern.',
      },
    },
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'topLeft',
        'topRight',
        'bottom',
        'bottomLeft',
        'bottomRight',
        'left',
        'leftTop',
        'leftBottom',
        'right',
        'rightTop',
        'rightBottom',
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Popconfirm>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------
export const Default: Story = {
  args: {
    title: 'Delete the task',
    description: 'Are you sure to delete this task?',
    okText: 'Yes',
    cancelText: 'No',
  },
  render: (args) => (
    <Popconfirm {...args}>
      <Button danger>Delete</Button>
    </Popconfirm>
  ),
};

// ---------------------------------------------------------------------------
// Callbacks & Alerts
// ---------------------------------------------------------------------------
export const Callbacks: Story = {
  name: 'With Action Callbacks',
  render: () => {
    const confirm = () => alert('Click on Yes');
    const cancel = () => alert('Click on No');

    return (
      <Popconfirm
        title="Are you sure you want to proceed?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button>Execute Action</Button>
      </Popconfirm>
    );
  },
};

// ---------------------------------------------------------------------------
// Title Only
// ---------------------------------------------------------------------------
export const TitleOnly: Story = {
  name: 'Title Only (No Description)',
  render: () => (
    <Popconfirm title="Save changes?" okText="Save">
      <Button type="primary">Save</Button>
    </Popconfirm>
  ),
};

// ---------------------------------------------------------------------------
// All Placements
// ---------------------------------------------------------------------------
export const AllPlacements: Story = {
  name: 'All Placements',
  parameters: { layout: 'padded' },
  render: () => {
    const placements: Array<React.ComponentProps<typeof Popconfirm>['placement']> = [
      'topLeft',
      'top',
      'topRight',
      'leftTop',
      'rightTop',
      'left',
      'right',
      'leftBottom',
      'rightBottom',
      'bottomLeft',
      'bottom',
      'bottomRight',
    ];
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 120px)',
          gap: 12,
          margin: '60px auto',
          width: 'fit-content',
        }}
      >
        {placements.map((p) => (
          <Popconfirm key={p} title={p} description="Just a placement demo" placement={p}>
            <Button size="small" style={{ width: '100%' }}>
              {p}
            </Button>
          </Popconfirm>
        ))}
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Async Closing Simulation
// ---------------------------------------------------------------------------
export const AsyncClosing: Story = {
  name: 'Asynchronous Closing Simulation',
  render: () => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopconfirm = () => setOpen(true);
    const handleCancel = () => setOpen(false);

    const handleOk = () => {
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
    };

    return (
      <Popconfirm
        title="Title"
        description="Open popconfirm with async logic"
        open={open}
        onConfirm={handleOk}
        okButtonProps={{ loading: confirmLoading }}
        onCancel={handleCancel}
      >
        <Button type="primary" onClick={showPopconfirm}>
          Open Async
        </Button>
      </Popconfirm>
    );
  },
};
