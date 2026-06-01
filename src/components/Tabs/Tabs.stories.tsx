import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'card', 'editable-card'],
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
    centered: {
      control: 'boolean',
    },
    tabPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const defaultItems = [
  {
    key: '1',
    label: 'Tab 1',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
];

export const Basic: Story = {
  args: {
    items: defaultItems,
  },
  render: (args) => <Tabs {...args} />,
};

export const Centered: Story = {
  args: {
    centered: true,
    items: defaultItems,
  },
  render: (args) => <Tabs {...args} />,
};

export const Disabled: Story = {
  args: {
    items: [defaultItems[0], { ...defaultItems[1], disabled: true }, defaultItems[2]],
  },
  render: (args) => <Tabs {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Tabs size="small" items={defaultItems} />
      <Tabs size="middle" items={defaultItems} />
      <Tabs size="large" items={defaultItems} />
    </div>
  ),
};

export const CardType: Story = {
  args: {
    type: 'card',
    items: defaultItems,
  },
  render: (args) => <Tabs {...args} />,
};

export const EditableCard: Story = {
  render: () => {
    const [items, setItems] = useState(defaultItems);
    const [activeKey, setActiveKey] = useState(defaultItems[0].key);

    const onEdit = (
      targetKey: React.Key | React.MouseEvent | React.KeyboardEvent,
      action: 'add' | 'remove'
    ) => {
      if (action === 'add') {
        const newActiveKey = `newTab${items.length + 1}`;
        setItems([
          ...items,
          {
            key: newActiveKey,
            label: 'New Tab',
            children: 'New Tab Pane',
          },
        ]);
        setActiveKey(newActiveKey);
      } else {
        const newItems = items.filter((item) => item.key !== targetKey);
        setItems(newItems);
        if (activeKey === targetKey && newItems.length) {
          setActiveKey(newItems[0].key);
        }
      }
    };

    return (
      <Tabs
        type="editable-card"
        onChange={setActiveKey}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
    );
  },
};
