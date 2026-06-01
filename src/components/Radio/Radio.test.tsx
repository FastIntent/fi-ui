import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Radio } from './index';

describe('Radio Component', () => {
  it('renders with label text', () => {
    render(<Radio>Option A</Radio>);
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('renders unchecked by default', () => {
    render(<Radio>Option</Radio>);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it('renders checked when defaultChecked is true', () => {
    render(<Radio defaultChecked>Option</Radio>);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('calls onChange when clicked', () => {
    const onChange = vi.fn();
    render(<Radio onChange={onChange}>Click me</Radio>);
    const input = document.querySelector('input[type="radio"]') as HTMLInputElement;
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('applies disabled wrapper class and attribute when disabled standalone', () => {
    const { container } = render(<Radio disabled>Option A</Radio>);
    expect(container.querySelector('.fi-radio-wrapper-disabled')).toBeInTheDocument();
    const input = container.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('applies disabled wrapper class when disabled inside a RadioGroup', () => {
    const { container } = render(
      <Radio.Group disabled>
        <Radio value="a">Option A</Radio>
      </Radio.Group>
    );
    expect(container.querySelector('.fi-radio-wrapper-disabled')).toBeInTheDocument();
  });

  describe('Radio.Group', () => {
    it('renders multiple radio options', () => {
      render(
        <Radio.Group>
          <Radio value="a">Alpha</Radio>
          <Radio value="b">Beta</Radio>
        </Radio.Group>
      );
      expect(screen.getByText('Alpha')).toBeInTheDocument();
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });

    it('calls onChange with the selected value', () => {
      const onChange = vi.fn();
      render(
        <Radio.Group onChange={onChange}>
          <Radio value="x">X</Radio>
          <Radio value="y">Y</Radio>
        </Radio.Group>
      );
      const inputs = document.querySelectorAll('input[type="radio"]');
      fireEvent.click(inputs[1]);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('reflects the controlled value', () => {
      render(
        <Radio.Group value="b">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </Radio.Group>
      );
      const inputs = document.querySelectorAll(
        'input[type="radio"]'
      ) as NodeListOf<HTMLInputElement>;
      expect(inputs[0].checked).toBe(false);
      expect(inputs[1].checked).toBe(true);
    });
  });
});
