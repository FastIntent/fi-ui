import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Empty } from './index';

describe('Empty Component', () => {
  it('renders default description from locale', () => {
    const { container } = render(<Empty />);
    expect(container.querySelector('.fi-empty')).toBeInTheDocument();
  });

  it('renders custom description', () => {
    render(<Empty description="No results found" />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders children (action area)', () => {
    render(
      <Empty>
        <button>Create New</button>
      </Empty>
    );
    expect(screen.getByRole('button', { name: 'Create New' })).toBeInTheDocument();
  });

  it('renders custom image when provided', () => {
    render(<Empty image={<img alt="empty-img" src="empty.png" />} />);
    expect(screen.getByAltText('empty-img')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Empty className="my-empty" />);
    expect(container.firstChild).toHaveClass('my-empty');
  });
});
