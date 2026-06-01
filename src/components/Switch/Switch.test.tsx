import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from './index';

describe('Switch Component', () => {
  it('renders as a button element', () => {
    const { container } = render(<Switch />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('applies base prefix class', () => {
    const { container } = render(<Switch />);
    expect(container.querySelector('.fi-switch')).toBeInTheDocument();
  });

  it('renders unchecked by default', () => {
    const { container } = render(<Switch />);
    const btn = container.querySelector('button') as HTMLButtonElement;
    expect(btn).not.toHaveClass('fi-switch-checked');
  });

  it('renders checked when defaultChecked is true', () => {
    const { container } = render(<Switch defaultChecked />);
    expect(container.querySelector('.fi-switch-checked')).toBeInTheDocument();
  });

  it('calls onChange when toggled', () => {
    const onChange = vi.fn();
    const { container } = render(<Switch onChange={onChange} />);
    fireEvent.click(container.querySelector('button')!);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    const { container } = render(<Switch disabled onChange={onChange} />);
    fireEvent.click(container.querySelector('button')!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies small size class', () => {
    const { container } = render(<Switch size="small" />);
    expect(container.querySelector('.fi-switch-small')).toBeInTheDocument();
  });

  it('applies loading class and disables when loading', () => {
    const { container } = render(<Switch loading />);
    expect(container.querySelector('.fi-switch-loading')).toBeInTheDocument();
    expect(container.querySelector('button')).toBeDisabled();
  });
});
