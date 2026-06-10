import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImagePickerInput } from './ImagePickerInput';
import { ConfigProvider } from '../ConfigProvider';
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
  it('renders an input with the placeholder when empty', () => {
    render(<ImagePickerInput actions={makeActions()} placeholder="Pick an image" />);
    expect(screen.getByPlaceholderText('Pick an image')).toBeInTheDocument();
  });

  it('shows the folder (browse) button when empty', () => {
    render(<ImagePickerInput actions={makeActions()} />);
    expect(screen.getByRole('button', { name: /browse images/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('shows ONLY the clear button when there is a value', () => {
    render(<ImagePickerInput actions={makeActions()} value="hero.png" />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /browse images/i })).not.toBeInTheDocument();
  });

  it('opens the manager when the folder button is clicked', async () => {
    const actions = makeActions();
    render(<ImagePickerInput actions={actions} />);
    fireEvent.click(screen.getByRole('button', { name: /browse images/i }));
    await waitFor(() => expect(actions.list).toHaveBeenCalled());
  });

  it('opens the manager when the empty input surface is clicked', async () => {
    const actions = makeActions();
    render(<ImagePickerInput actions={actions} placeholder="Pick" />);
    fireEvent.click(screen.getByPlaceholderText('Pick'));
    await waitFor(() => expect(actions.list).toHaveBeenCalled());
  });

  it('does NOT open the manager on surface click in editable mode', () => {
    const actions = makeActions();
    render(<ImagePickerInput actions={actions} editable placeholder="Pick" />);
    fireEvent.click(screen.getByPlaceholderText('Pick'));
    expect(actions.list).not.toHaveBeenCalled();
  });

  it('shows the value in the input when provided', () => {
    render(<ImagePickerInput actions={makeActions()} value="banners/summer.jpg" />);
    expect(screen.getByDisplayValue('banners/summer.jpg')).toBeInTheDocument();
  });

  it('clears on a SINGLE click and fires onChange(undefined)', () => {
    const onChange = vi.fn();
    render(<ImagePickerInput actions={makeActions()} value="hero.png" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('switches clear → folder button after clearing (uncontrolled)', () => {
    render(<ImagePickerInput actions={makeActions()} defaultValue="hero.png" />);
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.getByRole('button', { name: /browse images/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('clears in one click even when controlled (parent echoes onChange)', () => {
    const Controlled = () => {
      const [value, setValue] = React.useState<string | undefined>('hero.png');
      return (
        <ImagePickerInput actions={makeActions()} value={value} onChange={(p) => setValue(p)} />
      );
    };
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.getByRole('button', { name: /browse images/i })).toBeInTheDocument();
  });

  it('respects disabled: surface click does not open the manager', () => {
    const actions = makeActions();
    render(<ImagePickerInput actions={actions} disabled placeholder="Pick" />);
    fireEvent.click(screen.getByPlaceholderText('Pick'));
    expect(actions.list).not.toHaveBeenCalled();
  });

  it('lets the user type a URL in editable mode', () => {
    const onChange = vi.fn();
    render(<ImagePickerInput actions={makeActions()} editable onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://x.com/a.png' } });
    expect(onChange).toHaveBeenCalledWith('https://x.com/a.png');
  });

  it('falls back to ConfigProvider size', () => {
    const { container } = render(
      <ConfigProvider size="small">
        <ImagePickerInput actions={makeActions()} />
      </ConfigProvider>
    );
    expect(
      container.querySelector(
        '.atom-input-small, .atom-input-affix-wrapper-small, [class*="-small"]'
      )
    ).toBeTruthy();
  });

  it('renders the floating label markup when floating', () => {
    const { container } = render(
      <ImagePickerInput actions={makeActions()} floating label="Hero image" />
    );
    expect(screen.getByText('Hero image')).toBeInTheDocument();
    expect(container.querySelector('[class*="float-label"]')).toBeTruthy();
  });

  it('lifts the floating label when there is a value', () => {
    const { container } = render(
      <ImagePickerInput actions={makeActions()} floating label="Hero" value="hero.png" />
    );
    expect(container.querySelector('[class*="float-label-active"]')).toBeTruthy();
  });

  it('forwards the ref to the underlying input', () => {
    const ref = React.createRef<{ focus: () => void }>();
    render(
      <ImagePickerInput
        // @ts-expect-error – test only needs the focus shape
        ref={ref}
        actions={makeActions()}
        editable
      />
    );
    expect(ref.current).toBeTruthy();
    expect(typeof ref.current?.focus).toBe('function');
  });
});
