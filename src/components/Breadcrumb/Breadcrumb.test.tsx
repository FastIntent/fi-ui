import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Breadcrumb } from './index';

describe('Breadcrumb Component', () => {
  it('renders breadcrumb items correctly', () => {
    render(
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Products</Breadcrumb.Item>
        <Breadcrumb.Item>Details</Breadcrumb.Item>
      </Breadcrumb>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('renders the correct number of items', () => {
    const { container } = render(
      <Breadcrumb>
        <Breadcrumb.Item>A</Breadcrumb.Item>
        <Breadcrumb.Item>B</Breadcrumb.Item>
      </Breadcrumb>
    );
    expect(container.querySelectorAll('.fi-breadcrumb-item')).toHaveLength(2);
  });

  it('calls onClick when a breadcrumb item is clicked', () => {
    const handleClick = vi.fn();
    render(
      <Breadcrumb>
        <Breadcrumb.Item onClick={handleClick}>Home</Breadcrumb.Item>
      </Breadcrumb>
    );
    fireEvent.click(screen.getByText('Home'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom separator when provided', () => {
    render(
      <Breadcrumb separator=">">
        <Breadcrumb.Item>First</Breadcrumb.Item>
        <Breadcrumb.Item>Second</Breadcrumb.Item>
      </Breadcrumb>
    );
    expect(screen.getAllByText('>')).toHaveLength(1);
  });
});
