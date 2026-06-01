import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Space } from '../Space/Space';
import { notification } from './useNotification';
import type { NotificationPlacement } from './NotificationNode';

const meta: Meta = {
  title: 'Components/Notification',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;

// ─── Basic Types ──────────────────────────────────────────────────────────────
export const Types: StoryObj = {
  render: () => (
    <Space size="middle">
      <Button
        type="primary"
        onClick={() =>
          notification.success({
            message: 'Task Completed',
            description: 'The operation was successful. Everything looks great!',
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          notification.error({
            message: 'Error Occurred',
            description: 'Something went wrong. Please try again or contact support.',
          })
        }
      >
        Error
      </Button>
      <Button
        onClick={() =>
          notification.warning({
            message: 'Warning',
            description: 'This action might have unintended side effects.',
          })
        }
      >
        Warning
      </Button>
      <Button
        onClick={() =>
          notification.info({
            message: 'Information',
            description: 'Here is some useful information for you to know.',
          })
        }
      >
        Info
      </Button>
    </Space>
  ),
};

// ─── Placement ────────────────────────────────────────────────────────────────
export const Placement: StoryObj = {
  render: () => {
    const placements: NotificationPlacement[] = [
      'topLeft',
      'topRight',
      'bottomLeft',
      'bottomRight',
      'top',
      'bottom',
    ];
    return (
      <Space size="small" wrap>
        {placements.map((p) => (
          <Button
            key={p}
            onClick={() =>
              notification.info({
                placement: p,
                message: `Placement: ${p}`,
                description: 'This notification appears in the specified corner.',
              })
            }
          >
            {p}
          </Button>
        ))}
      </Space>
    );
  },
};

// ─── Duration / No auto-close ─────────────────────────────────────────────────
export const Duration: StoryObj = {
  render: () => (
    <Space size="middle">
      <Button
        onClick={() =>
          notification.info({
            message: 'Short (1.5s)',
            description: 'This will close in 1.5 seconds.',
            duration: 1.5,
          })
        }
      >
        1.5s
      </Button>
      <Button
        onClick={() =>
          notification.info({
            message: 'Sticky notification',
            description: 'This one will not close automatically.',
            duration: null,
          })
        }
      >
        No auto-close
      </Button>
      <Button type="primary" onClick={() => notification.destroy()}>
        Destroy All
      </Button>
    </Space>
  ),
};

// ─── Custom icon ──────────────────────────────────────────────────────────────
export const CustomIcon: StoryObj = {
  render: () => (
    <Button
      type="primary"
      onClick={() =>
        notification.open({
          message: 'Custom Icon',
          description: 'You can use any React node as the icon.',
          icon: (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ✦
            </span>
          ),
        })
      }
    >
      Custom Icon
    </Button>
  ),
};
