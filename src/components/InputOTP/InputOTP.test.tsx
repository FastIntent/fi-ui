import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InputOTP } from './index';

describe('InputOTP Component', () => {
  it('renders the correct number of input boxes (default 4)', () => {
    render(<InputOTP />);
    const inputs = document.querySelectorAll('input');
    expect(inputs).toHaveLength(4);
  });

  it('renders the correct number of input boxes when length is specified', () => {
    render(<InputOTP length={6} />);
    const inputs = document.querySelectorAll('input');
    expect(inputs).toHaveLength(6);
  });

  it('applies base class to container', () => {
    const { container } = render(<InputOTP />);
    expect(container.querySelector('.fi-otp')).toBeInTheDocument();
  });

  it('applies error status class', () => {
    const { container } = render(<InputOTP status="error" />);
    expect(container.querySelector('.fi-otp-status-error')).toBeInTheDocument();
  });

  it('disables all inputs when disabled prop is true', () => {
    render(<InputOTP disabled />);
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('calls onChange with concatenated value on input', () => {
    const onChange = vi.fn();
    render(<InputOTP length={4} onChange={onChange} />);
    const inputs = document.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: '5' } });
    expect(onChange).toHaveBeenCalled();
  });
});
