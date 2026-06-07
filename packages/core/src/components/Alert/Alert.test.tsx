import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from './index';

describe('Alert Component', () => {
  it('renders message correctly', () => {
    render(<Alert message="Something went wrong" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('applies the correct type class', () => {
    const { rerender } = render(<Alert message="Test" type="success" />);
    expect(screen.getByRole('alert')).toHaveClass('atom-alert-success');

    rerender(<Alert message="Test" type="error" />);
    expect(screen.getByRole('alert')).toHaveClass('atom-alert-error');

    rerender(<Alert message="Test" type="warning" />);
    expect(screen.getByRole('alert')).toHaveClass('atom-alert-warning');
  });

  it('renders description when provided', () => {
    render(<Alert message="Title" description="More details here" />);
    expect(screen.getByText('More details here')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('atom-alert-with-description');
  });

  it('does not render close button when closable is false', () => {
    render(<Alert message="Not closable" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders close button when closable is true', () => {
    render(<Alert message="Closable" closable />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('adds closing class after clicking close button', () => {
    render(<Alert message="Close me" closable />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('alert')).toHaveClass('atom-alert-closing');
  });

  it('removes alert from DOM after animation ends', () => {
    render(<Alert message="Close me" closable />);
    const alert = screen.getByRole('alert');
    fireEvent.click(screen.getByRole('button'));
    fireEvent.animationEnd(alert);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('calls onClose callback when closed', () => {
    const onClose = vi.fn();
    render(<Alert message="Close me" closable onClose={onClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders icon when showIcon is true', () => {
    render(<Alert message="Info" type="info" showIcon />);
    expect(document.querySelector('.atom-alert-icon')).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(<Alert message="Custom" icon={<span data-testid="custom-icon" />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
