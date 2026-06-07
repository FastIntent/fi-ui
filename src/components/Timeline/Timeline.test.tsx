import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Timeline } from './index';

describe('Timeline Component', () => {
  it('renders timeline items with content', () => {
    render(
      <Timeline>
        <Timeline.Item>Created the task</Timeline.Item>
        <Timeline.Item>Assigned to team</Timeline.Item>
        <Timeline.Item>Completed</Timeline.Item>
      </Timeline>
    );
    expect(screen.getByText('Created the task')).toBeInTheDocument();
    expect(screen.getByText('Assigned to team')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('applies base class to container', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item>Event</Timeline.Item>
      </Timeline>
    );
    expect(container.querySelector('.atom-timeline')).toBeInTheDocument();
  });

  it('applies item class to each item', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item>A</Timeline.Item>
        <Timeline.Item>B</Timeline.Item>
      </Timeline>
    );
    expect(container.querySelectorAll('.atom-timeline-item')).toHaveLength(2);
  });

  it('renders label when provided', () => {
    render(
      <Timeline>
        <Timeline.Item label="Jan 1">New Year</Timeline.Item>
      </Timeline>
    );
    expect(screen.getByText('Jan 1')).toBeInTheDocument();
  });

  it('applies color class to item dot', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item color="success">Done</Timeline.Item>
      </Timeline>
    );
    expect(container.querySelector('.atom-timeline-item-dot-success')).toBeInTheDocument();
  });
});
