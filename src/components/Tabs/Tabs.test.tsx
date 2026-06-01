import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from './index';

const items = [
  { key: '1', label: 'Overview', children: 'Overview content' },
  { key: '2', label: 'Details', children: 'Details content' },
  { key: '3', label: 'Settings', children: 'Settings content' },
];

describe('Tabs Component', () => {
  it('renders all tab labels', () => {
    render(<Tabs items={items} defaultActiveKey="1" />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders the content of the default active tab', () => {
    render(<Tabs items={items} defaultActiveKey="1" />);
    expect(screen.getByText('Overview content')).toBeInTheDocument();
  });

  it('switches content when a tab is clicked', () => {
    render(<Tabs items={items} defaultActiveKey="1" />);
    fireEvent.click(screen.getByText('Details'));
    expect(screen.getByText('Details content')).toBeInTheDocument();
  });

  it('calls onChange when a tab is selected', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} defaultActiveKey="1" onChange={onChange} />);
    fireEvent.click(screen.getByText('Settings'));
    expect(onChange).toHaveBeenCalledWith('3');
  });

  it('applies card type class', () => {
    const { container } = render(<Tabs items={items} type="card" />);
    expect(container.querySelector('.fi-tabs-card')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<Tabs items={items} size="large" />);
    expect(container.querySelector('.fi-tabs-lg')).toBeInTheDocument();
  });
});
