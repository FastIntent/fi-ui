import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Basic: Story = {
  args: {},
  render: (args) => <Calendar {...args} />,
};

export const Mini: Story = {
  args: { fullscreen: false },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Calendar {...args} />
    </div>
  ),
};

export const WithEvents: Story = {
  render: () => {
    const events: Record<string, { color: string; text: string }[]> = {
      '8': [
        { color: '#faad14', text: 'This is warning event.' },
        { color: '#52c41a', text: 'This is usual event.' },
      ],
      '10': [
        { color: '#faad14', text: 'This is warning event.' },
        { color: '#52c41a', text: 'This is usual event.' },
        { color: '#ff4d4f', text: 'This is error event.' },
      ],
      '15': [
        { color: '#faad14', text: 'This is warning event' },
        { color: '#52c41a', text: 'This is very long usu...' },
        { color: '#ff4d4f', text: 'This is error event 1.' },
      ],
    };

    return (
      <Calendar
        cellRender={(date, { type }) => {
          if (type !== 'month') return null;
          const dayEvents = events[String(date.date())];
          if (!dayEvents) return null;
          return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {dayEvents.map((e, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: e.color,
                      marginRight: 4,
                    }}
                  />
                  {e.text}
                </li>
              ))}
            </ul>
          );
        }}
      />
    );
  },
};

export const YearMode: Story = {
  args: { mode: 'year' },
  render: (args) => <Calendar {...args} />,
};
