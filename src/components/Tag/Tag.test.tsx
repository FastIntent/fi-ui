import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tag } from './index';

describe('Tag Component', () => {
  it('renders children text', () => {
    render(<Tag>In Progress</Tag>);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('applies preset color class', () => {
    const { container } = render(<Tag color="success">Done</Tag>);
    expect(container.querySelector('.fi-tag-success')).toBeInTheDocument();
  });

  it('applies borderless class when bordered is false', () => {
    const { container } = render(<Tag bordered={false}>Flat</Tag>);
    expect(container.querySelector('.fi-tag-borderless')).toBeInTheDocument();
  });

  it('renders close button when closable is true', () => {
    render(<Tag closable>Removable</Tag>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides tag after clicking close', () => {
    render(<Tag closable>Close me</Tag>);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Close me')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Tag closable onClose={onClose}>
        Tag
      </Tag>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('prevents closing when e.preventDefault() is called in onClose', () => {
    const onClose = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(
      <Tag closable onClose={onClose}>
        Stays
      </Tag>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Stays')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<Tag icon={<span data-testid="tag-icon" />}>Tagged</Tag>);
    expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
  });

  it('applies custom hex color as inline style', () => {
    const { container } = render(<Tag color="#ff6600">Custom</Tag>);
    const tag = container.firstChild as HTMLElement;
    expect(tag.style.backgroundColor).toBe('#ff6600');
  });
});
