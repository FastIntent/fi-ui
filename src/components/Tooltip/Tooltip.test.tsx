import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './index';
import { Button } from '../Button';

describe('Tooltip Component', () => {
  it('renders the trigger element', () => {
    render(
      <Tooltip title="Helpful tip">
        <Button>Hover me</Button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('renders tooltip content when visible is forced true', async () => {
    render(
      <Tooltip title="Always visible" visible>
        <span>Trigger</span>
      </Tooltip>
    );
    await waitFor(() => {
      expect(screen.getByText('Always visible')).toBeInTheDocument();
    });
  });

  it('does not render tooltip content when visible is false', () => {
    render(
      <Tooltip title="Hidden tip" visible={false}>
        <span>Trigger</span>
      </Tooltip>
    );
    expect(screen.queryByText('Hidden tip')).not.toBeInTheDocument();
  });

  it('renders overlay node content when visible', async () => {
    render(
      <Tooltip overlay={<span data-testid="overlay-content">Custom overlay</span>} visible>
        <span>Target</span>
      </Tooltip>
    );
    await waitFor(() => {
      expect(screen.getByTestId('overlay-content')).toBeInTheDocument();
    });
  });
});
