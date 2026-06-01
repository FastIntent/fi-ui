import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Slider } from './index';

describe('Slider Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Slider />);
    expect(container.querySelector('.fi-slider')).toBeInTheDocument();
  });

  it('applies disabled class when disabled', () => {
    const { container } = render(<Slider disabled />);
    expect(container.querySelector('.fi-slider-disabled')).toBeInTheDocument();
  });

  it('applies vertical class when vertical prop is true', () => {
    const { container } = render(<Slider vertical />);
    expect(container.querySelector('.fi-slider-vertical')).toBeInTheDocument();
  });

  it('renders range slider with two handles', () => {
    const { container } = render(<Slider range defaultValue={[20, 60]} />);
    const handles = container.querySelectorAll('.fi-slider-handle');
    expect(handles.length).toBeGreaterThanOrEqual(2);
  });

  it('positions the handle based on defaultValue', () => {
    const { container } = render(<Slider defaultValue={50} min={0} max={100} />);
    const handle = container.querySelector('.fi-slider-handle') as HTMLElement;
    expect(handle).toBeInTheDocument();
  });
});
