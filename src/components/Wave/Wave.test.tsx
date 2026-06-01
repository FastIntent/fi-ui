import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Wave } from './Wave';

describe('Wave Component', () => {
  it('renders its child element unchanged', () => {
    const { getByTestId } = render(
      <Wave>
        <button data-testid="child">Click</button>
      </Wave>
    );
    expect(getByTestId('child')).toBeInTheDocument();
  });

  it('sets data-wave-active on click (after requestAnimationFrame)', async () => {
    const { getByTestId } = render(
      <Wave>
        <button data-testid="child">Click</button>
      </Wave>
    );
    const btn = getByTestId('child');
    fireEvent.click(btn);
    // Wave uses requestAnimationFrame internally — wait for it to resolve
    await waitFor(() => {
      expect(btn.getAttribute('data-wave-active')).toBe('true');
    });
  });

  it('does not activate wave when disabled', async () => {
    const { getByTestId } = render(
      <Wave disabled>
        <button data-testid="child">Click</button>
      </Wave>
    );
    const btn = getByTestId('child');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(btn.getAttribute('data-wave-active')).not.toBe('true');
    });
  });
});
