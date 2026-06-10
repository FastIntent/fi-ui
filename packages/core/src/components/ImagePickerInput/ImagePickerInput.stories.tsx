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
      makeImg('logo.png', 'https://picsum.photos/seed/logo/600/400'),
      makeImg('hero.jpg', 'https://picsum.photos/seed/hero/600/400'),
      makeImg('cover.webp', 'https://picsum.photos/seed/cover/600/400'),
    ],
  });
  const banners = useRef<ListResult>({
    folders: [],
    images: [
      {
        ...makeImg('banner-1.jpg', 'https://picsum.photos/seed/b1/600/400'),
        path: 'banners/banner-1.jpg',
      },
      {
        ...makeImg('banner-2.jpg', 'https://picsum.photos/seed/b2/600/400'),
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

/**
 * Default behaviour: read-only Input with a folder icon in the suffix.
 *
 * • Click the folder → opens the ImageManager modal to pick an image.
 * • Click the input itself (while empty) → also opens the manager.
 * • Click the input (with a value) → opens the preview modal.
 * • The clear icon appears in the suffix when there's a value.
 */
export const Default: Story = {
  render: () => {
    const actions = useMockActions();
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImagePickerInput
          value={value}
          onChange={(next) => setValue(next)}
          actions={actions}
          rootDir="/uploads"
          placeholder="Pick a hero image…"
        />
      </div>
    );
  },
};

/**
 * Pre-populated with a value so the clear icon and the preview-on-click
 * behaviour are visible without first opening the manager.
 */
export const WithValue: Story = {
  render: () => {
    const actions = useMockActions();
    const [value, setValue] = useState<string | undefined>(
      'https://picsum.photos/seed/preview-demo/1200/800'
    );
    return (
      <div style={{ maxWidth: 480 }}>
        <ImagePickerInput
          value={value}
          onChange={(next) => setValue(next)}
          actions={actions}
          rootDir="/uploads"
        />
      </div>
    );
  },
};

/**
 * `editable` lets the user paste a URL straight into the field — useful
 * for admin settings where the URL is the source of truth and the
 * picker is just a helper.
 */
export const Editable: Story = {
  render: () => {
    const actions = useMockActions();
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImagePickerInput
          value={value}
          onChange={(next) => setValue(next)}
          actions={actions}
          rootDir="/uploads"
          editable
          placeholder="Paste a URL or pick one…"
        />
      </div>
    );
  },
};

/**
 * Three sizes match the rest of the form-control family (Input, Select,
 * DatePicker).
 */
export const Sizes: Story = {
  render: () => {
    const actions = useMockActions();
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ImagePickerInput
          size="small"
          value={value}
          onChange={(next) => setValue(next)}
          actions={actions}
          rootDir="/uploads"
          placeholder="Small"
        />
        <ImagePickerInput
          size="middle"
          value={value}
          onChange={(next) => setValue(next)}
          actions={actions}
          rootDir="/uploads"
          placeholder="Middle"
        />
        <ImagePickerInput
          size="large"
          value={value}
          onChange={(next) => setValue(next)}
          actions={actions}
          rootDir="/uploads"
          placeholder="Large"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const actions = useMockActions();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImagePickerInput actions={actions} rootDir="/uploads" disabled placeholder="Disabled" />
      </div>
    );
  },
};

/**
 * `floating` lifts the label above the field when the input has focus
 * or a value — same convention as the regular Input. The picture-prefix
 * icon is dropped in this mode so the label sits where the placeholder
 * would.
 */
export const Floating: Story = {
  render: () => {
    const actions = useMockActions();
    const [empty, setEmpty] = useState<string | undefined>();
    const [filled, setFilled] = useState<string | undefined>(
      'https://picsum.photos/seed/floating/1200/800'
    );
    return (
      <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <ImagePickerInput
          floating
          label="Hero image"
          value={empty}
          onChange={(next) => setEmpty(next)}
          actions={actions}
          rootDir="/uploads"
          placeholder="Pick or paste a URL"
        />
        <ImagePickerInput
          floating
          label="Cover image"
          value={filled}
          onChange={(next) => setFilled(next)}
          actions={actions}
          rootDir="/uploads"
        />
      </div>
    );
  },
};

/**
 * Floating + each size variant.
 */
export const FloatingSizes: Story = {
  render: () => {
    const actions = useMockActions();
    const [small, setSmall] = useState<string | undefined>();
    const [middle, setMiddle] = useState<string | undefined>();
    const [large, setLarge] = useState<string | undefined>();
    return (
      <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ImagePickerInput
          floating
          size="small"
          label="Small"
          value={small}
          onChange={(next) => setSmall(next)}
          actions={actions}
          rootDir="/uploads"
        />
        <ImagePickerInput
          floating
          size="middle"
          label="Middle"
          value={middle}
          onChange={(next) => setMiddle(next)}
          actions={actions}
          rootDir="/uploads"
        />
        <ImagePickerInput
          floating
          size="large"
          label="Large"
          value={large}
          onChange={(next) => setLarge(next)}
          actions={actions}
          rootDir="/uploads"
        />
      </div>
    );
  },
};

/**
 * `status="error"` paints the field with the error border + tints the
 * floating label red.
 */
export const FloatingError: Story = {
  render: () => {
    const actions = useMockActions();
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImagePickerInput
          floating
          label="Logo"
          status="error"
          value={value}
          onChange={(next) => setValue(next)}
          actions={actions}
          rootDir="/uploads"
        />
      </div>
    );
  },
};

/**
 * Floating with `editable` so the consumer can paste a URL directly and
 * the label still floats on focus.
 */
export const FloatingEditable: Story = {
  render: () => {
    const actions = useMockActions();
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImagePickerInput
          floating
          editable
          label="Image URL"
          value={value}
          onChange={(next) => setValue(next)}
          actions={actions}
          rootDir="/uploads"
          placeholder="Paste a URL or pick one…"
        />
      </div>
    );
  },
};
