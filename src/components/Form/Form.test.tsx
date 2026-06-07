import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Form } from './index';
import { Input } from '../Input';

describe('Form Component', () => {
  it('renders form wrapper and its structural children correctly', () => {
    render(
      <Form data-testid="test-form">
        <Form.Item label="Username" name="username">
          <Input placeholder="Enter username" />
        </Form.Item>
      </Form>
    );

    // Verify the main form element is present
    expect(screen.getByTestId('test-form')).toBeInTheDocument();

    // Verify the internal label is rendered by Form.Item
    expect(screen.getByText('Username')).toBeInTheDocument();

    // Verify the child input is correctly embedded
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('applies the correct layout directional classes based on props', () => {
    const { rerender } = render(<Form layout="horizontal" data-testid="test-form" />);
    const form = screen.getByTestId('test-form');

    expect(form).toHaveClass('atom-form');
    expect(form).toHaveClass('atom-form-horizontal');

    rerender(<Form layout="inline" data-testid="test-form" />);
    expect(form).toHaveClass('atom-form-inline');
    expect(form).not.toHaveClass('atom-form-horizontal');
  });

  it('renders vertical layout by default', () => {
    const { container } = render(<Form data-testid="test-form" />);
    expect(container.querySelector('.atom-form')).toBeInTheDocument();
  });
});
