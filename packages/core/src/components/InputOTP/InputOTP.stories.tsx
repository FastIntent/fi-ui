import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputOTP } from './InputOTP';

const meta: Meta<typeof InputOTP> = {
  title: 'Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: {
    length: { control: 'number' },
    status: { control: 'select', options: ['', 'error', 'warning'] },
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    disabled: { control: 'boolean' },
    inputType: { control: 'select', options: ['text', 'number', 'password'] },
  },
};

export default meta;

export const Basic: StoryObj<typeof InputOTP> = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <InputOTP {...args} value={value} onChange={setValue} />
        <div>Value: {value}</div>
      </div>
    );
  },
  args: {
    length: 4,
  },
};

export const Large: StoryObj<typeof InputOTP> = {
  ...Basic,
  args: {
    length: 6,
    size: 'large',
  },
};

export const Numeric: StoryObj<typeof InputOTP> = {
  ...Basic,
  args: {
    length: 4,
    inputType: 'number',
  },
};

export const States: StoryObj<typeof InputOTP> = {
  render: (args) => {
    const [val1, setVal1] = useState('');
    const [val2, setVal2] = useState('');
    const [val3, setVal3] = useState('12');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <p>Error State</p>
          <InputOTP {...args} status="error" value={val1} onChange={setVal1} />
        </div>
        <div>
          <p>Warning State</p>
          <InputOTP {...args} status="warning" value={val2} onChange={setVal2} />
        </div>
        <div>
          <p>Disabled State</p>
          <InputOTP {...args} disabled value={val3} />
        </div>
      </div>
    );
  },
  args: {
    length: 4,
  },
};

export const Sizes: StoryObj<typeof InputOTP> = {
  render: (args) => {
    const [val1, setVal1] = useState('');
    const [val2, setVal2] = useState('');
    const [val3, setVal3] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <p>Small</p>
          <InputOTP {...args} size="small" value={val1} onChange={setVal1} />
        </div>
        <div>
          <p>Middle (Default)</p>
          <InputOTP {...args} size="middle" value={val2} onChange={setVal2} />
        </div>
        <div>
          <p>Large</p>
          <InputOTP {...args} size="large" value={val3} onChange={setVal3} />
        </div>
      </div>
    );
  },
  args: {
    length: 4,
  },
};
