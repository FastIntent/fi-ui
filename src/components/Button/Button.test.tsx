import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './index';
import { ConfigProvider } from '../ConfigProvider';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('fi-btn');
    expect(button).toHaveClass('fi-btn-default');
  });

  it('triggers onClick event when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Action</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('fi-btn-disabled');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('displays loading state correctly and prevents clicks', () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Submit
      </Button>
    );
    const button = screen.getByRole('button');

    // Check loading class and disabled attribute
    expect(button).toHaveClass('fi-btn-loading');
    expect(button).toBeDisabled();

    // Ensure spinner element is rendered
    const spinner = button.querySelector('.fi-btn-loading-icon');
    expect(spinner).toBeInTheDocument();

    // Ensure click is intercepted
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies danger and block modifiers correctly', () => {
    render(
      <Button danger block>
        Delete
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('fi-btn-danger');
    expect(button).toHaveClass('fi-btn-block');
  });

  it('renders icons when provided', () => {
    const CustomIcon = <span data-testid="custom-icon">Icon</span>;
    render(<Button prefixIcon={CustomIcon}>With Icon</Button>);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('resolves its public prefix from ConfigProvider while preserving bundled fi styles', () => {
    render(
      <ConfigProvider prefixCls="acme">
        <Button type="primary" loading>
          Save changes
        </Button>
      </ConfigProvider>
    );

    const button = screen.getByRole('button', { name: /save changes/i });
    const spinner = button.querySelector('.fi-btn-loading-icon');

    expect(button).toHaveClass('fi-btn');
    expect(button).toHaveClass('fi-btn-primary');
    expect(button).toHaveClass('acme-btn');
    expect(button).toHaveClass('acme-btn-primary');
    expect(spinner).toHaveClass('fi-btn-loading-icon');
    expect(spinner).toHaveClass('acme-btn-loading-icon');
  });
});
