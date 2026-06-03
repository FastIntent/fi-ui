import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Input } from '../Input';
import { HSV, hsvToHex, hsvToRgb, hexToHsv, isValidHex, clamp } from './color-utils';

interface ColorPanelProps {
  hsv: HSV;
  onChange: (hsv: HSV) => void;
  onChangeComplete?: () => void;
  disabledAlpha?: boolean;
  presets?: Array<{ label: string; colors: string[] }>;
  prefixCls: string;
}

// ── Drag helper ──────────────────────────────────────────────────────

function useDrag(
  ref: React.RefObject<HTMLElement | null>,
  onDrag: (x: number, y: number) => void,
  onEnd?: () => void
) {
  const dragging = useRef(false);

  const getPos = useCallback(
    (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      onDrag(
        clamp((e.clientX - rect.left) / rect.width, 0, 1),
        clamp((e.clientY - rect.top) / rect.height, 0, 1)
      );
    },
    [ref, onDrag]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const down = (e: PointerEvent) => {
      dragging.current = true;
      el.setPointerCapture(e.pointerId);
      getPos(e);
    };
    const move = (e: PointerEvent) => {
      if (dragging.current) getPos(e);
    };
    const up = () => {
      if (dragging.current) {
        dragging.current = false;
        onEnd?.();
      }
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
    };
  }, [ref, getPos, onEnd]);
}

// ── Saturation canvas ────────────────────────────────────────────────

function SaturationCanvas({
  hsv,
  onChange,
  onEnd,
  prefixCls,
}: {
  hsv: HSV;
  onChange: (s: number, v: number) => void;
  onEnd?: () => void;
  prefixCls: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Draw gradient when hue changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    canvas.width = w;
    canvas.height = h;

    // Base hue
    const { r, g, b } = hsvToRgb({ h: hsv.h, s: 1, v: 1, a: 1 });
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, w, h);

    // White gradient (left to right)
    const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, w, h);

    // Black gradient (top to bottom)
    const blackGrad = ctx.createLinearGradient(0, 0, 0, h);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, w, h);
  }, [hsv.h]);

  useDrag(wrapRef, (x, y) => onChange(x, 1 - y), onEnd);

  return (
    <div ref={wrapRef} className={`${prefixCls}-saturation`}>
      <canvas ref={canvasRef} />
      <div
        className={`${prefixCls}-thumb`}
        style={{
          left: `${hsv.s * 100}%`,
          top: `${(1 - hsv.v) * 100}%`,
          backgroundColor: hsvToHex(hsv),
        }}
      />
    </div>
  );
}

// ── Panel ────────────────────────────────────────────────────────────

export const ColorPanel: React.FC<ColorPanelProps> = ({
  hsv,
  onChange,
  onChangeComplete,
  disabledAlpha,
  presets,
  prefixCls,
}) => {
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);
  const [hexText, setHexText] = useState(() => hsvToHex(hsv, hsv.a < 1).replace('#', ''));
  const focused = useRef(false);

  // Sync hex text from external HSV changes (not while user is typing)
  useEffect(() => {
    if (!focused.current) {
      setHexText(hsvToHex(hsv, hsv.a < 1).replace('#', ''));
    }
  }, [hsv]);

  useDrag(hueRef, (x) => onChange({ ...hsv, h: x * 360 }), onChangeComplete);

  useDrag(alphaRef, (x) => onChange({ ...hsv, a: x }), onChangeComplete);

  const handleHexSubmit = () => {
    focused.current = false;
    const val = hexText.startsWith('#') ? hexText : `#${hexText}`;
    if (isValidHex(val)) {
      const parsed = hexToHsv(val);
      if (parsed) {
        onChange(parsed);
        onChangeComplete?.();
      }
    } else {
      setHexText(hsvToHex(hsv, hsv.a < 1).replace('#', ''));
    }
  };

  const { r, g, b } = hsvToRgb(hsv);
  const solidColor = `rgb(${r},${g},${b})`;

  return (
    <div className={`${prefixCls}-panel`}>
      <SaturationCanvas
        hsv={hsv}
        onChange={(s, v) => onChange({ ...hsv, s, v })}
        onEnd={onChangeComplete}
        prefixCls={prefixCls}
      />

      {/* Hue slider */}
      <div ref={hueRef} className={`${prefixCls}-slider ${prefixCls}-hue`}>
        <div className={`${prefixCls}-slider-thumb`} style={{ left: `${(hsv.h / 360) * 100}%` }} />
      </div>

      {/* Alpha slider */}
      {!disabledAlpha && (
        <div ref={alphaRef} className={`${prefixCls}-slider ${prefixCls}-alpha`}>
          <div
            className={`${prefixCls}-alpha-gradient`}
            style={{
              background: `linear-gradient(to right, transparent, ${solidColor})`,
            }}
          />
          <div className={`${prefixCls}-slider-thumb`} style={{ left: `${hsv.a * 100}%` }} />
        </div>
      )}

      {/* Hex input */}
      <Input
        size="small"
        prefix="#"
        value={hexText}
        onChange={(e) => setHexText(e.target.value)}
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={handleHexSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleHexSubmit();
        }}
        spellCheck={false}
        maxLength={8}
      />

      {/* Presets */}
      {presets?.map((group) => (
        <div key={group.label} className={`${prefixCls}-presets`}>
          <div className={`${prefixCls}-presets-label`}>{group.label}</div>
          <div className={`${prefixCls}-presets-grid`}>
            {group.colors.map((color) => {
              const hex = hsvToHex(hsv, hsv.a < 1);
              return (
                <button
                  key={color}
                  type="button"
                  className={`${prefixCls}-presets-swatch${color.toLowerCase() === hex.toLowerCase() ? ` ${prefixCls}-presets-swatch-active` : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const parsed = hexToHsv(color);
                    if (parsed) {
                      onChange(parsed);
                      onChangeComplete?.();
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
