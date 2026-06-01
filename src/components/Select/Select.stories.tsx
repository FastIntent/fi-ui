import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select, Option } from './Select';
import { Form } from '../Form';
import { Button } from '../Button';
import { SpaceWithCompact as Space } from '../Space/Space';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  args: {
    placeholder: 'Select a user',
    style: { width: 200 },
    children: [
      <Option key="1" value="jack">
        Jack
      </Option>,
      <Option key="2" value="lucy">
        Lucy
      </Option>,
      <Option key="3" value="tom">
        Tom
      </Option>,
    ],
  },
};

export const Searchable: Story = {
  args: {
    showSearch: true,
    placeholder: 'Search for a user',
    optionFilterProp: 'children',
    style: { width: 200 },
    children: [
      <Option key="1" value="jack">
        Jack
      </Option>,
      <Option key="2" value="lucy">
        Lucy
      </Option>,
      <Option key="3" value="tom">
        Tom
      </Option>,
    ],
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Select size="large" defaultValue="lucy" style={{ width: 200 }}>
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
      </Select>
      <Select size="middle" defaultValue="lucy" style={{ width: 200 }}>
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
      </Select>
      <Select size="small" defaultValue="lucy" style={{ width: 200 }}>
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
      </Select>
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Select status="error" placeholder="Error state" style={{ width: 200 }}>
        <Option value="jack">Jack</Option>
      </Select>
      <Select status="warning" placeholder="Warning state" style={{ width: 200 }}>
        <Option value="jack">Jack</Option>
      </Select>
    </div>
  ),
};

const moodOptions = [
  { label: 'Happy', value: 'happy', emoji: '😄', desc: 'Feeling Good' },
  { label: 'Sad', value: 'sad', emoji: '😢', desc: 'Feeling Blue' },
  { label: 'Angry', value: 'angry', emoji: '😡', desc: 'Furious' },
  { label: 'Cool', value: 'cool', emoji: '😎', desc: 'Chilling' },
  { label: 'Sleepy', value: 'sleepy', emoji: '😴', desc: 'Need Sleep' },
];

export const Multiple: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 400 }}>
      <Select
        style={{ width: '100%' }}
        placeholder="Select a city"
        defaultValue="suzhou"
        options={[
          { label: 'Nanjing', value: 'nanjing' },
          { label: 'Suzhou', value: 'suzhou' },
          { label: 'Zhenjiang', value: 'zhenjiang' },
        ]}
      />
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select your current mood"
        defaultValue={['happy', 'sad', 'angry', 'cool', 'sleepy']}
        onChange={(value) => console.log('selected', value)}
        options={moodOptions}
        optionRender={(option) => (
          <Space size={8}>
            <span role="img" aria-label={option.data.label as string}>
              {option.data.emoji as string}
            </span>
            {`${option.data.label} (${option.data.desc})`}
          </Space>
        )}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Select
          mode="multiple"
          size="large"
          style={{ width: '100%' }}
          placeholder="Large"
          defaultValue={['happy', 'sad', 'angry']}
          options={moodOptions}
        />
        <Select
          mode="multiple"
          size="middle"
          style={{ width: '100%' }}
          placeholder="Middle (default)"
          defaultValue={['happy', 'sad', 'angry']}
          options={moodOptions}
        />
        <Select
          mode="multiple"
          size="small"
          style={{ width: '100%' }}
          placeholder="Small"
          defaultValue={['happy', 'sad', 'angry']}
          options={moodOptions}
        />
      </div>
    </div>
  ),
};

export const InForm: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Form layout="vertical">
        <Form.Item
          label="Selection"
          name="user"
          rules={[{ required: true, message: 'Please select a user!' }]}
        >
          <Select allowClear placeholder="Select a user">
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  ),
};
