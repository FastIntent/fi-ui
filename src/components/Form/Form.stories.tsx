import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Switch } from '../Switch/Switch';
import { DatePicker } from '../DatePicker';
import { Select, Option } from '../Select/Select';
import { InputNumber } from '../InputNumber/InputNumber';
import { Radio } from '../Radio/Radio';
import { RadioGroup } from '../Radio/RadioGroup';
import { useForm } from '@rc-component/form';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical', 'inline'],
    },
  },
};

export default meta;

export const AllFieldsValidation: StoryObj<typeof Form> = {
  name: 'All Fields Validation',
  render: () => {
    const [form] = useForm();

    const onFinish = (values: Record<string, unknown>) => {
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 560 }}>
        <Form.Item
          label="Full name"
          name="fullName"
          required
          rules={[{ required: true, message: 'Full name is required' }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          required
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email address' },
          ]}
        >
          <Input placeholder="john@example.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          required
          rules={[
            { required: true, message: 'Password is required' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input type="password" placeholder="Min. 8 characters" />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          required
          rules={[
            { required: true, message: 'Age is required' },
            { type: 'number', min: 18, max: 99, message: 'Age must be between 18 and 99' },
          ]}
        >
          <InputNumber placeholder="18" min={1} max={99} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Country"
          name="country"
          required
          rules={[{ required: true, message: 'Please select a country' }]}
        >
          <Select placeholder="Select a country">
            <Option value="us">United States</Option>
            <Option value="mx">Mexico</Option>
            <Option value="es">Spain</Option>
            <Option value="ar">Argentina</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Birth date"
          name="birthDate"
          required
          rules={[{ required: true, message: 'Please select your birth date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Availability range"
          name="availability"
          required
          rules={[{ required: true, message: 'Please select a date range' }]}
        >
          <DatePicker.RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          required
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <RadioGroup>
            <Radio value="admin">Admin</Radio>
            <Radio value="editor">Editor</Radio>
            <Radio value="viewer">Viewer</Radio>
          </RadioGroup>
        </Form.Item>

        <Form.Item name="notifications" label="Enable notifications" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          required
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('You must accept the terms and conditions')),
            },
          ]}
        >
          <Checkbox>I agree to the terms and conditions</Checkbox>
        </Form.Item>

        <Form.Item style={{ marginTop: 8 }}>
          <span style={{ display: 'inline-flex', gap: 8 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </span>
        </Form.Item>
      </Form>
    );
  },
};

export const DatePickerIntegration: StoryObj<typeof Form> = {
  render: (args) => {
    const [form] = useForm();
    const onFinish = (values: Record<string, unknown>) => {
      console.log('Form Values:', values);
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <Form {...args} form={form} onFinish={onFinish} style={{ maxWidth: 600 }}>
        <Form.Item
          label="Single Date"
          name="singleDate"
          rules={[{ required: true, message: 'Please select a date!' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="Date Range"
          name="dateRange"
          rules={[{ required: true, message: 'Please select a range!' }]}
        >
          <DatePicker.RangePicker />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  },
  args: {
    layout: 'vertical',
  },
};

export const Basic: StoryObj<typeof Form> = {
  render: (args) => {
    const [form] = useForm();
    const onFinish = (values: Record<string, unknown>) => {
      console.log('Success:', values);
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <Form {...args} form={form} onFinish={onFinish} style={{ maxWidth: 600 }}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'The input is not valid E-mail!' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  },
  args: {
    layout: 'vertical',
  },
};

export const Horizontal: StoryObj<typeof Form> = {
  ...Basic,
  args: {
    layout: 'horizontal',
  },
};

export const Inline: StoryObj<typeof Form> = {
  render: (args) => (
    <Form {...args} layout="inline">
      <Form.Item name="username">
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item name="password">
        <Input type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Log in
        </Button>
      </Form.Item>
    </Form>
  ),
  args: {
    layout: 'inline',
  },
};

export const Validation: StoryObj<typeof Form> = {
  render: (args) => {
    const [form] = useForm();
    return (
      <Form {...args} form={form} style={{ maxWidth: 600 }}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
            },
          ]}
        >
          <Checkbox>I have read the agreement</Checkbox>
        </Form.Item>

        <Form.Item label="Enable Notifications" name="notifications" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  },
  args: {
    layout: 'vertical',
  },
};
