import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImageManager } from './ImageManager';
import type { ImageManagerActions, ListResult, ServerImage } from './types';
import { isValidName, normalizePath, parentOf, segments, formatBytes } from './utils';

// ── utils tests (sandbox security) ───────────────────────────────────────────

describe('ImageManager utils', () => {
  it('normalizePath strips ".." segments and stays within sandbox root', () => {
    expect(normalizePath('foo/../bar')).toBe('bar');
    expect(normalizePath('../../etc/passwd')).toBe('etc/passwd');
    expect(normalizePath('./a/./b/')).toBe('a/b');
    expect(normalizePath('a//b///c')).toBe('a/b/c');
    expect(normalizePath('')).toBe('');
  });

  it('normalizePath cannot escape via mixed separators', () => {
    expect(normalizePath('a\\..\\..\\b')).toBe('b');
    expect(normalizePath('..\\..\\evil')).toBe('evil');
  });

  it('isValidName rejects separators, traversal, and reserved chars', () => {
    expect(isValidName('hero.png')).toBe(true);
    expect(isValidName('summer 2026.jpg')).toBe(true);
    expect(isValidName('')).toBe(false);
    expect(isValidName('.')).toBe(false);
    expect(isValidName('..')).toBe(false);
    expect(isValidName('with/slash')).toBe(false);
    expect(isValidName('back\\slash')).toBe(false);
    expect(isValidName('quote"name')).toBe(false);
  });

  it('parentOf and segments work for nested paths', () => {
    expect(parentOf('a/b/c')).toBe('a/b');
    expect(parentOf('a')).toBe('');
    expect(parentOf('')).toBe('');
    expect(segments('a/b/c')).toEqual(['a', 'b', 'c']);
    expect(segments('')).toEqual([]);
  });

  it('formatBytes returns human readable sizes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(2_500_000)).toBe('2.4 MB');
    expect(formatBytes(-1)).toBe('—');
  });
});

// ── Component tests ─────────────────────────────────────────────────────────

const sampleImage = (name: string, parent = ''): ServerImage => ({
  name,
  path: parent ? `${parent}/${name}` : name,
  url: `https://example.com/${name}`,
  size: 1024,
  mtime: Date.now(),
});

function makeActions(initial: ListResult): ImageManagerActions {
  return {
    list: vi.fn().mockResolvedValue(initial),
  };
}

describe('ImageManager', () => {
  it('renders folders and images from the loader', async () => {
    const actions = makeActions({
      folders: [{ name: 'banners', path: 'banners' }],
      images: [sampleImage('logo.png'), sampleImage('hero.jpg')],
    });
    render(<ImageManager actions={actions} />);
    await waitFor(() => expect(actions.list).toHaveBeenCalled());
    expect(await screen.findByText('logo.png')).toBeInTheDocument();
    expect(screen.getByText('hero.jpg')).toBeInTheDocument();
    expect(screen.getByText('banners')).toBeInTheDocument();
  });

  it('emits onSelectionChange when an image is clicked', async () => {
    const onSelectionChange = vi.fn();
    const actions = makeActions({
      folders: [],
      images: [sampleImage('logo.png')],
    });
    render(<ImageManager actions={actions} onSelectionChange={onSelectionChange} />);
    const card = await screen.findByRole('button', { name: 'logo.png' });
    fireEvent.click(card);
    expect(onSelectionChange).toHaveBeenCalledWith(
      ['logo.png'],
      expect.arrayContaining([expect.objectContaining({ path: 'logo.png' })])
    );
  });

  it('hides edit actions in view mode', async () => {
    const actions: ImageManagerActions = {
      list: vi.fn().mockResolvedValue({ folders: [], images: [] }),
      upload: vi.fn(),
      createFolder: vi.fn(),
    };
    render(<ImageManager actions={actions} mode="view" />);
    await waitFor(() => expect(actions.list).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: /upload/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /new folder/i })).toBeNull();
  });

  it('shows upload and new folder buttons in edit mode when actions are provided', async () => {
    const actions: ImageManagerActions = {
      list: vi.fn().mockResolvedValue({ folders: [], images: [] }),
      upload: vi.fn(),
      createFolder: vi.fn(),
    };
    render(<ImageManager actions={actions} mode="edit" />);
    await waitFor(() => expect(actions.list).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new folder/i })).toBeInTheDocument();
  });

  it('navigates into a folder on double-click and re-lists', async () => {
    const list = vi
      .fn()
      .mockResolvedValueOnce({
        folders: [{ name: 'banners', path: 'banners' }],
        images: [],
      })
      .mockResolvedValueOnce({
        folders: [],
        images: [sampleImage('summer.jpg', 'banners')],
      });
    render(<ImageManager actions={{ list }} />);
    const folder = await screen.findByRole('button', { name: /folder banners/i });
    fireEvent.doubleClick(folder);
    await waitFor(() => expect(list).toHaveBeenCalledWith('banners'));
    expect(await screen.findByText('summer.jpg')).toBeInTheDocument();
  });

  it('shows error state when loader rejects', async () => {
    const actions: ImageManagerActions = {
      list: vi.fn().mockRejectedValue(new Error('boom')),
    };
    render(<ImageManager actions={actions} />);
    expect(await screen.findByText(/boom/i)).toBeInTheDocument();
  });
});
