import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputNumber } from './InputNumber';

const meta: Meta<typeof InputNumber> = {
  title: 'Data Entry/InputNumber',
  component: InputNumber,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
      description: 'The size of the input box',
    },
    status: {
      control: 'select',
      options: ['', 'warning', 'error'],
      description: 'Set validation status',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    min: {
      control: 'number',
      description: 'The min value',
    },
    max: {
      control: 'number',
      description: 'The max value',
    },
    step: {
      control: 'number',
      description: 'The number to which the current value is increased or decreased',
    },
    defaultValue: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputNumber>;

export const Default: Story = {
  args: {
    min: 1,
    max: 10,
    defaultValue: 3,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <InputNumber size="small" defaultValue={1} />
      <InputNumber size="middle" defaultValue={2} />
      <InputNumber size="large" defaultValue={3} />
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <InputNumber status="warning" defaultValue={100} />
      <InputNumber status="error" defaultValue={200} />
    </div>
  ),
};

/**
 * Side-by-side prefix and suffix. Side-by-side prefix and suffix.
 * `prefix` is rendered on the left of the number (currency, units),
 * `suffix` on the right ("%", "kg", "ms"). Border and focus ring move
 * to the wrapper so the affix lives inside the same input shell.
 */
export const WithPrefixAndSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', width: 400 }}>
      <InputNumber prefix="$" defaultValue={100} style={{ flex: 1 }} />
      <InputNumber suffix="%" defaultValue={50} style={{ flex: 1 }} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 50,
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | number>(93);
    const [disabled, setDisabled] = React.useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <InputNumber
          min={-8}
          max={100}
          value={value}
          onChange={(val) => setValue(val as number)}
          disabled={disabled}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setValue(50)}>Set to 50</button>
          <button onClick={() => setDisabled(!disabled)}>Toggle Disabled</button>
        </div>
      </div>
    );
  },
};

export const ChangeOnWheel: Story = {
  render: () => (
    <div style={{ margin: 10 }}>
      <InputNumber style={{ width: 100 }} defaultValue={10} changeOnBlur={false} changeOnWheel />
    </div>
  ),
};

const CHINESE_NUMBERS = '零一二三四五六七八九';

const chineseParser = (text: string | undefined) => {
  if (!text) return '';
  const parsed = [...text]
    .map((cell) => {
      const index = CHINESE_NUMBERS.indexOf(cell);
      if (index !== -1) {
        return index;
      }
      return cell;
    })
    .join('');

  if (Number.isNaN(Number(parsed))) {
    return text;
  }

  return parsed;
};

const chineseFormatter = (value: string | number | undefined) => {
  if (value === undefined || value === null) return '';
  return [...String(value)]
    .map((cell) => {
      const index = Number(cell);
      if (!Number.isNaN(index)) {
        return CHINESE_NUMBERS[index];
      }
      return cell;
    })
    .join('');
};

const getSum = (str: string) => {
  let total = 0;
  str.split('').forEach((c) => {
    const num = Number(c);
    if (!Number.isNaN(num)) {
      total += num;
    }
  });
  return total;
};

export const Formatters: Story = {
  render: () => {
    const [value, setValue] = React.useState<number | string>(1000);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: 300 }}>
        <div>
          <div style={{ marginBottom: 8 }}>Currency Format</div>
          <InputNumber
            defaultValue={1000}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ marginBottom: 8 }}>Percentage Format</div>
          <InputNumber
            defaultValue={100}
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value?.replace('%', '') || ''}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ marginBottom: 8 }}>In Control (Custom Logic)</div>
          <InputNumber
            value={value}
            onChange={(val) => setValue(val as number)}
            formatter={(val, { userTyping, input }) => {
              if (userTyping) {
                return input;
              }
              return `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }}
            parser={(val) => val?.replace(/\$\s?|(,*)/g, '') || ''}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ marginBottom: 8 }}>Chinese Numbers</div>
          <InputNumber
            value={value}
            onChange={(val) => setValue(val as number)}
            parser={chineseParser}
            formatter={chineseFormatter}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ marginBottom: 8 }}>Strange Format</div>
          <InputNumber
            defaultValue={1000}
            formatter={(value) => `$ ${value} - ${getSum(String(value))}`}
            parser={(value) => (value?.match(/^\$ ([\d.]*) .*$/) || [])[1] || ''}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    );
  },
};
