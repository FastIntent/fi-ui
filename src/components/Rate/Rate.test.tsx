import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Rate } from './index';

describe('Rate Component', () => {
  it('renders the correct number of stars (default 5)', () => {
    const { container } = render(<Rate />);
    const stars = container.querySelectorAll('.fi-rate-star');
    expect(stars).toHaveLength(5);
  });

  it('renders the correct number of stars when count is specified', () => {
    const { container } = render(<Rate count={3} />);
    const stars = container.querySelectorAll('.fi-rate-star');
    expect(stars).toHaveLength(3);
  });

  it('applies base class', () => {
    const { container } = render(<Rate />);
    expect(container.querySelector('.fi-rate')).toBeInTheDocument();
  });

  it('applies disabled class when disabled', () => {
    const { container } = render(<Rate disabled />);
    expect(container.querySelector('.fi-rate-disabled')).toBeInTheDocument();
  });

  it('marks stars as full up to the defaultValue', () => {
    const { container } = render(<Rate defaultValue={3} count={5} />);
    const fullStars = container.querySelectorAll('.fi-rate-star-full');
    expect(fullStars.length).toBeGreaterThanOrEqual(3);
  });
});
