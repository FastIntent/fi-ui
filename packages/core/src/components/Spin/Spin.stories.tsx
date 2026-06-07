import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spin } from './Spin';
import { Alert } from '../Alert';
import { Switch } from '../Switch';

const meta: Meta<typeof Spin> = {
  title: 'Components/Spin',
  component: Spin,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Spin>;

export const Basic: Story = {
  args: { spinning: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
      <Spin size="small" />
      <Spin size="middle" />
      <Spin size="large" />
    </div>
  ),
};

export const WithTip: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
      <Spin size="small" tip="Loading..." />
      <Spin size="middle" tip="Loading..." />
      <Spin size="large" tip="Loading..." />
    </div>
  ),
};

export const CometType: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
      <Spin type="comet" size="small" />
      <Spin type="comet" size="middle" />
      <Spin type="comet" size="large" />
    </div>
  ),
};

export const WrappingContent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 400 }}>
      <Spin spinning>
        <Alert
          type="info"
          message="Alert message title"
          description="Further details about the context of this alert."
        />
      </Spin>
      <Spin spinning={false}>
        <Alert
          type="info"
          message="Alert message title"
          description="Further details about the context of this alert."
        />
      </Spin>
    </div>
  ),
};

export const DelayAndToggle: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <Switch
          checked={loading}
          onChange={setLoading}
          checkedChildren="On"
          unCheckedChildren="Off"
        />
        <Spin spinning={loading} delay={500} tip="Loading (delay 500ms)...">
          <div
            style={{
              padding: 24,
              background: 'var(--atom-color-fill-quaternary)',
              borderRadius: 8,
              width: 300,
            }}
          >
            <p style={{ margin: 0 }}>Content that gets blurred while loading.</p>
            <p style={{ margin: '8px 0 0' }}>Toggle the switch to see the spin with delay.</p>
          </div>
        </Spin>
      </div>
    );
  },
};

export const Fullscreen: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          onClick={() => {
            setOpen(true);
            setTimeout(() => setOpen(false), 2000);
          }}
          style={{
            padding: '6px 16px',
            background: 'var(--atom-primary-color)',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Show fullscreen spin (2s)
        </button>
        <Spin spinning={open} fullscreen tip="Loading..." />
      </>
    );
  },
};
