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

// Visual regression coverage for the rounded-corners contract.
// The Modal clips `&-content` with `overflow: hidden`, so corners must
// look identical whether or not a footer is rendered. These two
// stories make that contract explicit.

export const WithFooter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Confirm-style modal — header, body, and default Ok/Cancel footer. ' +
          'All four corners must read as rounded; the footer must not paint over ' +
          'the bottom radii.',
      },
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Modal {...args} open={open} onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
          <p>Are you sure you want to proceed with this operation?</p>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Confirm action',
    okText: 'OK',
    cancelText: 'Cancel',
  },
};

export const WithoutFooter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Footer suppressed via `footer={null}`. The body now reaches the ' +
          "modal's bottom edge — corners must still read as rounded thanks " +
          'to `&-content` clipping.',
      },
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Modal {...args} open={open} onCancel={() => setOpen(false)} footer={null}>
          <p style={{ paddingBottom: 24 }}>
            This modal has no footer. The bottom of the body still respects the modal&apos;s rounded
            corners — no square edges allowed.
          </p>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Borderless footer',
  },
};
