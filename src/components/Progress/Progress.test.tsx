import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Progress } from './index';

describe('Progress Component', () => {
  it('renders line progress by default', () => {
    const { container } = render(<Progress percent={50} />);
    expect(container.querySelector('.fi-progress')).toBeInTheDocument();
    expect(container.querySelector('.fi-progress-line')).toBeInTheDocument();
  });

  it('renders circle progress when type is circle', () => {
    const { container } = render(<Progress type="circle" percent={75} />);
    expect(container.querySelector('.fi-progress-circle')).toBeInTheDocument();
  });

  it('displays percent text by default', () => {
    render(<Progress percent={60} />);
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('hides percent text when showInfo is false', () => {
    render(<Progress percent={60} showInfo={false} />);
    expect(screen.queryByText('60%')).not.toBeInTheDocument();
  });

  it('applies success status class', () => {
    const { container } = render(<Progress percent={100} status="success" />);
    expect(container.querySelector('.fi-progress-status-success')).toBeInTheDocument();
  });

  it('applies exception status class', () => {
    const { container } = render(<Progress percent={50} status="exception" />);
    expect(container.querySelector('.fi-progress-status-exception')).toBeInTheDocument();
  });

  it('renders custom format text', () => {
    render(<Progress percent={42} format={(p) => `${p} pts`} />);
    expect(screen.getByText('42 pts')).toBeInTheDocument();
  });
});
