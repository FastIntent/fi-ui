import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './index';

describe('Badge Component', () => {
  it('renders children content', () => {
    render(
      <Badge count={5}>
        <span>Inbox</span>
      </Badge>
    );
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });

  it('displays numeric count', () => {
    render(
      <Badge count={8}>
        <span>Messages</span>
      </Badge>
    );
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('caps count at overflowCount and shows "+" suffix', () => {
    render(
      <Badge count={150} overflowCount={99}>
        <span>Alerts</span>
      </Badge>
    );
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('does not render badge when count is 0 and showZero is false', () => {
    render(
      <Badge count={0}>
        <span>Empty</span>
      </Badge>
    );
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('renders "0" when showZero is true', () => {
    render(
      <Badge count={0} showZero>
        <span>Empty</span>
      </Badge>
    );
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders dot badge without children', () => {
    const { container } = render(<Badge dot />);
    expect(container.querySelector('.atom-badge-dot')).toBeInTheDocument();
  });

  it('renders status badge with text', () => {
    render(<Badge status="success" text="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(document.querySelector('.atom-badge-status-success')).toBeInTheDocument();
  });
});
