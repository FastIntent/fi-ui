import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DatePicker } from './index';
import dayjs from 'dayjs';

describe('DatePicker Component', () => {
  it('renders initially with a placeholder text', () => {
    render(<DatePicker placeholder="Select your birthdate" />);
    expect(screen.getByPlaceholderText('Select your birthdate')).toBeInTheDocument();
  });

  it('initializes and formats the defaultValue correctly via dayjs', () => {
    const defaultDate = dayjs('2026-05-10');
    render(<DatePicker defaultValue={defaultDate} format="YYYY-MM-DD" />);

    // rc-picker renders an actual input element where the value is set
    const inputElement = document.querySelector('input') as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe('2026-05-10');
  });

  it('applies disabled state preventing user interactions', () => {
    render(<DatePicker disabled placeholder="Disabled Picker" />);

    const input = screen.getByPlaceholderText('Disabled Picker');
    expect(input).toBeDisabled();
  });
});
