import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Space } from './index';

describe('Space Component', () => {
  it('renders children correctly', () => {
    render(
      <Space>
        <span>First</span>
        <span>Second</span>
        <span>Third</span>
      </Space>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('applies base prefix class', () => {
    const { container } = render(
      <Space>
        <span>A</span>
      </Space>
    );
    expect(container.firstChild).toHaveClass('fi-space');
  });

  it('applies vertical direction class', () => {
    const { container } = render(
      <Space direction="vertical">
        <span>A</span>
      </Space>
    );
    expect(container.firstChild).toHaveClass('fi-space-vertical');
  });

  it('applies wrap class when wrap is true', () => {
    const { container } = render(
      <Space wrap>
        <span>A</span>
      </Space>
    );
    expect(container.firstChild).toHaveClass('fi-space-wrap');
  });

  it('renders separator between items', () => {
    render(
      <Space separator="|">
        <span>A</span>
        <span>B</span>
      </Space>
    );
    expect(screen.getAllByText('|')).toHaveLength(1);
  });

  it('applies align class', () => {
    const { container } = render(
      <Space align="center">
        <span>A</span>
      </Space>
    );
    expect(container.firstChild).toHaveClass('fi-space-align-center');
  });
});
