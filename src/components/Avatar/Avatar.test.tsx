import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from './index';

describe('Avatar Component', () => {
  it('renders text children correctly', () => {
    render(<Avatar>AG</Avatar>);
    expect(screen.getByText('AG')).toBeInTheDocument();
  });

  it('renders an image when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.png" alt="User avatar" />);
    const img = screen.getByAltText('User avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
  });

  it('applies circle shape class by default', () => {
    const { container } = render(<Avatar>JD</Avatar>);
    expect(container.firstChild).toHaveClass('fi-avatar-circle');
  });

  it('applies square shape class when specified', () => {
    const { container } = render(<Avatar shape="square">JD</Avatar>);
    expect(container.firstChild).toHaveClass('fi-avatar-square');
  });

  it('applies size class for named sizes', () => {
    const { container: large } = render(<Avatar size="large">A</Avatar>);
    expect(large.firstChild).toHaveClass('fi-avatar-large');

    const { container: small } = render(<Avatar size="small">A</Avatar>);
    expect(small.firstChild).toHaveClass('fi-avatar-small');
  });

  it('applies numeric size as inline style', () => {
    const { container } = render(<Avatar size={64}>A</Avatar>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('64px');
    expect(el.style.height).toBe('64px');
  });

  it('renders custom icon when provided', () => {
    render(<Avatar icon={<span data-testid="avatar-icon" />} />);
    expect(screen.getByTestId('avatar-icon')).toBeInTheDocument();
  });
});
