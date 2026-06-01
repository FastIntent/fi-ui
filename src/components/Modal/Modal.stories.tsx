import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    centered: { control: 'boolean' },
    maskClosable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Modal {...args} open={open} onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
          <p>Some content...</p>
          <p>Some content...</p>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Basic Modal',
  },
};

export const Centered: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Centered Modal</Button>
        <Modal
          {...args}
          open={open}
          centered
          onCancel={() => setOpen(false)}
          onOk={() => setOpen(false)}
        >
          <p>Vertically centered modal content</p>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Centered Modal',
  },
};

export const CustomFooter: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal with Custom Footer</Button>
        <Modal
          {...args}
          open={open}
          onCancel={() => setOpen(false)}
          footer={[
            <Button key="back" onClick={() => setOpen(false)}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading onClick={() => setOpen(false)}>
              Submit
            </Button>,
          ]}
        >
          <p>Wait for it...</p>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Custom Footer',
  },
};
