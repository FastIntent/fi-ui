export interface HSV {
  h: number; // 0-360
  s: number; // 0-1
  v: number; // 0-1
  a: number; // 0-1
}

export interface RGB {
  r: number; // 0-255
  g: number;
  b: number;
  a: number; // 0-1
}

export function hsvToRgb({ h, s, v, a }: HSV): RGB {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a,
  };
}

export function rgbToHsv({ r, g, b, a }: RGB): HSV {
  const r1 = r / 255,
    g1 = g / 255,
    b1 = b / 255;
  const max = Math.max(r1, g1, b1),
    min = Math.min(r1, g1, b1);
  const d = max - min;
  let h = 0;

  if (d !== 0) {
    if (max === r1) h = 60 * (((g1 - b1) / d) % 6);
    else if (max === g1) h = 60 * ((b1 - r1) / d + 2);
    else h = 60 * ((r1 - g1) / d + 4);
  }
  if (h < 0) h += 360;

  return { h, s: max === 0 ? 0 : d / max, v: max, a };
}

const hex2 = (n: number) => n.toString(16).padStart(2, '0');

export function rgbToHex({ r, g, b, a }: RGB, includeAlpha = false): string {
  const base = `#${hex2(r)}${hex2(g)}${hex2(b)}`;
  return includeAlpha && a < 1 ? `${base}${hex2(Math.round(a * 255))}` : base;
}

export function hexToRgb(hex: string): RGB | null {
  const h = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{3,8}$/.test(h)) return null;

  let r: number,
    g: number,
    b: number,
    a = 255;
  if (h.length === 3 || h.length === 4) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
    if (h.length === 4) a = parseInt(h[3] + h[3], 16);
  } else if (h.length === 6 || h.length === 8) {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
    if (h.length === 8) a = parseInt(h.slice(6, 8), 16);
  } else {
    return null;
  }
  return { r, g, b, a: a / 255 };
}

export function hexToHsv(hex: string): HSV | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsv(rgb) : null;
}

export function hsvToHex(hsv: HSV, includeAlpha = false): string {
  return rgbToHex(hsvToRgb(hsv), includeAlpha);
}

export function isValidHex(hex: string): boolean {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex);
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
