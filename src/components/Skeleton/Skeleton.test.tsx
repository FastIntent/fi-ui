import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './index';

describe('Skeleton Component', () => {
  it('renders with default text variant and wave animation', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('.fi-skeleton')).toBeInTheDocument();
    expect(container.querySelector('.fi-skeleton-text')).toBeInTheDocument();
    expect(container.querySelector('.fi-skeleton-animation-wave')).toBeInTheDocument();
  });

  it('applies circular variant class', () => {
    const { container } = render(<Skeleton variant="circular" />);
    expect(container.querySelector('.fi-skeleton-circular')).toBeInTheDocument();
  });

  it('applies rectangular variant class', () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    expect(container.querySelector('.fi-skeleton-rectangular')).toBeInTheDocument();
  });

  it('applies pulse animation class', () => {
    const { container } = render(<Skeleton animation="pulse" />);
    expect(container.querySelector('.fi-skeleton-animation-pulse')).toBeInTheDocument();
  });

  it('does not apply animation class when animation is false', () => {
    const { container } = render(<Skeleton animation={false} />);
    expect(container.querySelector('[class*="fi-skeleton-animation"]')).not.toBeInTheDocument();
  });

  it('applies width and height as inline styles', () => {
    const { container } = render(<Skeleton width={200} height={20} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('20px');
  });

  it('accepts string values for width and height', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('50%');
    expect(el.style.height).toBe('2rem');
  });
});
