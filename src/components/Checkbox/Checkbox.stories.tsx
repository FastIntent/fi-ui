import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { Divider } from '../Divider/Divider';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Checkbox',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    children: 'Checked Checkbox',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Checkbox',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    children: 'Disabled Checked',
  },
};

const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

export const CheckAll = () => {
  const [checkedList, setCheckedList] = useState<string[]>(defaultCheckedList);

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

  return (
    <div style={{ minWidth: 240 }}>
      <Checkbox
        indeterminate={indeterminate}
        checked={checkAll}
        onChange={(e) => setCheckedList(e.target.checked ? plainOptions : [])}
      >
        Check all
      </Checkbox>
      <Divider />
      <Checkbox.Group
        options={plainOptions}
        value={checkedList}
        onChange={(list) => setCheckedList(list)}
      />
    </div>
  );
};

CheckAll.storyName = 'Check All (indeterminate)';
