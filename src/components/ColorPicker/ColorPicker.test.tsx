import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';
import {
  hsvToRgb,
  rgbToHsv,
  hexToRgb,
  rgbToHex,
  hexToHsv,
  hsvToHex,
  isValidHex,
} from './color-utils';

// ── Color utils tests ─────────────────────────────────────────────

describe('color-utils', () => {
  it('converts HSV to RGB correctly', () => {
    const rgb = hsvToRgb({ h: 0, s: 1, v: 1, a: 1 });
    expect(rgb).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('converts RGB to HSV correctly', () => {
    const hsv = rgbToHsv({ r: 0, g: 255, b: 0, a: 1 });
    expect(hsv.h).toBeCloseTo(120);
    expect(hsv.s).toBeCloseTo(1);
    expect(hsv.v).toBeCloseTo(1);
  });

  it('converts hex to RGB', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('converts RGB to hex', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0, a: 1 })).toBe('#ff0000');
  });

  it('roundtrips hex -> hsv -> hex', () => {
    expect(hsvToHex(hexToHsv('#25ac01')!)).toBe('#25ac01');
  });

  it('validates hex strings', () => {
    expect(isValidHex('#abc')).toBe(true);
    expect(isValidHex('#aabbcc')).toBe(true);
    expect(isValidHex('#aabbccdd')).toBe(true);
    expect(isValidHex('xyz')).toBe(false);
    expect(isValidHex('#gg0000')).toBe(false);
  });

  it('returns null for invalid hex', () => {
    expect(hexToRgb('invalid')).toBeNull();
    expect(hexToHsv('invalid')).toBeNull();
  });
});

// ── Component tests ───────────────────────────────────────────────

describe('ColorPicker', () => {
  it('renders trigger button', () => {
    render(<ColorPicker />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
  });

  it('shows hex text when showText is true', () => {
    render(<ColorPicker defaultValue="#ff0000" showText />);
    expect(screen.getByText('#FF0000')).toBeInTheDocument();
  });

  it('shows custom text via showText function', () => {
    render(<ColorPicker defaultValue="#ff0000" showText={(hex) => `Color: ${hex}`} />);
    expect(screen.getByText('Color: #ff0000')).toBeInTheDocument();
  });

  it('applies disabled state', () => {
    render(<ColorPicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders clear button when allowClear is true', () => {
    const onChange = vi.fn();
    render(<ColorPicker allowClear onChange={onChange} defaultValue="#ff0000" />);
    const clearBtn = document.querySelector('[class*="trigger-clear"]');
    expect(clearBtn).toBeInTheDocument();
  });

  it('renders custom trigger via children', () => {
    render(
      <ColorPicker>
        <span data-testid="custom">Pick</span>
      </ColorPicker>
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('opens panel on click', () => {
    render(<ColorPicker />);
    fireEvent.click(screen.getByRole('button'));
    const panel = document.querySelector('[class*="color-picker-panel"]');
    expect(panel).toBeInTheDocument();
  });
});
