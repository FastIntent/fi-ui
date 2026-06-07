import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spin } from './index';

describe('Spin', () => {
  it('renders spinner with spinning class when spinning=true', () => {
    const { container } = render(<Spin spinning />);
    expect(container.querySelector('.atom-spin-spinning')).toBeInTheDocument();
  });

  it('does not apply spinning class when spinning=false', () => {
    const { container } = render(<Spin spinning={false} />);
    expect(container.querySelector('.atom-spin-spinning')).not.toBeInTheDocument();
  });

  it('applies size class correctly', () => {
    const { container } = render(<Spin size="small" />);
    expect(container.querySelector('.atom-spin-sm')).toBeInTheDocument();
  });

  it('renders tip text when provided', () => {
    render(<Spin tip="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('wraps children with overlay when provided', () => {
    render(
      <Spin>
        <div>Content</div>
      </Spin>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
