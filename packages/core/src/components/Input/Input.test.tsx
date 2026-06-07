import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './index';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('atom-input');
  });

  it('handles value changes accurately', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');

    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect((input as HTMLInputElement).value).toBe('Hello World');
  });

  it('respects disabled state and prevents interactions', () => {
    const handleChange = vi.fn();
    render(<Input disabled onChange={handleChange} placeholder="Disabled Input" />);
    const input = screen.getByPlaceholderText('Disabled Input');

    expect(input).toBeDisabled();
    expect(input).toHaveClass('atom-input-disabled');
  });

  it('renders prefix and suffix adornments', () => {
    render(
      <Input
        prefix={<span data-testid="prefix-icon">@</span>}
        suffix={<span data-testid="suffix-icon">.com</span>}
      />
    );

    expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
    expect(screen.getByTestId('suffix-icon')).toBeInTheDocument();
  });

  it('applies status classes for error, warning and success', () => {
    const { rerender, container } = render(<Input status="error" />);
    expect(container.querySelector('.atom-input-status-error')).toBeInTheDocument();

    rerender(<Input status="warning" />);
    expect(container.querySelector('.atom-input-status-warning')).toBeInTheDocument();

    rerender(<Input status="success" />);
    expect(container.querySelector('.atom-input-status-success')).toBeInTheDocument();
  });
});
