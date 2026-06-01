import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputNumber } from './index';

describe('InputNumber Component', () => {
  it('renders the input element', () => {
    render(<InputNumber data-testid="input-number" />);
    expect(screen.getByTestId('input-number')).toBeInTheDocument();
  });

  it('applies the base prefix class', () => {
    const { container } = render(<InputNumber />);
    expect(container.querySelector('.fi-input-number')).toBeInTheDocument();
  });

  it('applies disabled class when disabled', () => {
    const { container } = render(<InputNumber disabled />);
    expect(container.querySelector('.fi-input-number-disabled')).toBeInTheDocument();
  });

  it('applies size class correctly', () => {
    const { container: large } = render(<InputNumber size="large" />);
    expect(large.querySelector('.fi-input-number-lg')).toBeInTheDocument();

    const { container: small } = render(<InputNumber size="small" />);
    expect(small.querySelector('.fi-input-number-sm')).toBeInTheDocument();
  });

  it('renders with a default value', () => {
    render(<InputNumber defaultValue={42} />);
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('42');
  });
});
