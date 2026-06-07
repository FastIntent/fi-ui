import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Result } from './index';

describe('Result Component', () => {
  it('renders title and subTitle', () => {
    render(<Result title="Payment Successful" subTitle="Your order has been placed." />);
    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    expect(screen.getByText('Your order has been placed.')).toBeInTheDocument();
  });

  it('applies correct status class', () => {
    const { container } = render(<Result status="success" title="Done" />);
    expect(container.querySelector('.atom-result-status-success')).toBeInTheDocument();
  });

  it('applies error status class', () => {
    const { container } = render(<Result status="error" title="Failed" />);
    expect(container.querySelector('.atom-result-status-error')).toBeInTheDocument();
  });

  it('applies 404 status class', () => {
    const { container } = render(<Result status="404" title="Not Found" />);
    expect(container.querySelector('.atom-result-status-404')).toBeInTheDocument();
  });

  it('renders extra content (action buttons)', () => {
    render(<Result status="success" title="Success" extra={<button>Go Home</button>} />);
    expect(screen.getByRole('button', { name: 'Go Home' })).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(<Result icon={<span data-testid="custom-result-icon" />} title="Custom" />);
    expect(screen.getByTestId('custom-result-icon')).toBeInTheDocument();
  });
});
