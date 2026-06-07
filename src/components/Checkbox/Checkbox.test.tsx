import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './index';

describe('Checkbox Component', () => {
  it('renders with label text', () => {
    render(<Checkbox>Accept terms</Checkbox>);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Checkbox id="cb">Option</Checkbox>);
    const input = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it('renders as checked when defaultChecked is true', () => {
    render(<Checkbox defaultChecked>Option</Checkbox>);
    const input = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('calls onChange when clicked', () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Click me</Checkbox>);
    const input = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(
      <Checkbox disabled onChange={onChange}>
        Disabled
      </Checkbox>
    );
    const input = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(input);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies error status class', () => {
    const { container } = render(<Checkbox status="error">Error</Checkbox>);
    expect(container.querySelector('.atom-checkbox-wrapper-status-error')).toBeInTheDocument();
  });
});
