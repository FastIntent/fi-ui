import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ImagePickerInput } from './ImagePickerInput';
import type { ImageManagerActions, ListResult, ServerImage } from '../ImageManager/types';

const meta: Meta<typeof ImagePickerInput> = {
  title: 'Data Entry/ImagePickerInput',
  component: ImagePickerInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;
type Story = StoryObj<typeof ImagePickerInput>;

function makeImg(name: string, url: string): ServerImage {
  return {
    name,
    path: name,
    url,
    thumbnailUrl: url,
    size: 200_000,
    mtime: Date.now(),
  };
}

function useMockActions(): ImageManagerActions {
  const cache = useRef<ListResult>({
    folders: [{ name: 'banners', path: 'banners', itemCount: 2 }],
    images: [
      makeImg('logo.png', 'https://picsum.photos/seed/logo/200/200'),
      makeImg('hero.jpg', 'https://picsum.photos/seed/hero/200/200'),
      makeImg('cover.webp', 'https://picsum.photos/seed/cover/200/200'),
    ],
  });
  const banners = useRef<ListResult>({
    folders: [],
    images: [
      {
        ...makeImg('banner-1.jpg', 'https://picsum.photos/seed/b1/200/200'),
        path: 'banners/banner-1.jpg',
      },
      {
        ...makeImg('banner-2.jpg', 'https://picsum.photos/seed/b2/200/200'),
        path: 'banners/banner-2.jpg',
      },
    ],
  });
  const list = useCallback(async (path: string) => {
    await new Promise((r) => setTimeout(r, 80));
    if (path === 'banners') return banners.current;
    return cache.current;
  }, []);
  return useMemo(() => ({ list }), [list]);
}

export const Single: Story = {
  render: () => {
    const actions = useMockActions();
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ maxWidth: 480 }}>
        <ImagePickerInput
          value={value}
          onChange={(paths) => setValue(paths)}
          actions={actions}
          rootDir="/uploads"
          placeholder="Select a hero image"
        />
      </div>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const actions = useMockActions();
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ maxWidth: 560 }}>
        <ImagePickerInput
          value={value}
          onChange={(paths) => setValue(paths)}
          actions={actions}
          rootDir="/uploads"
          multiple
          placeholder="Select gallery images"
        />
      </div>
    );
  },
};
