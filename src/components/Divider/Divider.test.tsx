import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Divider } from './index';

describe('Divider Component', () => {
  it('renders as horizontal by default', () => {
    const { container } = render(<Divider />);
    expect(container.firstChild).toHaveClass('atom-divider');
    expect(container.firstChild).toHaveClass('atom-divider-horizontal');
  });

  it('renders as vertical when type is vertical', () => {
    const { container } = render(<Divider type="vertical" />);
    expect(container.firstChild).toHaveClass('atom-divider-vertical');
  });

  it('renders text content inside the divider', () => {
    render(<Divider>Section Title</Divider>);
    expect(screen.getByText('Section Title')).toBeInTheDocument();
  });

  it('applies dashed class when dashed prop is true', () => {
    const { container } = render(<Divider dashed />);
    expect(container.firstChild).toHaveClass('atom-divider-dashed');
  });

  it('applies orientation class when text is provided', () => {
    const { container } = render(<Divider orientation="left">Left</Divider>);
    expect(container.firstChild).toHaveClass('atom-divider-with-text-left');
  });

  it('applies plain class when plain prop is true', () => {
    const { container } = render(<Divider plain>Plain</Divider>);
    expect(container.firstChild).toHaveClass('atom-divider-plain');
  });
});
