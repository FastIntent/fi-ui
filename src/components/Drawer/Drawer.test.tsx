import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Drawer } from './index';

describe('Drawer Component', () => {
  it('mounts and renders content correctly when open is true', () => {
    render(
      <Drawer open={true} title="Test Drawer">
        <p data-testid="drawer-content">Drawer Content</p>
      </Drawer>
    );

    expect(screen.getByText('Test Drawer')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
  });

  it('does not render content into the DOM when open is false', () => {
    render(
      <Drawer open={false} title="Hidden Drawer">
        <p>Hidden Content</p>
      </Drawer>
    );

    expect(screen.queryByText('Hidden Drawer')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('triggers onClose callback when the close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Drawer open={true} onClose={handleClose} title="Interactive Drawer">
        <p>Drawer Content</p>
      </Drawer>
    );

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
