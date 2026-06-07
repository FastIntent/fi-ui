import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImagePickerInput } from './ImagePickerInput';
import type { ImageManagerActions, ServerImage } from '../ImageManager/types';

const sampleImage = (name: string): ServerImage => ({
  name,
  path: name,
  url: `https://example.com/${name}`,
  thumbnailUrl: `https://example.com/${name}`,
  size: 1024,
  mtime: Date.now(),
});

function makeActions(): ImageManagerActions {
  return {
    list: vi.fn().mockResolvedValue({
      folders: [],
      images: [sampleImage('hero.png'), sampleImage('logo.png')],
    }),
  };
}

describe('ImagePickerInput', () => {
  it('renders placeholder when empty', () => {
    render(<ImagePickerInput actions={makeActions()} placeholder="Pick an image" />);
    expect(screen.getByText('Pick an image')).toBeInTheDocument();
  });

  it('opens the modal when the trigger is clicked', async () => {
    const actions = makeActions();
    render(<ImagePickerInput actions={actions} placeholder="Pick" />);
    fireEvent.click(screen.getByRole('button', { name: /pick/i }));
    await waitFor(() => expect(actions.list).toHaveBeenCalled());
    expect(await screen.findByRole('button', { name: 'hero.png' })).toBeInTheDocument();
  });

  it('shows preview when value is provided', () => {
    render(
      <ImagePickerInput actions={makeActions()} value={['banners/summer.jpg']} placeholder="Pick" />
    );
    expect(screen.getByText('summer.jpg')).toBeInTheDocument();
    expect(screen.queryByText('Pick')).toBeNull();
  });

  it('respects disabled prop and does not open modal', () => {
    const actions = makeActions();
    render(<ImagePickerInput actions={actions} disabled placeholder="Pick" />);
    const trigger = screen.getByRole('button', { name: /pick/i });
    fireEvent.click(trigger);
    expect(actions.list).not.toHaveBeenCalled();
  });

  it('clear button fires onChange with empty selection', () => {
    const onChange = vi.fn();
    render(<ImagePickerInput actions={makeActions()} value={['hero.png']} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /clear selection/i }));
    expect(onChange).toHaveBeenCalledWith([], []);
  });
});
