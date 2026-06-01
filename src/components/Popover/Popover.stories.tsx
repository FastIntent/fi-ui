import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from '../Button';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A floating card with a title and content body. Built on `@rc-component/tooltip` with the same placement and trigger API as `Tooltip`, but with richer content support.',
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
    trigger: {
      control: 'multi-select',
      options: ['hover', 'click', 'focus', 'contextMenu'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Popover>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------
export const Default: Story = {
  args: {
    title: 'Popover Title',
    content: 'This is the popover content.',
    placement: 'top',
    trigger: ['hover'],
  },
  render: (args) => (
    <Popover {...args}>
      <Button type="default">Hover me</Button>
    </Popover>
  ),
};

// ---------------------------------------------------------------------------
// Click trigger
// ---------------------------------------------------------------------------
export const ClickTrigger: Story = {
  name: 'Click Trigger',
  render: () => (
    <Popover
      title="Click to open"
      content="This popover is triggered by a click."
      trigger={['click']}
    >
      <Button type="primary">Click me</Button>
    </Popover>
  ),
};

// ---------------------------------------------------------------------------
// Title only / Content only
// ---------------------------------------------------------------------------
export const TitleOnly: Story = {
  name: 'Title Only',
  render: () => (
    <Popover title="Header without body" trigger={['click']}>
      <Button>Open</Button>
    </Popover>
  ),
};

export const ContentOnly: Story = {
  name: 'Content Only',
  render: () => (
    <Popover content="A floating card without a header." trigger={['click']}>
      <Button>Open</Button>
    </Popover>
  ),
};

// ---------------------------------------------------------------------------
// Rich content
// ---------------------------------------------------------------------------
export const RichContent: Story = {
  name: 'Rich Content',
  render: () => {
    const content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ margin: 0 }}>Click the button to perform an action.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" type="primary">
            Confirm
          </Button>
          <Button size="small">Cancel</Button>
        </div>
      </div>
    );
    return (
      <Popover title="Confirmation" content={content} trigger={['click']}>
        <Button type="default">Open Rich Popover</Button>
      </Popover>
    );
  },
};

// ---------------------------------------------------------------------------
// Controlled
// ---------------------------------------------------------------------------
export const Controlled: Story = {
  name: 'Controlled (open/onOpenChange)',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Popover
          title="Controlled Popover"
          content="Visibility is controlled externally."
          open={open}
          onOpenChange={setOpen}
          trigger={['click']}
        >
          <Button type="primary">{open ? 'Close' : 'Open'} Popover</Button>
        </Popover>
        <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
          State: <strong>{open ? 'open' : 'closed'}</strong>
        </p>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// All placements
// ---------------------------------------------------------------------------
export const AllPlacements: Story = {
  name: 'All Placements',
  parameters: { layout: 'padded' },
  render: () => {
    const placements: Array<React.ComponentProps<typeof Popover>['placement']> = [
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
          <Popover key={p} title={p} content="Placement demo" placement={p} trigger={['hover']}>
            <Button size="small" style={{ width: '100%' }}>
              {p}
            </Button>
          </Popover>
        ))}
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Custom color
// ---------------------------------------------------------------------------
export const CustomColor: Story = {
  name: 'Custom Background Color',
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {(['#1677ff', '#52c41a', '#ff4d4f', '#722ed1'] as const).map((color) => (
        <Popover
          key={color}
          title="Custom color"
          content={`Background: ${color}`}
          color={color}
          trigger={['hover']}
        >
          <Button style={{ background: color, borderColor: color, color: '#fff' }}>{color}</Button>
        </Popover>
      ))}
    </div>
  ),
};
