import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './index';

describe('Modal Component', () => {
  it('mounts and renders content correctly when open is true', () => {
    render(
      <Modal open={true} title="Test Modal">
        <p data-testid="modal-content">Modal Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  it('does not render content into the DOM when open is false', () => {
    render(
      <Modal open={false} title="Hidden Modal">
        <p>Hidden Content</p>
      </Modal>
    );

    expect(screen.queryByText('Hidden Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('triggers onCancel callback when the close button is clicked', () => {
    const handleCancel = vi.fn();
    render(
      <Modal open={true} onCancel={handleCancel} title="Interactive Modal">
        <p>Modal Content</p>
      </Modal>
    );

    // Modal implements a close button with aria-label
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('triggers onOk callback when the default confirm button is clicked', () => {
    const handleOk = vi.fn();
    render(
      <Modal open={true} onOk={handleOk} title="Confirm Action" okText="Confirm">
        <p>Proceed?</p>
      </Modal>
    );

    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmBtn);

    expect(handleOk).toHaveBeenCalledTimes(1);
  });
});
