import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Result } from './Result';
import { Button } from '../Button';

const meta: Meta<typeof Result> = {
  title: 'Feedback/Result',
  component: Result,
};
export default meta;
type Story = StoryObj<typeof Result>;

export const Success: Story = {
  args: {
    status: 'success',
    title: 'Successfully Purchased',
    subTitle: 'Order number: 2017182818828182881',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    title: 'Submission Failed',
    subTitle: 'Please check and modify the following information before resubmitting.',
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
    title: 'There are some problems with your operation.',
  },
};

export const NotFound: Story = {
  args: {
    status: '404',
    title: '404',
    subTitle: 'Sorry, the page you visited does not exist.',
    extra: <Button type="primary">Back Home</Button>,
  },
};

export const ServerError: Story = {
  args: {
    status: '500',
    title: '500',
    subTitle: 'Sorry, something went wrong.',
    extra: <Button type="primary">Back Home</Button>,
  },
};
