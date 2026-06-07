import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Select, Option } from './index';

describe('Select Component', () => {
  it('renders wrapper correctly', () => {
    render(
      <Select data-testid="test-select" placeholder="Choose an option">
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    // Since rc-select renders complex dom structures, we verify the presence of the wrapper
    expect(screen.getByTestId('test-select')).toBeInTheDocument();
  });

  it('applies the disabled class correctly', () => {
    render(
      <Select disabled data-testid="test-select">
        <Option value="1">One</Option>
      </Select>
    );

    const select = screen.getByTestId('test-select');
    expect(select).toHaveClass('atom-select-disabled');
  });

  it('renders different sizes by applying the correct css classes', () => {
    const { rerender } = render(<Select size="large" data-testid="test-select" />);
    expect(screen.getByTestId('test-select')).toHaveClass('atom-select-large');

    rerender(<Select size="small" data-testid="test-select" />);
    expect(screen.getByTestId('test-select')).toHaveClass('atom-select-small');
  });

  it('applies loading class when loading is true', () => {
    render(<Select loading data-testid="test-select" />);
    expect(screen.getByTestId('test-select')).toHaveClass('atom-select-loading');
  });

  it('shows loading spinner instead of arrow when loading', () => {
    const { container } = render(<Select loading data-testid="test-select" />);
    expect(container.querySelector('.atom-select-loading-icon')).toBeInTheDocument();
  });
});
