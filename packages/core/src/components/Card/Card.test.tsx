import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './index';

describe('Card Component', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders extra content when provided', () => {
    render(
      <Card title="Title" extra={<button>More</button>}>
        Content
      </Card>
    );
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
  });

  it('applies base prefix class', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass('atom-card');
  });

  it('renders head section only when title or extra is provided', () => {
    const { container: noHead } = render(<Card>No head</Card>);
    expect(noHead.querySelector('.atom-card-head')).not.toBeInTheDocument();

    const { container: withHead } = render(<Card title="With Head">Content</Card>);
    expect(withHead.querySelector('.atom-card-head')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="my-card">Content</Card>);
    expect(container.firstChild).toHaveClass('my-card');
  });
});
