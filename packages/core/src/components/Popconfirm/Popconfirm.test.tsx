import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'jest-axe';
import { Popconfirm } from './Popconfirm';

describe('Popconfirm', () => {
  it('renders the trigger child without throwing', () => {
    render(
      <Popconfirm title="Are you sure?">
        <button type="button">Delete</button>
      </Popconfirm>
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('shows confirmation dialog on click', async () => {
    render(
      <Popconfirm title="Are you sure?">
        <button type="button">Delete</button>
      </Popconfirm>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  it('renders description if provided', async () => {
    render(
      <Popconfirm title="Delete Task" description="This action cannot be undone.">
        <button type="button">Delete</button>
      </Popconfirm>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });
  });

  it('calls onConfirm when OK is clicked and closes', async () => {
    const onConfirm = vi.fn();
    render(
      <Popconfirm title="Are you sure?" onConfirm={onConfirm}>
        <button type="button">Delete</button>
      </Popconfirm>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => screen.getByRole('button', { name: 'OK' }));

    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel is clicked and closes', async () => {
    const onCancel = vi.fn();
    render(
      <Popconfirm title="Are you sure?" onCancel={onCancel}>
        <button type="button">Delete</button>
      </Popconfirm>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => screen.getByRole('button', { name: 'Cancel' }));

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('can be completely controlled externally', async () => {
    const { rerender } = render(
      <Popconfirm title="Controlled" open={false}>
        <button type="button">Trigger</button>
      </Popconfirm>
    );
    expect(screen.queryByText('Controlled')).not.toBeInTheDocument();

    rerender(
      <Popconfirm title="Controlled" open={true}>
        <button type="button">Trigger</button>
      </Popconfirm>
    );
    await waitFor(() => {
      expect(screen.getByText('Controlled')).toBeInTheDocument();
    });
  });

  it('passes accessibility tests when closed', async () => {
    const { container } = render(
      <main>
        <Popconfirm title="Delete?">
          <button type="button">Del</button>
        </Popconfirm>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes accessibility tests when opened', async () => {
    const { container } = render(
      <main>
        <Popconfirm title="Delete?" open={true}>
          <button type="button">Del</button>
        </Popconfirm>
      </main>
    );
    await waitFor(() => screen.getByText('Delete?'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
