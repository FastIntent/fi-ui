import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';
import { Space } from '../Space/Space';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    message: 'Informational Notes',
    type: 'info',
  },
};

export const Types: Story = {
  render: () => (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Alert message="Success Tips" type="success" showIcon />
      <Alert message="Informational Notes" type="info" showIcon />
      <Alert message="Warning" type="warning" showIcon />
      <Alert message="Error" type="error" showIcon />
    </Space>
  ),
};

export const WithDescription: Story = {
  args: {
    message: 'Success Tips',
    description: 'Detailed description and advice about successful willpower.',
    type: 'success',
    showIcon: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <Space direction="vertical" style={{ width: '340px' }}>
      <Alert message="Success Tips" type="success" showIcon />
      <Alert message="Informational Notes" type="info" showIcon />
      <Alert message="Warning" type="warning" showIcon closable />
      <Alert message="Error" type="error" showIcon />
      <Alert
        message="Success Tips"
        description="Detailed description and advice about successful copywriting."
        type="success"
        showIcon
      />
      <Alert
        message="Informational Notes"
        description="Additional description and information about copywriting."
        type="info"
        showIcon
      />
      <Alert
        message="Warning"
        description="This is a warning notice about copywriting."
        type="warning"
        showIcon
        closable
      />
      <Alert
        message="Error"
        description="This is an error message about copywriting."
        type="error"
        showIcon
      />
    </Space>
  ),
};

export const Closable: Story = {
  args: {
    message:
      'Warning Text Warning Text Warning Text Warning Text Warning Text Warning Text Warning Text',
    type: 'warning',
    closable: true,
    onClose: () => console.log('Alert closed.'),
  },
};

export const CustomClose: Story = {
  args: {
    message: 'Error Text',
    type: 'error',
    closable: true,
    closeText: 'Close Now',
  },
};
