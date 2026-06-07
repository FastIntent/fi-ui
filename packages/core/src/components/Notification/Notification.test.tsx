import React from 'react';
import { act } from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { notification } from './index';

describe('Notification System', () => {
  beforeEach(async () => {
    await act(async () => {
      notification.destroy(); // Ensure DOM is clean before each test
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it('dynamically injects a notification into the DOM upon trigger', async () => {
    expect(screen.queryByText('System Update')).not.toBeInTheDocument();

    // Fire the notification imperatively
    await act(async () => {
      notification.info({
        message: 'System Update',
        description: 'Firmware upgraded successfully',
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(await screen.findByText('System Update')).toBeInTheDocument();
    expect(screen.getByText('Firmware upgraded successfully')).toBeInTheDocument();
  });

  it('supports success type notification', async () => {
    await act(async () => {
      notification.success({ message: 'Saved', description: 'Your changes have been saved.' });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Saved')).toBeInTheDocument();
  });

  it('supports error type notification', async () => {
    await act(async () => {
      notification.error({ message: 'Upload failed', description: 'File too large.' });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Upload failed')).toBeInTheDocument();
  });
});
