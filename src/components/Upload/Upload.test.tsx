import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Upload } from './index';

describe('Upload Component', () => {
  it('renders standard click-to-upload variant properly', () => {
    render(
      <Upload action="/api/upload">
        <button data-testid="upload-button">Click to Upload</button>
      </Upload>
    );

    // The inner trigger element should exist
    expect(screen.getByTestId('upload-button')).toBeInTheDocument();

    // An invisible file input should be injected by the upload engine
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it('renders the drag-and-drop Dragger variant with correct layout classes', () => {
    render(
      <Upload.Dragger action="/api/upload">
        <p>Drag files to this zone</p>
      </Upload.Dragger>
    );

    // Ensure the specific text is rendered
    expect(screen.getByText('Drag files to this zone')).toBeInTheDocument();

    const draggerWrapper = document.querySelector('.atom-upload-drag');
    expect(draggerWrapper).toBeInTheDocument();
  });

  it('respects the accept prop on the hidden file input', () => {
    render(
      <Upload action="/api/upload" accept="image/*">
        <button>Upload image</button>
      </Upload>
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.accept).toBe('image/*');
  });
});
